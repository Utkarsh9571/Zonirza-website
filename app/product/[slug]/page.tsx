import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { IProduct } from '@/models/Product';
import { ProductInteractiveUI } from '@/components/new-ui/ProductInteractiveUI';
import { ProductReviews } from '@/components/new-ui/ProductReviews';
import { ProductRecommendations } from '@/components/new-ui/ProductRecommendations';
import { constructMetadata } from '@/lib/seo';

async function getProduct(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/${slug}`, {
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
    return constructMetadata({
      title: 'Product Not Found',
      noIndex: true,
    });
  }

  const ogImage = product.images?.[0] || 'https://zoniraz.com/images/og-image.jpg';
  return constructMetadata({
    title: product.name,
    description: product.description.substring(0, 160),
    path: `/product/${product.slug}`,
    ogImage,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zoniraz.com';

  // Generate Product JSON-LD Structured Data
  const productJsonLd = {
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

  // Generate BreadcrumbList JSON-LD Structured Data
  const categoryTitle = product.category.charAt(0).toUpperCase() + product.category.slice(1).replace(/-/g, ' ');
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': `${baseUrl}`
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': categoryTitle,
        'item': `${baseUrl}/category/${product.category}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': product.name,
        'item': `${baseUrl}/product/${product.slug}`
      }
    ]
  };

  return (
    <>
      <script
        id={`product-jsonld-${product.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        id={`product-breadcrumb-jsonld-${product.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductInteractiveUI product={product} />
      <ProductRecommendations productSlug={product.slug} />
      <ProductReviews productId={product._id.toString()} />
    </>
  );
}
