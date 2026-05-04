import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zoniraz Jewellery | Timeless Elegance",
  description: "Exquisite jewelry collections crafted for timeless beauty.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">{children}</main>
        {/* Premium Footer */}
        <footer className="bg-[#F5F1EB] text-[#332D29] pt-20 pb-10 border-t border-[#EAE1D5]">
          <div className="section-container !max-w-[1500px]">
            {/* TOP SECTION: 5 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
              
              {/* 1. Brand Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#332D29] text-white flex items-center justify-center shrink-0">
                    <span className="text-xl font-serif">Z</span>
                  </div>
                  <span className="font-serif text-2xl tracking-wide">Zoniraz</span>
                </div>
                <p className="text-sm text-[#6B6B65] leading-relaxed">
                  Crafting timeless elegance and preserving heritage through exquisite fine jewelry since 1994.
                </p>
              </div>

              {/* 2. Shop Categories */}
              <div>
                <h4 className="font-medium text-sm uppercase tracking-widest mb-6">Shop</h4>
                <ul className="space-y-4 text-sm text-[#6B6B65]">
                  <li><Link href="/category/ring" className="hover:text-brand-gold transition-colors">Rings</Link></li>
                  <li><Link href="/category/earring" className="hover:text-brand-gold transition-colors">Earrings</Link></li>
                  <li><Link href="/category/pendant" className="hover:text-brand-gold transition-colors">Pendants</Link></li>
                  <li><Link href="/category/necklace" className="hover:text-brand-gold transition-colors">Necklaces</Link></li>
                </ul>
              </div>

              {/* 3. Company */}
              <div>
                <h4 className="font-medium text-sm uppercase tracking-widest mb-6">Company</h4>
                <ul className="space-y-4 text-sm text-[#6B6B65]">
                  <li><Link href="/about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact</Link></li>
                  <li><Link href="/collections" className="hover:text-brand-gold transition-colors">Our Collections</Link></li>
                </ul>
              </div>

              {/* 4. Policies */}
              <div>
                <h4 className="font-medium text-sm uppercase tracking-widest mb-6">Policies</h4>
                <ul className="space-y-4 text-sm text-[#6B6B65]">
                  <li><Link href="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/shipping" className="hover:text-brand-gold transition-colors">Shipping Policy</Link></li>
                  <li><Link href="/refunds" className="hover:text-brand-gold transition-colors">Refund Policy</Link></li>
                </ul>
              </div>

              {/* 5. Newsletter */}
              <div className="lg:col-span-1">
                <h4 className="font-medium text-sm uppercase tracking-widest mb-6">Newsletter</h4>
                <p className="text-sm text-[#6B6B65] mb-4 leading-relaxed">
                  Subscribe to receive updates on new collections and special offers.
                </p>
                <form className="flex flex-col space-y-3" action="#">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full bg-transparent border-b border-[#C1B7A9] py-2 text-sm text-[#332D29] placeholder-[#6B6B65] focus:outline-none focus:border-[#332D29] transition-colors"
                  />
                  <button 
                    type="submit" 
                    className="self-start text-xs font-medium uppercase tracking-widest text-[#332D29] hover:text-brand-gold transition-colors mt-2"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

            </div>

            {/* BOTTOM SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#EAE1D5] gap-6">
              
              {/* Copyright */}
              <p className="text-xs text-[#6B6B65] uppercase tracking-wider order-3 md:order-1">
                © {new Date().getFullYear()} Zoniraz Jewellery. All rights reserved.
              </p>

              {/* Payment Icons */}
              <div className="flex items-center space-x-4 order-2 text-[#6B6B65]">
                 <div className="w-10 h-6 border border-[#EAE1D5] rounded flex items-center justify-center text-[10px] font-bold">VISA</div>
                 <div className="w-10 h-6 border border-[#EAE1D5] rounded flex items-center justify-center text-[10px] font-bold">MC</div>
                 <div className="w-10 h-6 border border-[#EAE1D5] rounded flex items-center justify-center text-[10px] font-bold">AMEX</div>
                 <div className="w-10 h-6 border border-[#EAE1D5] rounded flex items-center justify-center text-[10px] font-bold">PAYTM</div>
              </div>

              {/* Social Icons */}
              <div className="flex items-center space-x-6 order-1 md:order-3 text-sm">
                <a href="#" className="text-[#332D29] hover:text-brand-gold transition-colors font-medium">Instagram</a>
                <a href="#" className="text-[#332D29] hover:text-brand-gold transition-colors font-medium">Pinterest</a>
                <a href="#" className="text-[#332D29] hover:text-brand-gold transition-colors font-medium">Facebook</a>
              </div>

            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
