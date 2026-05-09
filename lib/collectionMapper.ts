/**
 * Collection Mapping Layer
 * Maps editorial marketing collections to database-driven filters (tags, categories, price, specs).
 */

export interface CollectionMapping {
  tags?: string[];
  categories?: string[];
  specs?: Record<string, string[]>;
  minPrice?: number;
  maxPrice?: number;
  gender?: string[];
  fallbackTags?: string[];
}

export const COLLECTION_MAPPINGS: Record<string, CollectionMapping> = {
  'bridal': {
    tags: ['wedding', 'engagement', 'bridal'],
    categories: ['engagement-rings', 'diamond-necklace-set', 'necklace-set', 'bangles-bangles'],
    specs: { stone: ['diamond', 'emerald', 'ruby'] },
    fallbackTags: ['diamond', 'premium']
  },
  'everyday-luxury': {
    tags: ['office wear', 'dailywear', 'minimal', 'everyday'],
    categories: ['office-wear', 'plain-gold', 'studs-earrings', 'pendants'],
    maxPrice: 40000,
    fallbackTags: ['plain-gold', 'minimal']
  },
  'statement': {
    tags: ['premium', 'luxury', 'cocktail', 'statement'],
    categories: ['cocktail', 'diamond-rings', 'necklace-set'],
    minPrice: 60000,
    fallbackTags: ['diamond', 'luxury']
  },
  'office-wear': {
    tags: ['office wear', 'minimal', 'workwear'],
    categories: ['office-wear', 'studs-earrings', 'plain-gold-pendants'],
    gender: ['women'],
    maxPrice: 25000
  },
  'modern-classics': {
    tags: ['classic', 'modern', 'timeless'],
    categories: ['diamond-rings', 'solitaire-rings-solitaires', 'plain-gold-earrings'],
    fallbackTags: ['gold', 'diamond']
  },
  'trending': {
    tags: ['trending', 'bestseller', 'new'],
    categories: ['diamond-rings', 'hoops-earrings'],
    fallbackTags: ['featured', 'new']
  },
  'minimal': {
    tags: ['minimal', 'simple', 'sleek'],
    categories: ['plain-gold', 'studs-earrings', 'nose-pins-all-jewellery'],
    maxPrice: 20000
  },
  'solitaire': {
    tags: ['solitaire', 'premium', 'diamond'],
    categories: ['solitaire-rings-solitaires', 'solitaire-pendants-solitaires', 'ring-solitaires'],
    fallbackTags: ['diamond']
  },
  'heritage': {
    tags: ['vintage', 'heritage', 'traditional'],
    categories: ['religious-pendants', 'gold-mangalsutras', 'antique'],
    specs: { metal: ['yellow-gold'] },
    fallbackTags: ['gold', 'traditional']
  },
  'featured': {
    tags: ['featured', 'curated', 'exclusive'],
    fallbackTags: ['premium', 'luxury']
  }
};

/**
 * Resolves a marketing collection name to its filter criteria.
 * 
 * @param collectionName The slug/name of the collection
 * @returns The mapping criteria or null if not found
 */
export const resolveCollectionMapping = (collectionName: string): CollectionMapping | null => {
  if (!collectionName) return null;
  const normalized = collectionName.toLowerCase();
  return COLLECTION_MAPPINGS[normalized] || null;
};
