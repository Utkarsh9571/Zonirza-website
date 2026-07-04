import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import SuccessClientPage from './SuccessClientPage';

export const metadata: Metadata = constructMetadata({
  title: 'Order Successful',
  description: 'Thank you for your purchase from Luxury Jewelry. Your order is secured and being prepared by our artisans.',
  path: '/success',
  noIndex: true,
});

export default function SuccessPage() {
  return <SuccessClientPage />;
}

