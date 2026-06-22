import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Plus, Minus, Trash2, CreditCard, Banknote } from "lucide-react";
import { useCart } from "../context/CartContext";
import { api, createOrder } from "../lib/api";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = RAZORPAY_SCRIPT;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function Checkout() {
  const { items, total, count, remove, updateQty, clear, captureRecoveryEmail } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 cart, 1 address, 2 payment
  const [form, setForm] = useState({ customer_name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "", notes: "" });
  const [method, setMethod] = useState("razorpay"); // razorpay | cod
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-cream px-6">
        <div className="text-center max-w-md">
          <div className="font-serif-display text-3xl mb-4">Your ritual hasn't started.</div>
          <p className="text-ink/70 mb-8">Choose RockResin for the Deep Ritual, or Shahjeet for the Fast Ritual.</p>
          <Link to="/shop" className="btn-primary">Explore Rituals</Link>
        </div>
      </div>
    );
  }

  const shipping = total >= 999 ? 0 : 49;
  const grand = total + shipping;

  const placeOrderCOD = async () => {
    setPlacing(true);
    setError("");
    try {
      const res = await createOrder({ ...form, items });
      clear();
      navigate(`/order-confirmation/${res.order_id}`);
    } catch (e) {
      setError("Couldn't place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const placeOrderRazorpay = async () => {
    setPlacing(true);
    setError("");
    try {
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Razorpay script failed to load");
      const res = await api.post("/payments/razorpay/order", { ...form, items }).then((r) => r.data);
      const internalId = res.order_id;

      // Placeholder mode — auto-verify with mock signature so the UI flow can be exercised
      if (res.mock || res.key_id === "rzp_test_placeholder") {
        const verify = await api.post("/payments/razorpay/verify", {
          order_id: internalId,
          rzp_order_id: res.rzp_order_id,
          rzp_payment_id: "pay_mock",
          rzp_signature: "mock-ok",
        }).then((r) => r.data);
        if (verify.ok) {
          clear();
          navigate(`/order-confirmation/${internalId}`);
        } else {
          setError("Payment verification failed (test mode).");
        }
        return;
      }

      // Real flow
      const rzpOptions = {
        key: res.key_id,
        amount: res.amount,
        currency: res.currency,
        name: "3Tattava",
        description: "Performance Ayurveda Order",
        order_id: res.rzp_order_id,
        prefill: { name: form.customer_name, email: form.email, contact: form.phone },
        theme: { color: "#C8963E" },
        handler: async (response) => {
          try {
            const verify = await api.post("/payments/razorpay/verify", {
              order_id: internalId,
              rzp_order_id: response.razorpay_order_id,
              rzp_payment_id: response.razorpay_payment_id,
              rzp_signature: response.razorpay_signature,
            }).then((r) => r.data);
            if (verify.ok) {
              clear();
              navigate(`/order-confirmation/${internalId}`);
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch {
            setError("Verification call failed.");
          }
        },
        modal: { ondismiss: () => setPlacing(false) },
      };
      const rzp = new window.Razorpay(rzpOptions);
      rzp.on("payment.failed", () => setError("Payment failed. You can try again or switch to Cash on Delivery."));
      rzp.open();
    } catch (e) {
      setError("Couldn't start payment. Please try again or switch to COD.");
    } finally {
      setPlacing(false);
    }
  };

  const place = () => (method === "cod" ? placeOrderCOD() : placeOrderRazorpay());

  return (
    <div className="bg-cream min-h-[80vh]" data-testid="checkout-page">
      <section className="bg-ink text-cream py-12 px-6 md:px-16 grain">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="eyebrow text-gold mb-2">Checkout</div>
            <h1 className="font-display text-3xl md:text-4xl" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>Begin Your Ritual.</h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs eyebrow">
            {["Cart", "Address", "Payment"].map((s, i) => (
              <span key={s} className={`flex items-center gap-2 ${step === i ? "text-gold" : "text-cream/40"}`}>
                <span className={`w-6 h-6 flex items-center justify-center border ${step === i ? "border-gold bg-gold text-ink" : "border-cream/30"}`}>{i + 1}</span>
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 py-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1.5fr_1fr] gap-10">
          <div>
            {step === 0 && (
              <>
                <div className="eyebrow text-ink/60 mb-4">Cart · {count} items</div>
                <div className="border-y border-ink/10 divide-y divide-ink/10">
                  {items.map((it) => (
                    <div key={it.slug} className="flex gap-5 py-6" data-testid={`co-item-${it.slug}`}>
                      <img src={it.image} alt={it.name} className="w-24 h-28 object-cover" />
                      <div className="flex-1">
                        <div className="font-display text-lg" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{it.name}</div>
                        <div className="eyebrow text-[10px] text-gold-dark mt-1">₹{it.price.toLocaleString("en-IN")}</div>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center border border-ink/20">
                            <button onClick={() => updateQty(it.slug, it.qty - 1)} className="px-2.5 py-1.5" aria-label="dec"><Minus size={12} /></button>
                            <div className="px-3 text-sm">{it.qty}</div>
                            <button onClick={() => updateQty(it.slug, it.qty + 1)} className="px-2.5 py-1.5" aria-label="inc"><Plus size={12} /></button>
                          </div>
                          <button onClick={() => remove(it.slug)} className="text-ink/40 hover:text-terracotta" aria-label="Remove"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div className="font-display text-lg" style={{ fontVariationSettings: "'wdth' 80, 'wght' 700" }}>₹{(it.price * it.qty).toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep(1)} data-testid="co-to-address" className="btn-primary mt-8">Continue to Address <ArrowRight size={14} /></button>
              </>
            )}
            {step === 1 && (
              <>
                <div className="eyebrow text-ink/60 mb-4">Delivery Address</div>
                <div className="grid md:grid-cols-2 gap-5">
                  <input required placeholder="FULL NAME" data-testid="co-name" className="luxe-input md:col-span-2" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
                  <input required type="email" placeholder="EMAIL" data-testid="co-email" className="luxe-input" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); if (e.target.value.includes("@")) captureRecoveryEmail(e.target.value); }} />
                  <input required placeholder="PHONE" data-testid="co-phone" className="luxe-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <input required placeholder="STREET ADDRESS" data-testid="co-address" className="luxe-input md:col-span-2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  <input required placeholder="CITY" data-testid="co-city" className="luxe-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  <input required placeholder="STATE" data-testid="co-state" className="luxe-input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                  <input required placeholder="PINCODE" data-testid="co-pincode" className="luxe-input md:col-span-2" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                  <textarea rows="3" placeholder="ORDER NOTES (OPTIONAL)" data-testid="co-notes" className="luxe-input md:col-span-2 resize-none" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(0)} className="btn-outline-dark">Back</button>
                  <button
                    onClick={() => {
                      if (form.customer_name && form.email && form.phone && form.address && form.city && form.state && form.pincode) setStep(2);
                    }}
                    data-testid="co-to-payment"
                    className="btn-primary"
                  >
                    Continue to Payment <ArrowRight size={14} />
                  </button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="eyebrow text-ink/60 mb-4">Payment</div>
                <div className="space-y-3 mb-8">
                  <label className={`flex items-start gap-4 p-5 border cursor-pointer transition-all ${method === "razorpay" ? "border-gold bg-cream-deep/40" : "border-ink/15 hover:border-gold/50"}`} data-testid="pay-razorpay">
                    <input type="radio" name="pay" value="razorpay" checked={method === "razorpay"} onChange={() => setMethod("razorpay")} className="mt-1 accent-gold" />
                    <CreditCard size={20} className="text-gold-dark shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-display text-base" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>Pay Online · Razorpay</div>
                      <div className="text-xs text-ink/65 mt-1">UPI · Cards · Net Banking · Wallets. Powered by Razorpay (secure).</div>
                    </div>
                    <span className="eyebrow text-[10px] text-gold-dark">Recommended</span>
                  </label>
                  <label className={`flex items-start gap-4 p-5 border cursor-pointer transition-all ${method === "cod" ? "border-gold bg-cream-deep/40" : "border-ink/15 hover:border-gold/50"}`} data-testid="pay-cod">
                    <input type="radio" name="pay" value="cod" checked={method === "cod"} onChange={() => setMethod("cod")} className="mt-1 accent-gold" />
                    <Banknote size={20} className="text-gold-dark shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-display text-base" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>Cash on Delivery</div>
                      <div className="text-xs text-ink/65 mt-1">Pay in cash when the package arrives.</div>
                    </div>
                  </label>
                </div>
                {error && <div data-testid="co-error" className="text-sm text-terracotta border-l-2 border-terracotta pl-3 mb-4">{error}</div>}
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-outline-dark">Back</button>
                  <button onClick={place} disabled={placing} data-testid="co-place-order" className="btn-primary">
                    {placing ? "Processing…" : `Place Order · ₹${grand.toLocaleString("en-IN")}`} <ArrowRight size={14} />
                  </button>
                </div>
              </>
            )}
          </div>

          <aside className="bg-3t-black text-cream p-8 h-fit sticky top-24">
            <div className="eyebrow text-gold mb-5">Order Summary</div>
            <div className="space-y-3 border-b border-cream/15 pb-5 mb-5">
              {items.map((it) => (
                <div key={it.slug} className="flex justify-between text-sm">
                  <span className="text-cream/80">{it.name} × {it.qty}</span>
                  <span>₹{(it.price * it.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-b border-cream/15 pb-5 mb-5">
              <div className="flex justify-between"><span className="text-cream/70">Subtotal</span><span>₹{total.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span className="text-cream/70">Shipping</span><span className={shipping === 0 ? "text-gold" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
            </div>
            <div className="flex justify-between items-end">
              <span className="eyebrow text-gold">Total</span>
              <span className="font-display text-3xl gold-gradient-text" style={{ fontVariationSettings: "'wdth' 80, 'wght' 800" }}>₹{grand.toLocaleString("en-IN")}</span>
            </div>
            <div className="mt-6 eyebrow text-[10px] text-cream/60">Free shipping above ₹999</div>
          </aside>
        </div>
      </section>
    </div>
  );
}
