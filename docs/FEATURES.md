# Core System Features & Technical Architecture

The Luxury Jewelry Commerce Starter features an advanced architecture designed specifically for the unique complexities of precious metal and diamond retail.

## 1. Spot Rate & Formula Pricing Engine
Jewelry items are not priced statically. Instead, retail prices are dynamically calculated in real time using base metal weights, metal purities, gemstone weights, and spot market rates.

### The Pricing Formula
The final price of a product configuration is calculated using the following formula:
$$\text{Final Price} = (\text{Metal Cost} + \text{Gemstone/Diamond Cost} + \text{Making Charges} + \text{Base Price}) \times (1 + \text{Markup Margin}) \times (1 + \text{Tax Rate})$$

Where:
- **Metal Cost:** Calculated as:
  $$\text{Metal Cost} = \text{Estimated Weight} \times \text{Spot Rate per gram} \times \text{Purity Ratio}$$
  - **Purity Ratios:** `24K (1.0)`, `22K (0.916)`, `18K (0.750)`, `14K (0.585)`.
- **Diamond/Gemstone Cost:** Computed from configured stone rates (e.g., rate per carat for VVS or ruby) multiplied by the total carats.
- **Making Charges:** Can be set as a flat fee per gram or as a percentage of the metal cost.
- **Estimated Weight:** Dynamically scales based on ring sizes or bracelet lengths relative to the base model size.

## 2. Admin Settings & Overrides
Store administrators can configure global pricing constants and custom margins through the **Admin Portal Settings Dashboard**:
- **Spot Rates:** Live spot rates for Gold (24K) and Silver (99.9%) can be set manually or via API.
- **Global Markups:** Custom percentage markups to protect profit margins against price volatility.
- **Tax Rules:** Configure regional taxes (such as GST or state sales tax).
- **Category Overrides:** Override global rules for specific lines (e.g., custom weight scaling rules for bridal bangles vs. stackable bands).

## 3. Pricing Debugger & Certification
To ensure perfect accounting transparency and deterministic calculations, the repository includes two key developer tools:
- **`pricing-proof.mjs`:** A standalone pricing determinism script. It bypasses the Next.js cache and direct-queries MongoDB to output exact formulas step-by-step for auditing.
- **`verify-pricing.mjs`:** A validation runner script that asserts the consistency of storefront price displays against backend calculations.

## 4. Coupons & Gift Cards
- **Promo Coupons:** Custom coupon matching logic allowing percentage discounts or fixed money off. Supports minimum spending limits, expiry limits, and category constraints.
- **Gift Cards:** Customers can purchase and redeem customizable digital gift cards with secure unique code generation and balance tracking.

## 5. Customer Reviews & File Uploads
- **Interactive Review System:** Allows customers to write ratings, leave detailed text feedback, and upload photo attachments.
- **S3/Cloudinary Uploads:** Integrated file upload handler with file size limiting and file format filters for processing product review images and profile pictures safely.
