'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IProduct } from '@/models/Product';
import { ArrowRight, Star, ShieldCheck, Diamond, Heart, Store, RotateCcw } from 'lucide-react';
import CinematicHero from '@/components/home/CinematicHero';
import StylingVideoSlider from '@/components/StylingVideoSlider';
import { resolveProductImage } from '@/lib/imageResolver';
import { useCurrencyStore } from '@/store/currencyStore';
import { displayPrice } from '@/lib/currency';



const PERFECT_MATCH_CATEGORIES = [
  { name: 'Rings', image: '/images/site/rings_category.png', href: '/products?category=rings' },
  { name: 'Earrings', image: '/images/site/earrings_category.png', href: '/products?category=earrings' },
  { name: 'Pendants', image: '/images/site/pendants_category.png', href: '/products?category=pendants' },
  { name: 'Nose Pins', image: '/images/site/nose_pins_category.png', href: '/products?category=nose-pin' },
];

interface ICategory {
  _id: string;
  name: string;
  slug: string;
}

interface ITrendingCollection {
  title: string;
  imageUrl: string;
  link: string;
}

interface IHomeContent {
  trendingCollections?: ITrendingCollection[];
}

export default function HomeContent() {
  const [data, setData] = useState<{ products: IProduct[], categories: ICategory[] }>({ products: [], categories: [] });
  const [homeContent, setHomeContent] = useState<IHomeContent | null>(null);
  const { currentCurrency, rates } = useCurrencyStore();

  useEffect(() => {
    async function fetchData() {
      try {
        const [pRes, cRes, hRes] = await Promise.all([
          fetch(`/api/products?limit=20`),
          fetch(`/api/categories`),
          fetch(`/api/merchandising/public`)
        ]);

        const products = pRes.ok ? (await pRes.json()).data : [];
        const categories = cRes.ok ? (await cRes.json()).data : [];
        const home = hRes.ok ? (await hRes.json()).data : null;

        setData({ products, categories });
        if (home) setHomeContent(home);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);

  const { products } = data;

  return (
    <div className="flex flex-col bg-brand-bg text-brand-text min-h-screen overflow-x-hidden transition-colors duration-500">

      {/* 1. HERO SECTION */}
      <CinematicHero />

      {/* 2. SHOP BY COLLECTION */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-left mb-8 sm:mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight transition-colors">Shop by Collection</h2>
            <div className="w-16 h-px bg-brand-gold"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative aspect-4/5 lg:aspect-auto lg:h-full rounded-[40px] overflow-hidden group shadow-soft">
              <Image
                src="/images/site/wedding.png"
                alt="Bridal Collection"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover transition-transform duration-[3s] group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white space-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Signature</p>
                <h3 className="text-3xl font-serif text-white">Bridal Collection</h3>
                <Link href="/products?collection=bridal" className="inline-flex items-center space-x-2 text-sm uppercase tracking-widest font-bold hover:text-brand-gold transition-colors pt-2">
                  <span>Explore</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative w-full aspect-4/5 rounded-[40px] overflow-hidden group shadow-soft">
                <Image
                  src="/images/site/daily-wear.png"
                  alt="Everyday Wear"
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-[3s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <h3 className="text-xl sm:text-2xl font-serif text-white">Everyday Wear</h3>
                  <Link href="/products?collection=everyday-luxury" className="inline-flex items-center space-x-2 text-[8px] sm:text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors pt-1">
                    <span>Explore</span> <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
              <div className="relative w-full aspect-4/5 rounded-[40px] overflow-hidden group shadow-soft">
                <Image
                  src={resolveProductImage("default-16345643112830.jpg")}
                  alt="Men's Edit"
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-[3s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <h3 className="text-xl sm:text-2xl font-serif text-white">Office Wear</h3>
                  <Link href="/products?collection=office-wear" className="inline-flex items-center space-x-2 text-[8px] sm:text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors pt-1">
                    <span>Explore</span> <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              <div className="relative w-full aspect-4/5 rounded-[40px] overflow-hidden group shadow-soft">
                <Image
                  src={resolveProductImage("yellow-gold-16516404131671.jpg")}
                  alt="Solitaire Dream"
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-[3s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <h3 className="text-xl sm:text-2xl font-serif text-white">Solitaire Dream</h3>
                  <Link href="/products?collection=solitaire" className="inline-flex items-center space-x-2 text-[8px] sm:text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors pt-1">
                    <span>Explore</span> <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
              <div className="relative w-full aspect-4/5 rounded-[40px] overflow-hidden group shadow-soft">
                <Image
                  src={resolveProductImage("yellow-gold-16010271191566.jpg")}
                  alt="Heritage Gold"
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-[3s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <h3 className="text-xl sm:text-2xl font-serif text-white">Heritage Gold</h3>
                  <Link href="/products?collection=heritage" className="inline-flex items-center space-x-2 text-[8px] sm:text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors pt-1">
                    <span>Explore</span> <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FIND YOUR PERFECT MATCH */}
      <section className="py-8 sm:py-12 bg-white dark:bg-brand-accent transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-left mb-8 sm:mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Find Your Perfect Match</h2>
            <div className="w-16 h-px bg-brand-gold"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {PERFECT_MATCH_CATEGORIES.map((cat, i) => (
              <Link href={cat.href} key={i} className="group flex flex-col items-center text-center space-y-4">
                <div className="relative w-full aspect-4/5 rounded-[40px] overflow-hidden shadow-soft border border-brand-gold bg-brand-bg group-hover:shadow-premium transition-all">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
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
      <section className="py-8 sm:py-12 bg-[#F9F6F0] dark:bg-brand-bg transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-left mb-8 sm:mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Trending Now</h2>
            <div className="w-16 h-px bg-brand-gold"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {((homeContent?.trendingCollections && homeContent.trendingCollections.length > 0) ? homeContent.trendingCollections : [
              { title: 'The Solitaire Promise', imageUrl: resolveProductImage('yellow-gold-1651640118723.jpg'), link: '/products?collection=solitaire' },
              { title: 'Vintage Heirloom', imageUrl: resolveProductImage('yellow-gold-16010959532807.jpg'), link: '/products?collection=heritage' },
              { title: 'Modern Minimalism', imageUrl: resolveProductImage('default-16345640053092.jpg'), link: '/products?collection=minimal' }
            ]).map((trend: ITrendingCollection, i: number) => (
              <Link href={trend.link} key={i} className="group relative aspect-3/4 rounded-4xl overflow-hidden shadow-soft cursor-pointer block">
                <Image src={trend.imageUrl} alt={trend.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-transparent rounded-4xl border border-brand-gold"></div>
                <h3 className="absolute bottom-6 w-full text-center text-white font-serif text-xl px-4">{trend.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LUXURY JEWELRY WORLD */}
      <section className="py-8 sm:py-12 bg-white dark:bg-brand-accent transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-left mb-8 sm:mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Luxury Jewelry World</h2>
            <div className="w-16 h-px bg-brand-gold"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-125">
            <div className="grid grid-rows-2 gap-4 h-100 md:h-full">
              <Link href="/products?tag=featured" className="relative rounded-4xl overflow-hidden shadow-soft group block border border-brand-gold">
                <Image src={resolveProductImage("yellow-gold-1657457300506.jpg")} alt="Featured World" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform group-hover:scale-105 duration-1000" />
              </Link>
              <Link href="/products?collection=heritage" className="relative rounded-4xl overflow-hidden shadow-soft group block border border-brand-gold">
                <Image src={resolveProductImage("yellow-gold-16010972111558.jpg")} alt="Heritage World" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform group-hover:scale-105 duration-1000" />
              </Link>
            </div>
            <Link href="/products?collection=heritage" className="relative rounded-4xl overflow-hidden shadow-soft group h-full min-h-100 block">
              <Image src={resolveProductImage("default-16345651242469.jpg")} alt="Heritage World" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform group-hover:scale-105 duration-1000" />
              <div className="absolute inset-0 bg-[#1c1816]/30 flex flex-col items-center justify-center text-center p-8 rounded-4xl border border-brand-gold">
                <h3 className="text-5xl font-serif text-white mb-4 italic">The Heritage</h3>
                <p className="text-white/90 text-sm max-w-sm uppercase tracking-widest">Crafting brilliance for generations.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="py-12 bg-white dark:bg-brand-accent transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="w-full bg-[#B3A99B] rounded-[40px] overflow-hidden flex flex-col lg:flex-row shadow-soft">
            <div className="w-full lg:w-1/3 text-white p-6 sm:p-10 flex flex-col justify-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-serif">New Arrivals</h2>
              <p className="text-white/80 text-[10px] sm:text-xs leading-relaxed max-w-62.5">
                New Arrivals Dropping Daily, Monday through Friday. Explore the Latest Launches Now!
              </p>
              <Link href="/products?sort=newest" className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold hover:text-brand-gold transition-colors pt-4">
                <span>Shop All New</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-2 p-4 gap-4">
              {products.slice(0, 2).map((prod: IProduct, i: number) => (
                <Link href={`/product/${prod.slug}`} key={i} className="flex-1 bg-white dark:bg-[#1a1614] border-[6px] border-white dark:border-brand-border/10 rounded-[40px] shadow-md relative group aspect-4/5 overflow-hidden cursor-pointer block">
                  <Image src={resolveProductImage(prod.images?.[0])} alt={prod.name} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" priority={i === 0} />
                  <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm px-3 py-1 text-[10px] text-white tracking-widest uppercase">
                    {prod.name} | {displayPrice(prod.basePrice || 0, currentCurrency, rates)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. CURATED FOR YOU */}
      <section className="py-12 bg-white dark:bg-brand-accent transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-left mb-8 sm:mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Curated For You</h2>
            <div className="w-16 h-px bg-brand-gold mb-1"></div>
            <p className="text-[10px] sm:text-xs text-brand-text/60 dark:text-brand-text/80 uppercase tracking-widest">Shop By Gender</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[
              { img: '/images/site/women_jewelry.png', text: 'Women Jewellery', href: '/products?gender=women' },
              { img: '/images/site/men_jewelry.png', text: 'Men Jewellery', href: '/products?gender=men' },
              { img: '/images/site/kids_jewelry.png', text: 'Kids Jewellery', href: '/products?gender=kids' }
            ].map((store, i) => (
              <Link href={store.href} key={i} className="group cursor-pointer flex flex-col items-center">
                <div className="relative w-full aspect-4/5 rounded-4xl overflow-hidden mb-4 shadow-soft hover:shadow-premium transition-all hover:border-2 border-brand-gold">
                  <Image src={store.img} alt={store.text} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700 border border-brand-gold rounded-4xl" />
                </div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text/70 group-hover:text-brand-gold transition-colors">{store.text}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. STYLING 101 */}
      <section className="py-16 bg-white dark:bg-brand-accent overflow-hidden flex flex-col items-center transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 mb-12 sm:mb-16 space-y-2 w-full text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Styling 101 With Diamonds</h2>
          <div className="w-16 h-px bg-brand-gold mb-3"></div>
          <p className="text-[10px] sm:text-xs text-brand-text/60 uppercase tracking-widest">Trendsetting diamond jewellery suited for every occasion</p>
        </div>

        <div className="w-full relative">
          <StylingVideoSlider />
        </div>

        {/* Dynamic Testimonials and Showcase Grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {[
            {
              quote: "The Solitaire Ring from Luxury Jewelry is an absolute masterpiece. The craftsmanship is flawless, and it catches the light beautifully. I get compliments on it every single day!",
              author: "Ananya Sharma",
              designation: "Verified Buyer",
              rating: 5,
              product: "1ct Solitaire Ring",
              image: resolveProductImage("yellow-gold-1651640118723.jpg")
            },
            {
              quote: "Luxury Jewelry completely redefined my expectation of luxury jewelry. Their styling advice helped me choose the perfect heritage necklace for my wedding. Exceptional service!",
              author: "Priya Patel",
              designation: "Bridal Client",
              rating: 5,
              product: "Vintage Gold Choker",
              image: resolveProductImage("yellow-gold-16010959532807.jpg")
            },
            {
              quote: "Ethically sourced diamonds and complete transparency. The lifetime maintenance package gives me total peace of mind. Truly a brand built on trust and heritage.",
              author: "Rohan Mehta",
              designation: "Collector",
              rating: 5,
              product: "Men's Diamond Band",
              image: resolveProductImage("default-16345640053092.jpg")
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#1a1614] border border-brand-gold/10 p-8 rounded-[40px] shadow-soft flex flex-col justify-between space-y-6 hover:shadow-premium transition-all duration-300">
              <div className="flex items-center space-x-1 text-brand-gold">
                {[...Array(item.rating)].map((_, idx) => (
                  <Star key={idx} size={14} fill="currentColor" className="text-brand-gold fill-brand-gold" />
                ))}
              </div>
              <p className="text-brand-text/75 dark:text-brand-text/90 text-xs italic leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="flex items-center space-x-4 border-t border-brand-text/5 pt-4">
                <div className="w-12 h-12 relative rounded-full overflow-hidden bg-brand-bg shrink-0">
                  <Image src={item.image} alt={item.author} fill sizes="48px" className="object-cover" />
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-widest font-black text-brand-text">{item.author}</h4>
                  <p className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold">{item.designation} — {item.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. LUXURY JEWELRY ASSURANCE */}
      <section className="py-16 bg-white dark:bg-brand-accent border-y border-brand-gold/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between py-8 border-b border-brand-gold/10 gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Luxury Jewelry <span className="text-[#8B2332]">Assurance</span></h2>
              <p className="text-xs sm:text-sm text-brand-text/50 dark:text-brand-text/70 mt-2">Crafted by experts, cherished by you</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-16">
              <div className="flex flex-col items-center text-center">
                <Diamond size={24} className="text-brand-gold mb-2" />
                <span className="text-[10px] uppercase font-bold text-brand-text">Quality<br />Craftsmanship</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Heart size={24} className="text-brand-gold mb-2" />
                <span className="text-[10px] uppercase font-bold text-brand-text">Ethically<br />Sourced</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck size={24} className="text-brand-gold mb-2" />
                <span className="text-[10px] uppercase font-bold text-brand-text">100%<br />Transparency</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center py-16 text-center space-y-8">
            <div>
              <h2 className="text-3xl font-serif text-brand-text tracking-tight mb-2">Exchange Program</h2>
              <p className="text-sm text-brand-text/50 dark:text-brand-text/70">Trusted by 2.8M+ families</p>
            </div>

            <Link href="/exchange" className="w-full sm:w-auto px-8 py-3 border border-[#8B2332]/30 rounded-full text-[10px] uppercase tracking-widest font-bold text-brand-text hover:bg-brand-bg transition-colors flex items-center justify-center space-x-2">
              <span>Explore Now</span>
              <ArrowRight size={12} />
            </Link>

            <div className="w-full flex items-center justify-center space-x-4">
              <div className="h-px w-full max-w-50 bg-brand-text/10"></div>
              <p className="text-xs text-brand-text/40 dark:text-brand-text/60 italic">Trust us to be part of your precious moments and to deliver jewellery that you&apos;ll cherish forever.</p>
              <div className="h-px w-full max-w-50 bg-brand-text/10"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-12 mt-8">
              {[
                { icon: RotateCcw, title: 'Luxury Jewelry Exchange' },
                { icon: Diamond, title: 'The Purity Guarantee' },
                { icon: ShieldCheck, title: 'Complete Transparency and Trust' },
                { icon: Store, title: 'Lifetime Maintenance' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center max-w-30">
                  <item.icon size={32} className="text-brand-gold mb-4" strokeWidth={1.5} />
                  <span className="text-[10px] uppercase font-bold text-brand-text leading-tight">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. GIFTING & OLD GOLD */}
      <section className="py-16 bg-white dark:bg-brand-accent transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-square md:aspect-auto md:h-100 rounded-[40px] overflow-hidden bg-[#FAF9F6] dark:bg-[#12100e] group p-12 flex flex-col justify-center border border-brand-gold/50 shadow-sm">
            <div className="space-y-6 relative z-10">
              <div className="w-16 h-16 border border-brand-gold rounded-full flex items-center justify-center mb-6 bg-brand-gold/10">
                <Diamond size={24} className="text-brand-gold" />
              </div>
              <h3 className="text-4xl font-serif text-brand-text dark:text-white max-w-62.5 leading-tight">Sell Your Old Gold</h3>
              <p className="text-brand-text/60 dark:text-white/60 text-xs leading-relaxed max-w-62.5">Turn your unused gold into instant value with our transparent in-store valuation process.</p>
              <p className="text-[9px] uppercase tracking-widest font-bold text-[#8B2332] dark:text-[#e08686]">* Flagship Branch Only</p>
              <Link href="/exchange?tab=sell" className="w-full sm:w-max px-6 py-3 border border-brand-gold bg-brand-gold text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#B38B36] transition-all flex items-center justify-center space-x-2">
                <span>Book Valuation</span>
                <ArrowRight size={10} />
              </Link>
            </div>
            {/* Background decorative element */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
              <RotateCcw size={200} />
            </div>
          </div>

          <div className="relative aspect-square md:aspect-auto md:h-100 rounded-[40px] overflow-hidden bg-[#FFFBF0] dark:bg-brand-bg group p-12 flex flex-col justify-center border border-brand-gold dark:border-brand-border/10 shadow-sm">
            <div className="space-y-6">
              <div className="w-16 h-16 border border-brand-gold rounded-t-full flex items-center justify-center mb-6 bg-white dark:bg-black/20">
                <RotateCcw size={24} className="text-brand-gold" />
              </div>
              <h3 className="text-4xl font-serif text-brand-text max-w-62.5 leading-tight">Exchange your Old Gold for 100% Value!</h3>
              <p className="text-brand-text/60 dark:text-brand-text/80 text-xs leading-relaxed max-w-62.5">Unlock full value for your old gold today with our <span className="font-bold text-brand-text">Exchange Program!</span></p>
              <Link href="/exchange" className="w-full sm:w-max px-6 py-3 border border-brand-gold bg-brand-gold text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#B38B36] transition-all flex items-center justify-center space-x-2">
                <span>Know more</span>
                <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. LUXURY JEWELRY EXPERIENCE */}
      <section className="py-8 sm:py-16 bg-white dark:bg-brand-accent border-t border-brand-gold/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-left mb-8 sm:mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Luxury Jewelry Experience</h2>
            <div className="w-16 h-px bg-brand-gold mb-2"></div>
            <p className="text-[10px] sm:text-xs text-brand-text/60 dark:text-brand-text/80 uppercase tracking-widest">Find a Boutique or Book a Consultation</p>
          </div>
          {/* Luxury Jewelry Experience Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6">
            {[
              { img: '/images/site/visit_store.png', text: 'VISIT OUR STORE', hidden: true },
              { img: '/images/site/book_appointment.png', text: 'BOOK AN APPOINTMENT', link: '/contact' },
              { img: '/images/site/talk_expert.png', text: 'TALK TO AN EXPERT', hidden: true },
              { img: '/images/site/digi_gold.png', text: 'DIGI GOLD', link: '/digi-gold', hidden: true },
              { img: '/images/site/blogs.png', text: 'BLOGS', link: '/blog' },
              { img: '/images/site/jewellery_guide.png', text: 'JEWELLERY GUIDE', hidden: true }
            ].filter(store => !store.hidden).map((store, i) => {
              const CardContent = (
                <>
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={store.img}
                      alt={store.text}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 text-center border border-brand-gold rounded-b-[40px]">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-text group-hover:text-brand-gold transition-colors">{store.text}</h4>
                  </div>
                </>
              );

              if (store.link) {
                return (
                  <Link
                    href={store.link}
                    key={i}
                    className="group cursor-pointer bg-white dark:bg-brand-white border border-brand-gold/10 flex flex-col rounded-[40px] overflow-hidden shadow-soft hover:shadow-premium transition-all"
                  >
                    {CardContent}
                  </Link>
                );
              }

              return (
                <div
                  key={i}
                  className="group bg-white dark:bg-brand-white border border-brand-gold/10 flex flex-col rounded-[40px] overflow-hidden shadow-soft transition-all"
                >
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
