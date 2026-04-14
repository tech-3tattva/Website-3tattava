"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Category, Product } from "@shared/types";
import { api } from "@/lib/api";

const BADGES = ["", "Best Seller", "New", "20% Off"] as const;
const DOSHAS = ["Vata", "Pitta", "Kapha"] as const;

type Props = { productId?: string };

export default function AdminProductForm({ productId }: Props) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [categoryLabel, setCategoryLabel] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [sku, setSku] = useState("");
  const [badge, setBadge] = useState<string>("");
  const [dosha, setDosha] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isGiftable, setIsGiftable] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const loadCategories = useCallback(async () => {
    try {
      const data = await api.get<Category[]>("/categories");
      setCategories(data);
    } catch {
      setError("Could not load categories");
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const p = await api.get<Product>(`/admin/products/${productId}`);
        if (cancelled) return;
        setName(p.name);
        setSlug(p.slug);
        setCategory(p.category);
        setCategoryLabel(p.categoryLabel);
        setPrice(String(p.price));
        setMrp(p.mrp != null ? String(p.mrp) : "");
        setShortDescription(p.shortDescription ?? "");
        setDescription(p.description ?? "");
        setStockQuantity(String(p.stockQuantity ?? 0));
        setLowStockThreshold(
          String((p as unknown as { lowStockThreshold?: number }).lowStockThreshold ?? 5)
        );
        setSku((p as unknown as { sku?: string }).sku ?? p.slug);
        setBadge(p.badge ?? "");
        setDosha(p.dosha ?? []);
        setIsActive(p.isActive);
        setIsFeatured(Boolean(p.isFeatured));
        setIsGiftable(Boolean((p as unknown as { isGiftable?: boolean }).isGiftable));
        setExistingImages(p.images ?? []);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load product");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  useEffect(() => {
    if (!category || categories.length === 0) return;
    const cat = categories.find((c) => c.slug === category);
    if (cat && !isEdit) {
      setCategoryLabel(cat.name.toUpperCase());
    }
  }, [category, categories, isEdit]);

  function toggleDosha(d: string) {
    setDosha((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list) return;
    setImageFiles(Array.from(list).slice(0, 5));
  }

  function appendCommonFields(fd: FormData) {
    fd.append("name", name.trim());
    if (slug.trim()) fd.append("slug", slug.trim());
    fd.append("category", category.trim());
    fd.append("categoryLabel", categoryLabel.trim());
    fd.append("price", price);
    if (mrp.trim()) fd.append("mrp", mrp);
    if (shortDescription.trim()) fd.append("shortDescription", shortDescription.trim());
    if (description.trim()) fd.append("description", description.trim());
    fd.append("stockQuantity", stockQuantity);
    fd.append("lowStockThreshold", lowStockThreshold);
    if (sku.trim()) fd.append("sku", sku.trim());
    if (badge) fd.append("badge", badge);
    fd.append("dosha", JSON.stringify(dosha));
    fd.append("isActive", isActive ? "true" : "false");
    fd.append("isFeatured", isFeatured ? "true" : "false");
    fd.append("isGiftable", isGiftable ? "true" : "false");
    for (const file of imageFiles) {
      fd.append("images", file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!category.trim() || !categoryLabel.trim()) {
        throw new Error("Category and category label are required");
      }
      const fd = new FormData();
      appendCommonFields(fd);
      if (isEdit && productId) {
        await api.patchUpload(`/admin/products/${productId}`, fd, false);
      } else {
        await api.upload("/admin/products", fd, false);
      }
      router.push("/admin/inventory");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-text-medium py-8">Loading product…</p>;
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-8 max-w-3xl">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
      )}

      <section className="premium-card p-6 space-y-4">
        <h2 className="font-display text-xl text-text-dark">Basic info</h2>
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1">Product name *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1">
            URL slug (optional — auto from name if empty)
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. kumkumadi-serum"
            className="w-full px-3 py-2 border border-border rounded-lg"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Category *</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-white"
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Shelf label *</label>
            <input
              required
              value={categoryLabel}
              onChange={(e) => setCategoryLabel(e.target.value)}
              placeholder="e.g. FACE SERUM"
              className="w-full px-3 py-2 border border-border rounded-lg"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1">SKU (optional)</label>
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg"
          />
        </div>
      </section>

      <section className="premium-card p-6 space-y-4">
        <h2 className="font-display text-xl text-text-dark">Pricing</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Price (₹) *</label>
            <input
              required
              type="number"
              min={0}
              step={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">MRP (₹)</label>
            <input
              type="number"
              min={0}
              step={1}
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg"
            />
          </div>
        </div>
      </section>

      <section className="premium-card p-6 space-y-4">
        <h2 className="font-display text-xl text-text-dark">Descriptions</h2>
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1">Short description</label>
          <input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1">Full description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-border rounded-lg"
          />
        </div>
      </section>

      <section className="premium-card p-6 space-y-4">
        <h2 className="font-display text-xl text-text-dark">Images</h2>
        <p className="text-sm text-text-medium">
          Up to 5 images (JPEG, PNG, WebP). New uploads are added to the gallery on save.
        </p>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onFileChange} />
        {imageFiles.length > 0 && (
          <p className="text-sm text-text-dark">{imageFiles.length} new file(s) selected</p>
        )}
        {existingImages.length > 0 && (
          <div>
            <p className="text-sm font-medium text-text-dark mb-2">Current images</p>
            <ul className="text-xs text-text-medium break-all space-y-1">
              {existingImages.map((url) => (
                <li key={url}>{url}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="premium-card p-6 space-y-4">
        <h2 className="font-display text-xl text-text-dark">Stock & visibility</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Stock quantity</label>
            <input
              type="number"
              min={0}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Low-stock alert at</label>
            <input
              type="number"
              min={0}
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Active on website
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isGiftable} onChange={(e) => setIsGiftable(e.target.checked)} />
            Gift eligible
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1">Badge</label>
          <select
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-border rounded-lg bg-white"
          >
            {BADGES.map((b) => (
              <option key={b || "none"} value={b}>
                {b || "None"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-sm font-medium text-text-dark mb-2">Dosha</p>
          <div className="flex flex-wrap gap-3">
            {DOSHAS.map((d) => (
              <label key={d} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={dosha.includes(d)}
                  onChange={() => toggleDosha(d)}
                />
                {d}
              </label>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary-green text-white px-8 py-3 text-sm font-semibold hover:bg-secondary-green disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/inventory")}
          className="rounded-full border border-border px-8 py-3 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
