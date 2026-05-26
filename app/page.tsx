import { Metadata } from 'next';
import HomeContent from './HomeContent';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  path: '/',
});

export default function Home() {
  return <HomeContent />;
}
