import { Metadata } from 'next';
import ExchangeTabController from '@/components/exchange/ExchangeTabController';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Gold Exchange Program',
  description: 'Upgrade your old gold into timeless jewellery with the Luxury Jewelry Exchange Program. Calculate your estimated value and book an appointment today.',
  path: '/exchange',
});

export default async function ExchangePage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const resolvedParams = await searchParams;
  const initialTab = resolvedParams.tab === 'sell' ? 'sell' : 'exchange';
  return <ExchangeTabController initialTab={initialTab} />;
}
