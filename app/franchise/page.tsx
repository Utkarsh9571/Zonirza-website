import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import FranchiseClientPage from './FranchiseClientPage';

export const metadata: Metadata = constructMetadata({
  title: 'Franchise Partnership Opportunities | Expand the Legacy',
  description: 'Partner with India\'s leading luxury jewellery house. Discover FOCO & FOFO franchise models, retail brand pillars, and start your franchise inquiry today.',
  path: '/franchise',
});

export default function FranchisePage() {
  return <FranchiseClientPage />;
}
