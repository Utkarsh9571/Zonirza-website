import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Collection from '@/models/Collection';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const report = {
      categoriesCreated: [] as string[],
      collectionsCreated: [] as string[],
      productsCreated: [] as string[],
      errors: [] as string[]
    };

    const categoriesToEnsure = [
      { name: 'Rings', slug: 'rings', image: '/images/site/rings_category.png' },
      { name: 'Earrings', slug: 'earrings', image: '/images/site/earrings_category.png' },
      { name: 'Pendants', slug: 'pendants', image: '/images/site/pendants_category.png' },
      { name: 'Chains', slug: 'chains', image: '/images/images/product/default-16345643112830.jpg' },
      { name: 'Necklaces', slug: 'necklaces', image: '/images/images/product/yellow-gold-16010959532807.jpg' },
      { name: 'Bangles', slug: 'bangles', image: '/images/images/product/default-16345651242469.jpg' },
      { name: 'Bracelets', slug: 'bracelets', image: '/images/images/product/rose-gold-16010347432265.jpg' },
      { name: 'Mangalsutras', slug: 'mangalsutras', image: '/images/images/product/yellow-gold-16010972111558.jpg' },
      { name: 'Nose Pins', slug: 'nose-pins', image: '/images/site/nose_pins_category.png' },
      { name: 'Solitaires', slug: 'solitaires', image: '/images/images/product/rose-gold-16017058153130.jpg' },
      { name: 'Coins', slug: 'coins', image: '/images/images/product/yellow-gold-16010271191566.jpg' },
      { name: 'Men\'s Jewellery', slug: 'mens-jewellery', image: '/images/site/men_jewelry.png' },
      { name: 'Women\'s Jewellery', slug: 'womens-jewellery', image: '/images/site/women_jewelry.png' },
      { name: 'Kids Jewellery', slug: 'kids-jewellery', image: '/images/site/kids_jewelry.png' }
    ];

    const collectionsToEnsure = [
      { name: 'Bridal Jewellery', slug: 'bridal', tags: ['bridal', 'wedding'] },
      { name: 'Daily Wear', slug: 'everyday-luxury', tags: ['daily', 'everyday-luxury', 'everyday'] },
      { name: 'Office Wear', slug: 'office-wear', tags: ['office-wear', 'workwear'] },
      { name: 'Festive Collection', slug: 'festive', tags: ['festive', 'celebration'] },
      { name: 'Diamond Collection', slug: 'diamond-collection', tags: ['diamond', 'diamonds'] },
      { name: 'Gold Collection', slug: 'gold-collection', tags: ['gold'] },
      { name: 'Heritage', slug: 'heritage', tags: ['heritage', 'vintage'] },
      { name: 'Minimal', slug: 'minimal', tags: ['minimal', 'minimalist'] }
    ];

    // 1. Ensure Categories
    for (const catData of categoriesToEnsure) {
      let cat = await Category.findOne({ slug: catData.slug });
      if (!cat) {
        cat = await Category.findOne({ name: { $regex: new RegExp(`^${catData.name}$`, 'i') } });
      }
      
      if (!cat) {
        cat = await Category.create({
          name: catData.name,
          slug: catData.slug,
          image: catData.image || '/images/site/default-category.jpg',
          description: `Explore our stunning collection of ${catData.name}.`
        });
        report.categoriesCreated.push(catData.name);
      }

      // Check if it has products
      const pCount = await Product.countDocuments({ category: { $in: [cat.slug, cat.name, catData.slug, catData.name] } });
      if (pCount === 0) {
        // Create demo product
        const prod = await Product.create({
          name: `Premium ${cat.name} Showcase`,
          slug: `premium-${cat.slug}-showcase-${Date.now()}`,
          category: cat.slug,
          images: [cat.image || '/images/site/default-category.jpg'],
          description: `A masterfully crafted premium piece from our ${cat.name} collection. This item serves to demonstrate the exquisite quality and design available in this category. Features intricate detailing and superior finish.`,
          basePrice: 45000,
          makingCharges: 5000,
          stockStatus: 'in-stock',
          isActive: true,
          baseWeight: 10.5,
          tags: ['premium', 'showcase'],
          specs: {
            metal: '18KT Gold',
            purity: '18KT',
            weight: '10.5g'
          },
          goldPurityOptions: ['18KT', '22KT'],
          jewelryType: 'gold',
          configurableOptions: {
            metals: ['Yellow Gold', 'Rose Gold', 'White Gold'],
            purities: ['18KT', '22KT'],
            sizes: ['Standard']
          }
        });
        report.productsCreated.push(`Product for Category: ${cat.name}`);
      }
    }

    // 2. Ensure Collections
    for (const colData of collectionsToEnsure) {
      let col = await Collection.findOne({ slug: colData.slug });
      if (!col) {
        col = await Collection.findOne({ name: { $regex: new RegExp(`^${colData.name}$`, 'i') } });
      }
      
      if (!col) {
        col = await Collection.create({
          name: colData.name,
          slug: colData.slug,
          image: '/images/site/default-collection.jpg',
          tags: colData.tags,
          priority: 10,
          isActive: true
        });
        report.collectionsCreated.push(colData.name);
      }

      // Check products
      let count = 0;
      if (col.tags && col.tags.length > 0) {
        count = await Product.countDocuments({ tags: { $in: col.tags } });
      }

      if (count === 0) {
        // Add a product for this collection
        await Product.create({
          name: `Signature ${col.name} Piece`,
          slug: `signature-${col.slug}-piece-${Date.now()}`,
          category: 'rings', // generic fallback
          images: ['/images/images/product/yellow-gold-16010972111558.jpg'],
          description: `An exclusive signature piece representing the essence of our ${col.name}. Meticulously designed for those who appreciate unparalleled craftsmanship.`,
          basePrice: 65000,
          makingCharges: 8000,
          stockStatus: 'in-stock',
          isActive: true,
          baseWeight: 15,
          tags: col.tags.length > 0 ? [...col.tags, 'premium'] : ['premium', col.slug],
          specs: {
            metal: '22KT Gold',
            purity: '22KT',
            weight: '15g'
          },
          goldPurityOptions: ['18KT', '22KT'],
          jewelryType: 'gold',
          configurableOptions: {
            metals: ['Yellow Gold'],
            purities: ['22KT'],
            sizes: ['Standard']
          }
        });
        report.productsCreated.push(`Product for Collection: ${col.name}`);
      }
    }

    return NextResponse.json(report);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
