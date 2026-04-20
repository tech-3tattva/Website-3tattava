const express = require("express");
const Doctor = require("../models/Doctor");
const Booking = require("../models/Booking");
const { generateBookingId, getEndTime } = require("../utils/slots");

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

module.exports = router;
