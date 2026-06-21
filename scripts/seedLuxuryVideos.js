const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let MONGODB_URI = '';
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/MONGODB_URI=(.*)/);
  if (match) MONGODB_URI = match[1].trim();
}

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not found in .env.local");
  process.exit(1);
}

const HeroSlideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  videoDesktop: { type: String, required: true },
  videoMobile: { type: String, required: true },
  posterImage: { type: String, required: true },
  primaryCTA: {
    label: { type: String, required: true, default: 'Explore Collections' },
    link: { type: String, required: true, default: '/products' }
  },
  secondaryCTA: {
    label: { type: String },
    link: { type: String }
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const HeroSlide = mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema);

const slides = [
  {
    title: "A Legacy of Pure Radiance",
    subtitle: "Handcrafted 18K and 22K Gold Masterpieces for Every Occasion",
    videoDesktop: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-jewelry-sparkling-in-the-light-40432-large.mp4",
    videoMobile: "https://assets.mixkit.co/videos/preview/mixkit-shining-gold-rings-on-a-display-40436-large.mp4",
    posterImage: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=80",
    primaryCTA: {
      label: "Shop Gold",
      link: "/products?category=necklaces"
    },
    secondaryCTA: {
      label: "Our Story",
      link: "/terms"
    },
    isActive: true,
    order: 0
  },
  {
    title: "Brilliant Solitaires",
    subtitle: "Find Your Perfect Fire with Certified VVS-EF Diamond Masterpieces",
    videoDesktop: "https://assets.mixkit.co/videos/preview/mixkit-diamond-ring-sparkling-under-a-light-40435-large.mp4",
    videoMobile: "https://assets.mixkit.co/videos/preview/mixkit-diamond-ring-sparkling-under-a-light-40435-large.mp4",
    posterImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
    primaryCTA: {
      label: "Explore Diamonds",
      link: "/products?category=rings"
    },
    secondaryCTA: {
      label: "Book Atelier Visit",
      link: "/contact"
    },
    isActive: true,
    order: 1
  }
];

async function run() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGODB_URI);
    
    console.log("Clearing existing HeroSlides...");
    await HeroSlide.deleteMany({});
    
    console.log("Seeding luxury HeroSlides...");
    await HeroSlide.insertMany(slides);
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

run();
