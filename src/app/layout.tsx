import type {Metadata} from 'next';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'ImgResizer - Fast, Intelligent Image Resizing & Optimization',
  description: 'Effortlessly resize and optimize your images with AI-powered compression recommendations. Free, fast, and fully responsive browser-based tool.',
  keywords: 'image resizer, photo optimizer, ai image compression, bulk resize, webp converter, responsive image tool',
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
