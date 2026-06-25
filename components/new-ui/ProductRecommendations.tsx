'use client';

import React, { useEffect, useState } from 'react';
import { Section } from './Section';
import { ProductCard } from './ProductCard';
import { IProduct } from '@/models/Product';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const ProductRecommendations = ({ productSlug }: { productSlug: string }) => {
  const [recommendations, setRecommendations] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [productSlug]);

  const fetchRecommendations = async () => {
    try {
      const res = await fetch(`/api/products/${productSlug}/recommendations`);
      const json = await res.json();
      if (json.success) {
        setRecommendations(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || recommendations.length === 0) {
    return null;
  }

  return (
    <Section className="!py-20 bg-brand-bg dark:bg-[#1a1614] transition-colors border-t border-brand-text/5 dark:border-white/5">
      <div className="max-w-[1440px] mx-auto space-y-12 px-6">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif text-brand-text">You May Also Like</h2>
            <div className="w-16 h-px bg-brand-gold"></div>
          </div>
          <Link href="/products" className="hidden md:flex items-center space-x-2 text-[11px] uppercase tracking-widest text-brand-text/60 hover:text-brand-gold transition-colors font-bold group">
            <span>View All</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {recommendations.slice(0, 4).map((product) => (
            <ProductCard 
              key={product.slug} 
              slug={product.slug} 
              name={product.name} 
              price={product.basePrice} 
              image={product.images?.[0] || ''} 
              images={product.images}
              variantImages={product.variantImages}
              product={product}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};
