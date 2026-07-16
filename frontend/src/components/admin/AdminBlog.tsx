"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adminApi } from "@/lib/api";

type Blog = {
  id: string;
  slug: string;
  title: string;
  pillar: string;
  summary: string;
  coverImage: string;
  content: string;
  images: string[];
  author: string;
  readTime: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
};

const PILLARS = [
  "Shilajit & Fulvic",
  "Doshas & Balance",
  "Daily Rituals",
  "Performance & Energy",
  "Ingredients",
  "Ayurveda Basics",
];

/* ── Cream-white palette ── */
const CREAM = "#f4eee0";
const CARD = "#fffdf9";
const BORDER = "#e2d8c2";
const INK = "#3a2a1c";
const MUTED = "#836f57";
const GOLD = "#C8963E";
const SERIF = "var(--font-cormorant,'Cormorant Garamond'),serif";

const field: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  background: "#ffffff",
  border: `1px solid ${BORDER}`,
  borderRadius: 9,
  color: INK,
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
};
const label: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: MUTED,
  marginBottom: 6,
  fontWeight: 600,
};
const card: React.CSSProperties = {
  background: CARD,
  border: `1px solid ${BORDER}`,
  borderRadius: 16,
  padding: 26,
  boxShadow: "0 2px 14px rgba(68,42,27,0.06)",
};

function publishBtnStyle(saving: boolean): React.CSSProperties {
  return {
    padding: "13px 34px",
    background: saving ? "#d9bd86" : GOLD,
    color: "#2a1c0d",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: saving ? "default" : "pointer",
    boxShadow: "0 6px 16px rgba(200,150,62,0.28)",
    whiteSpace: "nowrap",
  };
}

