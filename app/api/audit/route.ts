import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Collection from '@/models/Collection';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await dbConnect();

    // 1. Audit Categories
    const categories = await Category.find();
    const emptyCategories = [];
    const populatedCategories = [];

    for (const cat of categories) {
      const count = await Product.countDocuments({ category: { $regex: new RegExp(`^${cat.slug}$`, 'i') } });
      if (count === 0) {
        // Also check by name
        const countByName = await Product.countDocuments({ category: { $regex: new RegExp(`^${cat.name}$`, 'i') } });
        if (countByName === 0) {
          emptyCategories.push({ name: cat.name, slug: cat.slug });
        } else {
          populatedCategories.push(cat.name);
        }
      } else {
        populatedCategories.push(cat.name);
      }
    }

    // 2. Audit Collections
    const collections = await Collection.find();
    const emptyCollections = [];
    const populatedCollections = [];

    for (const col of collections) {
      let count = 0;
      if (col.tags && col.tags.length > 0) {
        count = await Product.countDocuments({ tags: { $in: col.tags } });
      }
      if (count === 0) {
        emptyCollections.push({ name: col.name, slug: col.slug, tags: col.tags });
      } else {
        populatedCollections.push(col.name);
      }
    }

    // Check specific required categories from prompt:
    const requiredCategories = [
      'Rings', 'Earrings', 'Pendants', 'Chains', 'Necklaces', 'Bangles', 
      'Bracelets', 'Mangalsutras', 'Nose Pins', 'Solitaires', 'Coins', 
      "Men's Jewellery", "Women's Jewellery", 'Kids Jewellery', 
      'Bridal Jewellery', 'Daily Wear', 'Office Wear', 'Festive Collection', 
      'Diamond Collection', 'Gold Collection'
    ];

    const missingOrEmptyRequired = [];
    for (const req of requiredCategories) {
      // Check if it exists in categories
      const catMatch = categories.find(c => c.name.toLowerCase() === req.toLowerCase());
      const colMatch = collections.find(c => c.name.toLowerCase() === req.toLowerCase());

      if (catMatch) {
        if (emptyCategories.find(e => e.name === catMatch.name)) {
          missingOrEmptyRequired.push(req + " (Empty Category)");
        }
      } else if (colMatch) {
        if (emptyCollections.find(e => e.name === colMatch.name)) {
          missingOrEmptyRequired.push(req + " (Empty Collection)");
        }
      } else {
        missingOrEmptyRequired.push(req + " (Missing from DB entirely)");
      }
    }

    return NextResponse.json({
      emptyCategories,
      emptyCollections,
      missingOrEmptyRequired,
      allCategories: categories.map(c => c.name),
      summary: {
        totalCategories: categories.length,
        emptyCategoriesCount: emptyCategories.length,
        totalCollections: collections.length,
        emptyCollectionsCount: emptyCollections.length
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
