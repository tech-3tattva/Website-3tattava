"use client";

// ─────────────────────────────────────────────────────────
// Custom product-review system (brief §6.1).
// Real customer reviews only — clean empty state until the
// backend reports approved reviews. Publishes critical and
// positive reviews alike (no rating filtering).
// ─────────────────────────────────────────────────────────

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import StarRating from "@/components/ui/StarRating";
import {
  getProductReviews,
  submitProductReview,
  type ProductReviewsResponse,
} from "@/lib/reviews";

// ─── Tokens ─────────────────────────────────────────────────────────────────
const CREAM = "#f7f0e2";
const GOLD = "#C8963E";
const INK = "#1c1304";
const ESPRESSO = "#442a1b";
const TAUPE = "#8a7355";
const BORDER = "rgba(68,42,27,.16)";
const F = "var(--font-primary), system-ui, sans-serif";

const STARS = [5, 4, 3, 2, 1] as const;

const eyebrow: CSSProperties = {
  fontFamily: F,
  fontVariationSettings: "'wght' 600",
  fontSize: 12,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: TAUPE,
  margin: 0,
};

const inputStyle: CSSProperties = {
  width: "100%",
  fontFamily: F,
  fontSize: 15,
  color: INK,
  background: "#fff",
  border: `1px solid ${BORDER}`,
  borderRadius: 10,
  padding: "11px 14px",
  outline: "none",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontFamily: F,
  fontVariationSettings: "'wght' 700",
  fontSize: 12,
  letterSpacing: ".04em",
  color: ESPRESSO,
  margin: "0 0 6px",
};

