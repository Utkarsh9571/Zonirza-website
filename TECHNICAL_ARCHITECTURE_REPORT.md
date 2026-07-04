# Luxury Jewelry Luxury Jewelry
## Technical Architecture Report

This document serves as the master engineering reference for the Luxury Jewelry configurable jewelry platform, detailing the underlying architecture, systems, and data flow.

---

### SECTION 1 — System Architecture
The platform is built on a modern, decoupled JavaScript stack optimized for high performance and dynamic rendering.
- **Framework**: Next.js App Router (React 18+). Uses server-side rendering (SSR) and React Server Components (RSC) to minimize client-side JavaScript payloads.
- **Styling**: Tailwind CSS combined with Framer Motion for performant, hardware-accelerated luxury micro-animations and glassmorphic UI patterns.
- **Database**: MongoDB (Mongoose ORM). Stores normalized product structures, configuration rules, quotes, and complex nested user data.
- **Authentication**: NextAuth.js managing secure server-side session tokens, strictly delineating public routing from `/admin/*` boundaries.
- **State Management**: Zustand handles complex client-side interactions (Cart, Wishlist, Configuration Selection) without prop-drilling or context-re-rendering bottlenecks.

---

### SECTION 2 — Commerce Engine
Luxury Jewelry abandons rigid SKUs in favor of a dynamic, variant-based commerce engine.
- **Configurable Variants**: Products define base geometries and acceptable options (e.g., metals, purities, sizes). The frontend (`ProductInteractiveUI.tsx`) reacts to state changes dynamically.
- **Dynamic Pricing & Weight (`lib/pricing.ts`)**: Base prices are modified in real-time by multiplying global purity constants (e.g., 22K = 0.916 base), adding specific stone grade prices, and offset by ring size weight additions.
- **Variant Imaging**: The `resolveProductImage` and `imageResolver` utilities automatically swap the primary hero image to match the currently selected metal color, ensuring visual consistency.

---

### SECTION 3 — Rules Engine
To prevent manufacturing impossibilities, a centralized Rules Engine (`models/ConfigurationRule.ts` & `hooks/useRulesEngine.ts`) audits all selections.
- **Restriction Logic**: If a user selects a configuration that cannot be manufactured (e.g., setting a heavy diamond in soft 24K gold), the engine blocks the selection and returns an explanatory `restrictionMessage`.
- **Surcharges**: Rules can dynamically apply percentage or fixed surcharges (e.g., +15% for complex platinum casting).
- **Consultation Intercept**: Configurations deemed too complex trigger a "Requires Consultation" flag, converting the standard "Add to Cart" checkout flow into a high-touch sales lead.

---

### SECTION 4 — Quote Intelligence System
Custom requests bypass the standard cart and enter the Quote Intelligence lifecycle.
- **Complexity Scoring (`lib/quoteEstimation.ts`)**: The system parses the user's base product, selected variants, and free-text custom notes. It assigns a complexity score (1-10) using weighted heuristics.
- **Estimation Logic**: Based on the base price and complexity score, the engine computes a realistic low/high bound price range, managing customer expectations instantly.
- **Lifecycle Flow**: Quotes transition securely through stages: `PENDING` -> `REVIEWING` -> `ESTIMATED` -> `ACCEPTED` -> `REJECTED`, entirely managed by the admin interface with automated email dispatch.

---

### SECTION 5 — Discovery & Merchandising
Moving away from basic keyword matching, the discovery system relies on user *intent*.
- **Semantic Search Engine (`lib/searchEngine.ts`)**: The API intercepts raw queries (e.g., "minimal platinum band") and maps them to MongoDB `$in` and `RegExp` operators targeting categories, styles, and metals simultaneously.
- **Contextual Filters (`/api/products/filters`)**: Filters are generated dynamically by aggregating only the tags, metals, and stones currently available in the active product set, preventing empty search states.
- **Affinity Recommendations**: `ProductRecommendations` calculates cross-sells by intersecting shared collections, identical base metals, and the user's localized "Recently Viewed" history for concierge-level suggestions.
- **Search Analytics (`models/SearchAnalytics.ts`)**: Every query is logged. The Admin Merchandising panel aggregates top searches and critically flags "Zero-Result" queries, allowing admins to close inventory gaps.

---

### SECTION 6 — Operational Systems
- **Order Lifecycle**: Tracks manufacturing from `PAYMENT_PENDING` through `MANUFACTURING`, `POLISHING`, `QUALITY_CHECK`, and `SHIPPED`. Customers view this via a polished tracking UI.
- **Notification Architecture (`lib/mailer.ts`)**: Handles automated transactional emails via SMTP. 
- **Resilience**: The mailer utilizes an exponential backoff retry loop. If SMTP dispatch fails due to transient network issues, it safely pauses and retries up to 3 times before throwing an error to the structured logger.

---

### SECTION 7 — Admin Panel
The `/admin/(dashboard)` acts as the platform's command center.
- **Capabilities**: Full CRUD over Products, rules mapping, manual Quote estimation generation, Collection merchandising (hero image & priority sorting), and comprehensive Order lifecycle management.
- **Architecture**: Admin routes are entirely server-side protected. Direct API manipulation attempts without a valid `role === "admin"` session token return strict 401s.

---

### SECTION 8 — Performance & Infrastructure
- **Query Optimization**: High-traffic API routes (`/api/products`, `/api/search`) strictly use Mongoose's `.lean()` to return lightweight POJOs, drastically reducing memory footprint.
- **Database Indexes**: `ProductSchema` explicitly defines compound and text indexes on `slug`, `category`, `isActive`, `tags`, and `name` to prevent slow, full-collection scans.
- **SEO & Structured Data**: Dynamic `sitemap.xml`, OpenGraph metadata generation on the PDP, and automated JSON-LD schema injection ensure Google properly indexes price, image, and availability data as rich snippets.

---

### SECTION 9 — Security
- **Auth Protection**: NextAuth securely encrypts session JWTs. 
- **Input Validation**: All public endpoints parsing quotes, orders, or contact forms sanitize payloads. Database queries use structured `$in` maps rather than raw string injections.
- **API Boundaries**: Admin endpoints (`/api/admin/*`) use top-level `getServerSession` validation before allocating DB resources.

---

### SECTION 10 — Future Scalability
The current architecture is deliberately modular to allow for horizontal scaling:
- **Redis Caching**: As traffic scales, the `/api/products/filters` and `SearchAnalytics` aggregation queries can be offloaded to a Redis layer.
- **Webhook Integration**: Checkout payment verification currently relies on synchronous client-side polling. Future iterations can easily implement fully asynchronous Razorpay server-to-server webhooks.
- **Search Engine Upgrades**: The MongoDB semantic matcher is abstracted in `lib/searchEngine.ts`. If millions of SKUs are reached, this specific file can be refactored to query an Algolia or Meilisearch cluster without altering the frontend or other backend services.
