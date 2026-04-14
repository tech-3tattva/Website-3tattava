import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "3Tattva QR Landing",
  description: "QR landing pages for 3Tattva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
