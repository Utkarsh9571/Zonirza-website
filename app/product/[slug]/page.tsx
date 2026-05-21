import { notFound } from 'next/navigation';
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

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductInteractiveUI product={product} />
      <ProductRecommendations productSlug={product.slug} />
      <ProductReviews productId={product._id.toString()} />
    </>
  );
}
