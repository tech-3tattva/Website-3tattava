const express = require("express");

const Category = require("../models/Category");

const router = express.Router();

// PRD expects: GET /api/categories
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).exec();
    return res.json(categories);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

