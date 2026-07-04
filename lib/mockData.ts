/**
 * Mock / Demo Data
 * ----------------
 * Used by public API routes when MongoDB is not connected.
 * The site works fully as a showcase/demo without a database.
 * All data is replaced with real DB data once MONGODB_URI is configured.
 */

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
export const MOCK_SETTINGS = {
  siteName: 'Luxury Jewelry Commerce Starter',
  supportEmail: 'support@example.com',
  supportPhone: '+91 99999 99999',
  address: '123 Luxury Lane, Jewelry District, Mumbai 400001',
  businessHours: 'Mon–Sat: 10AM – 8PM, Sun: Closed',
  footerText: 'Crafting brilliance for generations.',
  maintenanceMode: false,
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    whatsapp: 'https://wa.me/919999999999',
  },
  contactPage: {
    title: 'Visit Our Boutique',
    description: 'Come experience our collection in person at our flagship store.',
    mapUrl: '',
  },
  seo: {
    defaultTitle: 'Luxury Jewelry — Timeless Elegance',
    defaultDescription: 'Discover our exquisite collection of handcrafted luxury jewelry.',
    keywords: ['jewelry', 'gold', 'diamond', 'luxury', 'rings', 'necklaces'],
  },
  announcement: {
    text: '✨ Demo Mode — Connect MongoDB for live data',
    link: '',
    isActive: true,
  },
  pricingFactors: {
    freeShippingThreshold: 5000,
    gstPercentage: 3,
    shippingBaseCharge: 0,
    metalRates: { gold24k: 7200, silver: 95, platinum: 4200 },
    diamondPrices: {},
    gemstonePrices: {},
    stonePrices: {},
    purityMultipliers: { '22K': 0.917, '18K': 0.75, '14K': 0.583 },
    sizeWeightOffset: 0,
    ringsOffset: 0.12,
    chainsOffset: 0.25,
    braceletsOffset: 0.15,
    banglesOffset: 0.15,
  },
};

