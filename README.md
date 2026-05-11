# Zoniraz Luxury Jewellery Store

A premier, light luxury jewellery e-commerce platform designed for an editorial-grade shopping experience. Built with a focus on timeless craftsmanship and modern elegance.

## ✨ Core Features

### 🛍️ Operational Ecommerce
- **Complete Order Lifecycle**: Real-time status tracking (Placed → Confirmed → Processing → Shipped → Delivered) with a visual timeline.
- **Order History**: Detailed view of past masterpieces including item configurations and shipping sanctuaries.
- **Persistent Wishlist**: Cross-device wishlist system with automated database synchronization for authenticated users.
- **Multi-Currency Support**: Seamless switching between INR, USD, AED, and EUR across the entire storefront.

### 💎 Premium User Experience
- **Editorial Design**: Light luxury aesthetic with glassmorphism, smooth animations (Framer Motion), and premium typography.
- **Mobile-First Interactions**: Touch-optimized "Bottom Sheet" filters and sort overlays for effortless mobile browsing.
- **Bespoke Detail View**: Interactive product pages with configuration options (Metal, Purity, Stones).

### 📧 Automated Workflows
- **Transactional Emails**: Branded HTML notifications for order confirmations and administrative alerts.
- **OTP Authentication**: Secure, luxury-themed email OTP authentication flow.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB (Mongoose ODM)
- **State Management**: Zustand (with Persist Middleware)
- **Authentication**: NextAuth.js
- **Mail Service**: Nodemailer

## 🚀 Getting Started

### 1. Installation
```bash
git clone <repository-url>
cd jewellery-website
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Email (SMTP)
EMAIL_SERVER_USER=your_smtp_user
EMAIL_SERVER_PASSWORD=your_smtp_password
EMAIL_FROM=noreply@zoniraz.com
BUSINESS_EMAIL=concierge@zoniraz.com
```

### 3. Development
```bash
npm run dev
```

## 📂 Architecture

- `/app` — Routing, layouts, and page components.
- `/components` — Modular UI components (Global, New-UI, Checkout, Orders).
- `/store` — Global state management (Cart, Wishlist, Currency).
- `/models` — Mongoose schemas for Products, Users, and Orders.
- `/lib` — Utilities for database, mail, images, and authentication.
- `/public` — Brand assets, including the official luxury logo.

## 🏛️ Design Guidelines

- **Typography**: Utilize Google Fonts (Outfit/Serif) for an editorial feel.
- **Colors**: Maintain the `brand-bg`, `brand-text`, and `brand-gold` palette.
- **Spacing**: Generous whitespace to reflect luxury and exclusivity.

---
© 2024 Zoniraz Masterpieces. All Rights Reserved.
