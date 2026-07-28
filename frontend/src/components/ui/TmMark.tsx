import type { CSSProperties } from "react";

/**
 * Circled trademark mark — "TM" comfortably centred inside a circle, rendered as a
 * superscript that hugs the end of the preceding text. The "TM" lives in an inner
 * span at ~0.6× the circle's font-size so the letters never touch the ring (matches
 * the standard circled-TM lockup). Inherits colour via `currentColor` and scales
 * with the surrounding font-size. Override size/position/colour via `style`.
 */
export default function TmMark({ style }: { style?: CSSProperties }) {
  return (
    <sup
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "1.4em",
        height: "1.4em",
        borderRadius: "50%",
        border: "0.09em solid currentColor",
        fontSize: "0.5em",
        verticalAlign: "top",
        marginLeft: "0.14em",
        transform: "translateY(0.04em)",
        boxSizing: "border-box",
        flex: "0 0 auto",
        overflow: "hidden",
        fontFamily: "var(--font-primary), system-ui, sans-serif",
        ...style,
      }}
    >
      <span
        style={{
          fontSize: "0.58em",
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "0.02em",
          paddingLeft: "0.02em",
        }}
      >
        TM
      </span>
    </sup>
  );
}
