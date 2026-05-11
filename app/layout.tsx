import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Zoniraz Jewellery | Exquisite Luxury & Timeless Elegance",
    template: "%s | Zoniraz Jewellery"
  },
  description: "Discover Zoniraz, where 50 years of heritage meets modern luxury. Explore our curated collections of diamond rings, gold necklaces, and bespoke bridal jewelry. Crafted for timeless elegance.",
  keywords: ["luxury jewelry", "diamond rings", "gold necklaces", "bridal jewelry", "Zoniraz", "bespoke jewelry", "indian jewelry brands", "timeless elegance"],
  authors: [{ name: "Zoniraz Jewel House" }],
  creator: "Zoniraz Team",
  publisher: "Zoniraz Jewel House Pvt Ltd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://zoniraz.com",
    siteName: "Zoniraz Jewellery",
    title: "Zoniraz Jewellery | Timeless Elegance & Exquisite Craftsmanship",
    description: "Exquisite jewelry collections crafted for timeless beauty. Explore our heritage and find your perfect masterpiece.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zoniraz Luxury Jewellery Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zoniraz Jewellery | Timeless Elegance",
    description: "Exquisite jewelry collections crafted for timeless beauty.",
    images: ["/images/og-image.jpg"],
    creator: "@zonirazjewel",
  },
  alternates: {
    canonical: "https://zoniraz.com",
    languages: {
      "en-IN": "https://zoniraz.com",
      "en-US": "https://zoniraz.com/country/usa",
      "en-AE": "https://zoniraz.com/country/uae",
      "en-EU": "https://zoniraz.com/country/europe",
    },
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

import { Providers } from "@/components/Providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
        </Providers>
        
        {/* NEW TANISHQ-INSPIRED DARK FOOTER */}
        <footer className="bg-[#3A1C16] text-[#EAE1D5] pt-20 pb-10 mt-10 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12 border-b border-[#EAE1D5]/10 pb-12">
              
              {/* 1. Brand (Left Column) */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                <div className="font-serif text-4xl tracking-widest text-[#EAE1D5] mb-2">
                  Zoniraz
                </div>
                <p className="text-sm text-[#EAE1D5]/90 font-light tracking-wide max-w-[300px]">
                  Zoniraz Jewel house Pvt LTD. is one of the leading Jewellery manufacturer, wholesaler, retailer and exporter in the international Jewels market. From the last 50 Years we are serving for our loyal customers and delivering them not only a qualitative and best designs of Jewellery but also a trustful and responsible brand.
                </p>
              </div>

              {/* 2. Useful Links */}
              <div className="pl-0 lg:pl-12">
                <h4 className="font-serif text-lg mb-6 text-[#EAE1D5]">Useful Links</h4>
                <ul className="space-y-3 text-sm font-light text-[#EAE1D5]/70">
                  <li><Link href="/help?tab=delivery" className="hover:text-white transition-colors">Delivery Information</Link></li>
                  <li><Link href="/help?tab=international" className="hover:text-white transition-colors">International Shipping</Link></li>
                  <li><Link href="/help?tab=payment" className="hover:text-white transition-colors">Payment Options</Link></li>
                  <li><Link href="/help?tab=returns" className="hover:text-white transition-colors">Returns</Link></li>
                </ul>
              </div>

              {/* 3. Information */}
              <div>
                <h4 className="font-serif text-lg mb-6 text-[#EAE1D5]">Information</h4>
                <ul className="space-y-3 text-sm font-light text-[#EAE1D5]/70">
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link href="/franchise" className="hover:text-white transition-colors font-bold text-brand-gold">Franchise Inquiry</Link></li>
                  <li><Link href="/about" className="hover:text-white transition-colors">About Zoniraz</Link></li>
                </ul>
              </div>

              {/* 4. Contact Us */}
              <div>
                <h4 className="font-serif text-lg mb-6 text-[#EAE1D5]">Contact Us</h4>
                <div className="space-y-6 text-sm font-light text-[#EAE1D5]/70">
                  <div className="space-y-1">
                    <p className="flex items-center space-x-2"><Phone size={14} className="text-[#EAE1D5]" /> <a href="tel:18005726599" className="hover:text-white transition-colors tracking-widest">1800 572 6599</a></p>
                  </div>
                  <div className="space-y-3">
                    <p className="font-serif text-lg text-[#EAE1D5]">Chat With Us</p>
                    <div className="flex items-center space-x-4">
                      <a href="mailto:zonirazjewelhouse@gmail.com" className="hover:text-white transition-colors border border-[#EAE1D5]/30 rounded-full p-2" title="Email Us"><Mail size={16} /></a>
                      <a href="tel:18005726599" className="hover:text-white transition-colors border border-[#EAE1D5]/30 rounded-full p-2" title="Call Us"><Phone size={16} /></a>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* BOTTOM SECTION: Social & Legal */}
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-3 border-b border-[#EAE1D5]/10 pb-6">
                <span className="font-serif text-[#EAE1D5] mr-2">Social</span>
                <Link href="https://www.youtube.com/channel/UCdmIX6L96IV_WsbXEqZGlcw" target="_blank" className="w-8 h-8 rounded-full border border-[#EAE1D5]/30 flex items-center justify-center hover:bg-white/10 transition-colors text-[#EAE1D5]" title="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </Link>
                <Link href="https://in.pinterest.com/zonirazjewel/" target="_blank" className="w-8 h-8 rounded-full border border-[#EAE1D5]/30 flex items-center justify-center hover:bg-white/10 transition-colors text-[#EAE1D5]" title="Pinterest">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.259 7.929-7.259 4.164 0 7.399 2.965 7.399 6.933 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592 0 12.017 0z"/></svg>
                </Link>
                <Link href="https://x.com/zonirazjewel/" target="_blank" className="w-8 h-8 rounded-full border border-[#EAE1D5]/30 flex items-center justify-center hover:bg-white/10 transition-colors text-[#EAE1D5]" title="X (Twitter)">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </Link>
                <Link href="https://www.facebook.com/zonirazjewel/" target="_blank" className="w-8 h-8 rounded-full border border-[#EAE1D5]/30 flex items-center justify-center hover:bg-white/10 transition-colors text-[#EAE1D5]" title="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </Link>
                <Link href="https://www.instagram.com/zonirazjewel/" target="_blank" className="w-8 h-8 rounded-full border border-[#EAE1D5]/30 flex items-center justify-center hover:bg-white/10 transition-colors text-[#EAE1D5]" title="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4.162 4.162 0 1 1 0-8.324 4.162 4.162 0 0 1 0 8.324zM18.406 4.413a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
                </Link>
                <Link href="https://www.linkedin.com/company/zonirazjewel/" target="_blank" className="w-8 h-8 rounded-full border border-[#EAE1D5]/30 flex items-center justify-center hover:bg-white/10 transition-colors text-[#EAE1D5]" title="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </Link>
                <Link href="https://www.tumblr.com/zonirazjewel" target="_blank" className="w-8 h-8 rounded-full border border-[#EAE1D5]/30 flex items-center justify-center hover:bg-white/10 transition-colors text-[#EAE1D5]" title="Tumblr">
                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.511-4.596 4.71-6.648h3.117v6.286h4.143v4.461h-4.143v6.333c0 .878.535 1.706 1.836 1.706.746 0 1.48-.176 1.782-.444V22.6c-1.378.892-2.903 1.4-4.436 1.4z"/></svg>
                </Link>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center text-[11px] font-light text-[#EAE1D5]/50 space-y-4 md:space-y-0">
                <span>© 2026 Zoniraz Limited. All Rights Reserved.</span>
                <div className="flex space-x-4">
                  <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
                  <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                </div>
              </div>
            </div>

          </div>
        </footer>

      </body>
    </html>
  );
}
