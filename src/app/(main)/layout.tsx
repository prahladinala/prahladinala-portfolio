import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import dynamic from "next/dynamic";
import "../globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header-v2";
import { getSocials } from "@/lib/keystatic-data";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Lazy load heavy client components
const CommandPalette = dynamic(() => import("@/components/command-palette").then(mod => mod.CommandPalette));
const TerminalWidget = dynamic(() => import("@/components/terminal-widget").then(mod => mod.TerminalWidget));
const AIAssistant = dynamic(() => import("@/components/ai-assistant").then(mod => mod.AIAssistant));
const TextSelectionMenu = dynamic(() => import("@/components/text-selection-menu").then(mod => mod.TextSelectionMenu));
const CustomContextMenu = dynamic(() => import("@/components/custom-context-menu").then(mod => mod.CustomContextMenu));

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://prahladinala.in"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Prahlad Inala | Software Engineer & Frontend Developer",
    template: "%s | Prahlad Inala"
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
    url: "https://prahladinala.in",
    title: "Prahlad Inala | Software Engineer & Frontend Developer",
    description: "Modern portfolio for Prahlad, specializing in React, Next.js, and Guidewire.",
    siteName: "Prahlad Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prahlad Inala | Software Engineer & Frontend Developer",
    description: "Modern portfolio for Prahlad, specializing in React, Next.js, and Guidewire.",
    creator: "@prahladinala",
  },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const socials = getSocials();
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Prahlad Inala",
    jobTitle: "Software Engineer",
    url: "https://prahladinala.in",
    sameAs: [
      socials?.github,
      socials?.linkedin,
      socials?.twitter,
      socials?.medium
    ].filter(Boolean),
    
    knowsAbout: ["React", "Next.js", "TypeScript", "Guidewire Jutro", "Frontend Development"]
  };
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased scroll-smooth`}>
      <head>
        <script
          id="schema-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={['light', 'dark', 'focus', 'system']}
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Header />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer socials={socials} />
          </TooltipProvider>
          <TextSelectionMenu />
          <CustomContextMenu />
          <CommandPalette socials={socials} />
          <TerminalWidget />
          <AIAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}

