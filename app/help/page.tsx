import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import HelpClientPage from './HelpClientPage';

export const metadata: Metadata = constructMetadata({
  title: 'Help Center & Customer Support FAQs',
  description: 'Browse our support FAQ for delivery timelines, payment options, international shipping details, and lifetime exchange and returns policies.',
  path: '/help',
});

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-brand-bg pb-24 pt-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <HelpClientPage />
      </div>
    </div>
  );
}
