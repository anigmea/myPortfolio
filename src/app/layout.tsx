import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Divyansh Kanodia | Finance × Data Science",
  description: "Quantitative research tools and decision systems by Divyansh Kanodia, a data science and business economics student at UC San Diego.",
  openGraph: { title: "Divyansh Kanodia | Finance × Data Science", description: "Quantitative research tools and decision systems.", url: "https://dk-01.netlify.app/", siteName: "Divyansh Kanodia", type: "website" },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html> }
