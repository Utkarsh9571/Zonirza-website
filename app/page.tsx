import Image from 'next/image';
import Link from 'next/link';
import { IProduct } from '@/models/Product';
import { ICategory } from '@/models/Category';
import { Play, ArrowRight, Star, Truck, Award, Package, Diamond, Heart, Share2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getData() {
  const [pRes, cRes] = await Promise.all([
    fetch(`${API_URL}/api/products`, { next: { revalidate: 60 } }),
    fetch(`${API_URL}/api/categories`, { next: { revalidate: 60 } })
  ]);
  
  const products = pRes.ok ? (await pRes.json()).data : [];
  const categories = cRes.ok ? (await cRes.json()).data : [];
  
  return { products, categories };
}

export default async function Home() {
  let { products, categories } = await getData();

  // Fallback for UI demonstration
  if (categories.length === 0) {
    categories = [
      { name: 'Ring', slug: 'ring', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e' },
      { name: 'Necklace', slug: 'necklace', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f' },
      { name: 'Bracelet', slug: 'bracelet', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a' }
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


      {/* 1. HERO SECTION */}
      <section className="relative h-screen min-h-[900px] w-full flex items-center justify-center p-6 md:p-12 overflow-hidden">
        {/* Background Image */}
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
        
        {/* Main Glass Container */}
        <div className="relative z-10 w-full max-w-[1400px] h-full max-h-[800px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[60px] shadow-premium overflow-hidden flex flex-col md:flex-row items-center justify-between p-12 md:p-24 animate-in fade-in zoom-in duration-1000">
          
          {/* Left Content */}
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

          {/* Right Floating Elements */}
          <div className="relative flex flex-col items-end space-y-16 mt-20 md:mt-0">
            {/* Happy Clients Pill */}
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

            {/* Detail Horizontal Card */}
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


      {/* 2. FEATURE ROW - Trust Badges */}
      <section className="py-36 bg-brand-accent/15">
        <div className="section-container !max-w-[1500px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-20 lg:gap-y-0">
            {[
              { icon: Truck, title: 'Free Shipping', sub: 'On all orders above $500' },
              { icon: Diamond, title: 'Exclusive Design', sub: 'Handcrafted by masters' },
              { icon: Package, title: 'Good Packaging', sub: 'Eco-friendly luxury' },
              { icon: Award, title: 'Highest Quality', sub: 'BIS Hallmarked Purity' },
            ].map((item, i) => (
              <div key={i} className={`flex flex-col items-center text-center px-12 lg:px-16 ${i < 3 ? 'lg:border-r border-brand-text/5' : ''}`}>
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-10 shadow-soft text-brand-gold group hover:scale-110 transition-transform duration-500">
                  <item.icon size={30} strokeWidth={1.5} />
                </div>
                <h4 className="text-base uppercase tracking-[0.3em] font-medium text-[#332D29] mb-4">{item.title}</h4>
                <p className="text-[#6B6B65] text-sm leading-relaxed max-w-[220px] font-medium">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SPLIT FEATURE SECTION - Radiant Refinement */}
      <section className="py-48 bg-[#FAF9F6]">
        <div className="section-container !max-w-[1600px]">
          <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-40">
            {/* Left Image - Massive & Dominant */}
            <div className="relative w-full lg:w-[45%] aspect-[4/5] rounded-[80px] overflow-hidden shadow-premium group animate-in fade-in slide-in-from-left-12 duration-1000">
              <Image src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200" alt="Style" fill className="object-cover transition-transform duration-[3s] group-hover:scale-110" />
              <div className="absolute top-10 left-10 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center space-x-3 shadow-soft">
                <div className="flex text-brand-gold">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <span className="text-xs font-bold text-brand-text tracking-widest">(5/5)</span>
              </div>
            </div>

            {/* Middle Text Content - Spacious & Elegant */}
            <div className="w-full lg:w-1/3 space-y-14">
              <h2 className="text-6xl md:text-[85px] font-serif text-[#332D29] leading-[0.95] tracking-tighter">
                The Art Of Radiant Refinement
              </h2>
              <p className="text-[#6B6B65] text-lg md:text-xl leading-relaxed max-w-md italic">
                Discover a world where every piece tells a story of elegance and superior craftsmanship. Our collections are designed for those who appreciate the finer details of life.
              </p>
              <button className="btn-outline !px-16 !py-7 rounded-full text-[11px] uppercase tracking-[0.4em] font-bold shadow-soft hover:bg-[#332D29] hover:text-white transition-all">
                Learn More
              </button>
            </div>

            {/* Right Small Image - Balanced */}
            <div className="hidden lg:block lg:w-1/4">
              <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-premium group animate-in fade-in slide-in-from-right-12 duration-1000 delay-500">
                 <Image 
                    src={products[2]?.images[0] || "https://images.unsplash.com/photo-1605100804763-247f67b3557e"} 
                    alt="Product Detail" 
                    fill 
                    className="object-cover transition-transform duration-[3s] group-hover:scale-110" 
                 />
                 <div className="absolute inset-0 bg-brand-text/5 group-hover:opacity-0 transition-opacity"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BRAND STORY SECTION */}
      <section className="py-48 bg-white overflow-hidden">
        <div className="section-container !max-w-[1500px]">
          <div className="flex flex-col lg:flex-row gap-24 lg:gap-40 items-center">
            {/* Left Image - Workshop/Atmospheric */}
            <div className="relative w-full lg:w-1/2 aspect-[4/3] rounded-[60px] overflow-hidden shadow-premium group">
              <Image 
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1200" 
                alt="Our Workshop" 
                fill 
                className="object-cover transition-transform duration-[4s] group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-[#332D29]/5"></div>
            </div>

            {/* Right Content */}
            <div className="w-full lg:w-1/2 space-y-12 animate-in fade-in slide-in-from-right-12 duration-1000">
              <div className="space-y-6">
                <p className="text-brand-gold text-xs uppercase tracking-[0.5em] font-bold">Heritage & Craft</p>
                <h2 className="text-6xl md:text-[90px] font-serif text-[#332D29] leading-[1] tracking-tighter">
                  Our Craft, <br /> Our Story
                </h2>
              </div>
              <p className="text-[#6B6B65] text-xl md:text-2xl leading-relaxed max-w-xl italic font-medium">
                For over three decades, Zoniraz has been a sanctuary of timeless elegance. Every piece is a testament to the master artisans who pour their soul into the gold and diamonds, preserving the ancient traditions of jewelry making while embracing the silhouettes of the modern world.
              </p>
              <div className="pt-6">
                <div className="w-24 h-[1px] bg-brand-gold/40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 5. COLLECTION SECTION */}
      <section className="py-48 bg-[#FDFBF7] rounded-[100px] mx-6 md:mx-12">
        <div className="section-container !max-w-[1500px]">
          <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-start">
            <div className="lg:w-1/4 space-y-12">
              <h2 className="text-6xl md:text-[85px] font-serif text-brand-text leading-[1.1] italic">Our Collection</h2>
              <p className="text-brand-text/50 text-base md:text-lg leading-relaxed max-w-sm uppercase tracking-widest">
                Explore our curated edit of timeless jewelry, meticulously crafted in the heart of our workshops.
              </p>
              <button className="btn-outline !px-14 !py-6 text-[11px] uppercase tracking-[0.4em] font-bold shadow-soft hover:shadow-premium transition-all">
                See More
              </button>
            </div>

            <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              {products.slice(0, 3).map((product: IProduct) => (
                <Link href={`/product/${product.slug}`} key={product.slug} className="group block">
                  <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[60px] shadow-soft transition-all duration-700 group-hover:shadow-premium group-hover:bg-white group-hover:-translate-y-5 border border-white/50">
                    <div className="relative aspect-[1/1] rounded-[45px] overflow-hidden mb-10 shadow-inner">
                      <Image 
                        src={product.images[0]} 
                        alt={product.name} 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                      />
                      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white text-brand-text flex items-center justify-center shadow-soft opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                        <Package size={18} />
                      </div>
                    </div>
                    <div className="space-y-4 px-2">
                      <h3 className="text-brand-text font-serif text-2xl md:text-3xl leading-tight">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-brand-gold text-sm font-bold tracking-[0.2em] uppercase opacity-80">
                          $ {product.specs instanceof Map ? product.specs.get('price') : (product.specs as any).price || '240.00'}
                        </p>
                        <div className="w-8 h-[1px] bg-brand-gold/30"></div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. MEDIA / VIDEO SECTION - Refined Choose Type */}
      <section className="py-80 bg-[#F5F1EB]">
        <div className="section-container !max-w-[1600px]">
          <div className="flex flex-col lg:flex-row gap-40 lg:gap-52 items-center">
            {/* Left Video Block - Increased Scale & Rounded Corners */}
            <div className="relative w-full lg:w-[65%] h-[600px] md:h-[800px] rounded-[150px] overflow-hidden group shadow-premium animate-in fade-in slide-in-from-left-12 duration-1000">
              <Image 
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1600" 
                alt="Brand Story" 
                fill 
                className="object-cover transition-transform duration-[3s] group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-brand-text/5 transition-opacity group-hover:opacity-0"></div>
              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white flex items-center justify-center text-brand-text shadow-premium transition-all hover:scale-110 active:scale-95 group/play">
                <Play size={40} fill="currentColor" className="ml-2 group-hover/play:text-brand-gold transition-colors" />
              </button>
            </div>

            {/* Right Category Selector - Spacious Content */}
            <div className="w-full lg:w-[35%] space-y-20 animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
              <div className="space-y-10">
                <h2 className="text-7xl md:text-[100px] font-serif text-[#332D29] leading-[0.85] tracking-tighter">
                  Choose The Type!
                </h2>
                <p className="text-[#6B6B65] text-xl md:text-2xl leading-relaxed max-w-lg">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                </p>
              </div>
              
              <div className="flex items-center space-x-16">
                {categories.slice(0, 3).map((cat: ICategory) => (
                  <Link href={`/category/${cat.slug}`} key={cat.slug} className="group flex flex-col items-center space-y-8">
                    <div className="w-56 h-80 rounded-[110px] overflow-hidden border border-white/50 bg-[#f9f7f4] shadow-xl p-2 transition-all duration-700 group-hover:shadow-premium group-hover:-translate-y-6">
                      <div className="w-full h-[55%] relative rounded-[90px] overflow-hidden bg-brand-accent mt-3 mx-auto w-[92%] flex items-center justify-center">
                        <Image 
                          src={cat.image} 
                          alt={cat.name} 
                          fill 
                          className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                      </div>
                      <div className="flex flex-col items-center justify-center h-[45%] space-y-4">
                        <span className="text-sm md:text-base uppercase tracking-[0.4em] font-bold text-[#6B6B65] group-hover:text-brand-gold transition-colors">{cat.name}</span>
                        <div className="w-10 h-10 rounded-full border border-brand-text/10 flex items-center justify-center mx-auto transition-all group-hover:border-brand-gold group-hover:bg-brand-gold group-hover:text-white">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 7. TESTIMONIAL SECTION */}
      <section className="py-48 bg-brand-accent/20">
        <div className="section-container !max-w-[1500px] text-center">
          <h2 className="text-6xl md:text-7xl font-serif text-[#332D29] italic mb-24">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                name: "Sarah Mitchell",
                role: "Verified Buyer",
                text: "The craftsmanship is simply unparalleled. My engagement ring is a masterpiece that I'll cherish forever.",
                avatar: "https://i.pravatar.cc/150?u=sarah"
              },
              {
                name: "James Wilson",
                role: "Luxury Enthusiast",
                text: "Exceptional service and exquisite designs. The attention to detail in every piece is truly remarkable.",
                avatar: "https://i.pravatar.cc/150?u=james"
              },
              {
                name: "Elena Rodriguez",
                role: "Collector",
                text: "Zoniraz jewelry isn't just an accessory; it's a statement of elegance. I'm absolutely in love with my necklace.",
                avatar: "https://i.pravatar.cc/150?u=elena"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-12 rounded-[60px] shadow-soft border border-white/50 text-left space-y-8 flex flex-col justify-between transition-all duration-500 hover:shadow-premium hover:-translate-y-4 group">
                <div className="space-y-6">
                  <div className="flex text-brand-gold gap-1">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-[#6B6B65] text-lg md:text-xl leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                </div>
                
                <div className="flex items-center gap-6 pt-8 border-t border-brand-text/5">
                  <div className="w-14 h-14 rounded-full overflow-hidden shadow-soft transition-transform group-hover:scale-110">
                    <Image src={testimonial.avatar} alt={testimonial.name} width={56} height={56} className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#332D29] font-bold tracking-tight">{testimonial.name}</span>
                    <span className="text-[#6B6B65] text-xs uppercase tracking-widest">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 8. CALL‑TO‑ACTION SECTION */}
      <section className="py-48 bg-[#F5F1EB]">
        <div className="section-container !max-w-[1500px] text-center">
          <h2 className="text-6xl md:text-[90px] font-serif text-[#332D29] mb-12">Find Your Signature Piece</h2>
          <button className="px-12 py-6 rounded-full bg-brand-gold text-white font-medium text-[18px] uppercase tracking-wider hover:bg-brand-gold/80 transition-colors shadow-soft hover:shadow-premium">
            Shop Now
          </button>
        </div>
      </section>

      <section className="py-24 border-t border-brand-text/5 bg-brand-accent/20">
        <div className="section-container">
          <div className="flex flex-wrap justify-between items-center gap-12 opacity-30 grayscale mix-blend-multiply">
            {['logoipsum', 'logoipsum', 'logoipsum', 'logoipsum', 'logoipsum'].map((logo, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-brand-text rounded-md rotate-45"></div>
                <span className="text-2xl font-bold tracking-tighter">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
