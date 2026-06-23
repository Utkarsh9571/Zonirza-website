'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  UserCircle, 
  MapPin, 
  Package, 
  LogOut, 
  Diamond, 
  Edit3, 
  Plus, 
  Loader2,
  Heart,
  X,
  MessageSquare,
  Ticket,
  ShieldCheck,
  Home,
  Briefcase
} from 'lucide-react';
import { Section } from '@/components/new-ui/Section';
import { Button } from '@/components/new-ui/Button';
import { cn } from '@/lib/utils';
import { useWishlistStore } from '@/store/wishlistStore';
import ProductCard from '@/components/ProductCard';
import { resolveProductImage } from '@/lib/imageResolver';

interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
  type: 'Home' | 'Office' | 'Other';
}

type OrderHistory = { _id: string; createdAt: string; orderStatus?: string; paymentStatus?: string; items: { name: string; image?: string; quantity: number }[] };
type UserQuote = { _id: string; createdAt: string; status: string; quotedPrice?: number; estimation?: { estimatedPriceMin: number; estimatedPriceMax: number }; complexity?: string; customizationNotes?: string; configuration: { metal: string; purity: string }; product?: { name?: string; images?: string[] } };
type WishlistProduct = { slug: string; name: string; basePrice: number; images?: string[] };
type Tab = { id: string; label: string; icon: React.ReactNode; href?: string; hidden?: boolean };

