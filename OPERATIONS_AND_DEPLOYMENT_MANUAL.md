# Zoniraz Luxury Jewelry
## Operations & Deployment Manual

This document acts as the master operations handbook for DevOps teams, system administrators, and commerce managers tasked with deploying, monitoring, and managing the Zoniraz production platform.

---

### SECTION 1 — Deployment Checklist

Before initiating any deployment to a production environment (such as Vercel, AWS ECS, or a traditional Node.js server), ensure the following prerequisites are met:

- **Environment Variables (`.env`)**:
  - `MONGODB_URI`: Must point to the production replica set. Ensure database IP access lists allow connections from the hosting provider.
  - `NEXTAUTH_SECRET`: A 32+ character cryptographically secure random string.
  - `NEXTAUTH_URL`: The canonical production domain (e.g., `https://zoniraz.com`).
  - `ADMIN_PASSWORD`: Secure seed password for initial admin creation.
  - `SMTP_*`: Valid host, port, user, and password for transactional emails.
  - `NEXT_PUBLIC_RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Live production payment keys.
  - `NEXT_PUBLIC_BASE_URL`: Fully qualified domain name, critical for SEO structured data and sitemap generation.
  
- **SSL Expectations**: The application relies heavily on secure session cookies and NextAuth. The hosting environment *must* provide SSL termination (HTTPS).

---

### SECTION 2 — Production Startup Procedure

1. **Deployment Flow**:
   - Install dependencies: `npm install --production`
   - Build the Next.js optimized bundles: `npm run build`
   - Start the server: `npm start`
2. **Build Validation**:
   - Monitor the build output for `Exit code: 0`. Ensure no TypeScript compilation errors or missing React Server Component directives break the build.
3. **Smoke Testing**:
   - Verify the homepage loads and the sitemap `/sitemap.xml` returns valid XML.
   - Navigate to `/admin` and authenticate using the credentials seeded by `ADMIN_PASSWORD`.
   - Perform a dummy search to ensure MongoDB indexes are active and returning results.

---

### SECTION 3 — Admin Operations Guide

The Admin Dashboard is the central command center for all commerce operations.

- **Manage Products**: Navigate to the Products tab. When creating a product, assign its base attributes and define its Configurable Options (available metals, sizes). Upload images directly; the platform handles responsive sizing.
- **Manage Rules**: Under the Rules tab, define restrictions or surcharges. Use precise scope definitions (Category or specific Product ID) and trigger conditions (e.g., "Metal: 24K Gold" AND "Stone: Diamond").
- **Manage Quotes**: Navigate to Quotes to view customer custom requests. Review the AI-generated Complexity Score and Base Estimate, then manually input the final quote price and trigger an email response.
- **Manage Collections**: Under Merchandising, create Collections. Add a rich Hero Image, Storytelling Copy, and assign a Priority score (higher scores appear first on the homepage).

---

### SECTION 4 — Operational Workflows

- **Order Lifecycle Flow**:
  1. Customer completes checkout (`PAYMENT_PENDING` -> `PROCESSING`).
  2. Admin initiates manufacturing in the Dashboard (`MANUFACTURING`).
  3. Admin advances the stage to `POLISHING` and then `QUALITY_CHECK`.
  4. Admin adds shipping details and marks `SHIPPED`. Customer tracking UI updates in real-time.
- **Quote Lifecycle Flow**:
  1. Customer requests consultation (`PENDING`).
  2. Admin reviews the system's estimated bound (`REVIEWING`).
  3. Admin submits a formal price (`ESTIMATED`). Customer receives an email.
  4. Customer accepts the quote via their profile (`ACCEPTED`), triggering an invoice generation.

---

### SECTION 5 — Monitoring & Maintenance

- **Logger Usage**: Critical system errors and SMTP failures are logged using `lib/logger.ts`. Configure your hosting provider (e.g., Vercel Logs, AWS CloudWatch) to ingest and alert on `level: 'error'` JSON outputs.
- **Search Analytics Review**: Weekly, navigate to the Admin **Merchandising > Search Insights** tab. Review the "Zero-Result Searches" table. If users are searching for "emerald" and getting zero results, source emerald inventory or update existing product tags to capture the demand.
- **DB Health Checks**: Monitor the MongoDB Atlas dashboard for CPU usage and Index scans. Ensure the `slug`, `category`, and `tags` indexes are heavily utilized, preventing COLLSCAN (Collection Scans).

---

### SECTION 6 — Emergency & Failure Handling

- **SMTP Failures**: If the email server goes down, the platform's `mailer.ts` uses exponential backoff. It will pause and retry sending quotes/orders up to 3 times. If complete failure occurs, it is logged, but the *database transaction* still succeeds. Customers will not lose their orders, but you may need to manually resend emails later.
- **Payment Failures**: If Razorpay verification fails, the order is safely saved as `PAYMENT_PENDING` in the database. Instruct the customer to attempt payment again via their profile.
- **Deployment Rollback Basics**: The application is stateless (all state is in MongoDB). If a new code deployment crashes, perform an immediate rollback to the previous deployment hash in your hosting provider without fear of data corruption.

---

### SECTION 7 — Future Operational Scaling

As operations grow, implement the following architectural evolutions:
- **Observability**: Integrate Datadog or Sentry into `lib/logger.ts` for proactive error alerting rather than reactive log reading.
- **Redis Caching**: Offload expensive `/api/products/filters` aggregation and Search Analytics caching to an external Redis cluster to save MongoDB CPU.
- **Queue Workers**: Move heavy email dispatching out of the Next.js API route cycle and into a background job queue (e.g., BullMQ) for instantaneous API responses during checkout.
- **CDN Strategy**: While Next.js handles local image optimization, integrate Cloudinary or AWS CloudFront for global edge delivery of heavy luxury video and hero assets.
