# Scripts Inventory and Classification

This document provides a comprehensive audit, classification inventory, and operational guide for all command-line scripts in the Zoniraz repository.

---

## 1. Production Scripts (`scripts/production/`)

These are production utilities used for system certification, validation suite execution, or initial setup tasks.

### `final-production-acceptance.mjs`
* **Classification**: `KEEP` (Production utility)
* **Reason**: Production business workflow test suite.
* **Historical Notes**: Added during the V3.1 Pricing update to simulate user journeys from Product Listing Cards to Cart/Checkout and assert strict price consistency across all views upon database rate fluctuations.
* **Production Usage Instructions**:
  Run this script in a local or staging environment containing active database connections to perform a full system integration check:
  ```bash
  node scripts/production/final-production-acceptance.mjs
  ```

### `mediaPipeline.js`
* **Classification**: `KEEP` (Production utility)
* **Reason**: Production image repository synchronization and optimization pipeline.
* **Historical Notes**: Developed to resolve discrepancies between local media uploads and standard static fallback files. It structures image subfolders inside production media folders.
* **Production Usage Instructions**:
  Ensure local media variables are set in environment files, then run:
  ```bash
  node scripts/production/mediaPipeline.js
  ```

### `pricing-certification.mjs`
* **Classification**: `KEEP` (Production utility)
* **Reason**: Unit check certifying pricing calculator formula logic.
* **Historical Notes**: Built during V3 pricing implementation to compare standard formula execution steps against simulated price calculations.
* **Production Usage Instructions**:
  Verify calculations before deploying pricing changes:
  ```bash
  node scripts/production/pricing-certification.mjs
  ```

### `pricing-parity-certification.mjs`
* **Classification**: `KEEP` (Production utility)
* **Reason**: Automated price parity checking suite.
* **Historical Notes**: Asserts that card price equals PDP price, cart price, checkout total, and order DB saved values for standard test product lines.
* **Production Usage Instructions**:
  Execute to assert price parity:
  ```bash
  node scripts/production/pricing-parity-certification.mjs
  ```

### `seed-pricing-defaults.mjs`
* **Classification**: `KEEP` (Production utility)
* **Reason**: Database seeder for default pricing values.
* **Historical Notes**: Restores system defaults for metal rates, gold margins, diamond adjustments, and category configurations.
* **Production Usage Instructions**:
  Reset database defaults (requires connection variables inside `.env.local`):
  ```bash
  node scripts/production/seed-pricing-defaults.mjs
  ```

---

## 2. Archived Scripts (`scripts/archive/`)

These represent historical, one-time migrations, data formatting fixes, or onboarding setup tasks that are preserved for audit purposes.

### `fixCategoryImages.js`
* **Classification**: `ARCHIVE` (Historical one-time migration)
* **Reason**: Resolved image path format discrepancies in early database category configurations.
* **Historical Notes**: Ran once to fix category banner URLs pointing to absolute paths rather than relative storage routes.

### `fixSilverProducts.js`
* **Classification**: `ARCHIVE` (Historical one-time migration)
* **Reason**: Corrected composition parameters for silver jewelry.
* **Historical Notes**: Ran once to update attributes of products made with silver instead of gold.

### `importProducts.js`
* **Classification**: `ARCHIVE` (Historical seeder)
* **Reason**: Initial bulk import of products.
* **Historical Notes**: Imported catalog items from raw legacy JSON files during initial environment setup.

### `migrateLegacyPricingData.cjs` & `migrateLegacyPricingData.mjs`
* **Classification**: `ARCHIVE` (Historical one-time migration)
* **Reason**: Migrated flat prices to structural product overrides.
* **Historical Notes**: Used to convert static catalog prices into structured pricing overrides during transition to the dynamic pricing engine.

### `migratePricingAndDefaults.js`
* **Classification**: `ARCHIVE` (Historical seeder)
* **Reason**: Seeding of default metals and size configs on early products.
* **Historical Notes**: Pre-populated initial products with size and metal configurations.

### `normalizeProducts.js`
* **Classification**: `ARCHIVE` (Historical format utility)
* **Reason**: Re-formatted attributes on initial catalog entries.
* **Historical Notes**: Standardized uppercase/lowercase naming across properties like `jewelryType` and categories.

### `parseProducts.js`
* **Classification**: `ARCHIVE` (Historical import tool)
* **Reason**: Parsed raw SQL database dumps.
* **Historical Notes**: Extracted key catalog specs from a legacy SQL database during content ingestion.

### `patch-ruby-weight.mjs`
* **Classification**: `ARCHIVE` (Historical database correction)
* **Reason**: Documented a production data weight patch.
* **Historical Notes**: Fixed specific ruby bangle specs where weight metadata was missing or misaligned in early database iterations.

### `reclassifyAndSeed.js`
* **Classification**: `ARCHIVE` (Historical data seeder)
* **Reason**: Cleaned catalog taxonomy hierarchy.
* **Historical Notes**: Fixed structural relationships between category trees and parent collections.

### `recoverTaxonomy.js`
* **Classification**: `ARCHIVE` (Historical recovery utility)
* **Reason**: Reconstructed corrupted taxonomy indexes.
* **Historical Notes**: Run to recover category mappings during an early database restore test.

### `refactorComposition.js`
* **Classification**: `ARCHIVE` (Historical database migration)
* **Reason**: Migrated structural composition properties.
* **Historical Notes**: Shifted specific gold purity values into Mongoose schemas.

### `restoreOriginalProducts.js`
* **Classification**: `ARCHIVE` (Historical database backup utility)
* **Reason**: Restored database to clean base seeder copy.
* **Historical Notes**: Used during design iterations to roll back user-made edits and return DB state to pristine original seeds.

### `seedLuxuryVideos.js`
* **Classification**: `ARCHIVE` (Historical catalog seeder)
* **Reason**: Mapped video URLs to premium collections.
* **Historical Notes**: Associated loop videos with active jewelry categories.

### `seedSolitaireAndCoins.js`
* **Classification**: `ARCHIVE` (Historical catalog seeder)
* **Reason**: Initial catalog seed for coins and solitaires.
* **Historical Notes**: Run during product expansion phase to launch new solitaire collection categories.

### `transformProducts.js`
* **Classification**: `ARCHIVE` (Historical formatting utility)
* **Reason**: Transform and format early product slugs.
* **Historical Notes**: Aligned early catalog database models to use hyphenated URLs instead of underscores.

---

## 3. Deleted Scripts

The following scripts were single-purpose console checks, debugging scraps, or dev experiments and have been permanently removed:
* `audit-pricing.js`: One-off print utility checking database properties.
* `auditData.js`: Printed schema sizes and counts.
* `checkSingleProduct.cjs`: Dumped fields of one catalog item to console.
* `detailedAudit.js`: Temporary math sanity check.
* `findSubcategories.js`: Development lookup checking category trees.
* `get-5-products-details.cjs`: Inspected 5 chosen items.
* `get-pricing-verification.cjs`: Inline pricing verification check.
* `list-chains-bracelets.cjs`: Temporary listing of chain weights.
* `listDbCategories.js`: Dumped collections list.
* `test-pricing-calculation.js`: Formula test scratchpad.
