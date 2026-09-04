import type { Metadata } from "next";
import { Atma, Cormorant_Garamond, Engagement, Manrope } from "next/font/google";
import "./globals.css";

const heroTitleFont = Engagement({
  variable: "--font-hero-title",
  subsets: ["latin"],
  weight: "400",
});

const sectionTitleFont = Atma({
  variable: "--font-section-title",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baby Shower Giovanni",
  description: "Una celebración especial para Giovanni.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${heroTitleFont.variable} ${sectionTitleFont.variable} ${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
