import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="bg-ink text-cream min-h-[80vh] flex items-center justify-center px-6 grain" data-testid="not-found">
      <div className="max-w-xl text-center">
        <div className="font-display text-[140px] gold-gradient-text leading-none mb-4" style={{ fontVariationSettings: "'wdth' 80, 'wght' 800" }}>404</div>
        <div className="eyebrow text-gold mb-4">Lost In The Himalayas</div>
        <h1 className="font-display text-3xl md:text-4xl mb-6" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>This page took a wrong turn somewhere above 16,000 ft.</h1>
        <div className="flex gap-3 justify-center flex-wrap mt-8">
          <Link to="/" className="btn-primary">Back to Home</Link>
          <Link to="/shop" className="btn-outline">Shop Rituals</Link>
          <Link to="/knowledge-center" className="btn-outline">Knowledge Center</Link>
        </div>
      </div>
    </div>
  );
}
