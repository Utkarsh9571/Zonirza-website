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
    id: 'all',
    name: 'All Jewellery',
    href: '/products',
    icon: Gem,
    filters: [
      { title: 'Category', options: [{ name: 'Finger Rings', href: '/products?category=rings' }, { name: 'Earrings', href: '/products?category=earrings' }, { name: 'Pendants', href: '/products?category=pendants' }] },
      { title: 'Price', options: [{ name: 'Under ₹20,000', href: '/products?price_max=20000' }, { name: '₹20,000 - ₹50,000', href: '/products?price_min=20000&price_max=50000' }] },
      { title: 'Occasion', options: [{ name: 'Daily Wear', href: '/products?tag=office-wear' }, { name: 'Engagement', href: '/products?occasion=engagement' }] },
    ],
    subCategories: [
      { name: 'All Jewellery', href: '/products', thumbnail: '💍' },
      { name: 'Finger Rings', href: '/products?category=rings', thumbnail: '💍' },
      { name: 'Nose Pin', href: '/products?category=nose-pin', thumbnail: '✨' },
      { name: 'Earrings', href: '/products?category=earrings', thumbnail: '👂' },
      { name: 'Pendants', href: '/products?category=pendants', thumbnail: '🎖️' }
    ],
    promotions: [
      {
        title: 'Elan - My World. My Story.',
        description: 'Explore Now',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
        href: '/products?tag=featured',
      }
    ],
    bottomBanner: {
      title: 'Jewellery for Every Moment—See It All Here!',
      description: 'Handcrafted designs to choose from',
      image: '/images/site/jewellery_guide.png',
      href: '/products'
    }
  },
  {
    id: 'gold',
    name: 'Gold',
    href: '/products?metal=gold',
    icon: Flame,
    filters: [
      { title: 'Category', options: [{ name: 'Gold Earrings', href: '/products?category=earrings&metal=gold' }, { name: 'Gold Rings', href: '/products?category=rings&metal=gold' }, { name: 'Gold Pendants', href: '/products?category=pendants&metal=gold' }] },
      { title: 'Price', options: [{ name: 'Under ₹20,000', href: '/products?price_max=20000' }] },
      { title: 'Occasion', options: [{ name: 'Engagement', href: '/products?category=rings&metal=gold&occasion=engagement' }] },
    ],
    subCategories: [
      { name: 'All Gold', href: '/products?metal=gold', thumbnail: '🟡' },
      { name: 'Gold Earrings', href: '/products?category=earrings&metal=gold', thumbnail: '👂' },
      { name: 'Gold Rings', href: '/products?category=rings&metal=gold', thumbnail: '💍' },
      { name: 'Gold Nose Pins', href: '/products?category=nose-pin&metal=gold', thumbnail: '✨' },
      { name: 'Gold Engagement Rings', href: '/products?category=rings&metal=gold&occasion=engagement', thumbnail: '💍' },
      { name: 'Gold Pendants', href: '/products?category=pendants&metal=gold', thumbnail: '🎖️' }
    ],
    promotions: [
      {
        title: 'Intricately handcrafted Gold masterpieces',
        description: 'Explore Now',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
        href: '/products?metal=gold',
      }
    ],
    bottomBanner: {
      title: 'From Classic to Contemporary.',
      description: 'Explore Stunning Gold Designs.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300',
      href: '/products?metal=gold'
    }
  },
  {
    id: 'diamond',
    name: 'Diamond',
    href: '/products?stone=diamond',
    icon: Diamond,
    filters: [
      { title: 'Category', options: [{ name: 'Diamond Rings', href: '/products?category=rings&stone=diamond' }, { name: 'Diamond Earrings', href: '/products?category=earrings&stone=diamond' }] },
      { title: 'Price', options: [{ name: 'Above ₹50,000', href: '/products?price_min=50000' }] },
    ],
    subCategories: [
      { name: 'All Diamond', href: '/products?stone=diamond', thumbnail: '💎' },
      { name: 'Diamond Earrings', href: '/products?category=earrings&stone=diamond', thumbnail: '👂' },
      { name: 'Diamond Pendants', href: '/products?category=pendants&stone=diamond', thumbnail: '🎖️' },
      { name: 'Diamond Rings', href: '/products?category=rings&stone=diamond', thumbnail: '💍' },
      { name: 'Diamond Nose Pins', href: '/products?category=nose-pin&stone=diamond', thumbnail: '✨' }
    ],
    promotions: [
      {
        title: 'Natural Diamonds',
        description: 'Explore Now',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
        href: '/products?stone=diamond',
      }
    ],
    bottomBanner: {
      title: 'Diamonds for Every Sparkle',
      description: 'Discover Exquisite Designs.',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=300',
      href: '/products?stone=diamond'
    }
  },
  {
    id: 'earrings',
    name: 'Earrings',
    href: '/products?category=earrings',
    icon: Heart,
    filters: [
      { title: 'Style', options: [{ name: 'Studs', href: '/products?category=earrings&style=studs' }, { name: 'Drops', href: '/products?category=earrings&style=drops' }] },
    ],
    subCategories: [
      { name: 'All Earrings', href: '/products?category=earrings', thumbnail: '👂' },
      { name: 'Drop & Danglers', href: '/products?category=earrings&style=drops', thumbnail: '💫' },
      { name: 'Studs & Tops', href: '/products?category=earrings&style=studs', thumbnail: '✨' },
      { name: 'Hoop & Huggies', href: '/products?category=earrings&style=hoops', thumbnail: '💫' }
    ],
    promotions: [
      {
        title: 'A eternal symbol of commitment',
        description: 'Shop now',
        image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800',
        href: '/products?category=earrings',
      }
    ],
    bottomBanner: {
      title: 'Earrings for You — Crafted with Precision',
      description: 'Explore Stunning Styles.',
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
      { name: 'Diamond Engagement Rings', href: '/products?category=rings&stone=diamond&occasion=engagement', thumbnail: '💎' },
      { name: 'Men\'s Rings', href: '/products?category=rings&gender=men', thumbnail: '🤵' },
      { name: 'Engagement Rings', href: '/products?category=rings&occasion=engagement', thumbnail: '💍' },
      { name: 'Gold Engagement Rings', href: '/products?category=rings&metal=gold&occasion=engagement', thumbnail: '💍' }
    ],
    promotions: [
      {
        title: 'Celebrate Love & Milestones',
        description: 'Shop now',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
        href: '/products?category=rings',
      }
    ],
    bottomBanner: {
      title: 'Celebrate Love with a Ring That Speaks Your Heart.',
      description: 'Designs to Choose From.',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=300',
      href: '/products?category=rings'
    }
  },
  {
    id: 'daily-wear',
    name: 'Daily Wear',
    href: '/products?tag=office-wear',
    icon: Watch,
    filters: [
      { title: 'Category', options: [{ name: 'Dailywear Rings', href: '/products?tag=office-wear&category=rings' }, { name: 'Dailywear Earrings', href: '/products?tag=office-wear&category=earrings' }] },
      { title: 'Price', options: [{ name: 'Under ₹20,000', href: '/products?price_max=20000' }] },
    ],
    subCategories: [
      { name: 'Dailywear Jewellery', href: '/products?tag=office-wear', thumbnail: '⌚' },
      { name: 'Dailywear Rings', href: '/products?tag=office-wear&category=rings', thumbnail: '💍' },
      { name: 'Dailywear Earrings', href: '/products?tag=office-wear&category=earrings', thumbnail: '👂' },
      { name: 'Dailywear Pendants', href: '/products?tag=office-wear&category=pendants', thumbnail: '🎖️' }
    ],
    promotions: [
      {
        title: 'Effortless style to make everyday sparkle.',
        description: 'Shop now',
        image: '/images/site/daily-wear.png',
        href: '/products?tag=office-wear',
      }
    ],
    bottomBanner: {
      title: 'From Everyday Glow to Extraordinary Sparkle.',
      description: 'Designs Await.',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=300',
      href: '/products?tag=office-wear'
    }
  },
  {
    id: 'gemstone',
    name: 'Gemstone',
    href: '/products?tag=gemstone',
    icon: Gem,
    filters: [
      { title: 'Category', options: [{ name: 'Gemstone Rings', href: '/products?category=rings&stone=emerald,ruby' }, { name: 'Gemstone Earrings', href: '/products?category=earrings&stone=emerald,ruby' }] },
    ],
    subCategories: [
      { name: 'Gemstone', href: '/products?tag=gemstone', thumbnail: '💎' },
      { name: 'Gemstone Rings', href: '/products?category=rings&stone=emerald,ruby', thumbnail: '💍' },
      { name: 'Gemstone Earrings', href: '/products?category=earrings&stone=emerald,ruby', thumbnail: '👂' },
      { name: 'Emerald Stone', href: '/products?stone=emerald', thumbnail: '🟢' },
      { name: 'Gemstone Pendants', href: '/products?category=pendants&stone=emerald,ruby', thumbnail: '🎖️' },
      { name: 'Ruby', href: '/products?stone=ruby', thumbnail: '🔴' }
    ],
    promotions: [
      {
        title: 'Natural gemstones, vibrant colours',
        description: 'Explore now',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
        href: '/products?tag=gemstone',
      }
    ],
  },
  {
    id: 'wedding',
    name: 'Wedding',
    href: '/products?collection=bridal',
    icon: Heart,
    filters: [
      { title: 'Category', options: [{ name: 'All Rivaah', href: '/products?collection=bridal' }] },
    ],
    subCategories: [
      { name: 'All Rivaah', href: '/products?collection=bridal', image: '/images/site/wedding.png' }
    ],
    promotions: [],
  },
  {
    id: 'gifting',
    name: 'Gifting',
    href: '/products?tag=for-gift',
    icon: Gift,
    filters: [
      { title: 'Gifts for', options: [{ name: 'Her', href: '/products?tag=for-gift&gender=women' }, { name: 'Him', href: '/products?tag=for-gift&gender=men' }] },
      { title: 'Gift Card', options: [{ name: 'Digital Gift Card', href: '/gift-cards' }] },
      { title: 'Price', options: [{ name: 'Under ₹20,000', href: '/products?price_max=20000' }] },
    ],
    subCategories: [
      { name: 'Her', href: '/products?tag=for-gift&gender=women', image: '/images/site/women_jewelry.png' },
      { name: 'Him', href: '/products?tag=for-gift&gender=men', image: '/images/site/men_jewelry.png' }
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
      description: 'Find the jewellery for all celebrations here.',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=300',
      href: '/products?tag=for-gift'
    }
  },
  {
    id: 'investments',
    name: 'Investment Plans',
    href: '/plans/gold-mine',
    icon: Star,
    filters: [
      { title: 'Plans', options: [{ name: 'Gold Mine (10+1)', href: '/plans/gold-mine' }, { name: 'Gold Reserve', href: '/plans/gold-reserve', hidden: true }] },
      { title: 'Digi Gold', options: [{ name: 'Buy Digital Gold', href: '/digi-gold', hidden: true }], hidden: true },
    ],
    subCategories: [
      { name: 'Gold Mine (10+1)', href: '/plans/gold-mine', thumbnail: '💰' },
      { name: 'Gold Reserve', href: '/plans/gold-reserve', thumbnail: '📈', hidden: true },
      { name: 'Digi Gold', href: '/digi-gold', thumbnail: '🪙', hidden: true },
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
      { title: 'Collections', options: [{ name: 'View All', href: '/products?tag=featured' }] },
      { title: 'Investments', options: [{ name: 'Gold Plans', href: '/plans/gold-mine' }] },
      { title: 'Customer Services', options: [{ name: 'Help & FAQs', href: '/help' }] }
    ],
    subCategories: [
      { name: 'Gold Exchange', href: '/exchange', image: '/images/site/digi_gold.png' },
    ],
    promotions: [],
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
