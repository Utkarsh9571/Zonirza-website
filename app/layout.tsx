import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

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
        
        {/* NEW TANISHQ-INSPIRED DARK FOOTER */}
        <footer className="bg-[#3A1C16] text-[#EAE1D5] pt-20 pb-10 mt-10 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12 border-b border-[#EAE1D5]/10 pb-12">
              
              {/* 1. App Download & Brand (Left Column) */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                <div className="font-serif text-4xl tracking-widest text-[#EAE1D5] mb-2">
                  Zoniraz
                </div>
                <p className="text-xs text-[#EAE1D5]/90 font-light tracking-wide">
                  Download the Zoniraz App Now
                </p>
                <div className="flex flex-col items-center md:items-start space-y-4">
                  <div className="w-32 h-32 bg-white rounded-xl p-2 shadow-xl overflow-hidden border border-white/20">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://zoniraz.com" alt="QR Code" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="bg-transparent border border-[#EAE1D5]/30 rounded px-3 py-1.5 text-[8px] uppercase tracking-widest hover:bg-[#EAE1D5]/10 transition-colors flex items-center space-x-1">
                      <Image src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" width={60} height={20} alt="Play Store" className="invert grayscale brightness-200" />
                    </button>
                    <button className="bg-transparent border border-[#EAE1D5]/30 rounded px-3 py-1.5 text-[8px] uppercase tracking-widest hover:bg-[#EAE1D5]/10 transition-colors flex items-center space-x-1">
                      <Image src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" width={60} height={20} alt="App Store" className="invert grayscale brightness-200" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Useful Links */}
              <div className="pl-0 lg:pl-12">
                <h4 className="font-serif text-lg mb-6 text-[#EAE1D5]">Useful Links</h4>
                <ul className="space-y-3 text-xs font-light text-[#EAE1D5]/70">
                  <li><Link href="/delivery" className="hover:text-white transition-colors">Delivery Information</Link></li>
                  <li><Link href="/international" className="hover:text-white transition-colors">International Shipping</Link></li>
                  <li><Link href="/payment" className="hover:text-white transition-colors">Payment Options</Link></li>
                  <li><Link href="/track" className="hover:text-white transition-colors">Track your Order</Link></li>
                  <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
                  <li><Link href="/find-store" className="hover:text-white transition-colors">Find a Store</Link></li>
                </ul>
              </div>

              {/* 3. Information */}
              <div>
                <h4 className="font-serif text-lg mb-6 text-[#EAE1D5]">Information</h4>
                <ul className="space-y-3 text-xs font-light text-[#EAE1D5]/70">
                  <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="/offers" className="hover:text-white transition-colors">Offers & Contest Details</Link></li>
                  <li><Link href="/help" className="hover:text-white transition-colors">Help & FAQs</Link></li>
                  <li><Link href="/about" className="hover:text-white transition-colors">About Zoniraz</Link></li>
                </ul>
              </div>

              {/* 4. Contact Us */}
              <div>
                <h4 className="font-serif text-lg mb-6 text-[#EAE1D5]">Contact Us</h4>
                <div className="space-y-6 text-xs font-light text-[#EAE1D5]/70">
                  <div className="space-y-1">
                    <p className="flex items-center space-x-2"><Phone size={14} className="text-[#EAE1D5]" /> <span>1800-266-0123</span></p>
                  </div>
                  <div className="space-y-3">
                    <p className="font-serif text-lg text-[#EAE1D5]">Chat With Us</p>
                    <div className="flex items-center space-x-4">
                      <Link href="#" className="hover:text-white transition-colors border border-[#EAE1D5]/30 rounded-full p-2"><Mail size={16} /></Link>
                      <Link href="#" className="hover:text-white transition-colors border border-[#EAE1D5]/30 rounded-full p-2"><Phone size={16} /></Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* BOTTOM SECTION: Social & Legal */}
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-4 border-b border-[#EAE1D5]/10 pb-6">
                <span className="font-serif text-[#EAE1D5]">Social</span>
                <Link href="#" className="w-6 h-6 rounded-full border border-[#EAE1D5]/30 flex items-center justify-center hover:bg-white/10 transition-colors text-[10px] font-bold">in</Link>
                <Link href="#" className="w-6 h-6 rounded-full border border-[#EAE1D5]/30 flex items-center justify-center hover:bg-white/10 transition-colors text-[10px] font-bold">X</Link>
                <Link href="#" className="w-6 h-6 rounded-full border border-[#EAE1D5]/30 flex items-center justify-center hover:bg-white/10 transition-colors text-[10px] font-bold">f</Link>
                <Link href="#" className="w-6 h-6 rounded-full border border-[#EAE1D5]/30 flex items-center justify-center hover:bg-white/10 transition-colors text-[10px] font-bold">yt</Link>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center text-[9px] font-light text-[#EAE1D5]/50 space-y-4 md:space-y-0">
                <span>© 2026 Zoniraz Limited. All Rights Reserved.</span>
                <div className="flex space-x-4">
                  <Link href="/security" className="hover:text-white transition-colors">Cyber Security Policy</Link>
                  <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
                  <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                  <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
                </div>
              </div>
            </div>

          </div>
        </footer>

      </body>
    </html>
  );
}
