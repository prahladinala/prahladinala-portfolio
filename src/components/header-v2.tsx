"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle-v2";
import { navLinks } from "@/config/nav";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section based on scroll position
      if (pathname === "/") {
        const sections = navLinks
          .map((link) => link.href.split("#")[1])
          .filter(Boolean);
        
        let current = "home";
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element && window.scrollY >= element.offsetTop - 150) {
            current = section;
          }
        }
        setActiveSection(current);
      } else {
        // If not on homepage, base it on the pathname
        if (pathname.startsWith("/notes")) setActiveSection("notes");
        else setActiveSection("");
      }
    };

    // Run once on path change to update immediately
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const isHashLink = href.startsWith("/#") || href.startsWith("#");

    if (pathname === "/" && isHashLink) {
      e.preventDefault();
      const targetId = href.split("#")[1];
      const elem = document.getElementById(targetId);
      if (elem) {
        window.scrollTo({
          top: elem.offsetTop - 80,
          behavior: "smooth",
        });
      }
    } else if (!pathname.startsWith("/") && isHashLink) {
      // Allow next/link to handle cross-page navigation naturally
    }
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 print:hidden ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/#home" className="text-xl font-bold tracking-tight z-50" onClick={(e) => handleLinkClick(e, "/")}>
            Prahlad<span className="text-primary">.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => {
              const isActive = 
                (link.href === "/" && activeSection === "home") || 
                (link.href.includes("#") && activeSection === link.href.split("#")[1]) ||
                (link.href.startsWith("/notes") && activeSection === "notes");

              return (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.title}
                  {isActive && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            <div className="pl-4 border-l border-border flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 bg-muted/40 p-1 rounded-full border border-border shadow-sm mr-1">
                <button onClick={() => router.back()} className="p-1.5 rounded-full hover:bg-background hover:text-primary text-muted-foreground transition-colors" title="Go Back">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button onClick={() => router.forward()} className="p-1.5 rounded-full hover:bg-background hover:text-primary text-muted-foreground transition-colors" title="Go Forward">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <ThemeToggle />
              <Link href="/resume" className={cn(buttonVariants({ size: "sm", variant: "default" }), "rounded-full")}>
                Resume
              </Link>
            </div>
          </nav>

          {/* Mobile Nav Toggle */}
          <div className="flex items-center md:hidden gap-2">
            <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-full border border-border shadow-sm">
              <button onClick={() => router.back()} className="p-1.5 rounded-full hover:bg-background hover:text-primary text-muted-foreground transition-colors" title="Go Back">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button onClick={() => router.forward()} className="p-1.5 rounded-full hover:bg-background hover:text-primary text-muted-foreground transition-colors" title="Go Forward">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }))} aria-label="Menu">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[350px] flex flex-col pt-16">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => {
                    const isActive = 
                      (link.href === "/" && activeSection === "home") || 
                      (link.href.includes("#") && activeSection === link.href.split("#")[1]) ||
                      (link.href.startsWith("/notes") && activeSection === "notes");

                    return (
                      <Link
                        key={link.title}
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className={`text-lg font-medium transition-colors hover:text-primary ${
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {link.title}
                      </Link>
                    );
                  })}
                  <div className="pt-4 mt-4 border-t border-border">
                    <Link href="/resume" className={cn(buttonVariants(), "w-full rounded-full")}>
                      View Resume
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