// ---------------------------------------------------------------------------
// Hero Slides
// ---------------------------------------------------------------------------
export const MOCK_HERO_SLIDES = [
  {
    _id: 'demo-slide-1',
    title: 'Timeless Brilliance',
    subtitle: 'Handcrafted luxury jewelry that tells your story. Discover our signature collections.',
    videoDesktop: '',
    videoMobile: '',
    posterImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop',
    primaryCTA: { label: 'Explore Collections', link: '/products' },
    secondaryCTA: { label: 'Our Story', link: '/about' },
    isActive: true,
    order: 0,
  },
  {
    _id: 'demo-slide-2',
    title: 'The Solitaire Edit',
    subtitle: 'Each diamond chosen for brilliance. Each setting crafted for eternity.',
    videoDesktop: '',
    videoMobile: '',
    posterImage: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?q=80&w=2070&auto=format&fit=crop',
    primaryCTA: { label: 'Shop Solitaires', link: '/products?collection=solitaire' },
    secondaryCTA: { label: 'Book a Consultation', link: '/contact' },
    isActive: true,
    order: 1,
  },
];

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export const MOCK_CATEGORIES = [
  { _id: 'cat-rings', name: 'Rings', slug: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600', isActive: true },
  { _id: 'cat-necklaces', name: 'Necklaces', slug: 'necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600', isActive: true },
  { _id: 'cat-bangles', name: 'Bangles', slug: 'bangles', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=600', isActive: true },
  { _id: 'cat-earrings', name: 'Earrings', slug: 'earrings', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600', isActive: true },
  { _id: 'cat-bracelets', name: 'Bracelets', slug: 'bracelets', image: 'https://images.unsplash.com/photo-1573408301185-9519f94616b2?q=80&w=600', isActive: true },
  { _id: 'cat-pendants', name: 'Pendants', slug: 'pendants', image: 'https://images.unsplash.com/photo-1634723990215-8e4b4e4f7f9f?q=80&w=600', isActive: true },
];

// ---------------------------------------------------------------------------
// Products (12 demo items)
// ---------------------------------------------------------------------------
const DEMO_PRODUCT_IMAGES = {
  ring: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800',
  ring2: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800',
  necklace: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800',
  bangle: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800',
  earring: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800',
  bracelet: 'https://images.unsplash.com/photo-1573408301185-9519f94616b2?q=80&w=800',
  pendant: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800',
};

export const MOCK_PRODUCTS = [
  {
    _id: 'demo-p-001',
    name: 'Solitaire Diamond Ring',
    slug: 'solitaire-diamond-ring',
    category: 'rings',
    basePrice: 45000,
    images: [DEMO_PRODUCT_IMAGES.ring],
    tags: ['diamond', 'solitaire', 'engagement'],
    isActive: true,
    specs: { metal: '18K White Gold', stone: 'Diamond', purity: '18K', weight: 3.2, gender: 'Women' },
    description: 'A timeless solitaire diamond ring in 18K white gold, perfect for engagements and special occasions.',
    rating: 4.9,
    reviewCount: 124,
  },
  {
    _id: 'demo-p-002',
    name: 'Classic Gold Bangle',
    slug: 'classic-gold-bangle',
    category: 'bangles',
    basePrice: 28000,
    images: [DEMO_PRODUCT_IMAGES.bangle],
    tags: ['gold', 'bangle', 'traditional'],
    isActive: true,
    specs: { metal: '22K Gold', stone: 'None', purity: '22K', weight: 12.5, gender: 'Women' },
    description: 'A beautifully crafted 22K gold bangle with intricate traditional motifs.',
    rating: 4.8,
    reviewCount: 89,
  },
  {
    _id: 'demo-p-003',
    name: 'Diamond Drop Earrings',
    slug: 'diamond-drop-earrings',
    category: 'earrings',
    basePrice: 32000,
    images: [DEMO_PRODUCT_IMAGES.earring],
    tags: ['diamond', 'earrings', 'drop'],
    isActive: true,
    specs: { metal: '18K Yellow Gold', stone: 'Diamond', purity: '18K', weight: 4.1, gender: 'Women' },
    description: 'Elegant diamond drop earrings that catch the light with every movement.',
    rating: 4.7,
    reviewCount: 67,
  },
  {
    _id: 'demo-p-004',
    name: 'Pearl & Gold Necklace',
    slug: 'pearl-gold-necklace',
    category: 'necklaces',
    basePrice: 38000,
    images: [DEMO_PRODUCT_IMAGES.necklace],
    tags: ['pearl', 'necklace', 'gold'],
    isActive: true,
    specs: { metal: '18K Yellow Gold', stone: 'Pearl', purity: '18K', weight: 8.3, gender: 'Women' },
    description: 'Lustrous freshwater pearls set in 18K gold — a statement of timeless grace.',
    rating: 4.9,
    reviewCount: 43,
  },
  {
    _id: 'demo-p-005',
    name: 'Men\'s Gold Band',
    slug: 'mens-gold-band',
    category: 'rings',
    basePrice: 18500,
    images: [DEMO_PRODUCT_IMAGES.ring2],
    tags: ['gold', 'men', 'band', 'wedding'],
    isActive: true,
    specs: { metal: '22K Gold', stone: 'None', purity: '22K', weight: 7.8, gender: 'Men' },
    description: 'A bold and refined 22K gold band for the modern gentleman.',
    rating: 4.6,
    reviewCount: 52,
  },
  {
    _id: 'demo-p-006',
    name: 'Tennis Diamond Bracelet',
    slug: 'tennis-diamond-bracelet',
    category: 'bracelets',
    basePrice: 72000,
    images: [DEMO_PRODUCT_IMAGES.bracelet],
    tags: ['diamond', 'bracelet', 'tennis', 'luxury'],
    isActive: true,
    specs: { metal: '18K White Gold', stone: 'Diamond', purity: '18K', weight: 9.5, gender: 'Women' },
    description: 'A full diamond tennis bracelet in 18K white gold — the ultimate luxury accessory.',
    rating: 5.0,
    reviewCount: 31,
  },
  {
    _id: 'demo-p-007',
    name: 'Ruby Pendant',
    slug: 'ruby-pendant',
    category: 'pendants',
    basePrice: 24000,
    images: [DEMO_PRODUCT_IMAGES.pendant],
    tags: ['ruby', 'pendant', 'gemstone'],
    isActive: true,
    specs: { metal: '18K Yellow Gold', stone: 'Ruby', purity: '18K', weight: 3.0, gender: 'Women' },
    description: 'A rich Burmese ruby pendant in 18K gold, symbolizing passion and prosperity.',
    rating: 4.8,
    reviewCount: 28,
  },
  {
    _id: 'demo-p-008',
    name: 'Emerald Cocktail Ring',
    slug: 'emerald-cocktail-ring',
    category: 'rings',
    basePrice: 56000,
    images: [DEMO_PRODUCT_IMAGES.ring],
    tags: ['emerald', 'cocktail', 'statement', 'gemstone'],
    isActive: true,
    specs: { metal: '18K Yellow Gold', stone: 'Emerald', purity: '18K', weight: 5.6, gender: 'Women' },
    description: 'A bold cocktail ring featuring a vibrant Colombian emerald flanked by diamonds.',
    rating: 4.7,
    reviewCount: 19,
  },
  {
    _id: 'demo-p-009',
    name: 'Jhumka Gold Earrings',
    slug: 'jhumka-gold-earrings',
    category: 'earrings',
    basePrice: 15000,
    images: [DEMO_PRODUCT_IMAGES.earring],
    tags: ['jhumka', 'traditional', 'gold', 'ethnic'],
    isActive: true,
    specs: { metal: '22K Gold', stone: 'None', purity: '22K', weight: 6.2, gender: 'Women' },
    description: 'Traditional handcrafted jhumka earrings in 22K gold with intricate filigree work.',
    rating: 4.9,
    reviewCount: 201,
  },
  {
    _id: 'demo-p-010',
    name: 'Diamond Mangalsutra',
    slug: 'diamond-mangalsutra',
    category: 'necklaces',
    basePrice: 42000,
    images: [DEMO_PRODUCT_IMAGES.necklace],
    tags: ['mangalsutra', 'diamond', 'wedding', 'traditional'],
    isActive: true,
    specs: { metal: '18K Yellow Gold', stone: 'Diamond', purity: '18K', weight: 7.1, gender: 'Women' },
    description: 'A modern mangalsutra with diamond accents, blending tradition with contemporary design.',
    rating: 4.8,
    reviewCount: 77,
  },
  {
    _id: 'demo-p-011',
    name: 'Rose Gold Bangle Set',
    slug: 'rose-gold-bangle-set',
    category: 'bangles',
    basePrice: 34000,
    images: [DEMO_PRODUCT_IMAGES.bangle],
    tags: ['rose gold', 'bangle', 'set', 'modern'],
    isActive: true,
    specs: { metal: '18K Rose Gold', stone: 'None', purity: '18K', weight: 16.0, gender: 'Women' },
    description: 'A set of three stackable rose gold bangles — wear together or separately.',
    rating: 4.6,
    reviewCount: 44,
  },
  {
    _id: 'demo-p-012',
    name: 'Diamond Eternity Band',
    slug: 'diamond-eternity-band',
    category: 'rings',
    basePrice: 68000,
    images: [DEMO_PRODUCT_IMAGES.ring2],
    tags: ['diamond', 'eternity', 'band', 'anniversary'],
    isActive: true,
    specs: { metal: '18K White Gold', stone: 'Diamond', purity: '18K', weight: 4.5, gender: 'Women' },
    description: 'A full eternity band with channel-set diamonds — a perfect anniversary gift.',
    rating: 5.0,
    reviewCount: 88,
  },
];

// ---------------------------------------------------------------------------
// Pricing Rules (empty — safe default)
// ---------------------------------------------------------------------------
export const MOCK_RULES: any[] = [];
