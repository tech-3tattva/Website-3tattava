const express = require("express");
const Blog = require("../models/Blog");

const router = express.Router();

function serialize(b) {
  const { _id, __v, ...rest } = b;
  return { id: _id.toString(), ...rest };
}

// GET /api/blogs -> all published blogs, newest first
router.get("/", async (_req, res, next) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();
    res.json(blogs.map(serialize));
  } catch (err) {
    next(err);
  }
});

// GET /api/blogs/:slug -> single published blog
router.get("/:slug", async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true }).lean();
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(serialize(blog));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
