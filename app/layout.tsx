import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import ConditionalLayout from "@/components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: "Luxury Jewelry | Exquisite Luxury & Timeless Elegance",
    template: "%s | Luxury Jewelry"
  },
  description: "Discover Luxury Jewelry, where 50 years of heritage meets modern luxury. Explore our curated collections of diamond rings, gold necklaces, and bespoke bridal jewelry. Crafted for timeless elegance.",
  keywords: ["luxury jewelry", "diamond rings", "gold necklaces", "bridal jewelry", "Luxury Jewelry", "bespoke jewelry", "indian jewelry brands", "timeless elegance"],
  authors: [{ name: "Luxury Jewel House" }],
  creator: "Luxury Jewelry Team",
  publisher: "Luxury Jewel House Pvt Ltd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://example.com",
    siteName: "Luxury Jewelry",
    title: "Luxury Jewelry | Timeless Elegance & Exquisite Craftsmanship",
    description: "Exquisite jewelry collections crafted for timeless beauty. Explore our heritage and find your perfect masterpiece.",
    images: [
      {
        url: "/images/hero-bg.avif",
        width: 1200,
        height: 630,
        alt: "Luxury Jewelry Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Jewelry | Timeless Elegance",
    description: "Exquisite jewelry collections crafted for timeless beauty.",
    images: ["/images/hero-bg.avif"],
    creator: "@luxury_jewelry",
  },
  alternates: {
    canonical: "https://example.com",
    languages: {
      "en-IN": "https://example.com",
      "en-US": "https://example.com/country/usa",
      "en-AE": "https://example.com/country/uae",
      "en-EU": "https://example.com/country/europe",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Luxury Jewelry",
    "url": "https://example.com",
    "logo": "https://example.com/images/LUXURY JEWELRY%20LOGO.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+919999999999",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    },
    "sameAs": [
      "https://www.facebook.com/luxury_jewelry",
      "https://www.instagram.com/luxury_jewelry",
      "https://x.com/luxury_jewelry",
      "https://www.linkedin.com/company/luxury_jewelry",
      "https://in.pinterest.com/luxury_jewelry",
      "https://www.youtube.com/@luxury_jewelry"
    ]
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white">
        <script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
