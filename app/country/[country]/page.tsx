import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const countryName = country.charAt(0).toUpperCase() + country.slice(1);


  return (
    <div className="bg-brand-dark min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000"
          alt={countryName}
          fill
          className="object-cover opacity-50 grayscale"
          priority
        />
        <div className="relative z-10 text-center px-6">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-6 italic">
            Exclusive Collection
          </p>
          <h1 className="text-6xl md:text-8xl font-serif text-white font-light tracking-tight mb-8">
            ZONIRAZ <span className="italic">{countryName}</span>
          </h1>
          <div className="w-24 h-[1px] bg-brand-gold mx-auto"></div>
        </div>
      </section>

      {/* 2. Info Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-10 leading-relaxed font-light italic">
            Experience the finest artisanal jewelry, <br /> now available in {countryName}.
          </h2>
          <p className="text-brand-beige/50 text-[13px] leading-[2] uppercase tracking-[0.15em] max-w-2xl mx-auto">
            From the bustling streets of Paris to the vibrant markets of Dubai, ZONIRAZ brings its legacy of exquisite craftsmanship and timeless design to the heart of {countryName}. Our curated collection reflects the unique spirit of every woman who wears it.
          </p>
        </div>
      </section>

      {/* 3. Product Highlights */}
      <section className="py-32 bg-brand-brown/10 border-y border-white/5">
        <div className="section-container">
          <div className="text-center mb-20">
            <h2 className="heading-section">Curated for {countryName}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            <ProductCard 
              name="Rose Pearl Cake Charm Pendant" 
              price="$ 198.99" 
              image="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800"
              slug="pearl-cake-pendant"
            />
            <ProductCard 
              name="Pavé Diamond Huggie Hoops" 
              price="$ 89.99" 
              image="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
              slug="pave-diamond-hoops"
            />
            <ProductCard 
              name="Charlotte Slim Ring" 
              price="$ 129.99" 
              image="https://images.unsplash.com/photo-1603561591411-0e7320b97d1b?auto=format&fit=crop&q=80&w=800"
              slug="charlotte-slim-ring"
            />
          </div>
        </div>
      </section>

      {/* 4. CTA Section */}
      <section className="py-40">
        <div className="section-container text-center">
          <div className="max-w-2xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-6xl font-serif text-white font-light italic leading-tight">
              Ready to find your <br /> signature sparkle?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/category/all" className="btn-premium">
                Explore Full Collection
              </Link>
              <Link href="/contact" className="btn-outline">
                Book a Consultation
              </Link>
            </div>
            <p className="text-brand-beige/30 text-[10px] uppercase tracking-widest pt-8">
              Shipping across all major cities in {countryName}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
