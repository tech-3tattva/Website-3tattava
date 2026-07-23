import Script from "next/script";

// GA4 Measurement ID. Set NEXT_PUBLIC_GA_ID in the environment (e.g. in Vercel)
// to your "G-XXXXXXXXXX" id. When unset this component is a no-op — a safe
// default so nothing breaks before analytics is configured.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-QD91C3FZ48";

export default function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
