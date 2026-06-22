import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { getOrder } from "../lib/api";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { getOrder(id).then(setOrder).catch(() => {}); }, [id]);
  return (
    <div className="bg-cream min-h-[80vh]" data-testid="order-confirmation">
      <section className="bg-ink text-cream py-24 px-6 md:px-16 grain text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-gold" />
          </div>
          <div className="eyebrow text-gold mb-4">Order Confirmed</div>
          <h1 className="font-display text-4xl md:text-6xl mb-6" style={{ fontVariationSettings: "'wdth' 82, 'wght' 800", lineHeight: 1 }}>
            Your Ritual <span className="gold-gradient-text">Begins.</span>
          </h1>
          {order && <div className="eyebrow text-cream/60 mt-2">Order #{order.id.slice(0, 8).toUpperCase()}</div>}
          <p className="font-italic-light text-xl text-cream/80 mt-8 max-w-xl mx-auto" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
            We've sent confirmation details to your email. Cash on Delivery — pay when it arrives.
          </p>
        </div>
      </section>

      {order && (
        <section className="section">
          <div className="max-w-3xl mx-auto bg-white border border-ink/10 p-8">
            <div className="eyebrow text-ink/60 mb-5">Summary</div>
            <div className="space-y-3 border-b border-ink/10 pb-5 mb-5">
              {order.items?.map((it, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{it.name} × {it.qty}</span>
                  <span>₹{(it.price * it.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-display text-2xl" style={{ fontVariationSettings: "'wdth' 80, 'wght' 700" }}>
              <span>Total</span><span>₹{order.total.toLocaleString("en-IN")}</span>
            </div>
            <div className="mt-8 grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="eyebrow text-[10px] text-ink/60 mb-2">Delivery To</div>
                <div>{order.customer_name}</div>
                <div className="text-ink/70">{order.address}, {order.city}, {order.state} {order.pincode}</div>
              </div>
              <div>
                <div className="eyebrow text-[10px] text-ink/60 mb-2">Contact</div>
                <div>{order.email}</div>
                <div className="text-ink/70">{order.phone}</div>
              </div>
            </div>
          </div>
          <div className="text-center mt-10 flex justify-center gap-3 flex-wrap">
            <Link to="/shop" className="btn-outline-dark">Keep Exploring</Link>
            <Link to="/knowledge-center" className="btn-outline-dark">Read Before You Begin <ArrowRight size={14} /></Link>
          </div>
        </section>
      )}
    </div>
  );
}
