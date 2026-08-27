import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "The Grand Horizon Resort & Spa | Luxury Hotel Demo",
  description: "Experience luxury in a cinematic oasis of comfort and elegancy. Book exclusive rooms, suites, and wellness escapes.",
  keywords: "luxury hotel, resort, booking, 3D hotel, wellness spa, suites",
  openGraph: {
    title: "The Grand Horizon Resort & Spa",
    description: "Cinematic oasis of comfort and elegance.",
    images: [{ url: "/images/hero-fallback.jpg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${playfair.variable} ${outfit.variable} font-sans bg-background text-foreground antialiased`}>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
