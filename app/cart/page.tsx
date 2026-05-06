'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Section } from '@/components/new-ui/Section';
import { Button } from '@/components/new-ui/Button';

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevent hydration mismatch

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="bg-brand-bg min-h-screen pt-40 pb-20">
        <Section className="flex flex-col items-center justify-center text-center space-y-8 mt-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="w-24 h-24 rounded-full bg-white shadow-soft flex items-center justify-center text-brand-gold/30 mb-4 border border-brand-text/5">
            <ShoppingBag size={40} />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-brand-text">Your Cart is Empty</h1>
          <p className="text-brand-text/50 uppercase tracking-widest text-sm max-w-md">
            Looks like you haven't added anything to your cart yet. Discover our luxury collections.
          </p>
          <Link href="/">
            <Button size="lg" className="mt-8 shadow-premium">
              Continue Shopping
            </Button>
          </Link>
        </Section>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg min-h-screen pt-40 pb-20">
      <Section>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* Left: Cart Items */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between border-b border-brand-text/10 pb-6">
              <h1 className="text-4xl font-serif text-brand-text">Your Selection</h1>
              <button 
                onClick={clearCart}
                className="text-[10px] uppercase tracking-widest font-bold text-brand-text/40 hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-6">
              {items.map((item) => (
                <div key={item._id} className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-white rounded-[40px] border border-brand-text/5 shadow-soft group transition-all hover:shadow-premium">
                  
                  {/* Item Image */}
                  <div className="relative w-full sm:w-32 aspect-square rounded-[25px] overflow-hidden bg-brand-bg border border-brand-text/5">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover p-2 transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl md:text-2xl font-serif text-brand-text pr-4 leading-tight">{item.name}</h3>
                      <button 
                        onClick={() => removeItem(item._id)}
                        className="text-brand-text/20 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <p className="text-lg text-brand-gold font-bold tracking-widest font-serif italic">
                      $ {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-4 pt-2">
                      <div className="flex items-center bg-brand-bg rounded-full border border-brand-text/5 p-1">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-brand-text/60 hover:text-brand-text transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-brand-text">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-brand-text/60 hover:text-brand-text transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[450px]">
            <div className="bg-white rounded-[50px] p-10 md:p-12 border border-brand-text/5 shadow-premium sticky top-32">
              <h2 className="text-2xl font-serif text-brand-text mb-10">Order Summary</h2>
              
              <div className="space-y-6 text-sm text-brand-text/70 mb-10 border-b border-brand-text/5 pb-10">
                <div className="flex justify-between">
                  <span className="uppercase tracking-widest text-[11px] font-bold">Subtotal</span>
                  <span className="font-bold text-brand-text">$ {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase tracking-widest text-[11px] font-bold">Shipping</span>
                  <span className="font-bold text-brand-gold uppercase text-[10px] tracking-widest italic">Complimentary</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-10">
                <span className="text-sm font-bold text-brand-text uppercase tracking-widest">Total</span>
                <span className="text-3xl font-serif text-brand-text italic">$ {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <Button size="lg" className="w-full !py-6 shadow-soft flex items-center justify-center space-x-3 text-sm">
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </Button>

              <div className="mt-8 text-center space-y-2">
                <p className="text-[9px] uppercase tracking-[0.2em] text-brand-text/40 font-bold">Taxes and customs calculated at checkout</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-brand-text/30">Secure Encrypted Payment</p>
              </div>
            </div>
          </div>

        </div>
      </Section>
    </div>
  );
}
