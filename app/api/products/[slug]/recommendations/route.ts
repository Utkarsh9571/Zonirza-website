import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Collection from '@/models/Collection';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '4');
    
    // Parse recently viewed from query, e.g., ?recentlyViewed=slug1,slug2
    const recentlyViewedStr = searchParams.get('recentlyViewed') || '';
    const recentlyViewedSlugs = recentlyViewedStr.split(',').filter(Boolean);

    const product = await Product.findOne({ slug });
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    const recommendations = [];
    const recommendedSlugs = new Set([slug]); // Exclude the current product itself

    // Strategy 1: Same Category & Metal Affinity
    const metalAffinity = product.specs?.get('metal') || (product.configurableOptions?.metals && product.configurableOptions.metals[0]);
    if (metalAffinity) {
      const affinityProducts = await Product.find({
        _id: { $ne: product._id },
        category: product.category,
        $or: [
          { "specs.metal": metalAffinity },
          { "configurableOptions.metals": metalAffinity }
        ],
        isActive: true
      }).limit(2).select('name slug images variantImages basePrice category tags');
      
      for (const p of affinityProducts) {
        if (!recommendedSlugs.has(p.slug)) {
          recommendations.push(p);
          recommendedSlugs.add(p.slug);
        }
      }
    }

    // Strategy 2: Same Collection
    // Find collections this product belongs to based on its tags
    if (product.tags.length > 0) {
      const activeCollections = await Collection.find({ 
        isActive: true,
        tags: { $in: product.tags }
      });

      if (activeCollections.length > 0) {
        // Collect tags from all collections this product is in
        const collectionTags = activeCollections.flatMap(c => c.tags);
        const collectionProducts = await Product.find({
          _id: { $ne: product._id },
          tags: { $in: collectionTags },
          isActive: true
        }).limit(2).select('name slug images variantImages basePrice category tags');

        for (const p of collectionProducts) {
          if (!recommendedSlugs.has(p.slug)) {
            recommendations.push(p);
            recommendedSlugs.add(p.slug);
          }
        }
      }
    }

    // Strategy 3: Recently Viewed Cross-Pollination
    if (recentlyViewedSlugs.length > 0) {
      const recentProducts = await Product.find({
        slug: { $in: recentlyViewedSlugs, $ne: slug },
        isActive: true
      }).limit(2).select('name slug images variantImages basePrice category tags');

      for (const p of recentProducts) {
        if (!recommendedSlugs.has(p.slug)) {
          recommendations.push(p);
          recommendedSlugs.add(p.slug);
        }
      }
    }

    // Fill the rest with trending/random in same category if we don't have enough
    if (recommendations.length < limit) {
      const fillAmount = limit - recommendations.length;
      const fillProducts = await Product.find({
        slug: { $nin: Array.from(recommendedSlugs) },
        category: product.category,
        isActive: true
      }).limit(fillAmount).select('name slug images variantImages basePrice category tags');

      for (const p of fillProducts) {
        recommendations.push(p);
        recommendedSlugs.add(p.slug);
      }
    }

    // Still not enough? Just get random active products
    if (recommendations.length < limit) {
      const fillAmount = limit - recommendations.length;
      const fillProducts = await Product.find({
        slug: { $nin: Array.from(recommendedSlugs) },
        isActive: true
      }).limit(fillAmount).select('name slug images variantImages basePrice category tags');

      for (const p of fillProducts) {
        recommendations.push(p);
      }
    }

    return NextResponse.json({
      success: true,
      data: recommendations.slice(0, limit)
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
