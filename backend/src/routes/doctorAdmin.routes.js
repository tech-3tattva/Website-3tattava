const express = require("express");
const Doctor = require("../models/Doctor");
const { verifyAdmin } = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/admin/doctors/applications
 * List all pending doctor applications.
 */
router.get("/applications", verifyAdmin, async (req, res, next) => {
  try {
    const { status = "pending", page = "1", limit = "20" } = req.query;
    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

    const filter = {};
    if (status !== "all") filter.status = status;

    const [doctors, total] = await Promise.all([
      Doctor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Doctor.countDocuments(filter),
    ]);

    res.json({ doctors, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/admin/doctors/applications/:id
 * Approve or reject a doctor application.
 * Body: { action: "approve" | "reject", notes: "optional rejection reason" }
 */
router.put("/applications/:id", verifyAdmin, async (req, res, next) => {
  try {
    const { action, notes } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "action must be 'approve' or 'reject'" });
    }

    const update =
      action === "approve"
        ? {
            status: "active",
            "qualifications.verifiedAt": new Date(),
            "qualifications.verifiedBy": req.user?.id || null,
            adminNotes: notes || "",
          }
        : {
            status: "rejected",
            adminNotes: notes || "Application rejected",
          };

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json({
      message: action === "approve" ? `${doctor.personal.fullName} is now active.` : `Application rejected.`,
      doctor: { _id: doctor._id, slug: doctor.slug, status: doctor.status },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/doctors/analytics
 * Platform-wide doctor network stats.
 */
router.get("/analytics", verifyAdmin, async (req, res, next) => {
  try {
    const [total, active, pending, totalBookings] = await Promise.all([
      Doctor.countDocuments(),
      Doctor.countDocuments({ status: "active" }),
      Doctor.countDocuments({ status: "pending" }),
      Doctor.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: null, total: { $sum: "$analytics.totalBookings" } } },
      ]),
    ]);

    res.json({
      doctors: { total, active, pending },
      bookings: totalBookings[0]?.total || 0,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
