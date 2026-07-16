const mongoose = require("mongoose");

/**
 * Founder-authored educational blog / article.
 * Created from the admin panel (Education tab) and rendered on the
 * public Education Centre page (/education) + article page (/education/:slug).
 *
 * `content` supports lightweight markup used by the frontend renderer:
 *   - Blank-line-separated paragraphs
 *   - Lines starting with "## " become sub-headings
 *   - **bold** and *italic* inline emphasis
 */
const blogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    title: { type: String, required: true, trim: true },

    // Grouping used by the Education library (e.g. "Shilajit", "Doshas", "Rituals").
    pillar: { type: String, default: "Ayurveda", trim: true },

    summary: { type: String, default: "" },
    coverImage: { type: String, default: "" }, // absolute URL
    content: { type: String, default: "" },
    images: { type: [String], default: [] }, // additional inline/gallery images

    author: { type: String, default: "3TATTAVA" },
    readTime: { type: String, default: "" },

    isPublished: { type: Boolean, default: true, index: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

blogSchema.index({ isPublished: 1, publishedAt: -1 });

blogSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
