import mongoose from 'mongoose';
import Settings from '@/models/Settings';
import Coupon from '@/models/Coupon';
import Product from '@/models/Product';
import { calculatePricing, ProductConfiguration, PricingBreakdown } from './pricing';

export interface SecurePricingResult {
  items: Array<{
    productId: string;
    name: string;
    slug: string;
    image: string;
    quantity: number;
    price: number;
    configuration: ProductConfiguration;
    pricingBreakdown: PricingBreakdown;
  }>;
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  gstAmount: number;
  shippingCharge: number;
  totalAmount: number;
}

/**
 * SECURE SERVER-SIDE PRICING ENGINE
 * Re-calculates everything based on database state.
 * This file is server-only and should not be imported in Client Components.
 */
export async function secureCalculateOrderTotal(
  cartItems: any[],
  couponCode?: string
): Promise<SecurePricingResult> {
  // 1. Fetch dynamic settings and rates
  const settings = await Settings.findOne({});
  const rates = settings?.pricingFactors?.metalRates || { gold24k: 6500, silver: 100, platinum: 4000 };
  const gstPercentage = settings?.pricingFactors?.gstPercentage || 3;
  const shippingBase = settings?.pricingFactors?.shippingBaseCharge || 0;
  const freeShippingThreshold = settings?.pricingFactors?.freeShippingThreshold || 5000;

  const resultItems: any[] = [];
  let subtotal = 0;

  // 2. Re-calculate each item
  for (const item of cartItems) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) {
      throw new Error(`Product ${item.name} is no longer available.`);
    }

    // Hydrate Category Config
    const Category = (await import('@/models/Category')).default;
    const categoryDoc = await Category.findOne({ slug: product.category }).lean();
    const categoryConfig = categoryDoc?.config || undefined;

    // Recalculate item price based on config
    const breakdown = calculatePricing(
      { 
        basePrice: product.basePrice, 
        baseWeight: product.baseWeight, 
        makingCharges: product.makingCharges,
        category: product.category,
        jewelryType: product.jewelryType,
        stoneType: product.stoneType,
        specs: product.specs,
        pricingOverrides: product.pricingOverrides,
        categoryConfig: categoryConfig,
        categoryOverrides: product.categoryOverrides
      },
      item.configuration,
      settings?.pricingFactors
    );

    const itemTotal = breakdown.totalPrice * item.quantity;
    subtotal += itemTotal;

    resultItems.push({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0], // Secure snapshot
      quantity: item.quantity,
      price: breakdown.totalPrice,
      configuration: item.configuration,
      pricingBreakdown: breakdown
    });
  }

  // 3. Coupon Validation
  let discountAmount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon) {
      const now = new Date();
      if (now <= coupon.expirationDate && coupon.usedCount < coupon.usageLimit && subtotal >= coupon.minCartValue) {
        if (coupon.discountType === 'percentage') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscount);
          }
        } else {
          discountAmount = coupon.discountValue;
        }
      }
    }
  }

  const taxableAmount = subtotal - discountAmount;
  const gstAmount = Math.round((taxableAmount * gstPercentage) / 100);
  const shippingCharge = taxableAmount >= freeShippingThreshold ? 0 : shippingBase;
  const totalAmount = taxableAmount + gstAmount + shippingCharge;

  return {
    items: resultItems,
    subtotal: Math.round(subtotal),
    discountAmount: Math.round(discountAmount),
    couponCode: discountAmount > 0 ? couponCode?.toUpperCase() : undefined,
    gstAmount,
    shippingCharge,
    totalAmount: Math.round(totalAmount)
  };
}
