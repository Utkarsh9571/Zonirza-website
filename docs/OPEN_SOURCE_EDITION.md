# Luxury Jewelry Commerce Starter - Open Source Edition

This repository has been sanitized and prepared as a generic, reusable luxury jewelry commerce starter kit ("Luxury Jewelry Commerce Starter"). All client-owned branding, customer data, production secrets, and private media assets have been completely scrubbed and replaced with generic equivalents.

## 1. What Was Removed
- **Client Branding & References:** Removed all instances of the "Luxury Jewelry" brand name across pages, metadata, Zustand namespaces, emails, and admin headers.
- **Production Secrets & Credentials:** Scrubbed active MongoDB connection URLs, replica set configs, Stripe private/public keys, Razorpay secrets, Hostinger/SMTP email credentials, and private domain links.
- **Client Assets:** Deleted the high-resolution client image logo and thousands of proprietary product JPEG/PNG assets from the public directory.
- **Proprietary Data:** Cleaned out real customer profiles, customer addresses, actual support logs, discount coupons, and transactional histories.

## 2. What Was Replaced
- **Responsive Text Logo:** The Navbar and Footer now render a premium CSS text logo (`LUXURY STARTER`) with smooth gold hover transitions instead of loading hardcoded images.
- **Generic Support & Details:** Hardcoded emails, phone numbers, and addresses have been updated to generic placeholders (e.g., `support@example.com` and `+91 99999 99999`).
- **Dummy Catalog & Categories:** Replaced catalog databases (`cleanProducts.json`, `normalizedProducts.json`, `cleanCategories.json`, etc.) with three mock products (gold, diamond, and emerald gemstone) and five key categories utilizing stock royalty-free Unsplash URLs.
- **Local Dev Connection Schemes:** Configured connection fallbacks in scripts and `.env.example` to target a local database instance (`mongodb://127.0.0.1:27017/jewelry-starter`).

## 3. Remaining Features
The starter kit includes a fully functional luxury e-commerce codebase:
- **Elegant Responsive UI:** Premium dark-mode ready design featuring glassmorphism elements, custom fonts, and smooth framer-motion micro-animations.
- **Formula-Driven Pricing Engine:** Dynamically calculates product retail prices based on current market gold spot rates, purity conversion ratios, making charges, gemstone carats, and margins.
- **Admin Portal Dashboard:** Allows management of store settings, categories, orders, customers, and active pricing rules.
- **Interactive Jewelry Customizer:** Lets users dynamically select gold purity, color (yellow/rose/white gold, platinum), ring sizes, and diamond clarity with instant price recalculations.
- **Digital Gold & Scheme Portals:** Includes complete flows for digital gold savings plans (10+1 scheme onboarding and calculator tools).

## 4. How Developers Can Customize
1. **Database Setup:** 
   Rename `.env.example` to `.env.local` and add your MongoDB connection URI:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/jewelry-starter
   ```
2. **Pricing Engine Rules:**
   Edit the Spot Rates and conversion margins inside the Admin Settings screen or customize the default values in `models/Settings.ts`.
3. **Payment Processing:**
   Add your public/private Stripe and Razorpay credentials to `.env.local` to active payments.
4. **Spot Rate Synchronization:**
   Integrate an external metal spot rate API or schedule a cron to update settings with real-time gold and silver prices.
