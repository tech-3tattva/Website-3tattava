/**
 * Shared admin design tokens.
 *
 * Every panel used to carry its own copy of card/table/badge styling, which is
 * why radii, borders and type sizes drifted apart (6px gold-bordered cards in
 * Orders vs 4px gradient-topped cards in Inventory). Panels now consume these
 * variables and utility classes instead of redeclaring the look.
 *
 * Injected once by the admin shell, so panel-level `<style>` blocks only need
 * to describe what is genuinely specific to that panel.
 *
 * Typography note: the admin previously referenced `--font-cormorant` and
 * `--font-jost` in 20 places. Neither variable is ever defined — only
 * `--font-primary` (Archivo) and `--font-devanagari` are loaded — so every
 * heading silently fell back to a system face. The admin is a dense data tool,
 * so it uses the one loaded family with a real size/weight scale rather than
 * pulling in a display serif.
 */
export const ADMIN_TOKENS = `
  .ad-scope {
    /* Surfaces */
    --ad-bg: #f7f0e2;
    --ad-surface: #fffdf8;
    --ad-surface-2: #fdfaf3;

    /* Ink */
    --ad-ink: #442a1b;
    --ad-ink-2: rgba(68,42,27,0.62);
    --ad-ink-3: rgba(68,42,27,0.42);

    /* Brand */
    --ad-gold: #c8963e;
    --ad-gold-soft: rgba(200,150,62,0.28);
    --ad-hairline: rgba(200,150,62,0.18);

    /* Status */
    --ad-ok: #1f7a4d;
    --ad-ok-bg: rgba(31,122,77,0.1);
    --ad-warn: #9a6212;
    --ad-warn-bg: rgba(200,150,62,0.14);
    --ad-bad: #a12d2d;
    --ad-bad-bg: rgba(161,45,45,0.09);

    /* Shape — one radius scale everywhere */
    --ad-r: 8px;
    --ad-r-sm: 6px;
    --ad-r-pill: 999px;

    --ad-shadow: 0 1px 2px rgba(68,42,27,0.05);
    --ad-shadow-lg: 0 24px 60px rgba(0,0,0,0.28);

    font-family: var(--font-primary), system-ui, sans-serif;
    color: var(--ad-ink);
  }

  /* ── Type scale ─────────────────────────────────────────────── */
  .ad-h1 { font-size: 27px; font-weight: 700; letter-spacing: -0.02em; margin: 0; color: var(--ad-ink); }
  .ad-h2 { font-size: 19px; font-weight: 700; letter-spacing: -0.01em; margin: 0; color: var(--ad-ink); }
  .ad-h3 { font-size: 15px; font-weight: 650; margin: 0; color: var(--ad-ink); }
  .ad-sub { font-size: 13.5px; color: var(--ad-ink-2); margin: 0; line-height: 1.55; }
  .ad-eyebrow {
    font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
    font-weight: 650; color: var(--ad-ink-3); margin: 0;
  }
  .ad-num { font-size: 25px; font-weight: 700; letter-spacing: -0.02em; }
  .ad-mono { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 12px; }

  /* ── Cards ──────────────────────────────────────────────────── */
  .ad-card {
    background: var(--ad-surface);
    border: 1px solid var(--ad-hairline);
    border-radius: var(--ad-r);
    box-shadow: var(--ad-shadow);
  }
  .ad-card-pad { padding: 18px 20px; }
  .ad-stat {
    background: var(--ad-surface);
    border: 1px solid var(--ad-hairline);
    border-radius: var(--ad-r);
    padding: 16px 18px;
    box-shadow: var(--ad-shadow);
  }
  .ad-stat .ad-num { display: block; margin-top: 6px; }

  /* ── Buttons ────────────────────────────────────────────────── */
  .ad-btn {
    font: inherit; font-size: 13px; font-weight: 600;
    padding: 9px 15px; border-radius: var(--ad-r-sm);
    border: 1px solid var(--ad-gold-soft);
    background: var(--ad-surface-2); color: var(--ad-ink);
    cursor: pointer; transition: background 0.15s ease, border-color 0.15s ease;
  }
  .ad-btn:hover:not(:disabled) { background: #f6ecd8; border-color: var(--ad-gold); }
  .ad-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .ad-btn-primary {
    background: linear-gradient(135deg, var(--ad-gold), #b8801f);
    color: #1c1304; border-color: transparent;
  }
  .ad-btn-primary:hover:not(:disabled) { filter: brightness(1.06); background: linear-gradient(135deg, var(--ad-gold), #b8801f); }
  .ad-btn-danger { color: var(--ad-bad); border-color: rgba(161,45,45,0.3); background: var(--ad-bad-bg); }
  .ad-btn-sm { padding: 6px 11px; font-size: 12px; }

  /* ── Badges ─────────────────────────────────────────────────── */
  .ad-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 650; letter-spacing: 0.04em;
    padding: 3px 9px; border-radius: var(--ad-r-pill);
    text-transform: uppercase; white-space: nowrap;
  }
  .ad-badge-ok { background: var(--ad-ok-bg); color: var(--ad-ok); }
  .ad-badge-warn { background: var(--ad-warn-bg); color: var(--ad-warn); }
  .ad-badge-bad { background: var(--ad-bad-bg); color: var(--ad-bad); }
  .ad-badge-mute { background: rgba(68,42,27,0.07); color: var(--ad-ink-2); }

  /* ── Sortable table headers ─────────────────────────────────── */
  .ad-sort {
    background: none; border: none; padding: 0; font: inherit;
    cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
    color: inherit; letter-spacing: inherit; text-transform: inherit;
  }
  .ad-sort:hover { color: var(--ad-gold); }
  .ad-sort-arrow { font-size: 9px; opacity: 0.75; }
  .ad-sort[aria-sort="none"] .ad-sort-arrow { opacity: 0.22; }

  /* ── Empty states ───────────────────────────────────────────── */
  .ad-empty { text-align: center; padding: 52px 24px; }
  .ad-empty-mark {
    width: 46px; height: 46px; margin: 0 auto 14px;
    border-radius: var(--ad-r-pill);
    border: 1px dashed var(--ad-gold-soft);
    display: flex; align-items: center; justify-content: center;
    font-size: 19px; color: var(--ad-gold);
  }
  .ad-empty-title { font-size: 15px; font-weight: 650; color: var(--ad-ink); margin: 0 0 5px; }
  .ad-empty-hint { font-size: 13px; color: var(--ad-ink-2); margin: 0 auto; max-width: 380px; line-height: 1.6; }

  /* ── Inputs ─────────────────────────────────────────────────── */
  .ad-input {
    font: inherit; font-size: 13px; padding: 8px 11px;
    border: 1px solid var(--ad-gold-soft); border-radius: var(--ad-r-sm);
    background: var(--ad-surface); color: var(--ad-ink);
  }
  .ad-input:focus { outline: 2px solid var(--ad-gold-soft); outline-offset: 1px; border-color: var(--ad-gold); }
`;
