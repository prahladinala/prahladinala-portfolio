import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle-v2";
import { PrintButton } from "@/components/print-button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "../globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resume | Prahlad Inala",
  description: "Printable professional resume of Prahlad Inala.",
  alternates: { canonical: "/resume" },
};

export default function ResumeRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full font-sans bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          themes={["light", "dark", "system"]}
          enableSystem
          disableTransitionOnChange
        >
          {/* Extremely Simple NavBar specifically for Resume */}
          <div className="container mx-auto px-4 py-4 flex justify-between items-center print:hidden border-b border-border mb-8 max-w-[850px]">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "ghost" }), "gap-2 rounded-full")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            
            <div className="flex items-center gap-2">
              <PrintButton />
              <ThemeToggle />
            </div>
          </div>
          
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
