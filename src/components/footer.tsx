"use client";

import { Heart, Mail } from "lucide-react";
import Link from "next/link";
import { Github, Linkedin, Twitter, Medium } from "@/components/icons";
import type { Socials } from "@/lib/keystatic-data";

export function Footer({ socials }: { socials?: Socials | null }) {
  // Default to empty strings if socials is undefined
  const safeSocials = socials || { github: '', linkedin: '', twitter: '', email: '', medium: '' };

  return (
    <footer className="w-full border-t border-border/40 bg-background pt-16 pb-8 mt-auto print:hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-foreground">Prahlad.</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Building fast, accessible, and beautiful web experiences. Specialized in React, Next.js, and Guidewire Jutro.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/#about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/#experience" className="hover:text-primary transition-colors">Experience</Link></li>
              <li><Link href="/#projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/#skills" className="hover:text-primary transition-colors">Skills</Link></li>
              <li><Link href="/notes" className="hover:text-primary transition-colors">Notes</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Connect</h4>
            <div className="flex gap-4 text-muted-foreground">
              {safeSocials.github && (
                <Link href={safeSocials.github} className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              )}
              {safeSocials.linkedin && (
                <Link href={safeSocials.linkedin} className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              )}
              {safeSocials.twitter && (
                <Link href={safeSocials.twitter} className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-5 h-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              )}
              {safeSocials.medium && (
                <Link href={safeSocials.medium} className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  <Medium className="w-5 h-5" />
                  <span className="sr-only">Medium</span>
                </Link>
              )}
              {safeSocials.email && (
                <Link href={`mailto:${safeSocials.email}`} className="hover:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                  <span className="sr-only">Email</span>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>c {new Date().getFullYear()} Prahlad Inala. All rights reserved.</p>
          <p>Designed & Built by Prahlad <span className="mx-2">|</span> Built with Next.js</p>
        </div>
      </div>
    </footer>
  );
}
