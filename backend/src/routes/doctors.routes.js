const express = require("express");
const Doctor = require("../models/Doctor");
const Booking = require("../models/Booking");
const BlockedSlot = require("../models/BlockedSlot");
const { generateSlots } = require("../utils/slots");

const router = express.Router();

/**
 * GET /api/doctors
 * List active doctors with optional filters.
 * Query: ?area=&specialization=&type=&sort=&search=&page=&limit=
 */
router.get("/", async (req, res, next) => {
  try {
    const {
      area,
      specialization,
      type,
      sort = "rating",
      search,
      page = "1",
      limit = "12",
    } = req.query;

    const filter = { status: "active" };

    if (area) filter["clinic.address.area"] = { $regex: new RegExp(area, "i") };
    if (specialization) filter["practice.specializations"] = specialization;
    if (type === "online") filter["practice.offersOnline"] = true;
    if (search) {
      filter.$or = [
        { "personal.fullName": { $regex: new RegExp(search, "i") } },
        { "clinic.address.area": { $regex: new RegExp(search, "i") } },
        { "practice.specializations": { $regex: new RegExp(search, "i") } },
      ];
    }

    const sortMap = {
      rating: { "ratings.average": -1 },
      "most-booked": { "analytics.totalBookings": -1 },
      newest: { createdAt: -1 },
    };
    const sortObj = sortMap[sort] || sortMap.rating;

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

    const [doctors, total] = await Promise.all([
      Doctor.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .select("-qualifications.registrationCertificate -qualifications.degreeCertificate -adminNotes")
        .lean(),
      Doctor.countDocuments(filter),
    ]);

    res.json({
      doctors,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/doctors/specializations
 * List distinct specializations with doctor counts.
 */
router.get("/specializations", async (_req, res, next) => {
  try {
    const result = await Doctor.aggregate([
      { $match: { status: "active" } },
      { $unwind: "$practice.specializations" },
      {
        $group: {
          _id: "$practice.specializations",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(result.map((r) => ({ name: r._id, count: r.count })));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/doctors/:slug
 * Get a single doctor's full profile.
 */
router.get("/:slug", async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({
      slug: req.params.slug,
      status: "active",
    })
      .select("-qualifications.registrationCertificate -qualifications.degreeCertificate -adminNotes")
      .lean();

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Increment profile views (fire-and-forget).
    Doctor.updateOne(
      { _id: doctor._id },
      { $inc: { "analytics.profileViews": 1, "analytics.profileViewsThisMonth": 1 } },
    ).catch(() => {});

    res.json(doctor);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/doctors/:slug/slots?date=YYYY-MM-DD
 * Get available time slots for a doctor on a given date.
 */
router.get("/:slug/slots", async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: "date query is required (YYYY-MM-DD)" });
    }

    const doctor = await Doctor.findOne({ slug: req.params.slug, status: "active" }).lean();
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Max advance booking check.
    const maxDays = doctor.slotConfig?.maxAdvanceBookingDays || 30;
    const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const todayStr = nowIST.toISOString().slice(0, 10);
    const targetDate = new Date(date + "T00:00:00+05:30");
    const diffDays = Math.ceil((targetDate - new Date(todayStr + "T00:00:00+05:30")) / 86400000);

    if (diffDays < 0) {
      return res.json({ available: [], closed: false, reason: "Date is in the past" });
    }
    if (diffDays > maxDays) {
      return res.json({ available: [], closed: false, reason: `Bookings allowed up to ${maxDays} days in advance` });
    }

    // Get booked + blocked slots for this date.
    const [confirmedBookings, blockedDoc] = await Promise.all([
      Booking.find({
        "doctor.doctorId": doctor._id,
        "appointment.date": date,
        status: "confirmed",
      })
        .select("appointment.timeSlot")
        .lean(),
      BlockedSlot.findOne({ doctorId: doctor._id, date }).lean(),
    ]);

    const bookedSlots = confirmedBookings.map((b) => b.appointment.timeSlot);
    const blockedSlots = blockedDoc?.slots || [];

    const result = generateSlots(doctor, date, bookedSlots, blockedSlots);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/doctors/apply
 * Submit a doctor application. Creates a doctor with status="pending".
 */
router.post("/apply", async (req, res, next) => {
  try {
    const body = req.body;

    // Build slug from name + area.
    const nameSlug = (body.fullName || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
    const areaSlug = (body.area || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 30);
    let slug = `${nameSlug}-${areaSlug}`.replace(/-+/g, "-").replace(/^-|-$/g, "");

    // Ensure uniqueness.
    const existing = await Doctor.findOne({ slug }).lean();
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const doctor = await Doctor.create({
      slug,
      status: "pending",
      personal: {
        fullName: body.fullName,
        phone: body.phone,
        email: body.email,
        photo: body.photo || "",
        gender: body.gender || "male",
      },
      qualifications: {
        degree: body.degree,
        university: body.university,
        graduationYear: body.graduationYear,
        registrationNumber: body.registrationNumber,
        registrationBoard: body.registrationBoard || "",
        yearsOfPractice: body.yearsOfPractice || 0,
      },
      clinic: {
        name: body.clinicName,
        address: {
          line1: body.addressLine1,
          line2: body.addressLine2 || "",
          area: body.area,
          city: body.city,
          state: body.state || "Delhi",
          pincode: body.pincode,
        },
        googleMapsLink: body.googleMapsLink || "",
      },
      practice: {
        specializations: body.specializations || [],
        languages: body.languages || ["hindi"],
        consultationFee: {
          inClinic: body.feeInClinic,
          online: body.feeOnline || null,
        },
        offersOnline: body.offersOnline === true,
        bio: body.bio || "",
      },
      workingHours: body.workingHours || {},
    });

    res.status(201).json({
      message: `Thank you, ${body.fullName}! Your application has been received. Our team will verify your credentials within 5-7 working days.`,
      doctorId: doctor._id,
      slug: doctor.slug,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "A doctor with this registration already exists." });
    }
    next(err);
  }
});

module.exports = router;
