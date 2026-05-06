'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from './Button';

interface AddToCartButtonProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = () => {
    if (isAnimating) return; // simple debounce

    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    setIsAdded(true);
    setIsAnimating(true);

    setTimeout(() => {
      setIsAdded(false);
      setIsAnimating(false);
    }, 2000);
  };

  return (
    <Button 
      size="lg" 
      className={`w-full !py-6 shadow-premium transition-all duration-300 ${
        isAdded ? 'bg-green-600 hover:bg-green-700' : ''
      }`}
      onClick={handleAddToCart}
    >
      {isAdded ? 'Added to Cart ✓' : 'Add to Cart'}
    </Button>
  );
}
