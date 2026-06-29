import Link from "next/link";
import { navLinks } from "@/config/nav";
import { Mail } from "lucide-react";
import { Linkedin, Twitter, Github } from "@/components/icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-background pt-16 pb-8">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          <div className="md:col-span-2">
            <Link
              href="#home"
              className="text-2xl font-bold tracking-tight mb-4 inline-block"
            >
              Prahlad<span className="text-primary">.</span>
            </Link>
            <p className="text-muted-foreground max-w-sm mt-4">
              Building fast, accessible, and beautiful web experiences.
              Specialized in React, Next.js, and Guidewire Jutro.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.slice(0, 5).map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/prahladinala"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/prahladinala"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://twitter.com/prahladinala"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="mailto:prahladinala@gmail.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Prahlad Inala. All rights reserved.
          </p>
          <p className="text-sm font-medium text-muted-foreground flex items-center">
            Designed & Built by Prahlad <span className="mx-2">|</span> Built
            with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
