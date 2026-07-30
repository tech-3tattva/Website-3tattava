const express = require("express");
const Doctor = require("../models/Doctor");
const Booking = require("../models/Booking");
const { generateBookingId, getEndTime } = require("../utils/slots");
const crypto = require("crypto");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { createConsultationEvent } = require("../lib/googleCalendar");

const router = express.Router();

/**
 * POST /api/bookings
 * Create a new booking. Uses a partial unique index on Booking to prevent
 * double-booking (same doctor + date + timeSlot with status="confirmed").
 */
router.post("/", async (req, res, next) => {
  try {
    const { doctorSlug, date, timeSlot, type, name, phone, email, age, gender, healthConcern, isFirstAyurvedaVisit } =
      req.body;

    if (!doctorSlug || !date || !timeSlot || !name || !phone || !age) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const doctor = await Doctor.findOne({ slug: doctorSlug, status: "active" }).lean();
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const consultationType = type === "online" ? "online" : "in-clinic";
    const fee =
      consultationType === "online"
        ? doctor.practice.consultationFee.online || doctor.practice.consultationFee.inClinic
        : doctor.practice.consultationFee.inClinic;

    const duration = doctor.slotConfig?.durationMinutes || 30;

    const booking = new Booking({
      bookingId: generateBookingId(date),
      status: "confirmed",
      doctor: {
        doctorId: doctor._id,
        name: doctor.personal.fullName,
        clinic: doctor.clinic.name,
      },
      patient: {
        name,
        phone,
        email: email || "",
        age: Number(age),
        gender: gender || "prefer-not-to-say",
      },
      appointment: {
        date,
        timeSlot,
        endTime: getEndTime(timeSlot, duration),
        type: consultationType,
        fee,
        healthConcern: healthConcern || "",
        isFirstAyurvedaVisit: isFirstAyurvedaVisit === true,
      },
      source: "website",
    });

    await booking.save();

    // Increment doctor's booking count (fire-and-forget).
    Doctor.updateOne(
      { _id: doctor._id },
      { $inc: { "analytics.totalBookings": 1, "analytics.bookingsThisMonth": 1 } },
    ).catch(() => {});

    res.status(201).json({
      message: "Booking confirmed!",
      booking: {
        bookingId: booking.bookingId,
        doctor: booking.doctor,
        appointment: booking.appointment,
        clinicAddress: doctor.clinic.address,
        googleMapsLink: doctor.clinic.googleMapsLink,
      },
    });
  } catch (err) {
    // Duplicate key = slot already taken.
    if (err.code === 11000) {
      return res.status(409).json({ message: "This time slot was just booked by someone else. Please pick another slot." });
    }
    next(err);
  }
});

/**
 * GET /api/bookings/:bookingId
 * Retrieve a booking by its human-readable bookingId.
 */
router.get("/:bookingId", async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId }).lean();
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/bookings/:bookingId/cancel
 * Cancel a booking. Free cancellation up to 4 hours before; otherwise counts as no-show.
 */
