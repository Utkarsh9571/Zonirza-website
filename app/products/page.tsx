import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import ProductsClientPage from './ProductsClientPage';

export const metadata: Metadata = constructMetadata({
  title: 'Fine Luxury Jewellery Collections',
  description: 'Explore the exquisite collections of gold, diamond, solitaire, and platinum jewellery at Luxury Jewelry. Handcrafted masterpieces tailored for luxury.',
  path: '/products',
});

export default function ProductsPage() {
  return <ProductsClientPage />;
}
