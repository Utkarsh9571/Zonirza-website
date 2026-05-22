import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import { IProduct } from '@/models/Product';
import { ProductInteractiveUI } from '@/components/new-ui/ProductInteractiveUI';
import { ProductReviews } from '@/components/new-ui/ProductReviews';
import { ProductRecommendations } from '@/components/new-ui/ProductRecommendations';

async function getProduct(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/${slug}`, {
    next: { revalidate: 60 }
  });
  
  if (!res.ok) {
    return null;
  }
  
  const json = await res.json();
  return json.data as IProduct;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Zoniraz',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zoniraz.com';

  return {
    title: `${product.name} | Zoniraz Luxury Jewelry`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      url: `${baseUrl}/product/${product.slug}`,
      images: [
        {
          url: product.images[0] || '',
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      siteName: 'Zoniraz',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zoniraz.com';

  // Generate JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map(img => img.startsWith('http') ? img : `${baseUrl}${img}`),
    description: product.description,
    sku: product.slug,
    brand: {
      '@type': 'Brand',
      name: 'Zoniraz',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.basePrice,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stockStatus === 'in-stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <Script
        id={`product-jsonld-${product.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductInteractiveUI product={product} />
      <ProductRecommendations productSlug={product.slug} />
      <ProductReviews productId={product._id.toString()} />
    </>
  );
}
