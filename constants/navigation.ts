import { 
  Diamond, 
  Flame, 
  Gem, 
  Gift, 
  Heart, 
  Baby, 
  User, 
  Watch, 
  Menu,
  Star 
} from 'lucide-react';

export interface NavSubCategory {
  name: string;
  href: string;
  image?: string;
  thumbnail?: string; // Small circular icon/thumbnail
  hidden?: boolean;
}

export interface NavFilterGroup {
  title: string;
  options: {
    name: string;
    href: string;
    hidden?: boolean;
  }[];
  hidden?: boolean;
}

export interface NavPromotion {
  title: string;
  description: string;
  image: string;
  href: string;
  badge?: string;
  cta?: string;
}

export interface BottomBanner {
  title: string;
  description: string;
  image: string;
  href: string;
}

export interface TopCategory {
  id: string;
  name: string;
  href: string;
  icon?: any;
  filters: NavFilterGroup[];
  subCategories: NavSubCategory[];
  promotions: NavPromotion[];
  bottomBanner?: BottomBanner;
}

const RAW_NAVIGATION_DATA: TopCategory[] = [
  {
    id: 'jewelry',
    name: 'Jewelry',
    href: '/products',
    icon: Gem,
    filters: [
      { 
        title: 'Category', 
        options: [
          { name: 'Rings', href: '/products?category=rings' }, 
          { name: 'Earrings', href: '/products?category=earrings' }, 
          { name: 'Necklaces', href: '/products?category=necklaces' },
          { name: 'Chains', href: '/products?category=chains' },
          { name: 'Pendants', href: '/products?category=pendants' },
          { name: 'Bracelets', href: '/products?category=bracelets' },
          { name: 'Bangles', href: '/products?category=bangles' },
          { name: 'Mangalsutras', href: '/products?category=mangalsutras' },
          { name: 'Nose Pins', href: '/products?category=nose-pin' },
          { name: 'Anklets', href: '/products?category=anklets' }
        ] 
      },
      { 
        title: 'Price', 
        options: [
          { name: 'Under ₹20,000', href: '/products?price_max=20000' }, 
          { name: '₹20,000 - ₹50,000', href: '/products?price_min=20000&price_max=50000' },
          { name: 'Above ₹50,000', href: '/products?price_min=50000' }
        ] 
      }
    ],
    subCategories: [
      { name: 'Rings', href: '/products?category=rings', thumbnail: '💍' },
      { name: 'Earrings', href: '/products?category=earrings', thumbnail: '👂' },
      { name: 'Necklaces', href: '/products?category=necklaces', thumbnail: '📿' },
      { name: 'Chains', href: '/products?category=chains', thumbnail: '⛓️' },
      { name: 'Pendants', href: '/products?category=pendants', thumbnail: '🎖️' },
      { name: 'Bracelets', href: '/products?category=bracelets', thumbnail: '💫' },
      { name: 'Bangles', href: '/products?category=bangles', thumbnail: '🟡' },
      { name: 'Mangalsutras', href: '/products?category=mangalsutras', thumbnail: '📿' },
      { name: 'Nose Pins', href: '/products?category=nose-pin', thumbnail: '✨' },
      { name: 'Anklets', href: '/products?category=anklets', thumbnail: '👣' }
    ],
    promotions: [
      {
        title: 'Crafted Brilliance',
        description: 'Explore Masterpieces',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
        href: '/products',
      }
    ],
    bottomBanner: {
      title: 'Jewelry for Every Moment—See It All Here!',
      description: 'Handcrafted designs to choose from',
      image: '/images/site/jewellery_guide.png',
      href: '/products'
    }
  },
  {
    id: 'collections',
    name: 'Collections',
    href: '/products',
    icon: Heart,
    filters: [
      { 
        title: 'Collections', 
        options: [
          { name: 'Bridal', href: '/products?collection=bridal' }, 
          { name: 'Daily Wear', href: '/products?tag=daily-wear' }, 
          { name: 'Festive', href: '/products?tag=festive' },
          { name: 'Office Wear', href: '/products?tag=office-wear' },
          { name: "Men's", href: '/products?gender=men' },
          { name: 'Kids', href: '/products?gender=kids' }
        ] 
      }
    ],
    subCategories: [
      { name: 'Bridal', href: '/products?collection=bridal', image: '/images/site/wedding.png' },
      { name: 'Daily Wear', href: '/products?tag=daily-wear', image: '/images/site/daily-wear.png' },
      { name: 'Festive', href: '/products?tag=festive', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800' },
      { name: 'Office Wear', href: '/products?tag=office-wear', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800' },
      { name: "Men's", href: '/products?gender=men', image: '/images/site/men_jewelry.png' },
      { name: 'Kids', href: '/products?gender=kids', image: '/images/site/kids_jewelry.png' }
    ],
    promotions: [
      {
        title: 'The Bridal Edit',
        description: 'Explore Collection',
        image: '/images/site/wedding.png',
        href: '/products?collection=bridal',
      }
    ],
    bottomBanner: {
      title: 'Zoniraz Signature Collections',
      description: 'Find jewelry suited for every event.',
      image: '/images/site/jewellery_guide.png',
      href: '/products'
    }
  },
  {
    id: 'materials',
    name: 'Materials',
    href: '/products',
    icon: Diamond,
    filters: [
      { 
        title: 'Materials', 
        options: [
          { name: 'Gold', href: '/products?metal=gold' }, 
          { name: 'Diamond', href: '/products?stone=diamond' }, 
          { name: 'Silver', href: '/products?metal=silver' },
          { name: 'Gemstone', href: '/products?tag=gemstone' }
        ] 
      }
    ],
    subCategories: [
      { name: 'Gold', href: '/products?metal=gold', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800' },
      { name: 'Diamond', href: '/products?stone=diamond', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800' },
      { name: 'Silver', href: '/products?metal=silver', image: '/images/site/digi_gold.png' },
      { name: 'Gemstone', href: '/products?tag=gemstone', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800' }
    ],
    promotions: [
      {
        title: 'Natural Diamonds',
        description: 'Explore Designs',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
        href: '/products?stone=diamond',
      }
    ],
    bottomBanner: {
      title: 'Pure Materials, Certified Authenticity',
      description: 'Discover jewelry crafted with 100% purity guarantees.',
      image: '/images/site/jewellery_guide.png',
      href: '/products'
    }
  },
  {
    id: 'investments',
    name: 'Investment Plans',
    href: '/plans/gold-mine',
    icon: Star,
    filters: [
      { title: 'Plans', options: [{ name: 'Gold Mine (10+1)', href: '/plans/gold-mine' }] }
    ],
    subCategories: [
      { name: 'Gold Mine (10+1)', href: '/plans/gold-mine', thumbnail: '💰' }
    ],
    promotions: [
      {
        title: 'Smart Savings for Luxury',
        description: 'Explore Plans',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
        href: '/plans/gold-mine',
      }
    ]
  },
  {
    id: 'more',
    name: 'More',
    href: '#',
    icon: Menu,
    filters: [
      { title: 'Exchange Program', options: [{ name: 'Gold Exchange', href: '/exchange' }] },
      { title: 'Customer Services', options: [{ name: 'Help & FAQs', href: '/help' }] }
    ],
    subCategories: [
      { name: 'Gold Exchange', href: '/exchange', image: '/images/site/digi_gold.png' }
    ],
    promotions: []
  }
];

export const NAVIGATION_DATA: TopCategory[] = RAW_NAVIGATION_DATA.map(category => ({
  ...category,
  filters: category.filters
    .filter(f => !f.hidden)
    .map(f => ({
      ...f,
      options: f.options.filter(o => !o.hidden)
    })),
  subCategories: category.subCategories.filter(s => !s.hidden)
}));
