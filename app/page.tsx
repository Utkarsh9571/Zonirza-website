'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PLACEHOLDER_IMAGE, getValidImageUrl } from '@/lib/constants';
import { IProduct } from '@/models/Product';
import { ArrowRight, Star, ShieldCheck, Diamond, Heart, CheckCircle2, Video, Store, Gift, RotateCcw } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';
import StylingVideoSlider from '@/components/StylingVideoSlider';
import { resolveProductImage } from '@/lib/imageResolver';
import { useAuthModalStore } from '@/store/authModalStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { displayPrice } from '@/lib/currency';

const resolveSliderImage = (imageName: string) => `/images/images/slider/${imageName}`;
const resolveContentImage = (imageName: string) => `/images/images/imgcontent/${imageName}`;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Home() {
  const [data, setData] = useState<{products: any[], categories: any[]}>({ products: [], categories: [] });
  const { openAuthModal } = useAuthModalStore();
  const { currentCurrency, rates } = useCurrencyStore();

  useEffect(() => {
    async function fetchData() {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`${API_URL}/api/products?limit=20`),
          fetch(`${API_URL}/api/categories`)
        ]);

        const products = pRes.ok ? (await pRes.json()).data : [];
        const categories = cRes.ok ? (await cRes.json()).data : [];

        setData({ products, categories });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);

  const { products, categories } = data;

  return (
    <div className="flex flex-col bg-brand-bg text-brand-text min-h-screen overflow-x-hidden transition-colors duration-500">

      {/* 1. HERO SECTION */}
      <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center p-4 md:p-6 lg:p-8 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/hero-bg.jpg"
            alt="Luxury Jewelry Background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 w-full h-full hero-glass rounded-[30px] md:rounded-[50px] overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-16 lg:p-24 pt-24 md:pt-32 lg:pt-32 animate-in fade-in zoom-in duration-1000">
          {/* Removed light gradient overlay */}
          
          <div className="flex-1 flex flex-col items-start justify-center space-y-12 max-w-2xl">
            <div className="space-y-4">
              <h1 className="text-7xl md:text-[110px] font-serif text-white leading-[0.85] tracking-tighter">
                Our Luxury <br /> Collections
              </h1>
            </div>

            <button 
              onClick={openAuthModal}
              className="flex items-center space-x-4 group bg-transparent border-none outline-none p-0"
            >
              <div className="bg-brand-text dark:bg-brand-gold text-brand-bg dark:text-white px-12 py-5 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-brand-gold hover:text-white transition-all shadow-none cursor-pointer">
                Let's Get Started
              </div>
              <div className="w-14 h-14 rounded-full bg-brand-text dark:bg-brand-gold text-brand-bg dark:text-white flex items-center justify-center shadow-none group-hover:bg-brand-gold group-hover:text-white transition-all cursor-pointer">
                <ArrowRight size={20} />
              </div>
            </button>

            <div className="space-y-4 pt-6 border-l-2 border-brand-gold pl-8">
              <p className="text-white text-xs uppercase tracking-[0.4em] font-bold italic opacity-80">
                # Zoniraz Jewelry Store
              </p>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm font-medium">
                Discover the artistry of fine jewellery at Zoniraz. From timeless diamond necklaces to contemporary gold collections, our pieces are crafted to celebrate your most precious moments.
              </p>
            </div>
          </div>

          <div className="relative flex-1 flex flex-col items-center justify-center w-full mt-12 md:mt-8 min-h-[200px] md:min-h-0">
            <HeroSlider />
          </div>
        </div>
      </section>

      {/* 2. SHOP BY COLLECTION */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-center mb-8 sm:mb-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight transition-colors">Shop by Collection</h2>
            <div className="w-16 h-[1px] bg-brand-gold mx-auto"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-2/3 relative aspect-[4/5] md:aspect-auto md:h-[500px] rounded-[40px] overflow-hidden group shadow-soft">
              <Image
                src="/images/site/wedding.png"
                alt="Bridal Collection"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                className="object-cover transition-transform duration-[3s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-text/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white space-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Signature</p>
                <h3 className="text-3xl font-serif">Bridal Collection</h3>
                <Link href="/products?collection=bridal" className="inline-flex items-center space-x-2 text-sm uppercase tracking-widest font-bold hover:text-brand-gold transition-colors pt-2">
                  <span>Explore</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/3 grid grid-cols-2 gap-4">
              <div className="relative w-full aspect-[4/5] rounded-[40px] overflow-hidden group shadow-soft">
                <Image
                  src="/images/site/daily-wear.png"
                  alt="Everyday Wear"
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-[3s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-text/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <h3 className="text-xl sm:text-2xl font-serif">Everyday Wear</h3>
                  <Link href="/products?collection=everyday-luxury" className="inline-flex items-center space-x-2 text-[8px] sm:text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors pt-1">
                    <span>Explore</span> <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
              <div className="relative w-full aspect-[4/5] rounded-[40px] overflow-hidden group shadow-soft">
                <Image
                  src="/images/images/product/default-16345643112830.jpg"
                  alt="Men's Edit"
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-[3s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-text/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <h3 className="text-xl sm:text-2xl font-serif">Office Wear</h3>
                  <Link href="/products?collection=office-wear" className="inline-flex items-center space-x-2 text-[8px] sm:text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors pt-1">
                    <span>Explore</span> <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
              
              <div className="relative w-full aspect-[4/5] rounded-[40px] overflow-hidden group shadow-soft">
                <Image
                  src="/images/images/product/rose-gold-16017058153130.jpg"
                  alt="Solitaire Dream"
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-[3s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-text/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <h3 className="text-xl sm:text-2xl font-serif">Solitaire Dream</h3>
                  <Link href="/products?collection=solitaire" className="inline-flex items-center space-x-2 text-[8px] sm:text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors pt-1">
                    <span>Explore</span> <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
              <div className="relative w-full aspect-[4/5] rounded-[40px] overflow-hidden group shadow-soft">
                <Image
                  src="/images/images/product/yellow-gold-16010271191566.jpg"
                  alt="Heritage Gold"
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-[3s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-text/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <h3 className="text-xl sm:text-2xl font-serif">Heritage Gold</h3>
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
          <div className="text-center mb-8 sm:mb-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Find Your Perfect Match</h2>
            <div className="w-16 h-[1px] bg-brand-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.slice(0, 8).map((cat: any, i: number) => (
              <Link href={`/products?category=${cat.slug}`} key={i} className="group flex flex-col items-center text-center space-y-4">
                <div className="relative w-full aspect-[4/5] rounded-[40px] overflow-hidden shadow-soft border border-brand-gold/10 bg-brand-bg group-hover:shadow-premium transition-all">
                  <Image
                    src={resolveProductImage(cat.image)}
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
          <div className="text-center mb-8 sm:mb-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Trending Now</h2>
            <div className="w-16 h-[1px] bg-brand-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[
              { title: 'The Solitaire Promise', img: '/images/images/product/rose-gold-16010347432265.jpg', query: 'collection=solitaire' },
              { title: 'Vintage Heirloom', img: '/images/images/product/yellow-gold-16010959532807.jpg', query: 'collection=heritage' },
              { title: 'Modern Minimalism', img: '/images/images/product/default-16345640053092.jpg', query: 'collection=minimal' }
            ].map((trend, i) => (
              <Link href={`/products?${trend.query}`} key={i} className="group relative aspect-[3/4] rounded-[40px] overflow-hidden shadow-soft cursor-pointer block">
                <Image src={trend.img} alt={trend.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-text/90 via-transparent to-transparent"></div>
                <h3 className="absolute bottom-6 w-full text-center text-white font-serif text-xl px-4">{trend.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ZONIRAZ WORLD */}
      <section className="py-8 sm:py-12 bg-white dark:bg-brand-accent transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Zoniraz World</h2>
            <div className="w-16 h-[1px] bg-brand-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[500px]">
            <div className="grid grid-rows-2 gap-4 h-full">
              <Link href="/products?tag=featured" className="relative rounded-[40px] overflow-hidden shadow-soft group block">
                <Image src="/images/images/product/rose-gold-16017081121080.jpg" alt="Featured World" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform group-hover:scale-105 duration-1000" />
              </Link>
              <Link href="/products?collection=heritage" className="relative rounded-[40px] overflow-hidden shadow-soft group block">
                <Image src="/images/images/product/yellow-gold-16010972111558.jpg" alt="Heritage World" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform group-hover:scale-105 duration-1000" />
              </Link>
            </div>
            <Link href="/products?collection=heritage" className="relative rounded-[40px] overflow-hidden shadow-soft group h-full min-h-[400px] block">
              <Image src="/images/images/product/default-16345651242469.jpg" alt="Heritage World" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform group-hover:scale-105 duration-1000" />
              <div className="absolute inset-0 bg-brand-text/20 flex flex-col items-center justify-center text-center p-8">
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
              <p className="text-white/80 text-[10px] sm:text-xs leading-relaxed max-w-[250px]">
                New Arrivals Dropping Daily, Monday through Friday. Explore the Latest Launches Now!
              </p>
              <Link href="/products?sort=newest" className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold hover:text-brand-gold transition-colors pt-4">
                <span>Shop All New</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-2 p-4 gap-4">
              {products.slice(0, 2).map((prod: any, i: number) => (
                <Link href={`/product/${prod.slug}`} key={i} className="flex-1 bg-white dark:bg-[#1a1614] border-[6px] border-white dark:border-brand-border/10 rounded-[40px] shadow-md relative group aspect-[4/5] overflow-hidden cursor-pointer block">
                  <Image src={resolveProductImage(prod.images?.[0])} alt={prod.name} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm px-3 py-1 text-[10px] text-white tracking-widest uppercase">
                    {prod.name} | {displayPrice(prod.basePrice || prod.price || 0, currentCurrency, rates)}
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
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Curated For You</h2>
            <p className="text-[10px] sm:text-sm text-brand-text/60 dark:text-brand-text/80 uppercase tracking-widest">Shop By Gender</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[
              { img: '/images/images/product/rose-gold-16023305023103.jpg', text: 'Women Jewellery', href: '/products?gender=women' },
              { img: '/images/images/product/default-16345643113729.jpg', text: 'Men Jewellery', href: '/products?gender=men' },
              { img: '/images/images/product/default-16345665363640.jpg', text: 'Kids Jewellery', href: '/products?gender=kids' }
            ].map((store, i) => (
              <Link href={store.href} key={i} className="group cursor-pointer flex flex-col items-center">
                <div className="relative w-full aspect-[4/5] rounded-[40px] overflow-hidden mb-4 shadow-soft hover:shadow-premium transition-all">
                <Image src={store.img} alt={store.text} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text/70 group-hover:text-brand-gold transition-colors">{store.text}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. STYLING 101 */}
      <section className="py-16 bg-white dark:bg-brand-accent overflow-hidden flex flex-col items-center transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 text-center mb-12 sm:mb-16 space-y-2 w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Styling 101 With Diamonds</h2>
          <p className="text-[10px] sm:text-sm text-brand-text/60 uppercase tracking-widest">Trendsetting diamond jewellery suited for every occasion</p>
        </div>

        <div className="w-full relative">
          <StylingVideoSlider />
        </div>
      </section>

      {/* 9. ZONIRAZ ASSURANCE */}
      <section className="py-16 bg-white dark:bg-brand-accent border-y border-brand-gold/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between py-8 border-b border-brand-gold/10 gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Zoniraz <span className="text-[#8B2332]">Assurance</span></h2>
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

            <button className="w-full sm:w-auto px-8 py-3 border border-[#8B2332]/30 rounded-full text-[10px] uppercase tracking-widest font-bold text-brand-text hover:bg-brand-bg transition-colors flex items-center justify-center space-x-2">
              <span>Explore Now</span>
              <ArrowRight size={12} />
            </button>

            <div className="w-full flex items-center justify-center space-x-4">
              <div className="h-[1px] w-full max-w-[200px] bg-brand-text/10"></div>
              <p className="text-xs text-brand-text/40 dark:text-brand-text/60 italic">Trust us to be part of your precious moments and to deliver jewellery that you'll cherish forever.</p>
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
      <section className="py-16 bg-white dark:bg-brand-accent transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-square md:aspect-auto md:h-[400px] rounded-[40px] overflow-hidden bg-[#F6EDEB] group p-10 flex flex-col items-center justify-center text-center">
            <div className="absolute top-0 bottom-0 left-12 w-8 bg-[#8B2332]"></div>
            <div className="absolute left-0 right-0 bottom-12 h-8 bg-[#8B2332]"></div>
            <div className="absolute left-12 bottom-12 w-12 h-12 bg-[#701C28] rounded-full transform -translate-x-2 translate-y-2"></div>

            <div className="relative z-10 space-y-4 sm:ml-12 sm:mb-12 bg-white/80 backdrop-blur-sm p-6 rounded-[40px] w-full max-w-[280px]">
              <h3 className="text-2xl sm:text-4xl font-serif text-[#8B2332]">#GiftOfChoice</h3>
              <p className="text-brand-text/70 text-[10px] sm:text-xs leading-relaxed max-w-[200px] mx-auto">Breathtaking gifts for your loved one's</p>
              <p className="text-[#8B2332] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Starting at $10,000</p>
              <button className="w-full mt-4 px-6 py-2 border border-[#8B2332]/20 bg-white rounded-full text-[10px] uppercase tracking-widest font-bold text-brand-text hover:bg-[#8B2332] hover:text-white transition-all flex items-center justify-center space-x-2">
                <span>Explore Now</span>
                <ArrowRight size={10} />
              </button>
            </div>
          </div>

          <div className="relative aspect-square md:aspect-auto md:h-[400px] rounded-[40px] overflow-hidden bg-[#FFFBF0] dark:bg-brand-bg group p-12 flex flex-col justify-center border-[12px] border-white dark:border-brand-border/10 shadow-sm">
            <div className="space-y-6">
              <div className="w-16 h-16 border border-brand-gold rounded-t-full flex items-center justify-center mb-6">
                <RotateCcw size={24} className="text-brand-gold" />
              </div>
              <h3 className="text-4xl font-serif text-brand-text max-w-[250px] leading-tight">Exchange your Old Gold for 100% Value!</h3>
              <p className="text-brand-text/60 dark:text-brand-text/80 text-xs leading-relaxed max-w-[250px]">Unlock full value for your old gold today with our <span className="font-bold text-brand-text">Exchange Program!</span></p>
              <button className="w-full sm:w-max px-6 py-3 border border-brand-gold bg-white rounded-full text-[10px] uppercase tracking-widest font-bold text-brand-text hover:bg-brand-gold hover:text-white transition-all flex items-center justify-center space-x-2">
                <span>Know more</span>
                <ArrowRight size={10} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. ZONIRAZ EXPERIENCE */}
      <section className="py-8 sm:py-16 bg-white dark:bg-brand-accent border-t border-brand-gold/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-center mb-8 sm:mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-text tracking-tight">Zoniraz Experience</h2>
            <p className="text-[10px] sm:text-sm text-brand-text/60 dark:text-brand-text/80 uppercase tracking-widest">Find a Boutique or Book a Consultation</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[
              { img: '/images/site/visit_store.png', text: 'VISIT OUR STORE' },
              { img: '/images/site/book_appointment.png', text: 'BOOK AN APPOINTMENT' },
              { img: '/images/site/talk_expert.png', text: 'TALK TO AN EXPERT' },
              { img: '/images/site/digi_gold.png', text: 'DIGI GOLD' },
              { img: '/images/site/blogs.png', text: 'BLOGS' },
              { img: '/images/site/jewellery_guide.png', text: 'JEWELLERY GUIDE' }
            ].map((store, i) => (
              <div key={i} className="group cursor-pointer bg-white dark:bg-brand-white border border-brand-gold/10 flex flex-col rounded-[40px] overflow-hidden shadow-soft hover:shadow-premium transition-all">
                <div className="relative aspect-square overflow-hidden">
                  <Image src={store.img} alt={store.text} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
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
