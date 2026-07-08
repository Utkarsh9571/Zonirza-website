/**
 * Centralized Product Image Resolver for Luxury Jewelry
 * Handles legacy image library paths, filename normalization, and fallback logic.
 */

export const PRODUCT_IMAGE_PATH = '/images/images/product';
export const FALLBACK_IMAGE = '/images/images/default-image.png';

// High-quality Unsplash placeholders to resolve when legacy local files are missing
export const UNSPLASH_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800', // Gold ring
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800', // Diamond ring
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800', // Pendant/Necklace
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800', // Bangles
  'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800', // Earrings
  'https://images.unsplash.com/photo-1573408301185-9519f94616b2?q=80&w=800', // Bracelet
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800', // Gemstone pendant
];

/**
 * Resolves a product image filename to its local static path.
 * 
 * @param imageName The filename or path from MongoDB
 * @returns A sanitized, local static path or the premium fallback
 */
export const resolveProductImage = (imageName: any): string => {
  if (!imageName || typeof imageName !== 'string') return FALLBACK_IMAGE;

  const trimmed = imageName.trim();
  if (!trimmed) return FALLBACK_IMAGE;

  // 1. Handle full URLs or data URLs (external or existing)
  if (trimmed.startsWith('http') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // 2. Handle new VPS storage paths that are already correct (V2 Architecture)
  if (
    trimmed.startsWith('/images/products/') || 
    trimmed.startsWith('/images/blogs/') || 
    trimmed.startsWith('/images/misc/') ||
    trimmed.startsWith('/videos/')
  ) {
    return trimmed;
  }

  // 3. Resolve path representation
  let resolvedPath = trimmed;
  if (trimmed.startsWith('/')) {
    if (!trimmed.includes(PRODUCT_IMAGE_PATH)) {
      resolvedPath = `${PRODUCT_IMAGE_PATH}${trimmed}`;
    }
  } else {
    resolvedPath = `${PRODUCT_IMAGE_PATH}/${trimmed.replace(/\s+/g, '-')}`;
  }

  // 4. Map legacy local product path requests to high-quality online placeholders
  // Since legacy product images are not committed to Git, this prevents 400 errors on Vercel
  if (resolvedPath.includes(PRODUCT_IMAGE_PATH)) {
    const filename = resolvedPath.split('/').pop() || '';
    
    // Fallback to default image if there's no filename
    if (!filename || filename === 'default-image.png' || filename === 'product_not_found.jpg') {
      return FALLBACK_IMAGE;
    }

    // Deterministically hash the filename to select an Unsplash placeholder image
    let hash = 0;
    for (let i = 0; i < filename.length; i++) {
      hash = filename.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % UNSPLASH_PLACEHOLDERS.length;
    return UNSPLASH_PLACEHOLDERS[index];
  }

  return resolvedPath;
};

/**
 * Performance-optimized Next.js Image loader configuration
 * Helps with responsive sizing for luxury jewelry assets.
 */
export const imageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  // Currently using local Next.js optimization
  // This is a hook for future CDN/Cloudinary/S3 migration
  return `${src}?w=${width}&q=${quality || 75}`;
};
