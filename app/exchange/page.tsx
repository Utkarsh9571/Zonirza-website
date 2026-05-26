import ExchangeTabController from '@/components/exchange/ExchangeTabController';

export const metadata = {
  title: 'Gold Exchange Program | Zoniraz',
  description: 'Upgrade your old gold into timeless jewellery with the Zoniraz Exchange Program. Calculate your estimated value and book an appointment today.',
};

export default function ExchangePage({ searchParams }: { searchParams: { tab?: string } }) {
  const initialTab = searchParams.tab === 'sell' ? 'sell' : 'exchange';
  return <ExchangeTabController initialTab={initialTab} />;
}
