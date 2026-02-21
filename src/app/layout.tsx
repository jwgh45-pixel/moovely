import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moovely - The Grass Is Greener | UK Relocation Comparison",
  description:
    "Compare real wages between any two places in the UK. See your actual disposable income after tax, rent, bills, and commute. Built with government data, not guesswork.",
  keywords: [
    "cost of living comparison",
    "UK relocation",
    "salary comparison UK",
    "where should I live UK",
    "real wages UK",
    "disposable income comparison",
    "moving costs UK",
    "rent comparison UK cities",
  ],
  openGraph: {
    title: "Moovely - Is the Grass Actually Greener?",
    description:
      "Compare real wages between any two places in the UK. Find out if you'd actually be better off.",
    url: "https://moovely.co",
    siteName: "Moovely",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moovely - Is the Grass Actually Greener?",
    description:
      "Compare real wages between UK cities. Government data, not guesswork.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
