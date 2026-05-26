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
  metadataBase: new URL('https://zoniraz.com'),
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
        url: "/images/ZONIRAZ-favicon.png",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Zoniraz Jewellery",
    "url": "https://zoniraz.com",
    "logo": "https://zoniraz.com/images/ZONIRAZ%20LOGO.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "1800-572-26599",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    },
    "sameAs": [
      "https://www.facebook.com/zonirazjewel/",
      "https://www.instagram.com/zonirazjewel/",
      "https://x.com/zonirazjewel/",
      "https://www.linkedin.com/company/zonirazjewel/",
      "https://in.pinterest.com/zonirazjewel/",
      "https://www.youtube.com/channel/UCdmIX6L96IV_WsbXEqZGlcw",
      "https://www.tumblr.com/zonirazjewel"
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
