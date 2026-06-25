/**
 * Intelligent Product Image Selection Logic
 * Selects the most contextually relevant image based on search, filters, or default prioritization.
 */

export interface ImageContext {
  search?: string;
  metal?: string;
}

/**
 * Returns the best thumbnail filename for a product given a user context.
 * 
 * @param product The product object (must include images and variantImages map)
 * @param context Optional context containing search query or active metal filter
 * @returns The selected image filename
 */
export const getProductThumbnail = (product: any, context?: ImageContext): string => {
  if (!product) return '';
  
  const variantImagesRaw = product.variantImages || {};
  const images = product.images || [];

  // Normalize variantImage keys safely
  const variantImages: Record<string, string> = {};
  Object.keys(variantImagesRaw).forEach(k => {
    variantImages[k.toLowerCase().replace(/\s+/g, '-')] = variantImagesRaw[k];
  });

  // 1. Explicit Metal Context (from filters)
  if (context?.metal) {
    const metalKey = context.metal.toLowerCase().replace(/\s+/g, '-');
    
    // Exact match
    if (variantImages[metalKey]) return variantImages[metalKey];
    
    // Mapping for common synonyms if needed
    if (metalKey === 'silver' || metalKey === 'white-gold' || metalKey === 'platinum') {
      const bestSilver = variantImages['white-gold'] || variantImages['default'] || variantImages['platinum'] || variantImages['silver'];
      if (bestSilver) return bestSilver;
    }
  }

  // 2. Search Context Awareness
  if (context?.search) {
    const query = context.search.toLowerCase();
    
    // Check for metal keywords in search query
    if (query.includes('rose')) {
      if (variantImages['rose-gold']) return variantImages['rose-gold'];
    }
    
    if (query.includes('gold') && !query.includes('white') && !query.includes('rose')) {
      if (variantImages['yellow-gold']) return variantImages['yellow-gold'];
    }

    if (query.includes('silver') || query.includes('white') || query.includes('platinum')) {
      const bestSilver = variantImages['white-gold'] || variantImages['default'] || variantImages['platinum'] || variantImages['silver'];
      if (bestSilver) return bestSilver;
    }
  }

  // 3. Default Prioritization Logic: Gold > Rose Gold > Silver
  // As per requirement: Gold performs better on luxury/light/dark backgrounds
  if (variantImages['yellow-gold']) return variantImages['yellow-gold'];
  if (variantImages['rose-gold']) return variantImages['rose-gold'];
  if (variantImages['white-gold']) return variantImages['white-gold'];
  if (variantImages['default']) return variantImages['default'];
  if (variantImages['platinum']) return variantImages['platinum'];
  if (variantImages['silver']) return variantImages['silver'];

  // 4. Fallback to the first image in the array
  return images[0] || '';
};
