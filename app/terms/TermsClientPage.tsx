'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Scale, ScrollText, Gem, Diamond, Award, Truck, CreditCard } from 'lucide-react';

export default function TermsClientPage() {
  return (
    <div className="min-h-screen bg-[#FDF9F6] dark:bg-brand-bg pb-24 pt-32 transition-colors">
      <div className="max-w-250 mx-auto px-6 md:px-12">
        
        {/* HERO HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center space-x-3 text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold mb-6">
            <span className="w-12 h-px bg-brand-gold/30"></span>
            <span>Legal & Information</span>
            <span className="w-12 h-px bg-brand-gold/30"></span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-8">Terms & Guidelines</h1>
          <p className="text-brand-text/60 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our products, certification standards, and policies to ensure a secure and confident shopping experience at Luxury Jewelry.
          </p>
        </motion.div>

        {/* CONTENT SECTIONS */}
        <div className="space-y-24">
          
          {/* 1. TERMS & CONDITIONS */}
          <section className="scroll-mt-32" id="terms">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-text text-white flex items-center justify-center shadow-soft">
                <ScrollText size={24} />
              </div>
              <h2 className="text-3xl font-serif text-brand-text">Terms & Conditions</h2>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-8 md:p-12 border border-brand-text/5 dark:border-zinc-800 shadow-premium space-y-8 text-brand-text/80 leading-relaxed transition-colors">
              <p className="font-bold text-brand-text">All the terms and conditions mention here will be applicable on the buyer at the time of buying any type of product from example.com</p>
              
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-brand-text">Use of the website</h3>
                <p>The customer agrees and acknowledge that this website can be used only by individual who are 18 year and above. Minor are not eligible to use this website and buy any product. At the time of purchase, seller will consider buyer age is 18 year and above.</p>
                <p>By using example.com, you are eligible to buy any product at the given price only. Seller reserves all the rights to terminate Customer’s access, refuse to deliver the product in case of conflict and refund the money after deducting all expenditure bear by seller during the sale-purchase agreement between seller and buyer.</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-serif text-xl text-brand-text">Trademarks</h3>
                <p>All the trademarks and logo appear on the website are registered. Any individual, company or any other firm can’t use the trademark, logo, name of website and information given on this website without written permission. If they do so, they will be liable for the penalty.</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-serif text-xl text-brand-text">Warranties & Pricing</h3>
                <p>Through representing products, their information and selling them to the customer not bound seller and his product in any kind of warranty and guarantees towards customer.</p>
                <p>Products Price given on the website are calculated using precious metal and gem prices in the market to provide you the best value. Price of example.com can change without notice due to precious metal and gems market fluctuation.</p>
              </div>

              <div className="p-6 bg-brand-bg dark:bg-zinc-950 rounded-3xl border border-brand-text/5 dark:border-zinc-800 italic text-sm transition-colors">
                &ldquo;example.com owner will not be liable and responsible for any loss, damage, personal injury of buyer and third party, whatsoever is the cause.&rdquo;
              </div>
            </div>
          </section>

          {/* 2. JEWELLERY GUIDE */}
          <section className="scroll-mt-32" id="guide">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold text-white flex items-center justify-center shadow-soft">
                <Gem size={24} />
              </div>
              <h2 className="text-3xl font-serif text-brand-text">Jewellery Guide</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-8 border border-brand-text/5 dark:border-zinc-800 shadow-premium space-y-6 transition-colors">
                <h3 className="text-2xl font-serif text-[#8B1D2F]">Gold Jewellery Guide</h3>
                <div className="space-y-4 text-sm text-brand-text/70">
                  <p><strong className="text-brand-text">Trustworthy Seller:</strong> We are a trustworthy seller with 50 years of experience in the market and sell right product with accurate quality at right price.</p>
                  <p><strong className="text-brand-text">Purity Standards:</strong> All our gold jewellery are BIS hallmarked approved, matching all standards recommended by the government.</p>
                  <p><strong className="text-brand-text">Investment:</strong> Buying Gold Jewellery is an investment because it easily liquidates and provides a good rate of return.</p>
                </div>
              </div>

              <div className="bg-[#3A1C16] rounded-[40px] p-8 text-[#EAE1D5] shadow-premium space-y-6">
                <h3 className="text-2xl font-serif text-brand-gold">Diamond Jewellery Guide</h3>
                <div className="space-y-4 text-sm text-[#EAE1D5]/70">
                  <p><strong className="text-white">Carat Weight:</strong> Slight differences in carat may not impact appearance but significantly impact price.</p>
                  <p><strong className="text-white">Types:</strong> We offer Natural Diamonds, Treated Diamonds, and modern Manmade Diamonds to suit all fashion needs and budgets.</p>
                  <p><strong className="text-white">Solitaire Budget:</strong> With us, you will be able to buy reasonable rate diamonds for solitaire jewellery based on 4C grading.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. CERTIFICATION GUIDE */}
          <section className="scroll-mt-32" id="certification">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#8B1D2F] text-white flex items-center justify-center shadow-soft">
                <Award size={24} />
              </div>
              <h2 className="text-3xl font-serif text-brand-text">Certification Guide</h2>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-10 border border-brand-text/5 dark:border-zinc-800 shadow-premium space-y-8 text-brand-text/80 transition-colors">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <h3 className="font-serif text-xl text-brand-text flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center text-xs font-bold">1</span>
                    BIS Hallmark
                  </h3>
                  <p className="text-sm">BIS Hallmark is a symbol of gold purity. We recommend buying hallmarked jewellery only. All our jewellery carries the BIS triangle mark and purity grade (e.g., 916 for 22K).</p>
                </div>
                <div className="flex-1 space-y-4">
                  <h3 className="font-serif text-xl text-brand-text flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center text-xs font-bold">2</span>
                    IGI Certification
                  </h3>
                  <p className="text-sm">The International Gemologist Institute provides authenticated certification for gems and diamonds. An IGI report discloses the carat, color, shape, and cut of your solitaire.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. CARE GUIDE */}
          <section className="scroll-mt-32" id="care">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#1B3A36] text-white flex items-center justify-center shadow-soft">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-3xl font-serif text-brand-text">Jewellery Care Guide</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Gemstones", icon: Gem, items: ["Clean with soft cloth", "Avoid high pressure", "Store in fabric lining", "Remove during gardening"] },
                { title: "Gold", icon: ScrollText, items: ["Clean with soap solution", "Avoid sprays/cosmetics", "Don't sleep with jewellery", "Use soft toothbrush"] },
                { title: "Diamonds", icon: Diamond, items: ["Store in jewellery box", "Avoid hair sprays/lotions", "Touch gently", "Professional cleaning only"] }
              ].map((care, i) => {
                const CareIcon = care.icon;
                return (
                  <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-4xl border border-brand-text/5 dark:border-zinc-800 hover:border-brand-gold/30 transition-all group">
                    <CareIcon size={32} className="text-brand-gold mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="font-serif text-lg text-brand-text mb-4">{care.title}</h3>
                    <ul className="space-y-3">
                      {care.items.map((item, j) => (
                        <li key={j} className="text-[11px] text-brand-text/60 flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-brand-gold mt-1.5 shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. POLICIES TABLE */}
          <section className="scroll-mt-32" id="policies">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-text text-white flex items-center justify-center shadow-soft">
                <Scale size={24} />
              </div>
              <h2 className="text-3xl font-serif text-brand-text">Lifetime Policies</h2>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-[40px] overflow-hidden border border-brand-text/5 dark:border-zinc-800 shadow-premium transition-colors">
              <div className="p-8 border-b border-brand-text/5 dark:border-zinc-800 bg-[#FDF9F6]/50 dark:bg-zinc-950/50">
                <p className="text-sm text-brand-text/70 italic">Luxury Jewelry offers 100% gold exchange value with a strict 0% deduction policy for upgrades. Buy backs are calculated at prevailing market rates after standard processing fees.</p>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-text text-white uppercase text-[10px] tracking-widest font-bold">
                    <th className="py-5 px-8">Category</th>
                    <th className="py-5 px-8">Exchange Value</th>
                    <th className="py-5 px-8">Buy Back Value</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-brand-text/80">
                  <tr className="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                    <td className="py-6 px-8 font-serif text-lg">Diamond</td>
                    <td className="py-6 px-8">100% of diamond value</td>
                    <td className="py-6 px-8 text-[#8B1D2F] font-bold">90% of diamond value</td>
                  </tr>
                  <tr className="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                    <td className="py-6 px-8 font-serif text-lg">Gold Jewellery</td>
                    <td className="py-6 px-8">100% of gold value</td>
                    <td className="py-6 px-8 text-[#8B1D2F] font-bold">95% of gold value</td>
                  </tr>
                  <tr className="hover:bg-brand-gold/5 transition-colors">
                    <td className="py-6 px-8 font-serif text-lg">Coins</td>
                    <td className="py-6 px-8">100% of gold value</td>
                    <td className="py-6 px-8 text-[#8B1D2F] font-bold">100% of gold value</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 6. LOGISTICS & PAYMENT */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#3A1C16] p-10 rounded-[40px] text-[#EAE1D5] space-y-6">
              <Truck size={32} className="text-brand-gold" />
              <h3 className="text-2xl font-serif">Delivery Duration</h3>
              <p className="text-sm text-[#EAE1D5]/70 leading-relaxed">
                We provide free delivery all over India. Shipping takes 24-48hrs for “Available in stocks” and 2 weeks for custom-made deliveries.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] border border-brand-text/5 dark:border-zinc-800 shadow-premium space-y-6 transition-colors">
              <CreditCard size={32} className="text-brand-gold" />
              <h3 className="text-2xl font-serif text-brand-text">Payment Policy</h3>
              <p className="text-sm text-brand-text/60 leading-relaxed">
                Luxury Jewelry encourages online payment and provides a secure, hassle-free payment gateway. We do not provide Cash on Delivery (COD) for security reasons.
              </p>
            </div>
          </section>

          {/* 7. CONTACT US FOOTER */}
          <section className="bg-brand-text rounded-[50px] p-12 md:p-16 text-center text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-8">
              <h3 className="text-4xl font-serif">Customer Delight</h3>
              <p className="text-white/60 max-w-xl mx-auto italic">&ldquo;Our goal is customer satisfaction, not just profit. You can trust in our 50 years of expertise.&rdquo;</p>
              <div className="flex flex-col items-center space-y-4">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Get in touch with Customer Support</span>
                <a href="tel:9999999999" className="text-3xl font-serif hover:text-brand-gold transition-colors tracking-widest">99999 99999</a>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-120"></div>
          </section>

        </div>
      </div>
    </div>
  );
}
