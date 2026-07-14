import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { I18nProvider } from "@/lib/i18n/useTranslation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Divyansh Kanodia | DK-01 Portfolio",
  description: "Portfolio of Divyansh Kanodia — Data Science & Business Economics at UC San Diego. Focused on reinforcement learning, LLM-enabled robotics, and labor market analytics.",
  keywords: ["Divyansh Kanodia", "Data Science", "Reinforcement Learning", "UC San Diego", "Machine Learning", "Portfolio", "LLM", "Robotics"],
  authors: [{ name: "Divyansh Kanodia" }],
  openGraph: {
    title: "Divyansh Kanodia | DK-01 Portfolio",
    description: "Interactive AI-powered portfolio. Explore projects in RL, data science, and economic modeling.",
    url: "https://dkanodia.netlify.app",
    siteName: "DK-01 | Divyansh Kanodia",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Divyansh Kanodia | DK-01 Portfolio",
    description: "Interactive AI-powered portfolio. Explore projects in RL, data science, and economic modeling.",
    creator: "@anigmea",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
