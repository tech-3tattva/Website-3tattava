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

const GOLD = "#C8963E";

const field: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "#101010",
  border: "1px solid rgba(200,150,62,0.18)",
  borderRadius: 4,
  color: "#F5F0EB",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
};
const label: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(245,240,235,0.5)",
  marginBottom: 6,
};
const card: React.CSSProperties = {
  background: "#1a1a1a",
  border: "1px solid rgba(200,150,62,0.12)",
  borderRadius: 4,
  padding: 22,
};

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
      setOk("Published — it is now live on the Education Centre page.");
      resetForm();
      await load();
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
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 28 }}>
      {error && (
        <p style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff9b9b", padding: "10px 14px", borderRadius: 4, fontSize: 13 }}>
          {error}
        </p>
      )}
      {ok && (
        <p style={{ background: "rgba(120,200,120,0.1)", border: "1px solid rgba(120,200,120,0.3)", color: "#a7e0a7", padding: "10px 14px", borderRadius: 4, fontSize: 13 }}>
          {ok}
        </p>
      )}

      {/* ── Create form ── */}
      <form onSubmit={(e) => void handleSubmit(e)} style={{ ...card, display: "flex", flexDirection: "column", gap: 18 }}>
        <h2 style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond'),serif", fontSize: 22, fontWeight: 600, color: "#F5F0EB", margin: 0 }}>
          Write a new article
        </h2>
        <p style={{ fontSize: 12, color: "rgba(245,240,235,0.4)", margin: "-8px 0 0" }}>
          Add a cover image and your content — it publishes directly to the Education Centre page.
        </p>

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
          <textarea style={{ ...field, minHeight: 60, resize: "vertical" }} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="One or two lines that describe the article." />
        </div>

        <div>
          <label style={label}>Content</label>
          <textarea style={{ ...field, minHeight: 240, resize: "vertical", lineHeight: 1.6 }} value={content} onChange={(e) => setContent(e.target.value)} placeholder={"Write the article here.\n\nSeparate paragraphs with a blank line.\n\n## Use a heading like this\n\nWrap text in **bold** or *italic* for emphasis."} />
          <p style={{ fontSize: 11, color: "rgba(245,240,235,0.35)", marginTop: 6 }}>
            Tip: blank line = new paragraph · start a line with <b style={{ color: GOLD }}>##</b> for a sub-heading · <b style={{ color: GOLD }}>**bold**</b> and <b style={{ color: GOLD }}>*italic*</b> supported.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
          <div>
            <label style={label}>Cover image</label>
            <input ref={coverRef} type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} style={{ color: "rgba(245,240,235,0.6)", fontSize: 13 }} />
            {cover && <p style={{ fontSize: 12, color: GOLD, marginTop: 6 }}>{cover.name}</p>}
          </div>
          <div>
            <label style={label}>Extra images (optional, gallery)</label>
            <input ref={galleryRef} type="file" accept="image/*" multiple onChange={(e) => setGallery(Array.from(e.target.files ?? []).slice(0, 10))} style={{ color: "rgba(245,240,235,0.6)", fontSize: 13 }} />
            {gallery.length > 0 && <p style={{ fontSize: 12, color: GOLD, marginTop: 6 }}>{gallery.length} image(s) selected</p>}
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(245,240,235,0.7)", cursor: "pointer" }}>
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          Publish immediately (uncheck to save as a hidden draft)
        </label>

        <div>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "12px 28px",
              background: saving ? "rgba(200,150,62,0.4)" : GOLD,
              color: "#0f0f0f",
              border: "none",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: saving ? "default" : "pointer",
            }}
          >
            {saving ? "Publishing…" : "Publish article"}
          </button>
        </div>
      </form>

      {/* ── Existing articles ── */}
      <div>
        <h2 style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond'),serif", fontSize: 22, fontWeight: 600, color: "#F5F0EB", marginBottom: 14 }}>
          Published articles {blogs.length > 0 && <span style={{ color: "rgba(245,240,235,0.3)", fontSize: 15 }}>({blogs.length})</span>}
        </h2>
        {loading ? (
          <p style={{ color: "rgba(245,240,235,0.4)", fontSize: 14 }}>Loading…</p>
        ) : blogs.length === 0 ? (
          <p style={{ color: "rgba(245,240,235,0.4)", fontSize: 14 }}>No articles yet. Write your first one above.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {blogs.map((b) => (
              <div key={b.id} style={{ ...card, display: "flex", alignItems: "center", gap: 16, padding: 14, flexWrap: "wrap" }}>
                <div style={{ width: 72, height: 54, flexShrink: 0, borderRadius: 4, overflow: "hidden", background: "#101010", border: "1px solid rgba(200,150,62,0.12)" }}>
                  {b.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(245,240,235,0.2)", fontSize: 10 }}>no image</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <p style={{ color: "#F5F0EB", fontSize: 15, margin: 0, fontWeight: 500 }}>{b.title}</p>
                  <p style={{ color: "rgba(245,240,235,0.4)", fontSize: 12, margin: "3px 0 0" }}>
                    {b.pillar} · {new Date(b.publishedAt || b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {!b.isPublished && <span style={{ color: "#e0a84f", marginLeft: 8 }}>· draft</span>}
                  </p>
                </div>
                <a
                  href={`/education/${b.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 12, color: GOLD, textDecoration: "none", border: `1px solid rgba(200,150,62,0.3)`, padding: "7px 14px", borderRadius: 4 }}
                >
                  View
                </a>
                <button
                  onClick={() => void handleDelete(b.id, b.title)}
                  style={{ fontSize: 12, color: "#ff9b9b", background: "transparent", border: "1px solid rgba(255,80,80,0.3)", padding: "7px 14px", borderRadius: 4, cursor: "pointer" }}
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
