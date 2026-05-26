import { Metadata } from 'next';
import ExchangeTabController from '@/components/exchange/ExchangeTabController';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Gold Exchange Program',
  description: 'Upgrade your old gold into timeless jewellery with the Zoniraz Exchange Program. Calculate your estimated value and book an appointment today.',
  path: '/exchange',
});

export default function ExchangePage({ searchParams }: { searchParams: { tab?: string } }) {
  const initialTab = searchParams.tab === 'sell' ? 'sell' : 'exchange';
  return <ExchangeTabController initialTab={initialTab} />;
}
