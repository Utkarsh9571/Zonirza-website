import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Collection from '@/models/Collection';
import Category from '@/models/Category';
import { BLOG_POSTS } from '@/lib/blog/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zoniraz.com';

  // 1. Fetch Dynamic Products
  let productUrls: any[] = [];
  try {
    const products = await Product.find({ isActive: true }).select('slug updatedAt').lean();
    productUrls = products.map((product: any) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.error('Sitemap product fetch error:', err);
  }

  // 2. Fetch Dynamic Collections
  let collectionUrls: any[] = [];
  try {
    const collections = await Collection.find({ isActive: true }).select('slug updatedAt').lean();
    collectionUrls = collections.map((collection: any) => ({
      url: `${baseUrl}/products?collection=${collection.slug}`,
      lastModified: collection.updatedAt ? new Date(collection.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.error('Sitemap collection fetch error:', err);
  }

  // 3. Fetch Dynamic Categories
  let categoryUrls: any[] = [];
  try {
    const categories = await Category.find().select('slug updatedAt').lean();
    categoryUrls = categories.map((category: any) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  } catch (err) {
    console.error('Sitemap category fetch error:', err);
  }

  // 4. Fetch Dynamic Blogs from posts.ts
  const blogUrls = BLOG_POSTS.map((post) => {
    // Post dates are in format like "May 5, 2026", convert safely to Date object
    let postDate = new Date();
    try {
      const parsedDate = Date.parse(post.date);
      if (!isNaN(parsedDate)) {
        postDate = new Date(parsedDate);
      }
    } catch (e) {
      // Fallback to now
    }
    
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: postDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  // 5. Static Pages
  const staticPaths = [
    { url: '', priority: 1.0, changeFrequency: 'daily' as const },
    { url: '/products', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/exchange', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/digi-gold', priority: 0.9, changeFrequency: 'daily' as const, hidden: true },
    { url: '/digi-gold/sip', priority: 0.9, changeFrequency: 'daily' as const, hidden: true },
    { url: '/terms', priority: 0.5, changeFrequency: 'monthly' as const },
    { url: '/privacy', priority: 0.5, changeFrequency: 'monthly' as const },
    { url: '/help', priority: 0.6, changeFrequency: 'weekly' as const },
  ];

  const staticUrls = staticPaths.filter(path => !(path as any).hidden).map((path) => ({
    url: `${baseUrl}${path.url}`,
    lastModified: new Date(),
    changeFrequency: path.changeFrequency,
    priority: path.priority,
  }));

  return [
    ...staticUrls,
    ...categoryUrls,
    ...collectionUrls,
    ...productUrls,
    ...blogUrls,
  ];
}
