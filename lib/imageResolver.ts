/**
 * Centralized Product Image Resolver for Luxury Jewelry
 * Handles legacy image library paths, filename normalization, and fallback logic.
 */

export const PRODUCT_IMAGE_PATH = '/images/images/product';
export const FALLBACK_IMAGE = '/images/images/default-image.png';

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

  // 3. Handle already resolved paths (starting with /)
  if (trimmed.startsWith('/')) {
    // If it's already a full legacy path like /images/images/product/xxx, return it
    if (trimmed.includes(PRODUCT_IMAGE_PATH)) return trimmed;
    
    // If it's just /filename.jpg, prepend our base path
    return `${PRODUCT_IMAGE_PATH}${trimmed}`;
  }

  // 4. Handle filename-only mapping (most common for legacy migration)
  // Normalize: handle spaces, inconsistent extensions if needed
  const normalizedName = trimmed.replace(/\s+/g, '-');

  // Logic: Return the normalized path
  return `${PRODUCT_IMAGE_PATH}/${normalizedName}`;
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
