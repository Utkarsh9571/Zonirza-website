import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Collection from '@/models/Collection';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zoniraz.com';

  const products = await Product.find({ isActive: true }).select('slug updatedAt').lean();
  const collections = await Collection.find({ isActive: true }).select('slug updatedAt').lean();

  const productUrls = products.map((product: any) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const collectionUrls = collections.map((collection: any) => ({
    url: `${baseUrl}/category/${collection.slug}`,
    lastModified: collection.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...collectionUrls,
    ...productUrls,
  ];
}
