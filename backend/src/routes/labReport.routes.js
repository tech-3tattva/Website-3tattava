const express = require("express");

const LabReport = require("../models/LabReport");
const Product = require("../models/Product");
const { ApiError } = require("../middleware/errorHandler");

const router = express.Router();

function normalizeBadge(raw) {
  return String(raw ?? "")
    .trim()
    .toUpperCase();
}

router.get("/by-badge/:badge", async (req, res, next) => {
  try {
    const badge = normalizeBadge(req.params.badge);
    if (!badge) {
      throw new ApiError(400, "Badge number is required");
    }

    const report = await LabReport.findOne({ badgeNumber: badge }).exec();
    if (!report) {
      throw new ApiError(404, "No lab report found for this badge number");
    }

    const product = await Product.findOne({ slug: report.productSlug, isActive: true })
      .select("name slug")
      .lean()
      .exec();

    const productName = product?.name ?? report.productSlug;
    const slug = product?.slug ?? report.productSlug;

    return res.json({
      badgeNumber: report.badgeNumber,
      productName,
      slug,
      reportUrl: report.reportUrl || null,
      summary: report.summary || null,
      batchCode: report.batchCode || null,
      testedAt: report.testedAt ? report.testedAt.toISOString() : null,
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
