import Image from 'next/image';
import Link from 'next/link';
import { IProduct } from '@/models/Product';
import { ArrowRight, Star, ShieldCheck, Diamond, Heart, CheckCircle2, Video, Store, Gift, RotateCcw } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getData() {
  const [pRes, cRes] = await Promise.all([
    fetch(`${API_URL}/api/products`, { next: { revalidate: 60 } }).catch(() => null),
    fetch(`${API_URL}/api/categories`, { next: { revalidate: 60 } }).catch(() => null)
  ]);
  
  const products = (pRes && pRes.ok) ? (await pRes.json()).data : [];
  const categories = (cRes && cRes.ok) ? (await cRes.json()).data : [];
  
  return { products, categories };
}

export default async function Home() {
  let { products, categories } = await getData();

  // Fallback for UI demonstration
  if (categories.length === 0) {
    categories = [
      { name: 'Rings', slug: 'ring', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e' },
      { name: 'Earrings', slug: 'earring', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908' },
      { name: 'Pendants', slug: 'pendant', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f' },
      { name: 'Bracelets', slug: 'bracelet', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a' },
      { name: 'Mangalsutras', slug: 'mangalsutra', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e' },
      { name: 'Necklaces', slug: 'necklace', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338' },
      { name: 'Chains', slug: 'chain', image: 'https://images.unsplash.com/photo-1588444837495-c6bfcceebce7' },
      { name: 'Nose Pins', slug: 'nose-pin', image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76' }
    ] as any;
  }
  
  if (products.length === 0) {
    products = [
      { name: 'Elegant Gold Ring', slug: 'gold-ring', images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e'], specs: { price: '240.00' } },
      { name: 'Diamond Necklace', slug: 'diamond-necklace', images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f'], specs: { price: '850.00' } },
      { name: 'Pearl Bracelet', slug: 'pearl-bracelet', images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a'], specs: { price: '420.00' } }
    ] as any;
  }


  return (
    <div className="flex flex-col bg-brand-bg min-h-screen overflow-x-hidden">

      {/* 1. HERO SECTION (Unchanged) */}
      <section className="relative h-screen min-h-[900px] w-full flex items-center justify-center p-6 md:p-12 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury Jewelry"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brand-text/10"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-[1400px] h-full max-h-[800px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[60px] shadow-premium overflow-hidden flex flex-col md:flex-row items-center justify-between p-12 md:p-24 animate-in fade-in zoom-in duration-1000">
          
          <div className="flex flex-col items-start space-y-12 max-w-2xl">
            <div className="space-y-4">
              <h1 className="text-7xl md:text-[110px] font-serif text-white leading-[0.85] tracking-tighter">
                Our Luxury <br /> Collections
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="bg-white text-brand-text px-12 py-5 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-brand-gold hover:text-white transition-all shadow-soft">
                Let's Get Started
              </button>
              <div className="w-14 h-14 rounded-full bg-white text-brand-text flex items-center justify-center shadow-soft hover:bg-brand-gold hover:text-white transition-all cursor-pointer">
                <ArrowRight size={20} />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-l-2 border-brand-gold pl-8">
              <p className="text-white text-xs uppercase tracking-[0.4em] font-bold italic opacity-80">
                # Zoniraz Jewelry Store
              </p>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm font-medium">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
              </p>
            </div>
          </div>

          <div className="relative flex flex-col items-end space-y-16 mt-20 md:mt-0">
            <div className="bg-white/90 backdrop-blur-md p-4 pr-10 rounded-full shadow-premium flex items-center space-x-6 animate-in slide-in-from-right-12 duration-1000 delay-300">
              <div className="flex -space-x-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-soft">
                    <Image src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="Client" width={48} height={48} />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full bg-brand-accent border-2 border-white flex items-center justify-center text-brand-text text-sm font-bold shadow-soft">
                  +
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-brand-text text-2xl font-serif font-bold leading-none">230K</p>
                <p className="text-brand-text/40 text-[9px] uppercase tracking-widest font-bold">Happy Clients</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[35px] shadow-premium flex items-center space-x-6 w-full max-w-[420px] animate-in slide-in-from-bottom-12 duration-1000 delay-500">
              <div className="w-28 h-20 relative rounded-2xl overflow-hidden bg-brand-accent shadow-soft">
                <Image src={products[0]?.images[0] || "https://images.unsplash.com/photo-1605100804763-247f67b3557e"} alt="Product" fill className="object-cover" />
              </div>
              <div className="flex flex-col items-start space-y-2">
                <p className="text-brand-text text-lg font-serif font-bold leading-tight">Beautiful In Every Detail</p>
                <Link href="#" className="text-brand-text/40 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center space-x-2 hover:text-brand-gold transition-colors group">
                  <span>Read More</span>
                  <div className="w-6 h-6 rounded-full border border-brand-text/10 flex items-center justify-center group-hover:border-brand-gold group-hover:text-brand-gold transition-all">
                    <ArrowRight size={10} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW TANISHQ-INSPIRED SECTIONS BEGIN HERE --- */}

      {/* 2. SHOP BY COLLECTION */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-center mb-8 sm:mb-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Shop by Collection</h2>
            <div className="w-16 h-[1px] bg-brand-gold mx-auto"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left Main Collection */}
            <div className="w-full lg:w-2/3 relative aspect-[4/5] md:aspect-auto md:h-[500px] rounded-xl overflow-hidden group shadow-soft">
              <Image 
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200" 
                alt="Bridal Collection" 
                fill 
                className="object-cover transition-transform duration-[3s] group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-text/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white space-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Signature</p>
                <h3 className="text-3xl font-serif">Bridal Collection</h3>
                <Link href="/category/bridal" className="inline-flex items-center space-x-2 text-sm uppercase tracking-widest font-bold hover:text-brand-gold transition-colors pt-2">
                  <span>Explore</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right Stacked Collections */}
            <div className="w-full lg:w-1/3 grid grid-cols-2 lg:flex lg:flex-col gap-4">
              <div className="relative w-full aspect-[4/5] md:h-full rounded-xl overflow-hidden group shadow-soft">
                <Image 
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600" 
                  alt="Everyday Wear" 
                  fill 
                  className="object-cover transition-transform duration-[3s] group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-text/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <h3 className="text-xl sm:text-2xl font-serif">Everyday Wear</h3>
                  <Link href="/category/everyday" className="inline-flex items-center space-x-2 text-[8px] sm:text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors pt-1">
                    <span>Explore</span> <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
              <div className="relative w-full aspect-[4/5] md:h-full rounded-xl overflow-hidden group shadow-soft">
                <Image 
                  src="https://images.unsplash.com/photo-1588444837495-c6bfcceebce7?auto=format&fit=crop&q=80&w=600" 
                  alt="Men's Edit" 
                  fill 
                  className="object-cover transition-transform duration-[3s] group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-text/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <h3 className="text-xl sm:text-2xl font-serif">Men's Edit</h3>
                  <Link href="/category/men" className="inline-flex items-center space-x-2 text-[8px] sm:text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors pt-1">
                    <span>Explore</span> <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FIND YOUR PERFECT MATCH */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-center mb-8 sm:mb-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Find Your Perfect Match</h2>
            <div className="w-16 h-[1px] bg-brand-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.slice(0, 8).map((cat: any, i: number) => (
              <Link href={`/category/${cat.slug}`} key={i} className="group flex flex-col items-center text-center space-y-4">
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-soft border border-brand-text/5 bg-brand-bg group-hover:shadow-premium transition-all">
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-brand-text group-hover:text-brand-gold transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRENDING NOW */}
      <section className="py-8 sm:py-12 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-center mb-8 sm:mb-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Trending Now</h2>
            <div className="w-16 h-[1px] bg-brand-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[
              { title: 'The Solitaire Promise', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e' },
              { title: 'Vintage Heirloom', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f' },
              { title: 'Modern Minimalism', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a' }
            ].map((trend, i) => (
              <div key={i} className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-soft cursor-pointer">
                <Image src={trend.img} alt={trend.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-text/90 via-transparent to-transparent"></div>
                <h3 className="absolute bottom-6 w-full text-center text-white font-serif text-xl px-4">{trend.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ZONIRAZ WORLD */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-center mb-8 sm:mb-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Zoniraz World</h2>
            <div className="w-16 h-[1px] bg-brand-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[500px]">
            {/* Top Left / Bottom Left equivalent (Grid split) */}
            <div className="grid grid-rows-2 gap-4 h-full">
              <div className="relative rounded-xl overflow-hidden shadow-soft group">
                <Image src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800" alt="World" fill className="object-cover transition-transform group-hover:scale-105 duration-1000" />
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-soft group">
                <Image src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800" alt="World" fill className="object-cover transition-transform group-hover:scale-105 duration-1000" />
              </div>
            </div>
            {/* Right Side (One Large) */}
            <div className="relative rounded-xl overflow-hidden shadow-soft group h-full min-h-[400px]">
              <Image src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000" alt="World" fill className="object-cover transition-transform group-hover:scale-105 duration-1000" />
              <div className="absolute inset-0 bg-brand-text/20 flex flex-col items-center justify-center text-center p-8">
                <h3 className="text-5xl font-serif text-white mb-4 italic">The Heritage</h3>
                <p className="text-white/90 text-sm max-w-sm uppercase tracking-widest">Crafting brilliance for generations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="w-full bg-[#B3A99B] overflow-hidden flex flex-col lg:flex-row shadow-soft">
            <div className="w-full lg:w-1/3 text-white p-6 sm:p-10 flex flex-col justify-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-serif">New Arrivals</h2>
              <p className="text-white/80 text-[10px] sm:text-xs leading-relaxed max-w-[250px]">
                New Arrivals Dropping Daily, Monday through Friday. Explore the Latest Launches Now!
              </p>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-2 p-4 gap-4">
              {products.slice(0, 2).map((prod: any, i: number) => (
                <div key={i} className="flex-1 bg-white border-[6px] border-white shadow-md relative group aspect-[4/5] overflow-hidden cursor-pointer">
                  <Image src={prod.images[0]} alt={prod.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm px-3 py-1 text-[10px] text-white tracking-widest uppercase">{prod.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. CURATED FOR YOU */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Curated For You</h2>
            <p className="text-[10px] sm:text-sm text-brand-text/60 uppercase tracking-widest">Shop By Gender</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[
              { img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600', text: 'Women Jewellery' },
              { img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600', text: 'Men Jewellery' },
              { img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600', text: 'Kids Jewellery' }
            ].map((store, i) => (
              <div key={i} className="group cursor-pointer flex flex-col items-center">
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 shadow-soft">
                  <Image src={store.img} alt={store.text} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text/70">{store.text}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. STYLING 101 WITH DIAMONDS */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-center mb-12 sm:mb-16 space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Styling 101 With Diamonds</h2>
            <p className="text-[10px] sm:text-sm text-brand-text/60 uppercase tracking-widest">Trendsetting diamond jewellery suited for every occasion</p>
          </div>

          <div className="relative flex justify-center items-center h-[500px] max-w-4xl mx-auto">
            {/* Background overlapping cards (simulated fan effect) */}
            <div className="hidden md:block absolute w-[250px] aspect-[9/16] bg-brand-text rounded-xl shadow-xl -translate-x-48 scale-75 opacity-60 z-0"></div>
            <div className="hidden md:block absolute w-[250px] aspect-[9/16] bg-[#539E99] rounded-xl shadow-xl -translate-x-24 scale-90 opacity-80 z-10"></div>
            
            <div className="hidden md:block absolute w-[250px] aspect-[9/16] bg-[#2A2B2E] rounded-xl shadow-xl translate-x-48 scale-75 opacity-60 z-0 overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908" alt="Diamond bg" fill className="object-cover opacity-50" />
            </div>
            <div className="hidden md:block absolute w-[250px] aspect-[9/16] bg-[#162933] rounded-xl shadow-xl translate-x-24 scale-90 opacity-80 z-10 overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1588444837495-c6bfcceebce7" alt="Diamond bg" fill className="object-cover opacity-50" />
            </div>

            {/* Center Active Card */}
            <div className="relative w-[280px] sm:w-[300px] aspect-[9/16] bg-[#1E4D8C] rounded-xl shadow-2xl z-20 overflow-hidden p-2">
              <div className="grid grid-cols-2 grid-rows-3 gap-2 h-full">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="relative rounded-md overflow-hidden bg-black/10">
                    <Image src="https://images.unsplash.com/photo-1605100804763-247f67b3557e" alt="Diamond item" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ZONIRAZ ASSURANCE & EXCHANGE */}
      <section className="py-16 bg-white border-y border-brand-text/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          
          {/* Top Strip */}
          <div className="flex flex-col md:flex-row items-center justify-between py-8 border-b border-brand-text/5 gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Zoniraz <span className="text-[#8B2332]">Assurance</span></h2>
              <p className="text-xs sm:text-sm text-brand-text/50 mt-2">Crafted by experts, cherished by you</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-16">
              <div className="flex flex-col items-center text-center">
                <Diamond size={24} className="text-brand-gold mb-2" />
                <span className="text-[10px] uppercase font-bold text-brand-text">Quality<br/>Craftsmanship</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Heart size={24} className="text-brand-gold mb-2" />
                <span className="text-[10px] uppercase font-bold text-brand-text">Ethically<br/>Sourced</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck size={24} className="text-brand-gold mb-2" />
                <span className="text-[10px] uppercase font-bold text-brand-text">100%<br/>Transparency</span>
              </div>
            </div>
          </div>

          {/* Bottom Strip (Exchange Program) */}
          <div className="flex flex-col items-center py-16 text-center space-y-8">
            <div>
              <h2 className="text-3xl font-serif text-brand-text tracking-tight mb-2">Exchange Program</h2>
              <p className="text-sm text-brand-text/50">Trusted by 2.8M+ families</p>
            </div>
            
            <button className="w-full sm:w-auto px-8 py-3 border border-[#8B2332]/30 rounded-full text-[10px] uppercase tracking-widest font-bold text-brand-text hover:bg-brand-bg transition-colors flex items-center justify-center space-x-2">
              <span>Explore Now</span>
              <ArrowRight size={12} />
            </button>

            <div className="w-full flex items-center justify-center space-x-4">
              <div className="h-[1px] w-full max-w-[200px] bg-brand-text/10"></div>
              <p className="text-xs text-brand-text/40 italic">Trust us to be part of your precious moments and to deliver jewellery that you'll cherish forever.</p>
              <div className="h-[1px] w-full max-w-[200px] bg-brand-text/10"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-12 mt-8">
              {[
                { icon: RotateCcw, title: 'Zoniraz Exchange' },
                { icon: Diamond, title: 'The Purity Guarantee' },
                { icon: ShieldCheck, title: 'Complete Transparency and Trust' },
                { icon: Store, title: 'Lifetime Maintenance' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center max-w-[120px]">
                  <item.icon size={32} className="text-brand-gold mb-4" strokeWidth={1.5} />
                  <span className="text-[10px] uppercase font-bold text-brand-text leading-tight">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. GIFTING & OLD GOLD */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Gift Card */}
          <div className="relative aspect-square md:aspect-auto md:h-[400px] rounded-3xl overflow-hidden bg-[#F6EDEB] group p-10 flex flex-col items-center justify-center text-center">
            {/* Simulated ribbons */}
            <div className="absolute top-0 bottom-0 left-12 w-8 bg-[#8B2332]"></div>
            <div className="absolute left-0 right-0 bottom-12 h-8 bg-[#8B2332]"></div>
            {/* Bow center */}
            <div className="absolute left-12 bottom-12 w-12 h-12 bg-[#701C28] rounded-full transform -translate-x-2 translate-y-2"></div>
            
            <div className="relative z-10 space-y-4 sm:ml-12 sm:mb-12 bg-white/80 backdrop-blur-sm p-6 rounded-2xl w-full max-w-[280px]">
              <h3 className="text-2xl sm:text-4xl font-serif text-[#8B2332]">#GiftOfChoice</h3>
              <p className="text-brand-text/70 text-[10px] sm:text-xs leading-relaxed max-w-[200px] mx-auto">Breathtaking gifts for your loved one's</p>
              <p className="text-[#8B2332] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Starting at $10,000</p>
              <button className="w-full mt-4 px-6 py-2 border border-[#8B2332]/20 bg-white rounded-full text-[10px] uppercase tracking-widest font-bold text-brand-text hover:bg-[#8B2332] hover:text-white transition-all flex items-center justify-center space-x-2">
                <span>Explore Now</span>
                <ArrowRight size={10} />
              </button>
            </div>
          </div>

          {/* Exchange Gold Card */}
          <div className="relative aspect-square md:aspect-auto md:h-[400px] rounded-3xl overflow-hidden bg-[#FFFBF0] group p-12 flex flex-col justify-center border-[12px] border-white shadow-sm">
            <div className="space-y-6">
              <div className="w-16 h-16 border border-brand-gold rounded-t-full flex items-center justify-center mb-6">
                <RotateCcw size={24} className="text-brand-gold" />
              </div>
              <h3 className="text-4xl font-serif text-brand-text max-w-[250px] leading-tight">Exchange your Old Gold for 100% Value!</h3>
              <p className="text-brand-text/60 text-xs leading-relaxed max-w-[250px]">Unlock full value for your old gold today with our <span className="font-bold text-brand-text">Exchange Program!</span></p>
              <button className="w-full sm:w-max px-6 py-3 border border-brand-gold bg-white rounded-full text-[10px] uppercase tracking-widest font-bold text-brand-text hover:bg-brand-gold hover:text-white transition-all flex items-center justify-center space-x-2">
                <span>Know more</span>
                <ArrowRight size={10} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 11. ZONIRAZ EXPERIENCE */}
      <section className="py-8 sm:py-16 bg-white border-t border-brand-text/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Zoniraz Experience</h2>
            <p className="text-[10px] sm:text-sm text-brand-text/60 uppercase tracking-widest">Find a Boutique or Book a Consultation</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 border border-brand-text/10 rounded-xl overflow-hidden shadow-soft">
            {[
              { img: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=600', text: 'VISIT OUR STORE' },
              { img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600', text: 'BOOK AN APPOINTMENT' },
              { img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600', text: 'TALK TO AN EXPERT' },
              { img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600', text: 'DIGI GOLD' },
              { img: 'https://images.unsplash.com/photo-1588444837495-c6bfcceebce7?auto=format&fit=crop&q=80&w=600', text: 'BLOGS' },
              { img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600', text: 'JEWELLERY GUIDE' }
            ].map((store, i) => (
              <div key={i} className="group cursor-pointer bg-white border border-brand-text/5 flex flex-col">
                <div className="relative aspect-square overflow-hidden">
                  <Image src={store.img} alt={store.text} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-4 text-center">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-text group-hover:text-brand-gold transition-colors">{store.text}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