function AccountContent() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // UI State
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const wishlistItems = useWishlistStore(state => state.items);
  const [isMounted, setIsMounted] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Data State
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    gender: '',
    addresses: [] as Address[],
    wishlist: [] as string[],
    orderHistory: [] as OrderHistory[],
    quotes: [] as UserQuote[],
    recentlyViewed: [] as string[],
    preferences: {
      preferredMetal: '',
      preferredCategory: '',
      ringSize: '',
      preferredCurrency: ''
    }
  });
  
  const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>([]);

  const [addressForm, setAddressForm] = useState<Address>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    isDefault: false,
    type: 'Home'
  });

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      if (data.success) {
        setUserData({
          name: data.user.name || '',
          phone: data.user.phone || '',
          gender: data.user.gender || '',
          addresses: data.user.addresses || [],
          wishlist: data.user.wishlist || [],
          orderHistory: [], // Will be populated by next fetch
          quotes: [], // Will be populated by next fetch
          recentlyViewed: data.user.recentlyViewed || [],
          preferences: data.user.preferences || {
            preferredMetal: '',
            preferredCategory: '',
            ringSize: '',
            preferredCurrency: 'INR'
          }
        });

        // Also fetch orders
        const ordersRes = await fetch('/api/orders');
        const ordersData = await ordersRes.json();
        if (ordersData.success) {
          setUserData(prev => ({
            ...prev,
            orderHistory: ordersData.orders
          }));
        }

        const quotesRes = await fetch('/api/quotes');
        const quotesData = await quotesRes.json();
        if (quotesData.success) {
          setUserData(prev => ({
            ...prev,
            quotes: quotesData.quotes
          }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchUserProfile();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  const fetchWishlistDetails = async () => {
    try {
      // Create a search query for multiple slugs
      const res = await fetch(`/api/products?slugs=${wishlistItems.join(',')}`);
      const data = await res.json();
      if (data.success) {
        setWishlistProducts(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist details:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'wishlist' && wishlistItems.length > 0) {
      fetchWishlistDetails();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, wishlistItems]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
          gender: userData.gender,
          preferences: userData.preferences
        })
      });
      if (res.ok) {
        setIsEditingProfile(false);
        await update(); // Refresh session
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const newAddresses = [...userData.addresses];
    
    // If setting as default, unset others
    if (addressForm.isDefault) {
      newAddresses.forEach(addr => addr.isDefault = false);
    }

    if (editingAddressIndex !== null) {
      newAddresses[editingAddressIndex] = addressForm;
    } else {
      newAddresses.push(addressForm);
    }

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: newAddresses })
      });
      if (res.ok) {
        setUserData({ ...userData, addresses: newAddresses });
        setIsAddressModalOpen(false);
        setEditingAddressIndex(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeAddress = async (index: number) => {
    if (!confirm('Are you sure you want to remove this address?')) return;
    
    const newAddresses = userData.addresses.filter((_, i) => i !== index);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: newAddresses })
      });
      if (res.ok) {
        setUserData({ ...userData, addresses: newAddresses });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isMounted || status === 'loading') {
    return (
      <div className="bg-brand-bg text-brand-text min-h-screen pt-32 pb-20 flex items-center justify-center transition-colors duration-500">
        <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Personal Details', icon: <UserCircle size={18} /> },
    { id: 'orders', label: 'My Orders', icon: <Package size={18} /> },
    { id: 'rewards', label: 'My Rewards', icon: <Ticket size={18} />, href: '/account/rewards' },
    { id: 'savings', label: 'Savings Plans', icon: <ShieldCheck size={18} />, href: '/account/savings' },
    { id: 'digigold', label: 'Digi Gold', icon: <Diamond size={18} />, href: '/account/digi-gold', hidden: true },
    { id: 'quotes', label: 'My Consultations', icon: <MessageSquare size={18} /> },
    { id: 'wishlist', label: 'My Wishlist', icon: <Heart size={18} /> },
    { id: 'addresses', label: 'Saved Addresses', icon: <MapPin size={18} /> },
  ];

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen pt-32 pb-20 overflow-x-hidden transition-colors duration-500">
      <Section className="max-w-350 mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Sidebar */}
          <div className="w-full lg:w-87.5 space-y-6 animate-in fade-in slide-in-from-left duration-1000">
            <div className="bg-white dark:bg-brand-white rounded-[40px] p-6 md:p-8 border border-brand-text/5 shadow-soft space-y-8 transition-colors">
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-text dark:bg-brand-gold flex items-center justify-center text-white text-2xl md:text-3xl font-serif italic shadow-premium shrink-0 transition-colors">
                  {userData.name?.charAt(0) || session?.user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg md:text-xl font-serif text-brand-text truncate">{userData.name || 'Valued Guest'}</h1>
                  <p className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold">Zoniraz Member</p>
                </div>
              </div>

              <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0 scrollbar-hide">
                {(tabs as Tab[]).filter(tab => !tab.hidden).map((tab) => (
                  tab.href ? (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-brand-bg dark:hover:bg-brand-bg text-brand-text/60 dark:text-brand-text/80 w-auto lg:w-full transition-all whitespace-nowrap"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-brand-bg">
                        {tab.icon}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
                    </Link>
                  ) : (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center space-x-4 p-4 rounded-2xl transition-all whitespace-nowrap",
                        activeTab === tab.id 
                          ? "bg-brand-text dark:bg-brand-gold text-white shadow-premium w-auto lg:w-full" 
                          : "hover:bg-brand-bg dark:hover:bg-brand-bg text-brand-text/60 dark:text-brand-text/80 w-auto lg:w-full"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        activeTab === tab.id ? "bg-white/10" : "bg-brand-bg"
                      )}>
                        {tab.icon}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
                    </button>
                  )
                ))}
              </nav>

              <div className="pt-4 border-t border-brand-text/5">
                <button 
                  onClick={() => signOut()}
                  className="w-full flex items-center space-x-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-bold uppercase tracking-widest text-[10px]"
                >
                  <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                    <LogOut size={16} />
                  </div>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* Tab: Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl md:text-3xl font-serif text-brand-text">Personal Details</h2>
                  {!isEditingProfile && (
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:underline"
                    >
                      <Edit3 size={14} />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                <div className="bg-white dark:bg-brand-white rounded-[40px] p-8 md:p-12 border border-brand-text/5 shadow-soft transition-colors">
                  {isEditingProfile ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold ml-4">Full Name</label>
                          <input 
                            value={userData.name}
                            onChange={(e) => setUserData({...userData, name: e.target.value})}
                            className="w-full h-14 bg-brand-bg/50 dark:bg-brand-bg border border-brand-text/5 dark:border-white/5 rounded-2xl px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all dark:text-brand-text/90"
                            placeholder="Enter your name"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold ml-4">Phone Number</label>
                          <input 
                            value={userData.phone}
                            onChange={(e) => setUserData({...userData, phone: e.target.value})}
                            className="w-full h-14 bg-brand-bg/50 dark:bg-brand-bg border border-brand-text/5 dark:border-white/5 rounded-2xl px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all dark:text-brand-text/90"
                            placeholder="Enter phone"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold ml-4">Gender</label>
                          <select 
                            value={userData.gender}
                            onChange={(e) => setUserData({...userData, gender: e.target.value})}
                            className="w-full h-14 bg-brand-bg/50 dark:bg-brand-bg border border-brand-text/5 dark:border-white/5 rounded-2xl px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all appearance-none dark:text-brand-text/90"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold ml-4">Email Address</label>
                           <input 
                            disabled
                            value={session?.user?.email || ''}
                            className="w-full h-14 bg-brand-bg/20 border border-brand-text/5 rounded-2xl px-6 text-sm font-bold tracking-widest text-brand-text/30"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 pt-4">
                        <Button type="submit" disabled={isLoading} className="shadow-premium min-w-37.5">
                          {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
                        </Button>
                        <button 
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="text-[10px] uppercase tracking-widest font-bold text-brand-text/40 hover:text-brand-text"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                      <div className="space-y-2">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-brand-text/30 font-bold">Full Name</p>
                        <p className="text-sm font-bold text-brand-text tracking-wide">{userData.name || '—'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-brand-text/30 font-bold">Email Address</p>
                        <p className="text-sm font-bold text-brand-text tracking-wide">{session?.user?.email}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-brand-text/30 font-bold">Phone</p>
                        <p className="text-sm font-bold text-brand-text tracking-wide">{userData.phone || '—'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-brand-text/30 font-bold">Gender</p>
                        <p className="text-sm font-bold text-brand-text tracking-wide">{userData.gender || '—'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-brand-text/30 font-bold">Preferences</p>
                        <p className="text-sm font-bold text-brand-text dark:text-brand-text/90 tracking-wide">
                          {userData.preferences?.preferredMetal || 'No metal set'} | {userData.preferences?.ringSize ? `Size: ${userData.preferences.ringSize}` : 'No size set'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl md:text-3xl font-serif text-brand-text">Saved Addresses</h2>
                  <button 
                    onClick={() => {
                      setEditingAddressIndex(null);
                      setAddressForm({
                        fullName: userData.name,
                        phone: userData.phone,
                        addressLine1: '',
                        addressLine2: '',
                        city: '',
                        state: '',
                        country: 'India',
                        pincode: '',
                        isDefault: userData.addresses.length === 0,
                        type: 'Home'
                      });
                      setIsAddressModalOpen(true);
                    }}
                    className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:underline"
                  >
                    <Plus size={16} />
                    <span>Add New</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userData.addresses.map((addr, idx) => (
                    <div 
                      key={idx}
                      className={cn(
                        "bg-white dark:bg-brand-white rounded-[40px] p-8 border transition-all shadow-soft relative group",
                        addr.isDefault ? "border-brand-gold/40 shadow-premium ring-1 ring-brand-gold/10" : "border-brand-text/5 hover:border-brand-gold/20"
                      )}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          addr.isDefault ? "bg-brand-gold text-white" : "bg-brand-bg text-brand-text/40"
                        )}>
                          {addr.type === 'Home' ? <Home size={18} /> : addr.type === 'Office' ? <Briefcase size={18} /> : <MapPin size={18} />}
                        </div>
                        {addr.isDefault && (
                          <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-[8px] font-black uppercase tracking-[0.2em] rounded-full">Primary</span>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h4 className="text-[12px] font-bold uppercase tracking-widest text-brand-text">{addr.fullName}</h4>
                          <p className="text-[10px] font-medium text-brand-text/40">{addr.phone}</p>
                        </div>
                        <p className="text-[11px] text-brand-text/60 leading-relaxed min-h-10">
                          {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                      </div>

                      <div className="flex items-center space-x-4 pt-6 mt-6 border-t border-brand-text/5">
                        <button 
                          onClick={() => {
                            setEditingAddressIndex(idx);
                            setAddressForm({ ...addr });
                            setIsAddressModalOpen(true);
                          }}
                          className="text-[10px] uppercase tracking-widest font-bold text-brand-text/40 hover:text-brand-gold transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => removeAddress(idx)}
                          className="text-[10px] uppercase tracking-widest font-bold text-red-300 hover:text-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  {userData.addresses.length === 0 && (
                    <div className="md:col-span-2 py-20 bg-white/50 dark:bg-white/5 rounded-[40px] border-2 border-dashed border-brand-text/10 flex flex-col items-center justify-center text-center space-y-4 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-white dark:bg-brand-bg flex items-center justify-center text-brand-text/20 transition-colors">
                        <MapPin size={32} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-serif italic text-brand-text">No saved addresses</p>
                        <p className="text-[9px] uppercase tracking-widest text-brand-text/30 font-bold">Add an address for faster checkout</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-serif text-brand-text">My Wishlist</h2>
                
                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {wishlistProducts.map((product) => (
                      <div key={product.slug} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ProductCard 
                          name={product.name}
                          price={product.basePrice}
                          image={product.images?.[0] || ''}
                          slug={product.slug}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-24 bg-white dark:bg-brand-white rounded-[60px] border border-brand-text/5 shadow-soft flex flex-col items-center justify-center text-center space-y-6 transition-colors">
                    <div className="w-20 h-20 rounded-full bg-brand-bg dark:bg-brand-bg flex items-center justify-center text-brand-gold/30 border border-brand-text/5">
                      <Heart size={36} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif italic text-brand-text">Your heart is open</h3>
                      <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-text/30 max-w-50 leading-relaxed">Save your favorite masterpieces to view them later.</p>
                    </div>
                    <Link href="/products" className="pt-4">
                      <Button variant="primary" className="shadow-premium px-10">Start Discovering</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Tab: Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-serif text-brand-text">My Orders</h2>
                
                <div className="space-y-6">
                  {userData.orderHistory.map((order: OrderHistory) => (
                    <div 
                      key={order._id}
                      className="bg-white dark:bg-brand-white rounded-[40px] p-8 border border-brand-text/5 shadow-soft hover:shadow-premium transition-all group"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b border-brand-text/5 pb-8">
                        <div className="space-y-2">
                          <p className="text-[9px] uppercase tracking-widest text-brand-text/30 font-bold">Order Reference</p>
                          <p className="text-sm font-bold text-brand-text tracking-widest"># {order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[9px] uppercase tracking-widest text-brand-text/30 font-bold">Date Placed</p>
                          <p className="text-sm font-bold text-brand-text">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[9px] uppercase tracking-widest text-brand-text/30 font-bold">Status</p>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                            order.orderStatus === 'delivered' ? "bg-green-50 dark:bg-green-500/10 text-green-600" : 
                            order.orderStatus === 'cancelled' ? "bg-red-50 dark:bg-red-500/10 text-red-600" :
                            "bg-brand-gold/10 text-brand-gold"
                          )}>
                            {order.orderStatus || (order.paymentStatus === 'paid' ? 'Confirmed' : 'Pending Payment')}
                          </span>
                        </div>
                        <div className="space-y-2 md:text-right">
                          <Link href={`/account/orders/${order._id}`}>
                            <Button variant="outline" className="px-6 py-2 text-[8px] uppercase tracking-[0.2em] border-brand-text/10 dark:border-brand-gold/40 hover:bg-brand-text dark:hover:bg-brand-gold hover:text-white transition-all">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <Link href={`/account/orders/${order._id}`} className="space-y-4 block group-hover:opacity-80 transition-opacity">
                        {order.items.map((item: { name: string; image?: string; quantity: number }, idx: number) => (
                          <div key={idx} className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center overflow-hidden border border-brand-text/5">
                              <Image 
                                src={resolveProductImage(item.image)} 
                                alt={item.name} 
                                width={48} 
                                height={48} 
                                className="object-cover group-hover:scale-110 transition-transform duration-700" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-bold text-brand-text truncate">{item.name}</p>
                              <p className="text-[9px] text-brand-text/40 uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </Link>
                    </div>
                  ))}

                  {userData.orderHistory.length === 0 && (
                    <div className="py-24 bg-white dark:bg-brand-white rounded-[60px] border border-brand-text/5 shadow-soft flex flex-col items-center justify-center text-center space-y-6 transition-colors">
                      <div className="w-20 h-20 rounded-full bg-brand-bg dark:bg-brand-bg flex items-center justify-center text-brand-gold/30 border border-brand-text/5">
                        <Package size={36} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-serif italic text-brand-text">No orders yet</h3>
                        <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-text/30 max-w-50 leading-relaxed">Your journey of elegance is just beginning.</p>
                      </div>
                      <Link href="/products" className="pt-4">
                        <Button variant="primary" className="shadow-premium px-10">Explore Masterpieces</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Quotes */}
            {activeTab === 'quotes' && (
              <div className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-serif text-brand-text">My Consultations</h2>
                
                <div className="space-y-6">
                  {userData.quotes?.map((quote: UserQuote) => (
                    <div 
                      key={quote._id}
                      className="bg-white dark:bg-brand-white rounded-[40px] p-8 border border-brand-text/5 shadow-soft hover:shadow-premium transition-all group"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b border-brand-text/5 pb-8">
                        <div className="space-y-2">
                          <p className="text-[9px] uppercase tracking-widest text-brand-text/30 font-bold">Request Reference</p>
                          <p className="text-sm font-bold text-brand-text tracking-widest"># {quote._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[9px] uppercase tracking-widest text-brand-text/30 font-bold">Requested On</p>
                          <p className="text-sm font-bold text-brand-text">{new Date(quote.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[9px] uppercase tracking-widest text-brand-text/30 font-bold">Status</p>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                            quote.status === 'Converted To Order' ? "bg-green-50 dark:bg-green-500/10 text-green-600" : 
                            quote.status === 'Rejected' ? "bg-red-50 dark:bg-red-500/10 text-red-600" :
                            "bg-brand-gold/10 text-brand-gold"
                          )}>
                            {quote.status}
                          </span>
                        </div>
                        <div className="space-y-2 md:text-right">
                          <p className="text-[9px] uppercase tracking-widest text-brand-text/30 font-bold">Estimated Quote</p>
                          <p className="text-sm font-bold text-brand-text tracking-widest">
                            {quote.quotedPrice ? `₹ ${quote.quotedPrice.toLocaleString()}` : 
                             quote.estimation ? `₹ ${quote.estimation.estimatedPriceMin.toLocaleString()} - ₹ ${quote.estimation.estimatedPriceMax.toLocaleString()}` : 'Pending'}
                          </p>
                          {quote.complexity && !quote.quotedPrice && (
                            <p className="text-[8px] text-brand-gold uppercase tracking-widest font-bold mt-1">
                              {quote.complexity}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-6">
                        <div className="w-16 h-16 rounded-2xl bg-brand-bg flex items-center justify-center overflow-hidden border border-brand-text/5 shrink-0">
                          <Image 
                            src={resolveProductImage(quote.product?.images?.[0] || '')} 
                            alt={quote.product?.name || 'Product'} 
                            width={64} 
                            height={64} 
                            className="object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-4">
                          <div>
                            <p className="text-[13px] font-bold text-brand-text truncate">{quote.product?.name}</p>
                            <p className="text-[10px] text-brand-text/40 uppercase tracking-widest font-bold mt-1">
                              {quote.configuration.metal} • {quote.configuration.purity}
                            </p>
                          </div>
                          
                          <div className="bg-brand-bg/50 dark:bg-black/10 rounded-xl p-4 border border-brand-text/5 text-xs text-brand-text/80 italic line-clamp-2">
                            &ldquo;{quote.customizationNotes}&rdquo;
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!userData.quotes || userData.quotes.length === 0) && (
                    <div className="py-24 bg-white dark:bg-brand-white rounded-[60px] border border-brand-text/5 shadow-soft flex flex-col items-center justify-center text-center space-y-6 transition-colors">
                      <div className="w-20 h-20 rounded-full bg-brand-bg dark:bg-brand-bg flex items-center justify-center text-brand-gold/30 border border-brand-text/5">
                        <MessageSquare size={36} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-serif italic text-brand-text">No custom requests</h3>
                        <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-text/30 max-w-50 leading-relaxed">Request a bespoke masterpiece today.</p>
                      </div>
                      <Link href="/products" className="pt-4">
                        <Button variant="primary" className="shadow-premium px-10">Start Customizing</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </Section>

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-text/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsAddressModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-brand-white rounded-[45px] shadow-premium p-8 md:p-12 animate-in zoom-in slide-in-from-bottom-8 duration-700 transition-colors">
            <button 
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-brand-bg dark:bg-brand-bg text-brand-text/40 hover:text-brand-gold transition-all"
            >
              <X size={20} />
            </button>
            
            <div className="space-y-10">
              <div className="space-y-2">
                <h3 className="text-3xl font-serif text-brand-text">{editingAddressIndex !== null ? 'Edit' : 'Add New'} Address</h3>
                <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">Safe & Secure Delivery Gateway</p>
              </div>

              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold ml-2">Full Name</label>
                    <input 
                      required
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                      className="w-full h-14 bg-brand-bg/50 dark:bg-brand-bg border border-brand-text/5 dark:border-white/5 rounded-2xl px-6 text-xs font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all dark:text-brand-text/90"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold ml-2">Phone</label>
                    <input 
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                      className="w-full h-14 bg-brand-bg/50 dark:bg-brand-bg border border-brand-text/5 dark:border-white/5 rounded-2xl px-6 text-xs font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all dark:text-brand-text/90"
                      placeholder="Enter phone"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold ml-2">Address Line 1</label>
                  <input 
                    required
                    value={addressForm.addressLine1}
                    onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
                    className="w-full h-14 bg-brand-bg/50 dark:bg-brand-bg border border-brand-text/5 dark:border-white/5 rounded-2xl px-6 text-xs font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all dark:text-brand-text/90"
                    placeholder="House / Office / Area"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold ml-2">City</label>
                    <input 
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                      className="w-full h-14 bg-brand-bg/50 dark:bg-brand-bg border border-brand-text/5 dark:border-white/5 rounded-2xl px-6 text-xs font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all dark:text-brand-text/90"
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold ml-2">Pincode</label>
                    <input 
                      required
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                      className="w-full h-14 bg-brand-bg/50 dark:bg-brand-bg border border-brand-text/5 dark:border-white/5 rounded-2xl px-6 text-xs font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all dark:text-brand-text/90"
                      placeholder="000000"
                    />
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold ml-2">Type</label>
                    <select 
                      value={addressForm.type}
                      onChange={(e) => setAddressForm({...addressForm, type: e.target.value as 'Home' | 'Office' | 'Other'})}
                      className="w-full h-14 bg-brand-bg/50 dark:bg-brand-bg border border-brand-text/5 dark:border-white/5 rounded-2xl px-6 text-xs font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all appearance-none dark:text-brand-text/90"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center space-x-3 cursor-pointer group pt-2">
                   <input 
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                    className="w-4 h-4 rounded-full border-brand-text/10 text-brand-gold focus:ring-brand-gold cursor-pointer"
                   />
                   <span className="text-[10px] uppercase tracking-widest text-brand-text/60 group-hover:text-brand-text transition-colors">Set as Primary Address</span>
                </label>

                <div className="pt-6">
                  <Button type="submit" disabled={isLoading} className="w-full py-6! shadow-premium">
                    {isLoading ? <Loader2 className="animate-spin" /> : "Secure Save"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="bg-brand-bg text-brand-text min-h-screen pt-32 pb-20 flex items-center justify-center transition-colors duration-500">
        <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
