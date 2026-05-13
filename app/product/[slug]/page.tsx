import { notFound } from 'next/navigation';
import { IProduct } from '@/models/Product';
import { ProductInteractiveUI } from '@/components/new-ui/ProductInteractiveUI';

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
      
      {/* Brand Strip Continuity */}
      <section className="py-24 border-t border-brand-text/5 bg-white/50 dark:bg-brand-accent/20 grayscale opacity-40 dark:opacity-20 transition-all">
        <div className="section-container">
          <div className="flex flex-wrap justify-between items-center gap-16 md:gap-24">
            {['VOGUE', 'ELLE', 'BAZAAR', 'FORBES', 'GQ', 'GLAMOUR'].map((brand) => (
              <span key={brand} className="text-2xl md:text-4xl font-serif tracking-[0.25em] font-bold text-brand-text italic">{brand}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
