import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Youtube, Twitter, Mail, Send } from "lucide-react";
import { subscribeNewsletter } from "../../lib/api";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await subscribeNewsletter({ email, source: "footer" });
      setStatus("Welcome to the Circle.");
      setEmail("");
    } catch {
      setStatus("Try again.");
    }
  };

  return (
    <footer data-testid="site-footer" className="mt-20">
      {/* Band 1 — Terracotta newsletter */}
      <div className="bg-[#b35e34] text-cream px-6 md:px-16 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="font-display text-4xl md:text-5xl mb-4" style={{ fontVariationSettings: "'wdth' 80, 'wght' 700" }}>
              3<span className="text-cream">TATTAVA</span>
            </div>
            <p className="text-sm opacity-90 max-w-md">Performance Ayurveda for modern humans. Doctor-led. Athlete-backed. Lab-tested. Built daily.</p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" aria-label="Instagram" data-testid="social-instagram" className="w-10 h-10 rounded-full border border-cream/30 flex items-center justify-center hover:bg-gold hover:text-ink hover:border-gold transition-all"><Instagram size={16} /></a>
              <a href="#" aria-label="YouTube" data-testid="social-youtube" className="w-10 h-10 rounded-full border border-cream/30 flex items-center justify-center hover:bg-gold hover:text-ink hover:border-gold transition-all"><Youtube size={16} /></a>
              <a href="#" aria-label="Twitter" data-testid="social-twitter" className="w-10 h-10 rounded-full border border-cream/30 flex items-center justify-center hover:bg-gold hover:text-ink hover:border-gold transition-all"><Twitter size={16} /></a>
              <a href="mailto:care@3tattava.com" aria-label="Email" data-testid="social-email" className="w-10 h-10 rounded-full border border-cream/30 flex items-center justify-center hover:bg-gold hover:text-ink hover:border-gold transition-all"><Mail size={16} /></a>
            </div>
          </div>
          <form onSubmit={subscribe} data-testid="newsletter-form" className="md:justify-self-end w-full max-w-md">
            <div className="eyebrow mb-3">Join the Performance Ayurveda Circle</div>
            <div className="flex items-end gap-3 border-b border-cream/40 pb-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                data-testid="newsletter-email"
                className="bg-transparent flex-1 outline-none placeholder:text-cream/50 py-2 text-base"
              />
              <button type="submit" data-testid="newsletter-submit" className="flex items-center gap-2 eyebrow hover:text-ink transition-colors">Subscribe <Send size={14} /></button>
            </div>
            {status && <div data-testid="newsletter-status" className="text-xs mt-3 opacity-90">{status}</div>}
            <p className="text-[11px] opacity-70 mt-3">Educational insights · Performance tips · New research · Podcast episodes.</p>
          </form>
        </div>
      </div>

      {/* Band 2 — Sand link columns */}
      <div className="bg-sand text-ink px-6 md:px-16 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <FooterCol title="Shop" links={[
            ["RockResin", "/products/rockresin"],
            ["Shahjeet Sticks", "/products/shahjeet-sticks"],
            ["Starter Kit", "/products/starter-kit"],
            ["Subscribe & Save", "/products/shahjeet-subscription"],
          ]} />
          <FooterCol title="About" links={[
            ["Our Story", "/our-story"],
            ["Dr. Kashish", "/our-story"],
            ["Research & Testing", "/research-testing"],
            ["Community", "/community"],
            ["Find Us", "/find-us"],
          ]} />
          <FooterCol title="Learn" links={[
            ["What Is Shilajit?", "/knowledge-center"],
            ["Shilajit for Women", "/knowledge-center"],
            ["Performance Ayurveda", "/knowledge-center"],
            ["FAQs", "/knowledge-center"],
            ["Dosha Quiz", "/dosha-quiz"],
          ]} />
          <FooterCol title="Support" links={[
            ["Track Order", "/track-order"],
            ["Returns & Refunds", "/support"],
            ["Contact Us", "/support"],
            ["Shipping Policy", "/support"],
            ["Performance Assessment", "/assessment"],
          ]} />
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-ink/10 flex flex-wrap gap-3">
          {["NABL 3rd-Party Lab", "AYUSH GMP", "US-FDA Facility", "Triphala Shodhana"].map((t) => (
            <span key={t} className="px-3 py-1.5 bg-white/70 border border-[#c9ba9f] eyebrow text-[10px]">{t}</span>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-4 text-[11px] opacity-70 eyebrow">SankalpaSiddhi Ayupharma Pvt. Ltd. · Made in India</div>
      </div>

      {/* Band 3 — near-black legal */}
      <div className="bg-[#1a1a1a] text-cream/70 px-6 md:px-16 py-6 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} 3Tattava — All rights reserved.</div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {["VISA", "MC", "AMEX", "UPI", "PAYTM", "PHONEPE"].map((p) => (
              <span key={p} className="px-2.5 py-1 bg-white text-black text-[10px] tracking-widest font-semibold">{p}</span>
            ))}
          </div>
          <div className="flex items-center gap-5 eyebrow text-[10px]">
            <Link to="/legal">Privacy</Link>
            <Link to="/legal">Terms</Link>
            <Link to="/legal">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div className="eyebrow mb-5 opacity-80">{title}</div>
      <ul className="space-y-3">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="text-sm hover:text-[#b35e34] transition-colors">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
