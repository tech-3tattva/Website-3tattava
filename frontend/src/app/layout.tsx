import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Libre_Baskerville, Noto_Serif_Devanagari } from "next/font/google";
import "../styles/globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import IntroSplash from "@/components/layout/IntroSplash";
import CartDrawer from "@/components/cart/CartDrawer";
import Providers from "@/components/providers/Providers";
import { OrganizationSchema } from "@/components/seo/JsonLd";
import ChatWidget from "@/components/chat/ChatWidget";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre",
  weight: ["400", "700"],
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
    default: "3TATTAVA — Performance Ayurveda | Himalayan Shilajit Resin & Honey Sticks",
    template: "%s | 3TATTAVA",
  },
  description:
    "India's first Performance Ayurveda brand. Pure Himalayan Shilajit Resin & Honey Sticks. Lab-certified, doctor-formulated. 80+ trace minerals. Shop now.",
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
    title: "3TATTAVA — Performance Ayurveda | Himalayan Shilajit Resin & Honey Sticks",
    description:
      "India's first Performance Ayurveda brand. Pure Himalayan Shilajit Resin & Honey Sticks. Lab-certified, doctor-formulated.",
  },
  twitter: {
    card: "summary_large_image",
    title: "3TATTAVA — Performance Ayurveda",
    description:
      "Pure Himalayan Shilajit. Lab-certified. Doctor-formulated. 80+ trace minerals.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: "https://www.3tattava.com" },
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
      className={`${cormorant.variable} ${dmSans.variable} ${libreBaskerville.variable} ${notoDevanagari.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen min-w-0 flex flex-col overflow-x-clip" suppressHydrationWarning>
        <OrganizationSchema />
        <Providers>
          <IntroSplash />
          <AnnouncementBar />
          <Header />
          <main id="main" className="flex-1 min-w-0">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
