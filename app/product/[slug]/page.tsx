import Image from 'next/image';
import { notFound } from 'next/navigation';
import { IProduct } from '@/models/Product';
import { ShieldCheck, Truck, RotateCcw, Heart, Share2, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/new-ui/Button';
import { Section } from '@/components/new-ui/Section';

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

  const specs = product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs;

  return (
    <div className="bg-brand-bg min-h-screen">
      <Section className="!pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          
          {/* Left: Product Images Gallery */}
          <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="group relative aspect-[4/5] w-full rounded-[60px] overflow-hidden bg-white border border-brand-text/5 shadow-premium">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover p-16 transition-transform duration-[2s] group-hover:scale-110"
                priority
              />
              <div className="absolute top-10 right-10 flex flex-col space-y-4">
                <button className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center border border-brand-text/5 text-brand-text hover:bg-brand-gold hover:text-white transition-all shadow-soft">
                  <Heart size={20} />
                </button>
                <button className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center border border-brand-text/5 text-brand-text hover:bg-brand-gold hover:text-white transition-all shadow-soft">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-8">
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square relative rounded-[30px] overflow-hidden border border-brand-text/5 bg-white shadow-soft group cursor-pointer transition-all hover:shadow-premium hover:-translate-y-2">
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover p-4 transition-transform group-hover:scale-110" />
                  </div>
                ))}
              </div>
            )}
            
            {/* Visual Story Video */}
            {product.videoUrl && (
              <div className="mt-20 space-y-8">
                <div className="flex items-center space-x-6">
                  <div className="w-12 h-[1px] bg-brand-gold"></div>
                  <h3 className="text-[11px] uppercase tracking-[0.5em] font-bold text-brand-gold italic">Visual Story</h3>
                </div>
                <div className="aspect-video relative rounded-[50px] overflow-hidden bg-brand-text shadow-premium border-8 border-white/50">
                  <iframe
                    src={product.videoUrl}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="lg:sticky lg:top-40 space-y-16 animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-brand-gold text-[12px] uppercase tracking-[0.6em] font-bold italic">
                  {product.category} Collection
                </p>
                <h1 className="text-6xl md:text-8xl font-serif font-light text-brand-text leading-[0.9] tracking-tighter">
                  {product.name}
                </h1>
              </div>
              
              <div className="flex items-center space-x-8">
                <p className="text-4xl text-brand-gold font-bold tracking-widest font-serif italic">
                  $ {specs?.price || '0.00'}
                </p>
                <div className="h-8 w-[1px] bg-brand-text/10"></div>
                <div className="flex items-center space-x-3 text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] uppercase tracking-widest font-bold">In Stock & Ready</span>
                </div>
              </div>

              <p className="text-brand-text/50 text-lg leading-relaxed max-w-lg uppercase tracking-widest">
                {product.description}
              </p>
            </div>

            {/* Assurance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 rounded-[35px] bg-white border border-brand-text/5 shadow-soft group hover:shadow-premium transition-all">
                <ShieldCheck size={24} className="text-brand-gold mb-4 transition-transform group-hover:scale-110" />
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-text mb-2">Lifetime Warranty</h4>
                <p className="text-brand-text/30 text-[9px] uppercase tracking-widest leading-relaxed">Guaranteed quality for generations.</p>
              </div>
              <div className="p-8 rounded-[35px] bg-white border border-brand-text/5 shadow-soft group hover:shadow-premium transition-all">
                <Truck size={24} className="text-brand-gold mb-4 transition-transform group-hover:scale-110" />
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-text mb-2">Express Shipping</h4>
                <p className="text-brand-text/30 text-[9px] uppercase tracking-widest leading-relaxed">Insured delivery in 3-5 days.</p>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="bg-brand-accent/20 rounded-[50px] p-12 border border-brand-text/5">
              <div className="flex items-center space-x-6 mb-12">
                <Info size={16} className="text-brand-gold" />
                <h2 className="text-[11px] uppercase tracking-[0.5em] font-bold text-brand-text italic">Specifications</h2>
              </div>
              <div className="grid grid-cols-2 gap-y-10 gap-x-12">
                {Object.entries(specs || {}).map(([key, value]) => (
                  key !== 'price' && (
                    <div key={key} className="space-y-3">
                      <p className="text-brand-text/20 text-[9px] uppercase tracking-[0.3em] font-bold">{key}</p>
                      <p className="text-brand-text/80 text-[13px] font-medium tracking-wide">{value as string}</p>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Inquiry CTA */}
            <div className="space-y-8 pt-8">
              <div className="flex flex-col space-y-6">
                <Button size="lg" className="w-full !py-6 shadow-premium">
                  Enquire for Purchase
                </Button>
                <div className="flex items-center justify-center space-x-8 text-brand-text/30">
                  <div className="flex items-center space-x-2">
                    <RotateCcw size={14} />
                    <span className="text-[9px] uppercase tracking-widest font-bold">30-Day Returns</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheck size={14} />
                    <span className="text-[9px] uppercase tracking-widest font-bold">100% Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Section>

      {/* Brand Strip Continuity */}
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
