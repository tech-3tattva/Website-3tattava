import type { Metadata, Viewport } from "next";
import { Noto_Serif_Devanagari } from "next/font/google";
import localFont from "next/font/local";
import "../styles/globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import IntroSplash from "@/components/layout/IntroSplash";
import CartDrawer from "@/components/cart/CartDrawer";
import Providers from "@/components/providers/Providers";
import ScrollProgress from "@/components/motion/ScrollProgress";
import { OrganizationSchema } from "@/components/seo/JsonLd";
import ChatWidget from "@/components/chat/ChatWidget";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import PurchaseNudge from "@/components/home/PurchaseNudge";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixel from "@/components/MetaPixel";
import ChromeGate from "@/components/layout/ChromeGate";
import WelcomeOfferNotification from "@/components/WelcomeOfferNotification";

const archivo = localFont({
  src: [
    { path: "./fonts/Archivo-Variable.woff2", style: "normal", weight: "100 900" },
    { path: "./fonts/Archivo-Italic-Variable.woff2", style: "italic", weight: "100 900" },
  ],
  display: "swap",
  variable: "--font-primary",
});

const notoDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  display: "swap",
  variable: "--font-devanagari",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.3tattava.com"),
  title: {
    default: "3TATTAVA — Performance Ayurveda | Shodhit Shilajit Resins & Honey Sticks",
    template: "%s",
  },
  description:
    "India's first Performance Ayurveda brand. Pure Himalayan Shilajit Resin & Honey Sticks. Lab-tested, doctor-formulated. 80+ trace minerals. Shop now.",
  applicationName: "3TATTAVA",
  authors: [{ name: "Dr. Kashish Gupta, BAMS" }],
  keywords: [
    "Shilajit",
    "Himalayan Shilajit",
    "Shilajit resin",
    "Shilajit honey sticks",
    "Performance Ayurveda",
    "3TATTAVA",
    "Ayurveda supplements",
    "fulvic acid",
    "trace minerals",
    "Dr. Kashish",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.3tattava.com",
    siteName: "3TATTAVA",
    title: "3TATTAVA — Performance Ayurveda | Shodhit Shilajit Resins & Honey Sticks",
    description:
      "India's first Performance Ayurveda brand. Pure Himalayan Shilajit Resin & Honey Sticks. Lab-tested, doctor-formulated.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "3TATTAVA — Performance Ayurveda" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "3TATTAVA — Performance Ayurveda",
    description:
      "Pure Himalayan Shilajit. Lab-tested. Doctor-formulated. 80+ trace minerals.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: "https://www.3tattava.com" },
  verification: {
    other: {
      "facebook-domain-verification": "5043s7gxpylgyknqrncyloujh6aj1b",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5c4033",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${notoDevanagari.variable}`}
      suppressHydrationWarning
    >
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
      <body className="antialiased min-h-screen min-w-0 flex flex-col overflow-x-clip" suppressHydrationWarning>
        <OrganizationSchema />
        <GoogleAnalytics />
        <MetaPixel />
        <Providers>
          <ScrollProgress />
          <ChromeGate>
            <IntroSplash />
            <AnnouncementBar />
            <Header />
          </ChromeGate>
          <main id="main" className="flex-1 min-w-0">
            {children}
          </main>
          <ChromeGate>
            <Footer />
            <CartDrawer />
            <ChatWidget />
            <WhatsAppWidget />
            <LeadCaptureModal />
            <PurchaseNudge />
          </ChromeGate>
          <CookieConsent />
          <WelcomeOfferNotification />
        </Providers>
      </body>
    </html>
  );
}
