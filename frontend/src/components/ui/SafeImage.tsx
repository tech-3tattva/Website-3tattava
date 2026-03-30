import Image, { type ImageProps } from "next/image";

function isSvgSrc(src: ImageProps["src"]): boolean {
  if (typeof src === "string") return /\.svg(\?|#|$)/i.test(src);
  if (typeof src === "object" && src !== null && "src" in src) {
    const path = (src as { src: string }).src;
    return typeof path === "string" && /\.svg(\?|#|$)/i.test(path);
  }
  return false;
}

/**
 * Drop-in replacement for `next/image` that skips the image optimizer for SVGs.
 * Sharp (used by `/_next/image`) often fails on SVG and returns 400 "received null".
 */
export default function SafeImage(props: ImageProps) {
  const svg = isSvgSrc(props.src);
  return (
    <Image
      {...props}
      alt={props.alt ?? ""}
      unoptimized={Boolean(props.unoptimized || svg)}
    />
  );
}
