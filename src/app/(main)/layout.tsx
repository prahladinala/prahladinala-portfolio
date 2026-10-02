import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import dynamic from "next/dynamic";
import "../globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header-v2";
import {
  getSocials,
  getExperiences,
  getProjects,
  getSettings,
} from "@/lib/keystatic-data";
import { SITE_CONFIG } from "@/config/constants";
import { ComingSoon } from "@/components/coming-soon";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Lazy load heavy client components
const CommandPalette = dynamic(() =>
  import("@/components/command-palette").then((mod) => mod.CommandPalette),
);
const TerminalWidget = dynamic(() =>
  import("@/components/terminal-widget").then((mod) => mod.TerminalWidget),
);
const AIAssistant = dynamic(() =>
  import("@/components/ai-assistant").then((mod) => mod.AIAssistant),
);
const TextSelectionMenu = dynamic(() =>
  import("@/components/text-selection-menu").then(
    (mod) => mod.TextSelectionMenu,
  ),
);
const CustomContextMenu = dynamic(() =>
  import("@/components/custom-context-menu").then(
    (mod) => mod.CustomContextMenu,
  ),
);

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: "/",
  },
  title: {
    default: `${SITE_CONFIG.name} | Software Engineer & Frontend Developer`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  applicationName: SITE_CONFIG.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} | Software Engineer & Frontend Developer`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | Software Engineer & Frontend Developer`,
    description: SITE_CONFIG.description,
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const socials = getSocials();
  const experiences = getExperiences();
  const projects = getProjects();
  const settings = getSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_CONFIG.url}/#website`,
        url: SITE_CONFIG.url,
        name: SITE_CONFIG.name,
        alternateName: ["Prahlad Inala", "Prahlad Portfolio", "prahladinala.in"],
        description: SITE_CONFIG.description,
        inLanguage: "en-US",
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_CONFIG.url}/#profile`,
        url: SITE_CONFIG.url,
        name: `${SITE_CONFIG.name} - Software Engineer`,
        isPartOf: {
          "@id": `${SITE_CONFIG.url}/#website`,
        },
        mainEntity: {
          "@type": "Person",
          name: SITE_CONFIG.name,
          jobTitle: "Software Engineer",
          url: SITE_CONFIG.url,
          image: `${SITE_CONFIG.url}/logo.png`,
          sameAs: [
            socials?.github,
            socials?.linkedin,
            socials?.twitter,
            socials?.medium,
          ].filter(Boolean),
          knowsAbout: [
            "React",
            "Next.js",
            "TypeScript",
            "Frontend Development",
          ],
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <Script
          id="schema-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link
          rel="preconnect"
          href="https://giscus.app"
          crossOrigin="anonymous"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme={settings.defaultTheme}
          themes={["light", "dark", "focus"]}
          enableSystem
        >
          {settings.maintenanceMode ? (
            <div className="flex-1 flex flex-col min-h-screen">
              <ComingSoon
                title="Under Maintenance"
                description="I am currently making some exciting upgrades to my portfolio. Please check back shortly!"
              />
            </div>
          ) : (
            <>
              <TooltipProvider>
                <Header
                  enableNotes={settings.enableNotes}
                  showAvailableBanner={settings.showAvailableBanner}
                />
                <main className="flex-1 flex flex-col">{children}</main>
                <Footer socials={socials} />
              </TooltipProvider>
              <div className="print:hidden">
                <TextSelectionMenu />
                <CustomContextMenu />
                <CommandPalette socials={socials} />
                <TerminalWidget />
                {settings.enableAiAssistant && (
                  <AIAssistant experiences={experiences} projects={projects} />
                )}
              </div>
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
