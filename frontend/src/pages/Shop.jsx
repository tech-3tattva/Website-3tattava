import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Filter } from "lucide-react";
import { getProducts } from "../lib/api";

const CATS = ["All", "Shilajit Resin", "Honey Sticks", "Bundles", "Subscribe & Save"];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState("All");

  useEffect(() => {
    getProducts(cat === "All" ? {} : { category: cat }).then(setProducts).catch(() => {});
  }, [cat]);

  return (
    <div data-testid="shop-page" className="bg-cream">
      <section className="bg-ink text-cream py-24 px-6 md:px-16 grain">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-gold mb-5">Shop · The Ritual Collection</div>
          <h1 className="font-display text-5xl md:text-7xl" style={{ fontVariationSettings: "'wdth' 82, 'wght' 800", lineHeight: 1 }}>
            Different Rituals. <br /><span className="gold-gradient-text">Same Philosophy.</span>
          </h1>
          <p className="font-italic-light text-cream/75 text-xl mt-6 max-w-2xl" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
            Doctor-led. Lab-tested. Triphala-purified. Built for daily ritual.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 flex-wrap mb-12 border-b border-ink/10 pb-6">
            <Filter size={14} className="text-ink/50" />
            {CATS.map((c) => (
              <button
                key={c}
                data-testid={`shop-filter-${c.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                onClick={() => setCat(c)}
                className={`eyebrow text-[10px] px-4 py-2 border transition-all ${cat === c ? "bg-ink text-cream border-ink" : "border-ink/15 hover:border-gold"}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <Link key={p.slug} to={`/products/${p.slug}`} className="luxe-card overflow-hidden group block" data-testid={`product-card-${p.slug}`}>
                <div className="relative h-72 bg-ink overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute top-4 left-4 eyebrow text-cream/90 text-[10px]" style={{ color: p.accent_color }}>{p.ritual_name}</div>
                  {p.compare_at && <div className="absolute top-4 right-4 eyebrow text-[10px] bg-gold text-ink px-2 py-1">Save ₹{(p.compare_at - p.price).toLocaleString("en-IN")}</div>}
                </div>
                <div className="p-6">
                  <div className="eyebrow text-[10px] text-ink/50 mb-2">{p.category}</div>
                  <div className="font-display text-2xl mb-2" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>{p.name}</div>
                  <p className="font-italic-light text-sm text-ink/70 mb-5" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>{p.tagline}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="font-display text-2xl" style={{ fontVariationSettings: "'wdth' 80, 'wght' 700" }}>₹{p.price.toLocaleString("en-IN")}</span>
                      {p.compare_at && <span className="ml-2 text-xs text-ink/40 line-through">₹{p.compare_at.toLocaleString("en-IN")}</span>}
                    </div>
                    <ArrowRight size={18} className="text-gold-dark group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
