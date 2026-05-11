import Image from 'next/image';
import { ProductCard } from '@/components/new-ui/ProductCard';
import { Section } from '@/components/new-ui/Section';
import { IProduct } from '@/models/Product';
import { PLACEHOLDER_IMAGE, getValidImageUrl } from '@/lib/constants';

async function getProducts(category: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products?category=${category}`, {
    next: { revalidate: 60 }
  });
  
  if (!res.ok) {
    return [];
  }
  
  const json = await res.json();
  return json.data as IProduct[];
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProducts(slug);
  
  const categoryTitle = slug === 'all' ? 'The Full Collection' : slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Category Header Banner */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000"
          alt={categoryTitle}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 text-center px-6">
          <p className="text-brand-gold text-[12px] uppercase tracking-[0.6em] font-bold mb-8 italic animate-in fade-in slide-in-from-bottom-4 duration-700">Curated Excellence</p>
          <h1 className="text-6xl md:text-9xl font-serif text-brand-text font-light tracking-tight italic leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {categoryTitle}
          </h1>
          <div className="w-24 h-[1px] bg-brand-gold mx-auto mt-12 animate-in fade-in duration-1000 delay-500"></div>
        </div>
      </section>

      {/* Product Grid Section */}
      <Section className="!py-32">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-10">
          <div className="space-y-4">
            <p className="text-brand-gold text-[12px] uppercase tracking-[0.5em] font-bold">Discover</p>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-brand-text italic">{products.length} <span className="not-italic text-brand-text/30">Masterpieces Found</span></h2>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                name={product.name}
                price={product.basePrice || 0}
                image={getValidImageUrl(product.images?.[0])}
                slug={product.slug}
                className="animate-in fade-in slide-in-from-bottom-12 duration-1000"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[60px] shadow-soft border border-brand-text/5">
            <p className="text-brand-text/40 text-3xl font-serif italic mb-6">
              No products found in this category yet.
            </p>
            <p className="text-brand-text/20 text-[11px] uppercase tracking-[0.4em] font-bold">
              Our artisans are crafting new pieces. Check back soon.
            </p>
          </div>
        )}
      </Section>

      {/* Brand Strip - Consistent with Homepage */}
      <section className="py-24 border-t border-brand-text/5 bg-white/50 grayscale opacity-40 mix-blend-multiply">
        <div className="section-container">
          <div className="flex flex-wrap justify-between items-center gap-16 md:gap-24">
            {['VOGUE', 'ELLE', 'BAZAAR', 'FORBES', 'GQ', 'GLAMOUR'].map((brand) => (
              <span key={brand} className="text-2xl md:text-4xl font-serif tracking-[0.25em] font-bold text-brand-text italic">{brand}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
