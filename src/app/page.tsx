import React from 'react';
import { ResizerTool } from '@/components/ImageResizer/ResizerTool';
import { Layers, Zap, ShieldCheck, Github } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-primary">
              Img<span className="text-accent">Resizer</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">Features</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">API</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">Privacy</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-primary hover:text-accent transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

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
            The professional tool for resizing images without losing quality. 
            AI-powered compression settings for the perfect web optimization.
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
              <h3 className="text-xl font-bold text-primary">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Processing happens entirely in your browser. No server uploads, no waiting. Instant results for every resize operation.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary">Privacy First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your images never leave your computer. Privacy by design ensures your sensitive data stays local and secure.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary">AI Optimization</h3>
              <p className="text-muted-foreground leading-relaxed">
                Intelligent content analysis suggests the best compression percentage and format based on your image type.
              </p>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="mt-32 py-16 bg-white rounded-3xl border p-8 md:p-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-primary">Why Use ImgResizer?</h2>
              <p className="text-muted-foreground leading-relaxed">
                In today's fast-paced digital world, web performance is everything. Large images can slow down your website, hurting your SEO and user experience. ImgResizer provides a seamless, free, and lightweight solution to optimize your visual content for various platforms.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-primary">Perfect for Social Media</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Use our built-in presets for Instagram, Facebook, and YouTube to ensure your graphics always look sharp and fit perfectly without manual dimension calculations.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-primary">Web-Ready Formats</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Convert your heavy PNGs and JPEGs to modern WebP formats with a single click, drastically reducing file sizes while maintaining professional visual fidelity.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tighter text-primary">
                Img<span className="text-accent">Resizer</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ImgResizer. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">Terms</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">Privacy</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
