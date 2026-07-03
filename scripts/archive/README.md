# Historical Archive Scripts

The scripts in this directory represent one-time data migrations, catalog fixes, taxonomy recovery utilities, and seeding configurations from past iterations of the Zoniraz jewelry e-commerce platform.

## Archived Scripts Inventory

* **Catalog Seeds**:
  * `importProducts.js`: Product seeder importing raw e-commerce products from JSON datasets.
  * `seedLuxuryVideos.js`: Seeder mapping product-specific loops and preview showcase videos.
  * `seedSolitaireAndCoins.js`: Catalog seeds for solitaires and digital gold products.
* **Pricing Transformations**:
  * `migrateLegacyPricingData.cjs` / `migrateLegacyPricingData.mjs`: One-time script converting legacy price schemas to V3 override definitions.
  * `migratePricingAndDefaults.js`: Injected custom default selectors (defaultMetal, defaultSize).
* **Fixes & Recovery**:
  * `fixCategoryImages.js`: Resolved issues in image asset paths mappings for categories.
  * `fixSilverProducts.js`: Corrected silver jewelry composition properties.
  * `normalizeProducts.js` / `transformProducts.js` / `refactorComposition.js`: Cleanup passes aligning taxonomy properties.
  * `recoverTaxonomy.js` / `reclassifyAndSeed.js`: Reconstructed lost taxonomy category trees.
  * `restoreOriginalProducts.js`: Restored original clean database state from initial backup configs.
