import Image from "next/image";

export default function BrandLogo() {
  return (
    <div
      className="relative mx-auto h-11 w-44 md:h-12 md:w-52"
      aria-label="3tattava logo"
    >
      <Image
        src="/logos/3tattava-wordmark.png"
        alt="3tattava"
        fill
        className="object-contain invert"
        sizes="(max-width: 768px) 176px, 208px"
        priority
      />
    </div>
  );
}
