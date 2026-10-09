import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getMosqueSettings } from "@/lib/data/settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getMosqueSettings();
  return {
    title: {
      default: s.name,
      template: `%s | ${s.name}`,
    },
    description: s.description ?? s.tagline ?? `Website resmi ${s.name}`,
    openGraph: {
      title: s.name,
      description: s.description ?? s.tagline ?? "",
      images: s.hero_image_url ? [s.hero_image_url] : [],
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
