import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LexFlow — Legal Information & Document Navigator",
  description: "AI-powered legal information assistant that helps users understand, compare, and navigate legal documents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Skip to content link for keyboard/screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-neutral-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>

        <nav aria-label="Main navigation" className="border-b border-neutral-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-neutral-900 hover:text-neutral-700 transition-colors">
              <span className="h-7 w-7 bg-neutral-900 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm leading-none font-serif">L</span>
              </span>
              LexFlow
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/" className="text-neutral-600 hover:text-neutral-900 transition-colors">Ask</Link>
              <Link href="/documents" className="text-neutral-600 hover:text-neutral-900 transition-colors">Documents</Link>
              <Link href="/compare" className="text-neutral-600 hover:text-neutral-900 transition-colors">Compare</Link>
            </div>
          </div>
        </nav>

        <div id="main-content" className="flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}
