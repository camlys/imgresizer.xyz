import React from 'react';
import { Layers, ShieldCheck, Zap, Sparkles, Globe, Cpu, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-primary">
              Img<span className="text-accent">Resizer</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">Features</Link>
            <Link href="/about" className="text-sm font-medium text-accent transition-colors">About</Link>
          </nav>
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Tool
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <section className="text-center mb-20 space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tight leading-[1.1]">
            Our Mission: <span className="text-accent">Visual Perfection</span>, Simplified.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            ImgResizer was built on the belief that professional image optimization shouldn't compromise privacy or speed.
          </p>
        </section>

        {/* Story Section */}
        <section className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">Privacy by Design</h2>
              <p className="text-muted-foreground leading-relaxed">
                In an era where data is often the product, we took a different path. ImgResizer performs all heavy lifting directly in your browser. Your sensitive photos, professional headshots, and proprietary graphics never touch our servers. 
              </p>
              <div className="flex items-center gap-4 p-4 bg-accent/5 rounded-2xl border border-accent/10">
                <ShieldCheck className="w-8 h-8 text-accent shrink-0" />
                <p className="text-sm font-medium text-primary">
                  100% Client-Side Processing. No uploads, no storage, no risk.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-3xl aspect-square flex items-center justify-center p-12">
              <ShieldCheck className="w-32 h-32 text-primary opacity-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="md:order-2 space-y-6">
              <h2 className="text-3xl font-bold text-primary">Intelligence Meets Utility</h2>
              <p className="text-muted-foreground leading-relaxed">
                We've integrated advanced Google Gemini AI to analyze your content. It doesn't just resize; it understands whether you're optimizing a high-contrast illustration or a nuanced portrait, suggesting the perfect balance of compression and quality.
              </p>
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <Sparkles className="w-8 h-8 text-primary shrink-0" />
                <p className="text-sm font-medium text-primary">
                  AI-Powered Insights for WebP, JPEG, and PNG optimization.
                </p>
              </div>
            </div>
            <div className="md:order-1 bg-muted rounded-3xl aspect-square flex items-center justify-center p-12">
              <Cpu className="w-32 h-32 text-accent opacity-20" />
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white border rounded-3xl space-y-4">
            <Zap className="w-10 h-10 text-accent" />
            <h3 className="font-bold text-xl text-primary">Speed</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Zero-latency processing. By utilizing your local hardware, we deliver results faster than any cloud-based solution.
            </p>
          </div>
          <div className="p-8 bg-white border rounded-3xl space-y-4">
            <Globe className="w-10 h-10 text-primary" />
            <h3 className="font-bold text-xl text-primary">Accessibility</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No accounts, no subscriptions, no barriers. High-quality tools should be available to every creator on the web.
            </p>
          </div>
          <div className="p-8 bg-white border rounded-3xl space-y-4">
            <Layers className="w-10 h-10 text-accent" />
            <h3 className="font-bold text-xl text-primary">Precision</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pixel-perfect cropping and rotation tools designed for the modern web and social media landscape.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-32 text-center p-12 bg-primary rounded-[3rem] text-white space-y-6">
          <h2 className="text-3xl font-black">Ready to optimize?</h2>
          <p className="opacity-80 max-w-md mx-auto">
            Experience the future of image resizing. Fast, private, and powered by AI.
          </p>
          <Link 
            href="/" 
            className="inline-flex h-14 items-center justify-center px-8 rounded-full bg-accent text-white font-bold hover:scale-105 transition-transform shadow-xl shadow-accent/20"
          >
            Start Resizing Now
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-lg font-black tracking-tighter text-primary">
                  Img<span className="text-accent">Resizer</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Professional browser-based image resizing. Private and secure.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="font-bold text-primary">Product</h4>
                <nav className="flex flex-col gap-2">
                  <Link href="/#features" className="text-sm text-muted-foreground hover:text-accent">Features</Link>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-accent">About</Link>
                  <Link href="/sitemap.xml" className="text-sm text-muted-foreground hover:text-accent">Sitemap</Link>
                </nav>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-primary">Legal</h4>
                <nav className="flex flex-col gap-2">
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent">Privacy</Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-accent">Terms</Link>
                </nav>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-muted-foreground">
              © 2025 ImgResizer.xyz. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}