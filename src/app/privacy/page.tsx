
import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerOff, Database, FileText, ArrowLeft, Layers } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import Link from 'next/link';

export default function PrivacyPage() {
  const lastUpdated = "May 24, 2024";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader type="about" />

      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        {/* Header Section */}
        <section className="mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Sovereignty Verified</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tight">
            Privacy <span className="text-accent">Protocol</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Last Updated: {lastUpdated}
          </p>
        </section>

        {/* Core Philosophy Card */}
        <div className="bg-primary p-8 md:p-12 rounded-[2.5rem] text-white mb-20 shadow-2xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">The Zero-Server Manifesto</h2>
            <p className="text-lg opacity-90 leading-relaxed max-w-2xl">
              Unlike traditional image editors that require you to upload files to their cloud, ImgResizer operates on a <strong>Local-First</strong> architecture. Your images never touch our hardware.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <ServerOff className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="font-bold">No Uploads</h4>
                  <p className="text-sm opacity-80">Images are read directly into your browser's RAM via the File API.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <Database className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="font-bold">No Storage</h4>
                  <p className="text-sm opacity-80">We maintain zero databases for user-generated visual content.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <ShieldCheck className="w-64 h-64 rotate-12" />
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-16">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Technical Processing</h3>
            </div>
            <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed space-y-4">
              <p>
                ImgResizer utilizes the <strong>Canvas API</strong> and <strong>Web Workers</strong> to perform resizing, cropping, and format conversion directly on your device. This means the CPU/GPU heavy lifting is distributed to your local hardware, not a remote server.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Memory Lifecycle:</strong> All image data exists only for the duration of your browser session.</li>
                <li><strong>AI Analysis:</strong> When using "Smart Advice," a temporary data URI is processed by Google Gemini. This data is ephemeral and used solely to generate optimization parameters; it is not used for model training or permanent storage.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Third-Party Services</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We strive for a minimal footprint. Our third-party integrations are limited to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 border rounded-2xl bg-white shadow-sm space-y-2">
                <h4 className="font-bold text-primary">Google GenAI</h4>
                <p className="text-sm text-muted-foreground">Used for content analysis. Operates under strict privacy guidelines where input data is deleted after the request is completed.</p>
              </div>
              <div className="p-6 border rounded-2xl bg-white shadow-sm space-y-2">
                <h4 className="font-bold text-primary">Firebase Hosting</h4>
                <p className="text-sm text-muted-foreground">Standard web server logs (IP address, browser type) are collected for security and performance monitoring purposes only.</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Your Rights</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Because we do not collect personal identifiers or image content, there is no data to "delete" or "export." However, we fully support the spirit of:
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-muted rounded-full text-xs font-bold text-primary border">GDPR Compliance</span>
              <span className="px-4 py-2 bg-muted rounded-full text-xs font-bold text-primary border">CCPA Protection</span>
              <span className="px-4 py-2 bg-muted rounded-full text-xs font-bold text-primary border">PIPEDA Standard</span>
            </div>
          </section>
        </div>

        {/* Contact CTA */}
        <section className="mt-24 pt-16 border-t text-center space-y-6">
          <h2 className="text-2xl font-bold text-primary">Questions about our architecture?</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Our engineering team is committed to transparency. Feel free to reach out for a deeper technical dive into our local-first approach.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/about" 
              className="inline-flex h-12 items-center justify-center px-6 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-opacity"
            >
              Learn More About Us
            </Link>
            <Link 
              href="/" 
              className="inline-flex h-12 items-center justify-center px-6 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Editor
            </Link>
          </div>
        </section>
      </main>

      {/* Simplified Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tighter text-primary">
                Img<span className="text-accent">Resizer</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground italic">
              "Privacy isn't an option, it's a fundamental requirement."
            </p>
            <p className="text-xs text-muted-foreground">
              © 2025 ImgResizer.xyz
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
