import { Metadata } from "next";

interface ConstructMetadataProps {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description,
  path = "",
  ogImage = "https://example.com/images/og-image.jpg",
  noIndex = false,
}: ConstructMetadataProps = {}): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `https://example.com${cleanPath === "/" ? "" : cleanPath}`;

  const alternateUrl = (countryPrefix: string) => {
    const suffix = cleanPath === "/" ? "" : cleanPath;
    return `https://example.com${countryPrefix}${suffix}`;
  };

  return {
    metadataBase: new URL("https://example.com"),
    title: title ? `${title} | Luxury Jewelry` : "Luxury Jewelry | Exquisite Luxury & Timeless Elegance",
    description: description || "Discover Luxury Jewelry, where 50 years of heritage meets modern luxury. Explore our curated collections of diamond rings, gold necklaces, and bespoke bridal jewelry. Crafted for timeless elegance.",
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
      url,
      siteName: "Luxury Jewelry",
      title: title ? `${title} | Luxury Jewelry` : "Luxury Jewelry | Timeless Elegance & Exquisite Craftsmanship",
      description: description || "Exquisite jewelry collections crafted for timeless beauty. Explore our heritage and find your perfect masterpiece.",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || "Luxury Jewelry Luxury Jewellery Collection",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | Luxury Jewelry` : "Luxury Jewelry | Timeless Elegance",
      description: description || "Exquisite jewelry collections crafted for timeless beauty.",
      images: [ogImage],
      creator: "@luxury-jewelryjewel",
    },
    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
        "en-US": alternateUrl("/country/usa"),
        "en-AE": alternateUrl("/country/uae"),
        "en-EU": alternateUrl("/country/europe"),
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
