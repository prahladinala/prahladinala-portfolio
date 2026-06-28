import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

// Lazy load heavy client components
const CommandPalette = dynamic(() => import("@/components/command-palette").then(mod => mod.CommandPalette));
const TerminalWidget = dynamic(() => import("@/components/terminal-widget").then(mod => mod.TerminalWidget));
const AIAssistant = dynamic(() => import("@/components/ai-assistant").then(mod => mod.AIAssistant));

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Prahlad | Software Engineer",
    template: "%s | Prahlad"
  },
  description: "Modern portfolio for Prahlad, specializing in React, Next.js, and Guidewire.",
  keywords: ["Software Engineer", "Frontend Developer", "Guidewire Jutro", "React", "Next.js", "TypeScript", "Prahlad"],
  authors: [{ name: "Prahlad" }],
  creator: "Prahlad",
  applicationName: "Prahlad Portfolio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prahladinala.dev",
    title: "Prahlad | Software Engineer",
    description: "Modern portfolio for Prahlad, specializing in React, Next.js, and Guidewire.",
    siteName: "Prahlad Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prahlad | Software Engineer",
    description: "Modern portfolio for Prahlad, specializing in React, Next.js, and Guidewire.",
    creator: "@prahladinala",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Prahlad",
  jobTitle: "Software Engineer",
  url: "https://prahladinala.dev",
  sameAs: [
    "https://github.com/PRAHLADINALA",
    "https://linkedin.com/in/prahladinala",
    "https://twitter.com/prahladinala"
  ],
  alumniOf: "Your University",
  knowsAbout: ["React", "Next.js", "TypeScript", "Guidewire Jutro", "Frontend Development"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
          <CommandPalette />
          <TerminalWidget />
          <AIAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
