'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Layers, PencilRuler, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SiteHeaderProps {
  type?: 'home' | 'about';
}

export function SiteHeader({ type = 'home' }: SiteHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      
      const currentScrollY = window.scrollY;
      
      // Determine if the header should be in its "shrunk" (collapsed) state
      setIsScrolled(currentScrollY > 20);

      // Determine visibility: Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-500 ease-in-out",
      isScrolled ? "h-14 shadow-sm" : "h-16 md:h-20",
      isVisible ? "translate-y-0" : "-translate-y-full"
    )}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className={cn(
            "bg-primary rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-500",
            isScrolled ? "w-8 h-8" : "w-9 h-9"
          )}>
            <Layers className={cn("transition-all duration-500", isScrolled ? "w-4 h-4" : "w-5 h-5")} />
          </div>
          <span className={cn(
            "font-black tracking-tighter text-primary transition-all duration-500",
            isScrolled ? "text-lg" : "text-xl"
          )}>
            Img<span className="text-accent">Resizer</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">Features</Link>
          <Link href="/about" className={cn(
            "text-sm font-medium transition-colors",
            type === 'about' ? "text-accent" : "text-muted-foreground hover:text-accent"
          )}>About</Link>
          {type === 'home' && (
            <a href="/sitemap.xml" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">Sitemap</a>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {type === 'home' ? (
            <a 
              href="https://camly.org" 
              target="_blank" 
              rel="noreferrer" 
              className={cn(
                "group relative inline-flex items-center gap-2 font-bold transition-all duration-300 bg-white border border-primary/10 rounded-full hover:border-accent/50 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] hover:shadow-accent/20 active:scale-95",
                isScrolled ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
              )}
              title="Advanced PDF & Image Editor"
            >
              <PencilRuler className={cn("text-accent transition-transform group-hover:rotate-12", isScrolled ? "w-3.5 h-3.5" : "w-4 h-4")} />
              <span className="text-primary group-hover:text-accent transition-colors hidden sm:inline">Camly Editor</span>
              <span className="sm:hidden text-primary group-hover:text-accent transition-colors">Camly</span>
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
            </a>
          ) : (
            <Link href="/" className="flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Tool
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