// ─── Interactive rating input ────────────────────────────────────────────────
function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div
      role="radiogroup"
      aria-label="Your rating"
      style={{ display: "flex", gap: 4 }}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(0)}
          onClick={() => onChange(n)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
            fontSize: 30,
            color: n <= shown ? GOLD : "rgba(68,42,27,.22)",
            transition: "color .12s ease",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── Write-a-review form ─────────────────────────────────────────────────────
function ReviewForm({
  slug,
  onSubmitted,
}: {
  slug: string;
  onSubmitted: (verifiedBuyer: boolean) => void;
}) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photos, setPhotos] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (rating < 1) return setError("Please choose a star rating.");
    if (!name.trim()) return setError("Please add your name.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      return setError("Please add a valid email.");
    if (!body.trim()) return setError("Please write your review.");

    const photoUrls = photos
      .split(/[\n,]+/)
      .map((p) => p.trim())
      .filter((p) => /^https?:\/\//i.test(p));

    setSubmitting(true);
    try {
      const res = await submitProductReview({
        slug,
        rating,
        title: title.trim(),
        body: body.trim(),
        name: name.trim(),
        email: email.trim(),
        photos: photoUrls.length ? photoUrls : undefined,
      });
      onSubmitted(Boolean(res.verifiedBuyer));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not submit your review. Please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fbf6ea",
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        padding: "clamp(20px,3vw,32px)",
        display: "grid",
        gap: 16,
      }}
    >
      <div>
        <span style={labelStyle}>Your rating</span>
        <StarInput value={rating} onChange={setRating} />
      </div>

      <div>
        <label style={labelStyle} htmlFor="rv-title">
          Title <span style={{ color: TAUPE, fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          id="rv-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience"
          maxLength={120}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="rv-body">
          Your review
        </label>
        <textarea
          id="rv-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you notice? How do you use it?"
          rows={4}
          maxLength={2000}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        <div>
          <label style={labelStyle} htmlFor="rv-name">
            Name
          </label>
          <input
            id="rv-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={80}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="rv-email">
            Email{" "}
            <span style={{ color: TAUPE, fontWeight: 400 }}>(not published)</span>
          </label>
          <input
            id="rv-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            maxLength={160}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="rv-photos">
          Photo URLs{" "}
          <span style={{ color: TAUPE, fontWeight: 400 }}>
            (optional · one per line)
          </span>
        </label>
        <textarea
          id="rv-photos"
          value={photos}
          onChange={(e) => setPhotos(e.target.value)}
          placeholder="https://…"
          rows={2}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {error && (
        <p
          role="alert"
          style={{ fontFamily: F, fontSize: 14, color: "#c0392b", margin: 0 }}
        >
          {error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={submitting}
          style={{
            background: submitting ? TAUPE : ESPRESSO,
            color: CREAM,
            border: "none",
            borderRadius: 999,
            padding: "13px 30px",
            fontFamily: F,
            fontVariationSettings: "'wght' 700",
            fontSize: 13,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            cursor: submitting ? "default" : "pointer",
          }}
        >
          {submitting ? "Submitting…" : "Submit review"}
        </button>
      </div>
    </form>
  );
}

// ─── Compact near-price badge (hidden until real reviews exist) ──────────────
export function PdpRatingBadge({
  slug,
  style,
}: {
  slug: string;
  style?: CSSProperties;
}) {
  const [agg, setAgg] = useState<{ average: number; count: number } | null>(
    null,
  );

  useEffect(() => {
    let alive = true;
    getProductReviews(slug)
      .then((d) => {
        if (alive && d && d.count > 0)
          setAgg({ average: d.average, count: d.count });
      })
      .catch(() => {
        /* silent — badge simply stays hidden */
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  // Render nothing while loading or when there are no reviews → zero layout churn.
  if (!agg) return null;

  return (
    <a
      href="#reviews"
      aria-label={`${agg.average.toFixed(1)} out of 5 from ${agg.count} reviews`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        textDecoration: "none",
        ...style,
      }}
    >
      <StarRating value={agg.average} size="sm" />
      <span
        style={{
          fontFamily: F,
          fontSize: 13,
          fontVariationSettings: "'wght' 600",
          color: ESPRESSO,
        }}
      >
        {agg.average.toFixed(1)} · {agg.count} review{agg.count === 1 ? "" : "s"}
      </span>
    </a>
  );
}

// ─── Main section ────────────────────────────────────────────────────────────
export default function ProductReviews({ slug }: { slug: string }) {
  const [data, setData] = useState<ProductReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [thanks, setThanks] = useState<{ verifiedBuyer: boolean } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setData(await getProductReviews(slug));
    } catch {
      setLoadError("Reviews are unavailable right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  const count = data?.count ?? 0;
  const average = data?.average ?? 0;
  const distribution = data?.distribution ?? {};
  const reviews = data?.reviews ?? [];
  const showForm = formOpen || (!loading && !loadError && count === 0);

  const handleSubmitted = (verifiedBuyer: boolean) => {
    setThanks({ verifiedBuyer });
    setFormOpen(false);
    void load();
  };

  return (
    <section
      id="reviews"
      style={{
        background: CREAM,
        padding: "clamp(48px,7vw,88px) 24px",
        scrollMarginTop: 80,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <p style={{ ...eyebrow, color: GOLD, marginBottom: 8 }}>
          Real Customer Reviews
        </p>
        <h2
          style={{
            fontFamily: F,
            fontVariationSettings: "'wght' 800",
            fontSize: "clamp(26px,4vw,42px)",
            color: ESPRESSO,
            letterSpacing: "-0.02em",
            margin: "0 0 clamp(24px,3.5vw,40px)",
          }}
        >
          Customer Reviews
        </h2>

        {thanks && (
          <div
            role="status"
            style={{
              background: "#fbf6ea",
              border: `1px solid ${GOLD}`,
              borderLeft: `4px solid ${GOLD}`,
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 28,
            }}
          >
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wght' 700",
                fontSize: 15,
                color: ESPRESSO,
                margin: 0,
              }}
            >
              Thank you — your review has been submitted.
            </p>
            <p
              style={{
                fontFamily: F,
                fontSize: 13,
                color: TAUPE,
                margin: "4px 0 0",
              }}
            >
              {thanks.verifiedBuyer
                ? "We matched your email to a verified purchase — you'll appear as a Verified Buyer."
                : "It will appear here once approved."}
            </p>
          </div>
        )}

        {loading ? (
          <p style={{ fontFamily: F, fontSize: 15, color: TAUPE }}>
            Loading reviews…
          </p>
        ) : loadError ? (
          <div style={{ display: "grid", gap: 16 }}>
            <p style={{ fontFamily: F, fontSize: 15, color: "#c0392b", margin: 0 }}>
              {loadError}
            </p>
            <button
              type="button"
              onClick={() => void load()}
              style={{
                justifySelf: "start",
                background: ESPRESSO,
                color: CREAM,
                border: "none",
                borderRadius: 999,
                padding: "10px 22px",
                fontFamily: F,
                fontVariationSettings: "'wght' 700",
                fontSize: 12,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* ── Summary header ── */}
            {count > 0 ? (
              <div
                style={{
                  display: "grid",
                  gap: "clamp(24px,4vw,56px)",
                  gridTemplateColumns:
                    "minmax(180px, 240px) minmax(240px, 1fr)",
                  alignItems: "center",
                  marginBottom: 36,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: F,
                      fontVariationSettings: "'wght' 800",
                      fontSize: "clamp(48px,9vw,72px)",
                      lineHeight: 1,
                      color: ESPRESSO,
                    }}
                  >
                    {average.toFixed(1)}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "10px 0 6px",
                    }}
                  >
                    <StarRating value={average} />
                  </div>
                  <p style={{ fontFamily: F, fontSize: 13, color: TAUPE, margin: 0 }}>
                    Based on {count} review{count === 1 ? "" : "s"}
                  </p>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  {STARS.map((s) => {
                    const c = distribution[String(s)] ?? 0;
                    const pct = count > 0 ? (c / count) * 100 : 0;
                    return (
                      <div
                        key={s}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "48px 1fr 40px",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: F,
                            fontSize: 12,
                            color: ESPRESSO,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {s} ★
                        </span>
                        <span
                          aria-hidden
                          style={{
                            height: 8,
                            borderRadius: 999,
                            background: "rgba(68,42,27,.10)",
                            overflow: "hidden",
                          }}
                        >
                          <span
                            style={{
                              display: "block",
                              height: "100%",
                              width: `${pct}%`,
                              background: GOLD,
                              borderRadius: 999,
                            }}
                          />
                        </span>
                        <span
                          style={{
                            fontFamily: F,
                            fontSize: 12,
                            color: TAUPE,
                            textAlign: "right",
                          }}
                        >
                          {c}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                style={{
                  border: `1px dashed ${BORDER}`,
                  borderRadius: 16,
                  padding: "clamp(24px,4vw,40px)",
                  textAlign: "center",
                  marginBottom: 28,
                }}
              >
                <p
                  style={{
                    fontFamily: F,
                    fontVariationSettings: "'wght' 700",
                    fontSize: "clamp(16px,2vw,20px)",
                    color: ESPRESSO,
                    margin: 0,
                  }}
                >
                  No reviews yet — be the first to review.
                </p>
                <p
                  style={{
                    fontFamily: F,
                    fontSize: 14,
                    color: TAUPE,
                    margin: "8px 0 0",
                  }}
                >
                  Share your experience below to help others.
                </p>
              </div>
            )}

            {/* ── Write-a-review toggle / form ── */}
            {count > 0 && !showForm && (
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                style={{
                  background: ESPRESSO,
                  color: CREAM,
                  border: "none",
                  borderRadius: 999,
                  padding: "12px 28px",
                  fontFamily: F,
                  fontVariationSettings: "'wght' 700",
                  fontSize: 13,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  marginBottom: 36,
                }}
              >
                Write a review
              </button>
            )}

            {showForm && (
              <div style={{ marginBottom: 40 }}>
                <ReviewForm slug={slug} onSubmitted={handleSubmitted} />
              </div>
            )}

            {/* ── Review list ── */}
            {count > 0 && (
              <div style={{ display: "grid", gap: 20 }}>
                {reviews.map((r, i) => (
                  <article
                    key={`${r.authorName}-${r.createdAt}-${i}`}
                    style={{
                      background: "#fff",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 16,
                      padding: "clamp(18px,2.5vw,26px)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <StarRating value={r.rating} size="sm" />
                      <span
                        style={{
                          fontFamily: F,
                          fontVariationSettings: "'wght' 700",
                          fontSize: 14,
                          color: ESPRESSO,
                        }}
                      >
                        {r.authorName}
                      </span>
                      {r.verifiedBuyer && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            fontFamily: F,
                            fontVariationSettings: "'wght' 700",
                            fontSize: 10,
                            letterSpacing: ".08em",
                            textTransform: "uppercase",
                            color: "#fff",
                            background: GOLD,
                            borderRadius: 999,
                            padding: "3px 9px",
                          }}
                        >
                          ✓ Verified Buyer
                        </span>
                      )}
                      <span
                        style={{
                          marginLeft: "auto",
                          fontFamily: F,
                          fontSize: 12,
                          color: TAUPE,
                        }}
                      >
                        {new Date(r.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {r.title && (
                      <h3
                        style={{
                          fontFamily: F,
                          fontVariationSettings: "'wght' 700",
                          fontSize: 16,
                          color: INK,
                          margin: "0 0 6px",
                        }}
                      >
                        {r.title}
                      </h3>
                    )}
                    <p
                      style={{
                        fontFamily: F,
                        fontSize: 15,
                        lineHeight: 1.6,
                        color: ESPRESSO,
                        margin: 0,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {r.body}
                    </p>

                    {r.photos && r.photos.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                          marginTop: 12,
                        }}
                      >
                        {r.photos.map((src) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={src}
                            src={src}
                            alt={`Photo from ${r.authorName}'s review`}
                            loading="lazy"
                            style={{
                              width: 72,
                              height: 72,
                              objectFit: "cover",
                              borderRadius: 10,
                              border: `1px solid ${BORDER}`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
