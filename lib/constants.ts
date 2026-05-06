export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800';

export const getValidImageUrl = (url: any): string => {
  if (typeof url !== 'string' || !url.trim()) return PLACEHOLDER_IMAGE;
  
  const trimmed = url.trim();
  
  // If it's a data URL, it's valid for next/image
  if (trimmed.startsWith('data:')) return trimmed;
  
  // If it's a relative path or an absolute URL, it's likely valid
  if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('./')) {
    return trimmed;
  }
  
  // If it's just a filename like "image.jpg", check if it's potentially a local image
  // but for safety with next/image URL constructor, we return placeholder if it's not a clear path
  // or we could try returning it with a leading slash.
  // Given the current error "Failed to construct 'URL'", a leading slash might help or it might just be an invalid string.
  
  // Let's be aggressive: if it doesn't look like a URL or a path, use placeholder
  if (!trimmed.includes('.') || trimmed.includes(' ')) return PLACEHOLDER_IMAGE;
  
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};
