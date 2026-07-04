import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import GiftCardsClientPage from './GiftCardsClientPage';

export const metadata: Metadata = constructMetadata({
  title: 'Luxury Gift Cards | The Perfect Gifting Expression',
  description: 'Give the gift of choice with a Luxury Jewelry Luxury Gift Card. Select custom values, themes, and personalize messages for your loved ones.',
  path: '/gift-cards',
});

export default function GiftCardsPage() {
  return <GiftCardsClientPage />;
}
