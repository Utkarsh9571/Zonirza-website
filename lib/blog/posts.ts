export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  date: string;
  readTime: string;
  author: string;
  featured: boolean;
  sections?: {
    type: 'intro' | 'text-image' | 'image-text' | 'highlight' | 'tips' | 'conclusion';
    title?: string;
    text?: string;
    image?: string;
    items?: string[];
  }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: 'why-akshaya-tritiya-is-best-time-to-buy-gold',
    title: 'Why Is Akshaya Tritiya the Most Auspicious Time to Buy Gold Jewellery?',
    excerpt: 'At Luxury Jewelry, we have always believed that certain days carry a special energy. Akshaya Tritiya is one of those rare occasions when tradition and beauty converge.',
    image: '/images/site/blog/post-1.png',
    tags: ['Festive', 'Gold'],
    date: 'May 5, 2026',
    readTime: '5 min read',
    author: 'Editorial Team',
    featured: false,
    content: 'Akshaya Tritiya is one of those rare days when buying gold feels less like a transaction and more like a ritual of hope...',
    sections: [
      {
        type: 'intro',
        title: 'Introduction',
        text: 'Akshaya Tritiya is one of those rare days when buying gold feels less like a transaction and more like a ritual of hope. Each choice carries its own meaning, its own way of saying \'this is for the future\'.'
      },
      {
        type: 'text-image',
        title: 'Combining Style with Investment',
        text: 'Gold jewellery quietly does double duty. You enjoy it as part of your personal style while still knowing it carries a gold jewellery price backed by certified purity.',
        image: '/images/site/blog/internal-1.png'
      },
      {
        type: 'image-text',
        title: 'Gold Jewellery: A Blend of Beauty and Value',
        text: 'Gold jewellery is often the most intuitive choice. It gives you something you can enjoy immediately while still holding long term value.',
        image: '/images/site/blog/internal-2.png'
      },
      {
        type: 'highlight',
        title: 'Perfect for Weddings and Celebrations',
        text: 'A well chosen gold jewellery set or kundan jewellery set can become the hero of many looks, styled differently each time with sarees or lehengas.'
      },
      {
        type: 'tips',
        title: 'Smart Buying Tips for Akshaya Tritiya',
        items: [
          'Always buy from trusted, transparent brands.',
          'Look for clear information on purity and weight.',
          'Ensure the website is secure and backed by documented policies.'
        ]
      }
    ]
  },
  {
    id: 2,
    slug: 'gold-earrings-must-have-accessory-2026',
    title: 'Why Simple Gold Earrings Are the Must-Have Accessory of 2026',
    excerpt: 'In 2026, jewellery is speaking softer and smarter. Gold earrings lead this quiet revolution of wearable luxury.',
    image: '/images/site/blog/post-2.png',
    tags: ['Daily Wear', 'Earrings', 'Gold'],
    date: 'April 20, 2026',
    readTime: '4 min read',
    author: 'Style Expert',
    featured: true,
    content: 'The shift towards minimalist luxury is here to stay...',
    sections: [
      {
        type: 'intro',
        title: 'The Rise of Minimalist Adornment',
        text: 'In 2026, we are witnessing a return to essentials. Simple gold earrings have become the defining piece of the modern woman\'s wardrobe—versatile, elegant, and timeless.'
      },
      {
        type: 'text-image',
        title: 'From Boardroom to Evening Gala',
        text: 'The beauty of a simple gold hoop or stud lies in its adaptability. It transitions seamlessly from a corporate setting to an intimate dinner.',
        image: '/images/site/blog/post-2.png'
      },
      {
        type: 'highlight',
        title: 'Styling Tip: Layering with Purpose',
        text: 'Don\'t be afraid to mix textures. A polished gold stud paired with a hammered gold cuff can create a sophisticated, curated look.'
      }
    ]
  },
  {
    id: 3,
    slug: 'diamond-engagement-ring-guide',
    title: 'The Ultimate Guide to Choosing a Diamond Engagement Ring',
    excerpt: 'Selecting the perfect diamond ring is a journey of emotion and precision. From the 4Cs to the setting style, every detail tells a story.',
    image: '/images/site/blog/post-3.png',
    tags: ['Diamond', 'Rings'],
    date: 'April 12, 2026',
    readTime: '7 min read',
    author: 'Luxury Jewelry Gemologist',
    featured: false,
    content: 'A diamond is forever, but the right setting makes it yours...',
    sections: [
      {
        type: 'intro',
        title: 'A Lifetime Commitment',
        text: 'Choosing an engagement ring is one of the most significant decisions you will make. It\'s not just about the stone; it\'s about the story it represents.'
      },
      {
        type: 'text-image',
        title: 'Understanding the 4Cs',
        text: 'Cut, Color, Clarity, and Carat weight are the universal standards for grading diamonds. At Luxury Jewelry, we prioritize Cut above all else for maximum brilliance.',
        image: '/images/site/blog/post-3.png'
      }
    ]
  },
  {
    id: 4,
    slug: 'bihari-bridal-jewellery-traditions',
    title: 'From Dholna to Maang Tikka: Must-Have Bihari Bridal Jewellery',
    excerpt: 'In Bihar and Jharkhand, bridal adornment is nothing short of spectacular. Discover the traditions behind these unique pieces.',
    image: '/images/site/blog/post-4.png',
    tags: ['Bridal', 'Trending'],
    date: 'March 28, 2026',
    readTime: '6 min read',
    author: 'Cultural Curator',
    featured: true,
    content: 'The richness of Bihar\'s heritage is best reflected in its bridal gold...',
    sections: [
      {
        type: 'intro',
        title: 'Heritage in Gold',
        text: 'Every Indian wedding carries its own visual language. In Bihar, the bridal ensemble is a powerful display of craftsmanship and cultural pride.'
      },
      {
        type: 'image-text',
        title: 'The Dholna: A Symbol of Love',
        text: 'The Dholna, a drum-shaped pendant, is central to Bihari bridal traditions, often passed down through generations as a sacred heirloom.',
        image: '/images/site/blog/post-4.png'
      }
    ]
  }
];
