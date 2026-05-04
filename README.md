# Project Title

Zoniraz Jewellery Website

# Description

A modern, light luxury jewellery e-commerce website built with Next.js, React, Tailwind CSS, and MongoDB. The platform provides a premium shopping experience with responsive design, dynamic category filtering, and product details.

# Tech Stack

* Next.js / React
* Tailwind CSS
* MongoDB
* Node.js

# Installation Steps

1. Clone the repository:
   ```bash
   git clone <repo-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Create a `.env.local` file and add required variables (see below).

4. Run development server:
   ```bash
   npm run dev
   ```

# Environment Variables

Required environment variables:

```env
MONGODB_URI=
# NEXT_PUBLIC_API_URL= (if applicable)
```

# Folder Structure

* `/app` → Next.js App Router routes and layouts
* `/components` → Reusable UI components
* `/lib` → Utility helpers and database connections
* `/models` → MongoDB database models
* `/app/api` → Backend API route handlers

# Features

* Dynamic product listing
* Category pages
* Product detail pages
* Franchise form
* Responsive design

# Notes for Developers

* UI components are modular and strictly follow a light luxury design system.
* Data is dynamic and fetched from MongoDB.
* Avoid hardcoding data; leverage existing models.
* Follow the existing folder structure and design conventions when adding new features.
