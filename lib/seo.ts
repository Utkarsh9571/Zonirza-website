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
  ogImage = "https://zoniraz.com/images/og-image.jpg",
  noIndex = false,
}: ConstructMetadataProps = {}): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `https://zoniraz.com${cleanPath === "/" ? "" : cleanPath}`;

  const alternateUrl = (countryPrefix: string) => {
    const suffix = cleanPath === "/" ? "" : cleanPath;
    return `https://zoniraz.com${countryPrefix}${suffix}`;
  };

  return {
    metadataBase: new URL("https://zoniraz.com"),
    title: title ? `${title} | Zoniraz Jewellery` : "Zoniraz Jewellery | Exquisite Luxury & Timeless Elegance",
    description: description || "Discover Zoniraz, where 50 years of heritage meets modern luxury. Explore our curated collections of diamond rings, gold necklaces, and bespoke bridal jewelry. Crafted for timeless elegance.",
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
      url,
      siteName: "Zoniraz Jewellery",
      title: title ? `${title} | Zoniraz Jewellery` : "Zoniraz Jewellery | Timeless Elegance & Exquisite Craftsmanship",
      description: description || "Exquisite jewelry collections crafted for timeless beauty. Explore our heritage and find your perfect masterpiece.",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || "Zoniraz Luxury Jewellery Collection",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | Zoniraz Jewellery` : "Zoniraz Jewellery | Timeless Elegance",
      description: description || "Exquisite jewelry collections crafted for timeless beauty.",
      images: [ogImage],
      creator: "@zonirazjewel",
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
