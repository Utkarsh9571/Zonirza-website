'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, MapPin, Phone, User, Home, Briefcase, Trash2, CheckCircle2 } from 'lucide-react';
import { useCartStore, Address } from '@/store/cartStore';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { Button } from '@/components/new-ui/Button';
import { getValidImageUrl } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useCurrencyStore } from '@/store/currencyStore';
import { displayPrice } from '@/lib/currency';

export default function ShippingPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { 
    items, 
    getTotal, 
    savedAddresses, 
    addAddress, 
    removeAddress, 
    selectedAddressId, 
    selectAddress 
  } = useCartStore();
  const { currentCurrency, rates } = useCurrencyStore();

  const [showAddressForm, setShowAddressForm] = useState(savedAddresses.length === 0);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    type: 'Home'
  });

  useEffect(() => {
    setIsMounted(true);
    if (isMounted && items.length === 0) {
      router.push('/cart');
    }
  }, [isMounted, items.length, router]);

  if (!isMounted || items.length === 0) return null;

  const total = getTotal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress: Address = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
    };
    addAddress(newAddress);
    setShowAddressForm(false);
  };


  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-32">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Step Indicator */}
        <CheckoutSteps currentStep="shipping" />

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Side: Address Selection/Form */}
          <div className="flex-1 space-y-10 animate-in fade-in slide-in-from-left duration-1000">
            
            <div className="flex items-center justify-between">
              <button 
                onClick={() => router.push('/cart')}
                className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-text/40 hover:text-brand-text transition-colors"
              >
                <ChevronLeft size={16} />
                <span>Return to Cart</span>
              </button>
              <h2 className="text-2xl font-serif text-brand-text">Shipping Details</h2>
            </div>

            {/* Saved Addresses List */}
            {!showAddressForm && (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-text/40">Select Delivery Address</h3>
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:text-brand-text transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedAddresses.map((address) => (
                    <div 
                      key={address.id}
                      onClick={() => selectAddress(address.id)}
                      className={cn(
                        "relative p-8 rounded-[40px] border transition-all duration-500 cursor-pointer group",
                        selectedAddressId === address.id 
                          ? "bg-white border-brand-gold shadow-premium" 
                          : "bg-white/40 border-brand-text/5 hover:border-brand-text/10"
                      )}
                    >
                      {selectedAddressId === address.id && (
                        <div className="absolute top-6 right-6 text-brand-gold">
                          <CheckCircle2 size={24} />
                        </div>
                      )}

                      <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                            selectedAddressId === address.id ? "bg-brand-gold text-white" : "bg-brand-bg text-brand-text/40"
                          )}>
                            {address.type === 'Home' ? <Home size={18} /> : <Briefcase size={18} />}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-text/40">{address.type}</span>
                        </div>

                        <div className="space-y-2">
                          <p className="font-bold text-brand-text tracking-wide">{address.fullName}</p>
                          <p className="text-sm text-brand-text/60 leading-relaxed max-w-[200px]">
                            {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-[11px] font-bold text-brand-text/40 pt-2 flex items-center space-x-2">
                            <Phone size={12} />
                            <span>+91 {address.phone}</span>
                          </p>
                        </div>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAddress(address.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold uppercase tracking-widest text-red-500 hover:underline pt-4"
                        >
                          Remove Address
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address Form */}
            {showAddressForm && (
              <div className="bg-white rounded-[50px] p-10 md:p-12 border border-brand-text/5 shadow-soft">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-serif text-brand-text">Add New Delivery Address</h3>
                  {savedAddresses.length > 0 && (
                    <button 
                      onClick={() => setShowAddressForm(false)}
                      className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40 hover:text-brand-text transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40 ml-4">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-text/20" size={18} />
                        <input 
                          required
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full h-16 bg-brand-bg/50 border border-brand-text/5 rounded-2xl pl-16 pr-6 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-gold/30"
                          placeholder="Utkarsh Sharma"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40 ml-4">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-text/20" size={18} />
                        <input 
                          required
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full h-16 bg-brand-bg/50 border border-brand-text/5 rounded-2xl pl-16 pr-6 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-gold/30"
                          placeholder="9876543210"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40 ml-4">House No. / Building / Street</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-text/20" size={18} />
                      <input 
                        required
                        name="addressLine"
                        value={formData.addressLine}
                        onChange={handleInputChange}
                        className="w-full h-16 bg-brand-bg/50 border border-brand-text/5 rounded-2xl pl-16 pr-6 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-gold/30"
                        placeholder="D-524, 25 Budh vihar"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40 ml-4">City</label>
                      <input 
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full h-16 bg-brand-bg/50 border border-brand-text/5 rounded-2xl px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-gold/30"
                        placeholder="ALWAR"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40 ml-4">State</label>
                      <input 
                        required
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full h-16 bg-brand-bg/50 border border-brand-text/5 rounded-2xl px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-gold/30"
                        placeholder="RAJASTHAN"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40 ml-4">Pincode</label>
                      <input 
                        required
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full h-16 bg-brand-bg/50 border border-brand-text/5 rounded-2xl px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-gold/30"
                        placeholder="301001"
                      />
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40 ml-4">Address Type</label>
                    <div className="flex space-x-4">
                      {['Home', 'Office', 'Other'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, type: type as any }))}
                          className={cn(
                            "flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                            formData.type === type 
                              ? "bg-brand-text text-white border-brand-text" 
                              : "bg-transparent text-brand-text/40 border-brand-text/5 hover:border-brand-text/20"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full !py-7 mt-8 shadow-premium">
                    Save Address & Continue
                  </Button>
                </form>
              </div>
            )}

          </div>

          {/* Right Side: Order Summary */}
          <div className="w-full lg:w-[480px]">
            <div className="bg-white rounded-[50px] p-10 md:p-12 border border-brand-text/5 shadow-premium sticky top-32 space-y-10 animate-in fade-in slide-in-from-right duration-1000">
              <h2 className="text-2xl font-serif text-brand-text text-center">Order Summary</h2>
              
              <div className="space-y-6 border-b border-brand-text/5 pb-10">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex space-x-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-bg relative border border-brand-text/5">
                      <Image src={getValidImageUrl(item.image)} alt={item.name} fill className="object-cover p-1" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[11px] font-bold text-brand-text uppercase tracking-widest line-clamp-1">{item.name}</p>
                      <p className="text-[9px] text-brand-text/40 uppercase tracking-widest">{item.configuration.purity} | Size: {item.configuration.size}</p>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-[10px] font-bold text-brand-text/40">Qty: {item.quantity}</span>
                        <span className="text-xs font-serif text-brand-text font-bold">{displayPrice(item.price, currentCurrency, rates)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-brand-text">Amount Payable</span>
                  <span className="text-3xl font-serif text-brand-text italic">{displayPrice(total, currentCurrency, rates)}</span>
                </div>

                <Button 
                  size="lg" 
                  className="w-full !py-7 shadow-premium text-sm tracking-[0.2em]"
                  disabled={!selectedAddressId || showAddressForm}
                  onClick={() => router.push('/checkout/payment')}
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
