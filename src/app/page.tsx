import React from 'react';
import { ResizerTool } from '@/components/ImageResizer/ResizerTool';
import { Zap, ShieldCheck, Layers } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ImgResizer",
    "operatingSystem": "Web",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "The professional tool for resizing images without losing quality. AI-powered compression settings for the perfect web optimization.",
    "url": "https://www.imgresizer.xyz",
    "featureList": [
      "AI-powered compression recommendations",
      "Browser-based processing (Privacy first)",
      "Instant social media presets",
      "Format conversion (JPG, PNG, WebP)",
      "Interactive cropping and rotation"
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Collapsing Smart Header */}
      <SiteHeader type="home" />

      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <section className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-bold animate-fade-in">
            <Zap className="w-4 h-4" />
            <span>Fast, Intelligent & Private</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tight max-w-3xl mx-auto leading-[1.1]">
            Resize and Optimize Images <span className="text-accent">Intelligently</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The professional browser-based tool for resizing images without losing quality. 
            Get AI-powered compression settings for perfect web optimization instantly.
          </p>
        </section>

        {/* Core Tool */}
        <ResizerTool />

        {/* Features Section */}
        <section id="features" className="mt-32 pt-20 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary">Lightning Fast Resizing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Processing happens entirely in your browser. No server uploads means zero latency. Instant results for every resize, crop, or format change.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary">Privacy-First Optimization</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your images never leave your computer. Privacy by design ensures your sensitive data stays local, secure, and away from any cloud servers.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary">AI Content Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Intelligent content analysis suggests the optimal compression percentage and format (WebP, JPG, PNG) based on your specific image type.
              </p>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section id="why-us" className="mt-32 py-16 bg-white rounded-3xl border p-8 md:p-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-primary">Why ImgResizer is the Best Choice for Web Optimization</h2>
              <p className="text-muted-foreground leading-relaxed">
                In today's fast-paced digital landscape, web performance is a critical ranking factor. Large, unoptimized images can slow down your website, hurting your SEO and user retention. ImgResizer provides a seamless, free, and lightweight solution to optimize visual content for any platform.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-primary">Optimized Social Media Graphics</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our tool includes built-in presets for Instagram, Facebook, YouTube, and LinkedIn. Ensure your posts always meet platform requirements with pixel-perfect dimensions without manual calculations.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-primary">Next-Gen WebP Conversion</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Drastically reduce file sizes by converting standard JPG and PNG files to modern WebP formats. ImgResizer maintains professional visual fidelity while maximizing your site's load speed.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 text-left">
          <div className="grid grid-cols-3 gap-8 md:gap-12 items-start">
            {/* Branding */}
            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center gap-1.5 md:gap-2.5">
                <div className="w-6 h-6 md:w-10 md:h-10 bg-primary rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-md md:shadow-lg">
                  <Layers className="w-3.5 h-3.5 md:w-5 md:h-5" />
                </div>
                <span className="text-xs md:text-xl font-black tracking-tighter text-primary">
                  Img<span className="text-accent">Resizer</span>
                </span>
              </div>
              <p className="text-[10px] md:text-sm text-muted-foreground max-w-xs leading-tight">
                Professional browser-based image resizing. Private and secure.
              </p>
            </div>

            {/* Product Links */}
            <div className="space-y-2 md:space-y-4">
              <h4 className="font-bold text-primary text-[10px] md:text-base">Product</h4>
              <nav className="flex flex-col gap-1 md:gap-2">
                <a href="#features" className="text-[9px] md:text-sm text-muted-foreground hover:text-accent transition-colors">Features</a>
                <a href="/about" className="text-[9px] md:text-sm text-muted-foreground hover:text-accent transition-colors">About</a>
                <a href="/sitemap.xml" className="text-[9px] md:text-sm text-muted-foreground hover:text-accent transition-colors">Sitemap</a>
              </nav>
            </div>

            {/* Legal Links */}
            <div className="space-y-2 md:space-y-4">
              <h4 className="font-bold text-primary text-[10px] md:text-base">Legal</h4>
              <nav className="flex flex-col gap-1 md:gap-2">
                <a href="#" className="text-[9px] md:text-sm text-muted-foreground hover:text-accent transition-colors">Privacy</a>
                <a href="#" className="text-[9px] md:text-sm text-muted-foreground hover:text-accent transition-colors">Terms</a>
              </nav>
            </div>
          </div>

          <div className="mt-8 md:mt-16 pt-4 md:pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <p className="text-[10px] md:text-xs font-medium text-muted-foreground">
              © 2025 ImgResizer.xyz
            </p>
            <div className="flex items-center gap-2 md:gap-4 text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-muted-foreground/30">
              <span>Private</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>Browser</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
