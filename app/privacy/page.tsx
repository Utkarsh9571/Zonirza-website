import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import PrivacyClientPage from './PrivacyClientPage';

export const metadata: Metadata = constructMetadata({
  title: 'Privacy Policy & Shipping Terms',
  description: 'Read the legal terms, secure payment policies, return timelines, and standard and courier shipping rates for Zoniraz Jewellery.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return <PrivacyClientPage />;
}
