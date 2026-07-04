# Starter Pricing Architecture

## Overview

The dynamic pricing engine is formula-driven and calculates prices dynamically based on product configuration and material costs.

## Formula Breakdown

### Total Price = Metal Price + Making Charges + Stone Price + GST

Where:
- **GST**: 3% of (Metal Price + Making Charges + Stone Price)

---

## Component Details

### 1. Metal Price
Calculated as:
```
Metal Price = (Estimated Weight) × (24K Gold Rate per Gram) × (Purity Multiplier)
```

**Purity Multipliers**:
- 24K: 1.0
- 22K: 0.916
- 18K: 0.750
- 14K: 0.585
- 9K: 0.375

**Estimated Weight**:
- For rings, bangles, etc.: Base Weight ± (Size × Size Weight Offset)
- Size 12 = Base Size (default weight)

---

### 2. Stone Price
Calculated as:
```
Stone Price = (Diamond Weight in Carats) × (Diamond Quality Rate per Carat)
```

**Diamond Quality Rates (per carat)**:
- EF-VVS: ₹85,000
- GH-VS: ₹65,000
- GHI-VS: ₹55,000
- FG-SI: ₹45,000
- IJ-SI: ₹35,000
- Diamond-Standard: ₹40,000

---

### 3. Making Charges
Hierarchy of sources:
1. `product.pricingOverrides.makingCharges` (if present)
2. `product.categoryOverrides.makingCharges` (if present)
3. `product.categoryConfig.makingCharges` (if present)
4. `product.makingCharges` (if present and >0)
5. **Fallback**: 15% of metal price

---

## Data Model

Key product fields:
- `baseWeight`: Base metal weight in grams (required for formula)
- `diamondWeightCarats`: Diamond weight in carats (for diamond jewelry)
- `jewelryType`: "gold", "diamond", or "gemstone" (determines stone pricing logic)
- `makingCharges`: Direct making charges (if not using category rules)
- `pricingOverrides`: Override specific pricing factors per product
- `categoryConfig`: Category-level pricing rules

---

## Default Configuration
All storefront components (Product Card, PDP, Cart, Checkout) use `sharedDefaultProductConfiguration` from `lib/ecommerce.ts` to ensure consistent pricing.

---

## Admin Panel Usage
- **Computed Base Price**: Read-only field that shows calculated price using default options
- **Editable Fields**:
  - Base Weight
  - Diamond Weight
  - Making Charges
  - Pricing Overrides
  - Category Configuration

---

## Migration
To normalize existing products, run `node scripts/archive/migrateLegacyPricingData.cjs`. This script populates:
- `baseWeight` from `specs.Gold Weight`
- `diamondWeightCarats` from `specs.Diamond Weight`
- `jewelryType` inferred from product data
- `stoneType` inferred from product data
