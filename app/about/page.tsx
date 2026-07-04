import { Metadata } from 'next';
import AboutContent from './AboutContent';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: "Our Heritage & Legacy",
  description: "Luxury Jewel House has 50 years of heritage in manufacturing, retailing, and exporting luxury jewellery. Explore our story and legacy of trust.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutContent />;
}
