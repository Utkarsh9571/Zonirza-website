import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import TermsClientPage from './TermsClientPage';

export const metadata: Metadata = constructMetadata({
  title: 'Terms & Conditions & Lifetime Jewellery Care',
  description: 'Learn about our hallmarking purity standards, diamond care guidelines, and lifetime exchange and buy-back policies for jewellery.',
  path: '/terms',
});

export default function TermsPage() {
  return <TermsClientPage />;
}