router.put("/:bookingId/cancel", async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      bookingId: req.params.bookingId,
      status: "confirmed",
    });

    if (!booking) {
      return res.status(404).json({ message: "Active booking not found" });
    }

    const appointmentTime = new Date(`${booking.appointment.date}T${booking.appointment.timeSlot}:00+05:30`);
    const now = new Date();
    const hoursUntil = (appointmentTime - now) / (1000 * 60 * 60);

    if (hoursUntil < 4) {
      booking.status = "no-show";
    } else {
      booking.status = "cancelled";
    }
    await booking.save();

    res.json({
      message: booking.status === "cancelled"
        ? "Booking cancelled successfully."
        : "Booking cancelled late — recorded as no-show.",
      status: booking.status,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/reviews
 * Submit a review for a completed booking.
 */
router.post("/review", async (req, res, next) => {
  try {
    const { bookingId, rating, text } = req.body;

    if (!bookingId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "bookingId and rating (1-5) are required." });
    }

    const booking = await Booking.findOne({ bookingId });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.review.rating) {
      return res.status(409).json({ message: "Review already submitted for this booking." });
    }

    booking.review = {
      rating: Number(rating),
      text: text || "",
      createdAt: new Date(),
      isVerified: true,
    };
    await booking.save();

    // Update doctor's denormalized rating. Recalculate from all reviews.
    const allReviews = await Booking.find({
      "doctor.doctorId": booking.doctor.doctorId,
      "review.rating": { $ne: null },
    })
      .select("review.rating")
      .lean();

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    for (const r of allReviews) {
      const star = r.review.rating;
      breakdown[star] = (breakdown[star] || 0) + 1;
      sum += star;
    }
    const avg = allReviews.length > 0 ? Math.round((sum / allReviews.length) * 10) / 10 : 0;

    await Doctor.updateOne(
      { _id: booking.doctor.doctorId },
      {
        $set: {
          "ratings.average": avg,
          "ratings.count": allReviews.length,
          "ratings.breakdown": breakdown,
        },
      },
    );

    res.json({ message: "Thank you for your review!", rating: Number(rating) });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/bookings/doctor/:doctorId/reviews
 * Get reviews for a doctor (paginated).
 */
router.get("/doctor/:doctorId/reviews", async (req, res, next) => {
  try {
    const { page = "1", limit = "10" } = req.query;
    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Booking.find({
        "doctor.doctorId": req.params.doctorId,
        "review.rating": { $ne: null },
      })
        .sort({ "review.createdAt": -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("patient.name patient.age appointment.date review")
        .lean(),
      Booking.countDocuments({
        "doctor.doctorId": req.params.doctorId,
        "review.rating": { $ne: null },
      }),
    ]);

    res.json({ reviews, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/bookings/consultation
 * Online consultation booking (VaidyaConnect). First consultation per email is free.
 * Creates the booking, generates a video-meet link, and emails the doctor + patient.
 */
function meetLinkFor(bookingId) {
  // Preferred: a fixed Google Meet room set via CONSULT_MEET_LINK
  // (e.g. https://meet.google.com/abc-defg-hij). Dr. Falguni admits each
  // patient from the Meet waiting room at their booked slot.
  const fixed = (process.env.CONSULT_MEET_LINK || "").trim();
  if (fixed) return fixed;
  // Fallback when no Google Meet room is configured: instant, no-auth Jitsi
  // room with an unguessable suffix.
  const token = crypto.randomBytes(4).toString("hex");
  return `https://meet.jit.si/3TATTAVA-Consult-${bookingId}-${token}`;
}

const PRAKRITI_LABELS = {
  healthGoal: "Health goal",
  primaryConcern: "Primary concern",
  bodyFrame: "Body frame",
  appetite: "Appetite",
  digestion: "Digestion",
  sleep: "Sleep",
  energyPattern: "Energy pattern",
  bowelMovement: "Bowel movement",
  dietPreference: "Diet preference",
  activityLevel: "Activity level",
  currentMedications: "Current medications/supplements",
  notes: "Additional notes",
};

async function sendConsultEmails({ doctorEmail, patient, doctorName, appointment, meetLink, prakriti, isFree }) {
  const hasSes =
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION &&
    process.env.AWS_SES_FROM_EMAIL;
  if (!hasSes) return { doctorSent: false, patientSent: false, reason: "SES not configured" };

  const from = process.env.AWS_SES_FROM_EMAIL;
  const client = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const when = `${appointment.date} at ${appointment.timeSlot} IST`;
  const prakritiLines = Object.entries(prakriti || {})
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `  • ${PRAKRITI_LABELS[k] || k}: ${v}`)
    .join("\n");

  const doctorText =
    `New online consultation booking${isFree ? " (FREE — first consultation)" : ""}\n\n` +
    `Patient: ${patient.name}\nPhone: ${patient.phone}\nEmail: ${patient.email}\n` +
    `Age: ${patient.age}   Gender: ${patient.gender}\n\n` +
    `When: ${when}\nType: Online video\nMeeting link: ${meetLink}\n\n` +
    `Prakriti intake:\n${prakritiLines || "  (none provided)"}\n\n` +
    `Booking ID: ${appointment.bookingId}\n`;

  let doctorSent = false;
  let patientSent = false;
  try {
    await client.send(
      new SendEmailCommand({
        Source: from,
        Destination: { ToAddresses: [doctorEmail] },
        ReplyToAddresses: patient.email ? [patient.email] : undefined,
        Message: { Subject: { Data: `New consultation — ${patient.name} — ${when}` }, Body: { Text: { Data: doctorText } } },
      })
    );
    doctorSent = true;
  } catch {
    /* graceful — link still returned to the user on-screen */
  }

  if (patient.email) {
    const patientText =
      `Hi ${patient.name},\n\nYour consultation with ${doctorName} is confirmed.\n\n` +
      `When: ${when}\nJoin the video call here: ${meetLink}\n\n` +
      `Booking ID: ${appointment.bookingId}\n\n— 3TATTAVA · VaidyaConnect`;
    try {
      await client.send(
        new SendEmailCommand({
          Source: from,
          Destination: { ToAddresses: [patient.email] },
          Message: { Subject: { Data: "Your 3TATTAVA consultation is confirmed" }, Body: { Text: { Data: patientText } } },
        })
      );
      patientSent = true;
    } catch {
      /* graceful */
    }
  }

  return { doctorSent, patientSent };
}

router.post("/consultation", async (req, res, next) => {
  try {
    const { doctorSlug, date, timeSlot, name, phone, email, age, gender, prakriti } = req.body;
    if (!doctorSlug || !date || !timeSlot || !name || !phone || !email || !age) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const doctor = await Doctor.findOne({ slug: doctorSlug, status: "active" }).lean();
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const emailLc = String(email).toLowerCase().trim();
    // First consultation per email is free.
    const priorCount = await Booking.countDocuments({
      "patient.email": emailLc,
      status: { $in: ["confirmed", "completed"] },
    });
    const isFree = priorCount === 0;
    const onlineFee = doctor.practice?.consultationFee?.online;
    const fee = isFree ? 0 : onlineFee || doctor.practice?.consultationFee?.inClinic || 0;

    const duration = doctor.slotConfig?.durationMinutes || 30;
    const bookingId = generateBookingId(date);

    // Doctor's notification / calendar-invite address (env override wins).
    const doctorEmail =
      (process.env.CONSULT_NOTIFY_EMAIL || "").trim() ||
      doctor.personal?.email ||
      process.env.AWS_SES_FROM_EMAIL;

    // Try to create a Google Calendar event with a unique Meet link; this also
    // emails calendar invites to the patient + doctor and lands the slot on the
    // doctor's Google Calendar. Falls back to meetLinkFor() (fixed Meet room or
    // Jitsi) when the Calendar integration isn't configured or the call fails.
    const prakritiText = Object.entries(prakriti || {})
      .filter(([, v]) => v && String(v).trim())
      .map(([k, v]) => `${PRAKRITI_LABELS[k] || k}: ${v}`)
      .join("\n");
    const calendarEvent = await createConsultationEvent({
      summary: `3TATTAVA Consultation — ${String(name).trim()}`,
      description:
        `Online Ayurveda consultation${isFree ? " (free first consultation)" : ""} with ${doctor.personal.fullName}.\n\n` +
        `Patient: ${String(name).trim()}\nPhone: ${String(phone).trim()}\nEmail: ${emailLc}\n` +
        `Age: ${Number(age)}   Gender: ${gender || "prefer-not-to-say"}\n\n` +
        `Prakriti intake:\n${prakritiText || "(none provided)"}\n\nBooking ID: ${bookingId}`,
      date,
      startTime: timeSlot,
      durationMin: duration,
      attendees: [emailLc, doctorEmail],
    });
    const meetLink = calendarEvent?.meetLink || meetLinkFor(bookingId);

    const booking = new Booking({
      bookingId,
      status: "confirmed",
      doctor: { doctorId: doctor._id, name: doctor.personal.fullName, clinic: doctor.clinic.name },
      patient: {
        name: String(name).trim(),
        phone: String(phone).trim(),
        email: emailLc,
        age: Number(age),
        gender: gender || "prefer-not-to-say",
      },
      appointment: {
        date,
        timeSlot,
        endTime: getEndTime(timeSlot, duration),
        type: "online",
        fee,
        healthConcern: prakriti?.primaryConcern || "",
        isFirstAyurvedaVisit: isFree,
        meetLink,
        isFreeConsultation: isFree,
      },
      prakriti: prakriti || {},
      source: "website",
    });

    await booking.save();

    Doctor.updateOne(
      { _id: doctor._id },
      { $inc: { "analytics.totalBookings": 1, "analytics.bookingsThisMonth": 1 } }
    ).catch(() => {});

    const emailResult = await sendConsultEmails({
      doctorEmail,
      patient: booking.patient,
      doctorName: booking.doctor.name,
      appointment: { date, timeSlot, bookingId },
      meetLink,
      prakriti: prakriti || {},
      isFree,
    });

    return res.status(201).json({
      message: "Consultation confirmed!",
      booking: {
        bookingId,
        meetLink,
        isFreeConsultation: isFree,
        fee,
        doctor: booking.doctor,
        appointment: booking.appointment,
      },
      emailResult,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "This time slot was just booked by someone else. Please pick another slot." });
    }
    return next(err);
  }
});

module.exports = router;
