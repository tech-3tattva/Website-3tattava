// Server-side fetch helpers for founder-authored Education blogs (DB-backed).
// Used by the /education pages (server components). Kept separate from the
// client `api.ts` wrapper because these run during server render.

export type DbBlog = {
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

const API = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api").replace(/\/$/, "");

export async function getPublishedBlogs(): Promise<DbBlog[]> {
  try {
    const res = await fetch(`${API}/blogs`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as DbBlog[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getDbBlog(slug: string): Promise<DbBlog | null> {
  try {
    const res = await fetch(`${API}/blogs/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as DbBlog;
  } catch {
    return null;
  }
}
