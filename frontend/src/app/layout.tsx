import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Libre_Baskerville, Noto_Serif_Devanagari } from "next/font/google";
import "../styles/globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import IntroSplash from "@/components/layout/IntroSplash";
import CartDrawer from "@/components/cart/CartDrawer";
import Providers from "@/components/providers/Providers";

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
  title: "3Tattva Ayurveda & Wellness | Balance. Build. Become.",
  description:
    "Authentic Ayurveda — Formulated by certified Ayurvedacharyas. Premium wellness products for Skin, Hair, Body. Discover your dosha.",
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
        <Providers>
          <IntroSplash />
          <AnnouncementBar />
          <Header />
          <main id="main" className="flex-1 min-w-0">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
