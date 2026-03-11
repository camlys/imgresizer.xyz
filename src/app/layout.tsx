import type {Metadata} from 'next';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.imgresizer.xyz'),
  title: 'ImgResizer | Free AI Image Resizer & Optimizer Online',
  description: 'Fast, secure, and intelligent image resizing. Resize images for Instagram, YouTube, and web with AI-powered quality optimization. No upload needed - runs entirely in your browser.',
  keywords: [
    'image resizer', 
    'photo optimizer', 
    'ai image compression', 
    'resize images online', 
    'webp converter', 
    'bulk resize', 
    'instagram image size',
    'image crop tool',
    'browser based image editor'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ImgResizer | Fast & Intelligent Image Optimization',
    description: 'Optimize your images with AI-powered compression recommendations. Privacy-first, browser-based resizing tool.',
    url: 'https://www.imgresizer.xyz',
    siteName: 'ImgResizer',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImgResizer | Free AI Image Optimizer',
    description: 'Resize and optimize images in your browser with AI insights. No server uploads, 100% private.',
    creator: '@imgresizer',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-accent/30">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
