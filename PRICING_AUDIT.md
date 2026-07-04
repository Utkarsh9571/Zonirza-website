
# Luxury Jewelry Pricing Architecture Audit

## 1. Raw MongoDB Product Document
From the audit, here's the relevant fields for the "Apex Stackable Double Row Diamond Ring":
```javascript
{
  _id: "6a1ac094063ed907f92d9e6f",
  name: "Apex Stackable double row Diamond Ring",
  basePrice: 22720, // Admin shows this
  makingCharges: 250, 
  // 🔴 CRITICAL ISSUE: No baseWeight field!
  // 🔴 CRITICAL ISSUE: No jewelryType set!
  // 🔴 CRITICAL ISSUE: No stoneType set!
  specs: {
    "Gold Weight": "3.04g", 
    "Diamond Weight": ".06ct"
  },
  configurableOptions: {
    stones: ["VVS1", "VS1", "SI1", "Diamond-Standard"], // mapLegacyStones() maps "VVS1" → "EF-VVS"
    sizes: ["5", ... , "20"],
    purities: ["9K","14K","18K"],
    metals: ["white-gold","yellow-gold","rose-gold"]
  },
  defaultMetal: "yellow-gold"
}
```

---

## 2. Product Card Logic
**Component File**: `components/new-ui/ProductCard.tsx`
**Key Issues**:
- When `product.jewelryType` is not set → `isDiamond` becomes `false`, so stone price is **not added**!
- Because `product.baseWeight` is missing, `baseWeightVal = product.baseWeight || product.price ||5.0` falls back to 5.0g! But specs say "Gold Weight": "3.04g", which is ignored!
- Price shown = formula-driven, but admin's `basePrice` is completely ignored!

---

## 3. PDP Logic
**Component File**: `components/new-ui/ProductInteractiveUI.tsx`
**Key Issues**:
- Same problem! `jewelryType` not set, so diamond price isn't calculated correctly! Also baseWeight missing!
- Initial configuration uses `sharedDefaultProductConfiguration`, which sets `size` to '12' and maps stones!
- Admin's `basePrice` not used at all!

---

## 4. Admin Product Editor
**Component File**: `app/admin/(dashboard)/products/[id]/page.tsx`
**Editable Fields**: basePrice, makingCharges, baseWeight, etc.
**Issues**:
- The `basePrice` admin edits is NOT used by `calculatePricing()` anywhere!
- Admin can set basePrice but it has zero impact on storefront pricing!
- Admin's makingCharges is sometimes used, but there are 5 levels of precedence!


---

## Why 15,522 ≠17,096 ≠22,720:
- 22,720: This is the admin basePrice, which calculatePricing() completely ignores!
- 15,522 & 17,096: Calculated from formula with no diamond weight (because no jewelryType!), different size/purity/stone choices!

---

## FINAL RECOMMENDATION:

**Option B (Admin basePrice drives everything!)** with adjustments:
1. Make `basePrice` (admin-edited) the starting point
2. Apply formula adjustments (metal, purity, diamond, size) on top of basePrice
3. Ensure jewelryType, stoneType, baseWeight are set correctly in DB
