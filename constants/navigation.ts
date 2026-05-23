import { 
  Diamond, 
  Flame, 
  Gem, 
  Gift, 
  Heart, 
  Baby, 
  User, 
  Watch, 
  Mic, 
  Menu,
  Star 
} from 'lucide-react';

export interface NavSubCategory {
  name: string;
  href: string;
  image?: string;
  thumbnail?: string; // Small circular icon/thumbnail
}

export interface NavFilterGroup {
  title: string;
  options: {
    name: string;
    href: string;
  }[];
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

export const NAVIGATION_DATA: TopCategory[] = [
  {
    id: 'all',
    name: 'All Jewellery',
    href: '/products',
    icon: Gem,
    filters: [
      { title: 'Category', options: [{ name: 'Finger Rings', href: '/products?category=rings' }, { name: 'Bangles', href: '/products?category=bangles' }, { name: 'Necklaces', href: '/products?category=necklaces' }] },
      { title: 'Price', options: [{ name: 'Under ₹10,000', href: '/products?price_max=10000' }, { name: '₹10,000 - ₹50,000', href: '/products?price_min=10000&price_max=50000' }] },
      { title: 'Occasion', options: [{ name: 'Daily Wear', href: '/products?occasion=daily' }, { name: 'Engagement', href: '/products?occasion=engagement' }] },
    ],
    subCategories: [
      { name: 'All Jewellery', href: '/products', thumbnail: '💍' },
      { name: 'Finger Rings', href: '/products?category=rings', thumbnail: '💍' },
      { name: 'Nose Pin', href: '/products?category=nose-pin', thumbnail: '✨' },
      { name: 'Bangles', href: '/products?category=bangles', thumbnail: '💫' },
      { name: 'Earrings', href: '/products?category=earrings', thumbnail: '👂' },
      { name: 'Mangalsutra', href: '/products?category=mangalsutra', thumbnail: '📿' },
      { name: 'Necklaces', href: '/products?category=necklaces', thumbnail: '💎' },
      { name: 'Bracelets', href: '/products?category=bracelets', thumbnail: '⛓️' },
      { name: 'Pendants', href: '/products?category=pendants', thumbnail: '🎖️' },
      { name: 'Chains', href: '/products?category=chains', thumbnail: '🔗' },
      { name: 'Necklace Set', href: '/products?category=necklace-set', thumbnail: '👑' },
      { name: 'Pendants & Earring Set', href: '/products?category=set', thumbnail: '✨' },
    ],
    promotions: [
      {
        title: 'Elan - My World. My Story.',
        description: 'Explore Now',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
        href: '/collections/elan',
      }
    ],
    bottomBanner: {
      title: 'Jewellery for Every Moment—See It All Here!',
      description: '14,000+ designs to choose from',
      image: '/images/site/jewellery_guide.png',
      href: '/products'
    }
  },
  {
    id: 'gold',
    name: 'Gold',
    href: '/products?category=gold',
    icon: Flame,
    filters: [
      { title: 'Category', options: [{ name: 'Gold Bangles', href: '/products?category=gold-bangles' }, { name: 'Gold Earrings', href: '/products?category=gold-earrings' }] },
      { title: 'Price', options: [{ name: 'Under ₹20,000', href: '/products?price_max=20000' }] },
      { title: 'Occasion', options: [{ name: 'Wedding', href: '/products?occasion=wedding' }] },
    ],
    subCategories: [
      { name: 'All Gold', href: '/products?category=gold', thumbnail: '🟡' },
      { name: 'Gold Earrings', href: '/products?category=gold-earrings', thumbnail: '👂' },
      { name: 'Gold Rings', href: '/products?category=gold-rings', thumbnail: '💍' },
      { name: 'Gold Nose Pins', href: '/products?category=gold-nose-pins', thumbnail: '✨' },
      { name: 'Gold Bangles', href: '/products?category=gold-bangles', thumbnail: '💫' },
      { name: 'Gold Chains', href: '/products?category=gold-chains', thumbnail: '🔗' },
      { name: 'Gold Engagement Rings', href: '/products?category=gold-rings&occasion=engagement', thumbnail: '💍' },
      { name: 'Gold Kadas', href: '/products?category=gold-kadas', thumbnail: '⛓️' },
      { name: 'Gold Bracelets', href: '/products?category=gold-bracelets', thumbnail: '⛓️' },
      { name: 'Gold Pendants', href: '/products?category=gold-pendants', thumbnail: '🎖️' },
      { name: 'Gold Necklaces', href: '/products?category=gold-necklaces', thumbnail: '💎' },
      { name: 'Gold Mangalsutras', href: '/products?category=gold-mangalsutras', thumbnail: '📿' },
    ],
    promotions: [
      {
        title: 'Intricately handcrafted Kundan masterpieces',
        description: 'Explore Now',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
        href: '/collections/kundan',
      }
    ],
    bottomBanner: {
      title: 'From Classic to Contemporary.',
      description: 'Explore 6000+ Stunning Designs.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300',
      href: '/products?category=gold'
    }
  },
  {
    id: 'diamond',
    name: 'Diamond',
    href: '/products?category=diamond',
    icon: Diamond,
    filters: [
      { title: 'Category', options: [{ name: 'Diamond Rings', href: '/products?category=diamond-rings' }] },
      { title: 'Price', options: [{ name: 'Above ₹50,000', href: '/products?price_min=50000' }] },
    ],
    subCategories: [
      { name: 'All Diamond', href: '/products?category=diamond', thumbnail: '💎' },
      { name: 'Diamond Earrings', href: '/products?category=diamond-earrings', thumbnail: '👂' },
      { name: 'Diamond Necklace Set', href: '/products?category=diamond-necklace-set', thumbnail: '👑' },
      { name: 'Diamond Pendants', href: '/products?category=diamond-pendants', thumbnail: '🎖️' },
      { name: 'Diamond Bangles', href: '/products?category=diamond-bangles', thumbnail: '💫' },
      { name: 'Diamond Rings', href: '/products?category=diamond-rings', thumbnail: '💍' },
      { name: 'Diamond Necklaces', href: '/products?category=diamond-necklaces', thumbnail: '💎' },
      { name: 'Diamond Nose Pins', href: '/products?category=diamond-nose-pins', thumbnail: '✨' },
      { name: 'Diamond Bracelet', href: '/products?category=diamond-bracelet', thumbnail: '⛓️' },
      { name: 'Diamond Mangalsutra', href: '/products?category=diamond-mangalsutra', thumbnail: '📿' },
    ],
    promotions: [
      {
        title: 'Natural Diamonds',
        description: 'Explore Now',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
        href: '/collections/diamonds',
      }
    ],
    bottomBanner: {
      title: 'Diamonds for Every Sparkle',
      description: 'Discover 6500+ Exquisite Designs.',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=300',
      href: '/products?category=diamond'
    }
  },
  {
    id: 'earrings',
    name: 'Earrings',
    href: '/products?category=earrings',
    icon: Heart,
    filters: [
      { title: 'Style', options: [{ name: 'Studs', href: '/products?category=earrings&style=studs' }] },
    ],
    subCategories: [
      { name: 'All Earrings', href: '/products?category=earrings', thumbnail: '👂' },
      { name: 'Jhumkas', href: '/products?category=earrings&style=jhumka', thumbnail: '✨' },
      { name: 'Drop & Danglers', href: '/products?category=earrings&style=drops', thumbnail: '💫' },
      { name: 'Studs & Tops', href: '/products?category=earrings&style=studs', thumbnail: '✨' },
      { name: 'Hoop & Huggies', href: '/products?category=earrings&style=hoops', thumbnail: '💫' },
    ],
    promotions: [
      {
        title: 'A eternal symbol of commitment',
        description: 'Shop now',
        image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800',
        href: '/collections/earrings',
      }
    ],
    bottomBanner: {
      title: 'Earrings for You — Crafted with Precision',
      description: 'Explore 3500+ Stunning Styles.',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=300',
      href: '/products?category=earrings'
    }
  },
  {
    id: 'rings',
    name: 'Rings',
    href: '/products?category=rings',
    icon: Flame,
    filters: [
      { title: 'Occasion', options: [{ name: 'Engagement', href: '/products?category=rings&occasion=engagement' }] },
    ],
    subCategories: [
      { name: 'All Rings', href: '/products?category=rings', thumbnail: '💍' },
      { name: 'Diamond Engagement Rings', href: '/products?category=rings&metal=diamond&occasion=engagement', thumbnail: '💎' },
      { name: 'Men\'s Rings', href: '/products?category=rings&gender=men', thumbnail: '🤵' },
      { name: 'Casual Rings', href: '/products?category=rings&occasion=casual', thumbnail: '💍' },
      { name: 'Engagement Rings', href: '/products?category=rings&occasion=engagement', thumbnail: '💍' },
      { name: 'Platinum Engagement Rings', href: '/products?category=rings&metal=platinum&occasion=engagement', thumbnail: '💍' },
      { name: 'Couple Rings', href: '/products?category=rings&occasion=couple', thumbnail: '💕' },
      { name: 'Gold Engagement Rings', href: '/products?category=rings&metal=gold&occasion=engagement', thumbnail: '💍' },
    ],
    promotions: [
      {
        title: 'Celebrate Love & Milestones',
        description: 'Shop now',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
        href: '/collections/rings',
      }
    ],
    bottomBanner: {
      title: 'Celebrate Love with a Ring That Speaks Your Heart.',
      description: '3900+ Designs to Choose From.',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=300',
      href: '/products?category=rings'
    }
  },
  {
    id: 'daily-wear',
    name: 'Daily Wear',
    href: '/products?tag=daily-wear',
    icon: Watch,
    filters: [
      { title: 'Category', options: [{ name: 'Dailywear Rings', href: '/products?tag=daily-wear&category=rings' }, { name: 'Dailywear Earrings', href: '/products?tag=daily-wear&category=earrings' }] },
      { title: 'Price', options: [{ name: 'Under ₹20,000', href: '/products?price_max=20000' }] },
      { title: 'Style', options: [{ name: 'Modern', href: '/products?style=modern' }] },
    ],
    subCategories: [
      { name: 'Dailywear Jewellery', href: '/products?tag=daily-wear', thumbnail: '⌚' },
      { name: 'Dailywear Rings', href: '/products?tag=daily-wear&category=rings', thumbnail: '💍' },
      { name: 'Dailywear Chains', href: '/products?tag=daily-wear&category=chains', thumbnail: '🔗' },
      { name: 'Dailywear Mangalsutra', href: '/products?tag=daily-wear&category=mangalsutra', thumbnail: '📿' },
      { name: 'Dailywear Earrings', href: '/products?tag=daily-wear&category=earrings', thumbnail: '👂' },
      { name: 'Dailywear Pendants', href: '/products?tag=daily-wear&category=pendants', thumbnail: '🎖️' },
    ],
    promotions: [
      {
        title: 'Effortless style to make everyday sparkle.',
        description: 'Shop now',
        image: '/images/site/daily-wear.png',
        href: '/collections/daily-wear',
      }
    ],
    bottomBanner: {
      title: 'From Everyday Glow to Extraordinary Sparkle.',
      description: '3000+ Designs Await.',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=300',
      href: '/products?tag=daily-wear'
    }
  },
  {
    id: 'gemstone',
    name: 'Gemstone',
    href: '/products?category=gemstone',
    icon: Gem,
    filters: [
      { title: 'Category', options: [{ name: 'Gemstone Rings', href: '/products?category=gemstone-rings' }] },
    ],
    subCategories: [
      { name: 'Gemstone', href: '/products?category=gemstone', thumbnail: '💎' },
      { name: 'Gemstone Rings', href: '/products?category=gemstone-rings', thumbnail: '💍' },
      { name: 'Gemstone Earrings', href: '/products?category=gemstone-earrings', thumbnail: '👂' },
      { name: 'Emerald Stone', href: '/products?stone=emerald', thumbnail: '🟢' },
      { name: 'Gemstone Pendants', href: '/products?category=gemstone-pendants', thumbnail: '🎖️' },
      { name: 'Ruby', href: '/products?stone=ruby', thumbnail: '🔴' },
    ],
    promotions: [
      {
        title: 'Natural gemstones, vibrant colours',
        description: 'Explore now',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
        href: '/collections/gemstone',
      }
    ],
  },
  {
    id: 'wedding',
    name: 'Wedding',
    href: '/products?tag=wedding',
    icon: Heart,
    filters: [
      { title: 'Category', options: [{ name: 'All Rivaah', href: '/products?tag=wedding' }] },
      { title: 'Community', options: [{ name: 'North Indian', href: '/products?community=north' }] },
      { title: 'Metal', options: [{ name: 'Gold', href: '/products?metal=gold' }] },
    ],
    subCategories: [
      { name: 'All Rivaah', href: '/products?tag=wedding', image: '/images/site/wedding.png' },
      { name: 'Wedding Choker', href: '/products?category=choker&tag=wedding', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400' },
      { name: 'Wedding Haram', href: '/products?category=haram&tag=wedding', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400' },
      { name: 'Wedding Bangles', href: '/products?category=bangles&tag=wedding', image: '/images/site/bracelets_category.png' },
      { name: 'Wedding Diamond', href: '/products?category=diamond&tag=wedding', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400' },
      { name: 'Wedding Mangalsutra', href: '/products?category=mangalsutra&tag=wedding', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400' },
      { name: 'Accessories', href: '/products?category=accessories&tag=wedding', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=400' },
    ],
    promotions: [],
  },
  {
    id: 'gifting',
    name: 'Gifting',
    href: '/products?tag=gifting',
    icon: Gift,
    filters: [
      { title: 'Gifts for', options: [{ name: 'Her', href: '/products?tag=gifting&gender=women' }] },
      { title: 'Gift Card', options: [{ name: 'Digital Gift Card', href: '/gift-cards' }] },
      { title: 'Price', options: [{ name: 'Under ₹5,000', href: '/products?price_max=5000' }] },
      { title: 'Occasion', options: [{ name: 'Anniversary', href: '/products?occasion=anniversary' }] },
      { title: 'Corporate Gifting', options: [{ name: 'Bulk Orders', href: '/corporate' }] },
    ],
    subCategories: [
      { name: 'Her', href: '/products?tag=gifting&gender=women', image: '/images/site/women_jewelry.png' },
      { name: 'Him', href: '/products?tag=gifting&gender=men', image: '/images/site/men_jewelry.png' },
      { name: 'Kids', href: '/products?tag=gifting&gender=kids', image: '/images/site/kids_jewelry.png' },
    ],
    promotions: [
      {
        title: 'Gift card',
        description: 'Shop now',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
        href: '/gift-cards',
      }
    ],
    bottomBanner: {
      title: 'Celebrate life’s joys with Zoniraz.',
      description: 'Find the jewellery for all occasions and celebrations here.',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=300',
      href: '/products?tag=gifting'
    }
  },
  {
    id: 'investments',
    name: 'Investment Plans',
    href: '/plans/gold-mine',
    icon: Star,
    filters: [
      { title: 'Plans', options: [{ name: 'Gold Mine (10+1)', href: '/plans/gold-mine' }, { name: 'Gold Reserve', href: '/plans/gold-reserve' }] },
    ],
    subCategories: [
      { name: 'Gold Mine (10+1)', href: '/plans/gold-mine', thumbnail: '💰' },
      { name: 'Gold Reserve', href: '/plans/gold-reserve', thumbnail: '📈' },
    ],
    promotions: [
      {
        title: 'Smart Savings for Luxury',
        description: 'Explore Plans',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
        href: '/plans/gold-mine',
      }
    ],
  },
  {
    id: 'more',
    name: 'More',
    href: '#',
    icon: Menu,
    filters: [
      { title: 'Exchange Program', options: [{ name: 'Gold Exchange', href: '/exchange' }] },
      { title: 'Collections', options: [{ name: 'View All', href: '/collections' }] },
      { title: 'Investments', options: [{ name: 'Gold Plans', href: '/invest' }] },
      { title: 'Mia', options: [{ name: 'Mia by Zoniraz', href: '/mia' }] },
      { title: 'Loyalty Points', options: [{ name: 'Encircle', href: '/loyalty' }] },
      { title: 'Customer Services', options: [{ name: 'Track Order', href: '/track' }] },
      { title: 'Our Brands', options: [{ name: 'Ziva', href: '/brands' }] },
      { title: 'Currency Selector', options: [{ name: 'INR', href: '#' }] },
    ],
    subCategories: [
      { name: 'Gold Exchange', href: '/exchange', image: '/images/site/digi_gold.png' },
    ],
    promotions: [],
  }
];
