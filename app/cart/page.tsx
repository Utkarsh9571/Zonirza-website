'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthModalStore } from '@/store/authModalStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, MapPin, Gift, ChevronRight, Info } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Section } from '@/components/new-ui/Section';
import { Button } from '@/components/new-ui/Button';
import { resolveProductImage } from '@/lib/imageResolver';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { AssuranceCards } from '@/components/checkout/AssuranceCards';
import { QuantityChoiceModal } from '@/components/cart/QuantityChoiceModal';
import { cn } from '@/lib/utils';
import { useCurrencyStore } from '@/store/currencyStore';
import { displayPrice } from '@/lib/currency';

export default function CartPage() {
  const { status } = useSession();
  const openAuthModal = useAuthModalStore((state: any) => state.openAuthModal);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getTotal, 
    pincode, 
    setPincode, 
    giftMessage, 
    setGiftMessage 
  } = useCartStore();
  const { currentCurrency, rates } = useCurrencyStore();

  const [pincodeInput, setPincodeInput] = useState(pincode);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<null | 'success' | 'error'>(pincode ? 'success' : null);
  const [showGiftInput, setShowGiftInput] = useState(!!giftMessage);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<{ id: string, name: string, slug: string } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const total = getTotal();

  const handlePincodeCheck = () => {
    if (!pincodeInput || pincodeInput.length < 6) return;
    setIsCheckingPincode(true);
    // Simulate API call
    setTimeout(() => {
      setIsCheckingPincode(false);
      setDeliveryStatus('success');
      setPincode(pincodeInput);
    }, 800);
  };

  const handleProceedToCheckout = () => {
    if (status !== 'authenticated') {
      openAuthModal();
      return;
    }
    router.push('/checkout/shipping');
  };

  const handleQuantityIncrease = (cartItemId: string, name: string, slug: string) => {
    setPendingItem({ id: cartItemId, name, slug });
    setModalOpen(true);
  };

  const handleModalSelect = (choice: 'duplicate' | 'new') => {
    if (!pendingItem) return;

    if (choice === 'duplicate') {
      const item = items.find(i => i.cartItemId === pendingItem.id);
      if (item) {
        updateQuantity(pendingItem.id, item.quantity + 1, 'duplicate');
      }
    } else {
      // Configure separately: redirect back to product page with prefilled options
      router.push(`/product/${pendingItem.slug}`);
    }
    setModalOpen(false);
    setPendingItem(null);
  };

  if (items.length === 0) {
    return (
      <div className="bg-brand-bg text-brand-text min-h-screen pt-40 pb-20 transition-colors duration-500">
        <Section className="flex flex-col items-center justify-center text-center space-y-8 mt-20">
          <div className="w-24 h-24 rounded-full bg-white dark:bg-brand-white shadow-soft flex items-center justify-center text-brand-gold/30 mb-4 border border-brand-text/5 transition-colors">
            <ShoppingBag size={40} />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-brand-text">Your Selection is Empty</h1>
          <p className="text-brand-text/50 dark:text-brand-text/70 uppercase tracking-widest text-sm max-w-md">
            Discover our latest masterpieces and start your luxury collection.
          </p>
          <Link href="/products">
            <Button size="lg" className="mt-8 shadow-premium">
              Shop Collections
            </Button>
          </Link>
        </Section>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen pt-24 pb-32 transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Step Indicator */}
        <CheckoutSteps currentStep="cart" />

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Side: Delivery & Items */}
          <div className="flex-1 space-y-10 animate-in fade-in slide-in-from-left duration-1000">
            
            {/* 1. Delivery Check Section */}
            <div className="bg-white dark:bg-brand-white rounded-[40px] p-8 md:p-10 border border-brand-text/5 shadow-soft space-y-6 transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-bg dark:bg-brand-bg flex items-center justify-center text-brand-gold transition-colors">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text">Check Delivery Availability</h2>
                  <p className="text-[10px] text-brand-text/40 dark:text-brand-text/60 uppercase tracking-wider">Enter your pincode for estimated delivery</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter Pincode (e.g. 301001)"
                    className="w-full h-16 bg-brand-bg/50 dark:bg-brand-bg border border-brand-text/5 dark:border-white/5 rounded-2xl px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all dark:text-brand-text/90"
                  />
                  {deliveryStatus === 'success' && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">Available</span>
                  )}
                </div>
                <button 
                  onClick={handlePincodeCheck}
                  disabled={isCheckingPincode || pincodeInput.length < 6}
                  className="h-16 px-10 bg-brand-text dark:bg-brand-gold text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-brand-gold dark:hover:bg-white dark:hover:text-brand-text transition-all disabled:opacity-50"
                >
                  {isCheckingPincode ? 'Checking...' : 'Check'}
                </button>
              </div>

              {deliveryStatus === 'success' && (
                <div className="pt-4 flex items-center space-x-3 text-brand-text/60 animate-in fade-in duration-500">
                  <Info size={16} />
                  <p className="text-[11px] font-medium tracking-wide">Expected delivery by <span className="font-bold text-brand-text">Tuesday, 12th May</span></p>
                </div>
              )}
            </div>

            {/* 2. Cart Items */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-xl font-serif text-brand-text">Your Selection ({items.length})</h3>
                <button onClick={clearCart} className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-text/30 dark:text-brand-text/60 hover:text-red-500 transition-colors">Clear All</button>
              </div>

              {items.map((item) => (
                <div key={item.cartItemId} className="flex flex-col md:flex-row gap-8 p-8 bg-white dark:bg-brand-white rounded-[45px] border border-brand-text/5 shadow-soft hover:shadow-premium transition-all duration-700 group relative">
                  {/* Image */}
                  <div className="w-full md:w-40 aspect-square rounded-[30px] overflow-hidden bg-brand-bg dark:bg-brand-bg/50 border border-brand-text/5 relative transition-colors">
                    <Image 
                      src={resolveProductImage(item.image)} 
                      alt={item.name} 
                      fill 
                      className="object-cover p-3 group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="text-xl md:text-2xl font-serif text-brand-text">{item.name}</h4>
                          <div className="flex flex-wrap gap-2 pt-2">
                            <span className="px-3 py-1.5 rounded-full bg-brand-bg dark:bg-brand-bg/50 text-brand-text/60 dark:text-brand-text/80 text-[9px] font-bold uppercase tracking-widest border border-brand-text/5 dark:border-white/5 transition-colors">
                              {item.configuration.purity} {item.configuration.metal}
                            </span>
                            {item.configuration.size && (
                              <span className="px-3 py-1.5 rounded-full bg-brand-bg dark:bg-brand-bg/50 text-brand-text/60 dark:text-brand-text/80 text-[9px] font-bold uppercase tracking-widest border border-brand-text/5 dark:border-white/5 transition-colors">
                                Size: {item.configuration.size}
                              </span>
                            )}
                            <span className="px-3 py-1.5 rounded-full bg-brand-bg dark:bg-brand-bg/50 text-brand-text/60 dark:text-brand-text/80 text-[9px] font-bold uppercase tracking-widest border border-brand-text/5 dark:border-white/5 transition-colors">
                              {item.estimatedWeight}g
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeItem(item.cartItemId)}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-text/5 dark:border-white/5 pt-6 transition-colors">
                      <div className="flex items-center bg-brand-bg dark:bg-brand-bg/50 rounded-full border border-brand-text/5 dark:border-white/5 p-1.5 transition-colors">
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-brand-white shadow-sm text-brand-text/40 dark:text-brand-text/60 hover:text-brand-text dark:hover:text-brand-gold transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-12 text-center text-sm font-bold text-brand-text">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityIncrease(item.cartItemId, item.name, item.slug)}
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-brand-white shadow-sm text-brand-text/40 dark:text-brand-text/60 hover:text-brand-text dark:hover:text-brand-gold transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-2xl font-serif text-brand-gold italic">{displayPrice(item.price, currentCurrency, rates)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 3. Gift Message Section */}
            <div className="bg-white dark:bg-brand-white rounded-[40px] p-8 md:p-10 border border-brand-text/5 shadow-soft space-y-6 transition-colors">
              <button 
                onClick={() => setShowGiftInput(!showGiftInput)}
                className="flex items-center justify-between w-full group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-brand-bg dark:bg-brand-bg flex items-center justify-center text-brand-gold transition-colors">
                    <Gift size={24} />
                  </div>
                  <div className="text-left">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text">Add a Gift Message</h2>
                    <p className="text-[10px] text-brand-text/40 dark:text-brand-text/60 uppercase tracking-wider">Send a personalized note with your gift</p>
                  </div>
                </div>
                <div className={cn("transition-transform duration-300", showGiftInput ? "rotate-90" : "")}>
                  <ChevronRight size={20} className="text-brand-text/20 group-hover:text-brand-text" />
                </div>
              </button>

              {showGiftInput && (
                <div className="animate-in slide-in-from-top-4 duration-500 pt-4">
                  <textarea 
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Write your beautiful message here..."
                    className="w-full h-32 bg-brand-bg/50 dark:bg-brand-bg border border-brand-text/5 dark:border-white/5 rounded-[25px] p-6 text-sm font-medium tracking-wide focus:outline-none focus:border-brand-gold/30 transition-all resize-none dark:text-brand-text/90"
                  />
                </div>
              )}
            </div>

            {/* Assurance Cards */}
            <AssuranceCards />

          </div>

          {/* Right Side: Order Summary */}
          <div className="w-full lg:w-[480px]">
            <div className="bg-white dark:bg-brand-white rounded-[50px] p-10 md:p-12 border border-brand-text/5 shadow-premium sticky top-32 space-y-10 animate-in fade-in slide-in-from-right duration-1000 transition-colors">
              <h2 className="text-2xl font-serif text-brand-text dark:text-brand-text/90 text-center">Order Summary</h2>
              
              <div className="space-y-6 border-b border-brand-text/5 pb-10">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-brand-text/40 dark:text-brand-text/60">Subtotal ({items.length} Items)</span>
                  <span className="text-lg font-serif text-brand-text">{displayPrice(total, currentCurrency, rates)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-brand-text/40 dark:text-brand-text/60">Delivery Charges</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-full transition-colors">Complimentary</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-brand-text/40">Packaging & Insurance</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-text/20">₹ 0</span>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-brand-text">Amount Payable</span>
                    <p className="text-[9px] text-brand-text/30 dark:text-brand-text/60 uppercase tracking-[0.15em]">Inclusive of all taxes</p>
                  </div>
                  <span className="text-4xl font-serif text-brand-text italic">{displayPrice(total, currentCurrency, rates)}</span>
                </div>

                <Button 
                  size="lg" 
                  className="w-full !py-7 shadow-premium text-sm tracking-[0.2em]"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Shipping
                </Button>

                <div className="flex flex-col items-center space-y-4 pt-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-text/30 font-medium">Safe & Secure checkout experience</p>
                  <div className="flex items-center space-x-6 opacity-30">
                    {/* Placeholder Payment Icons */}
                    <div className="w-10 h-6 bg-brand-text/10 rounded-sm" />
                    <div className="w-10 h-6 bg-brand-text/10 rounded-sm" />
                    <div className="w-10 h-6 bg-brand-text/10 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Fixed Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-brand-bg/80 backdrop-blur-xl border-t border-brand-text/5 dark:border-white/5 p-6 lg:hidden flex items-center justify-between shadow-premium transition-colors">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40 dark:text-brand-text/60">Payable Amount</p>
          <p className="text-2xl font-serif text-brand-text dark:text-brand-text/90 font-bold">{displayPrice(total, currentCurrency, rates)}</p>
        </div>
        <Button 
          size="lg" 
          className="px-8 shadow-premium"
          onClick={handleProceedToCheckout}
        >
          Checkout
        </Button>
      </div>

      <QuantityChoiceModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleModalSelect}
        itemName={pendingItem?.name || ''}
      />
    </div>
  );
}