export default function AdminBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [pillar, setPillar] = useState<string>(PILLARS[0]);
  const [summary, setSummary] = useState("");
  const [readTime, setReadTime] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [cover, setCover] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.get<{ blogs: Blog[] }>("/admin/blogs");
      setBlogs(res.blogs || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForm() {
    setTitle("");
    setSlug("");
    setPillar(PILLARS[0]);
    setSummary("");
    setReadTime("");
    setContent("");
    setIsPublished(true);
    setCover(null);
    setGallery([]);
    if (coverRef.current) coverRef.current.value = "";
    if (galleryRef.current) galleryRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      if (slug.trim()) fd.append("slug", slug.trim());
      fd.append("pillar", pillar.trim());
      fd.append("summary", summary.trim());
      fd.append("readTime", readTime.trim());
      fd.append("content", content);
      fd.append("isPublished", isPublished ? "true" : "false");
      if (cover) fd.append("coverImage", cover);
      for (const f of gallery) fd.append("images", f);
      await adminApi.upload("/admin/blogs", fd);
      setOk(isPublished ? "Published — it is now live on the Education Centre page." : "Saved as a draft (hidden from the site).");
      resetForm();
      await load();
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, t: string) {
    if (!window.confirm(`Delete "${t}"? This removes it from the Education page.`)) return;
    try {
      await adminApi.delete(`/admin/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div style={{ background: CREAM, borderRadius: 20, padding: "clamp(16px,2.5vw,30px)", display: "flex", flexDirection: "column", gap: 24 }}>
      {error && (
        <p style={{ background: "#fbeaea", border: "1px solid #edc4c4", color: "#a13a3a", padding: "11px 15px", borderRadius: 9, fontSize: 13, margin: 0 }}>
          {error}
        </p>
      )}
      {ok && (
        <p style={{ background: "#e8f3e5", border: "1px solid #bcd9b3", color: "#3f7a3a", padding: "11px 15px", borderRadius: 9, fontSize: 13, margin: 0 }}>
          {ok}
        </p>
      )}

      {/* ── Create form ── */}
      <form onSubmit={(e) => void handleSubmit(e)} style={{ ...card, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Header with the Publish action always visible */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", borderBottom: `1px solid ${BORDER}`, paddingBottom: 18 }}>
          <div>
            <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: INK, margin: 0 }}>Write a new article</h2>
            <p style={{ fontSize: 13, color: MUTED, margin: "4px 0 0" }}>
              Add a cover image and your content — it publishes directly to the Education Centre page.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: MUTED, cursor: "pointer", whiteSpace: "nowrap" }}>
              <input type="checkbox" checked={!isPublished} onChange={(e) => setIsPublished(!e.target.checked)} />
              Save as draft
            </label>
            <button type="submit" disabled={saving} style={publishBtnStyle(saving)}>
              {saving ? "Publishing…" : isPublished ? "Publish article" : "Save draft"}
            </button>
          </div>
        </div>

        <div>
          <label style={label}>Title *</label>
          <input style={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. The Science of Shilajit for Daily Energy" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
          <div>
            <label style={label}>Category / Pillar</label>
            <input style={field} list="blog-pillars" value={pillar} onChange={(e) => setPillar(e.target.value)} />
            <datalist id="blog-pillars">
              {PILLARS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>
          <div>
            <label style={label}>Read time (optional)</label>
            <input style={field} value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="e.g. 5 min read" />
          </div>
          <div>
            <label style={label}>URL slug (optional)</label>
            <input style={field} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from title" />
          </div>
        </div>

        <div>
          <label style={label}>Summary (shown on the article card)</label>
          <textarea style={{ ...field, minHeight: 62, resize: "vertical" }} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="One or two lines that describe the article." />
        </div>

        <div>
          <label style={label}>Content</label>
          <textarea style={{ ...field, minHeight: 260, resize: "vertical", lineHeight: 1.6 }} value={content} onChange={(e) => setContent(e.target.value)} placeholder={"Write the article here.\n\nSeparate paragraphs with a blank line.\n\n## Use a heading like this\n\nWrap text in **bold** or *italic* for emphasis."} />
          <p style={{ fontSize: 11.5, color: MUTED, marginTop: 7 }}>
            Tip: blank line = new paragraph · start a line with <b style={{ color: GOLD }}>##</b> for a sub-heading · <b style={{ color: GOLD }}>**bold**</b> and <b style={{ color: GOLD }}>*italic*</b> supported.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
          <div>
            <label style={label}>Cover image</label>
            <input ref={coverRef} type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} style={{ color: INK, fontSize: 13 }} />
            {cover && <p style={{ fontSize: 12, color: GOLD, marginTop: 6 }}>{cover.name}</p>}
          </div>
          <div>
            <label style={label}>Extra images (optional, gallery)</label>
            <input ref={galleryRef} type="file" accept="image/*" multiple onChange={(e) => setGallery(Array.from(e.target.files ?? []).slice(0, 10))} style={{ color: INK, fontSize: 13 }} />
            {gallery.length > 0 && <p style={{ fontSize: 12, color: GOLD, marginTop: 6 }}>{gallery.length} image(s) selected</p>}
          </div>
        </div>

        {/* Bottom publish action (also visible after filling the form) */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16, borderTop: `1px solid ${BORDER}`, paddingTop: 18, flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: MUTED, cursor: "pointer" }}>
            <input type="checkbox" checked={!isPublished} onChange={(e) => setIsPublished(!e.target.checked)} />
            Save as draft
          </label>
          <button type="submit" disabled={saving} style={publishBtnStyle(saving)}>
            {saving ? "Publishing…" : isPublished ? "Publish article" : "Save draft"}
          </button>
        </div>
      </form>

      {/* ── Existing articles ── */}
      <div>
        <h2 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700, color: INK, marginBottom: 14 }}>
          Published articles {blogs.length > 0 && <span style={{ color: MUTED, fontSize: 16 }}>({blogs.length})</span>}
        </h2>
        {loading ? (
          <p style={{ color: MUTED, fontSize: 14 }}>Loading…</p>
        ) : blogs.length === 0 ? (
          <p style={{ color: MUTED, fontSize: 14 }}>No articles yet. Write your first one above.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {blogs.map((b) => (
              <div key={b.id} style={{ ...card, display: "flex", alignItems: "center", gap: 16, padding: 14, flexWrap: "wrap" }}>
                <div style={{ width: 74, height: 56, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#efe7d5", border: `1px solid ${BORDER}` }}>
                  {b.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, fontSize: 10 }}>no image</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <p style={{ color: INK, fontSize: 15, margin: 0, fontWeight: 600 }}>{b.title}</p>
                  <p style={{ color: MUTED, fontSize: 12, margin: "3px 0 0" }}>
                    {b.pillar} · {new Date(b.publishedAt || b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {!b.isPublished && <span style={{ color: "#b8860b", marginLeft: 8 }}>· draft</span>}
                  </p>
                </div>
                <a
                  href={`/education/${b.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 12, color: "#2a1c0d", background: "rgba(200,150,62,0.16)", textDecoration: "none", border: `1px solid rgba(200,150,62,0.4)`, padding: "8px 15px", borderRadius: 8, fontWeight: 600 }}
                >
                  View
                </a>
                <button
                  onClick={() => void handleDelete(b.id, b.title)}
                  style={{ fontSize: 12, color: "#a13a3a", background: "transparent", border: "1px solid #e0b4b4", padding: "8px 15px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
