import Image from 'next/image';
import { Metadata } from 'next';
import { ProductCard } from '@/components/new-ui/ProductCard';
import { Section } from '@/components/new-ui/Section';
import { IProduct } from '@/models/Product';
import { constructMetadata } from '@/lib/seo';

async function getProductsAndRecommendations(category: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products?category=${category}`, {
    next: { revalidate: 60 }
  });
  
  if (!res.ok) {
    return { products: [], recommendations: [] };
  }
  
  const json = await res.json();
  return {
    products: (json.data || []) as IProduct[],
    recommendations: (json.recommendations || []) as IProduct[]
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const categoryTitle = slug === 'all' ? 'All Collections' : slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  return constructMetadata({
    title: categoryTitle,
    description: `Explore the exclusive ${categoryTitle} collection from Luxury Jewelry. Handcrafted luxury designs with Timeless Elegance.`,
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { products, recommendations } = await getProductsAndRecommendations(slug);
  
  const categoryTitle = slug === 'all' ? 'The Full Collection' : slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://example.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": categoryTitle,
        "item": `https://example.com/category/${slug}`
      }
    ]
  };

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Dynamic Breadcrumb Schema */}
      <script
        id="category-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Category Header Banner */}
      <section className="relative h-[60vh] min-h-125 w-full flex items-center justify-center overflow-hidden">
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
          <div className="w-24 h-px bg-brand-gold mx-auto mt-12 animate-in fade-in duration-1000 delay-500"></div>
        </div>
      </section>

      {/* Product Grid Section */}
      <Section className="py-32!">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-10">
          <div className="space-y-4">
            <p className="text-brand-gold text-[12px] uppercase tracking-[0.5em] font-bold">Discover</p>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-brand-text italic">{products.length} <span className="not-italic text-brand-text/30">Masterpieces Found</span></h2>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-12 gap-y-16 md:gap-y-24">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                name={product.name}
                price={product.basePrice || 0}
                image={product.images?.[0] || ''}
                slug={product.slug}
                variantImages={product.variantImages}
                images={product.images}
                product={product}
                className="animate-in fade-in slide-in-from-bottom-12 duration-1000"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[60px] shadow-soft border border-brand-gold/10">
            <p className="text-brand-text/40 text-3xl font-serif italic mb-6">
              No products found in this category yet.
            </p>
            <p className="text-brand-text/20 text-[11px] uppercase tracking-[0.4em] font-bold">
              Our artisans are crafting new pieces. Check back soon.
            </p>
          </div>
        )}

        {/* Recommendations ("Explore More") section */}
        {recommendations.length > 0 && products.length < 12 && (
          <div className="mt-32 pt-24 border-t border-brand-gold/10">
            <div className="space-y-4 mb-16">
              <p className="text-brand-gold text-[12px] uppercase tracking-[0.5em] font-bold">Curated for you</p>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-brand-text italic">Explore More</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-12 gap-y-16 md:gap-y-24">
              {recommendations.map((product) => (
                <ProductCard
                  key={product.slug}
                  name={product.name}
                  price={product.basePrice || 0}
                  image={product.images?.[0] || ''}
                  slug={product.slug}
                  variantImages={product.variantImages}
                  images={product.images}
                  product={product}
                  className="animate-in fade-in slide-in-from-bottom-12 duration-1000"
                />
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Brand Strip - Consistent with Homepage */}
      <section className="py-24 border-t border-brand-gold/10 bg-white/50 grayscale opacity-40 mix-blend-multiply">
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
