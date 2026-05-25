import ExchangeHero from '@/components/exchange/ExchangeHero';
import ExchangeServiceCards from '@/components/exchange/ExchangeServiceCards';
import ExchangeHowItWorks from '@/components/exchange/ExchangeHowItWorks';
import ExchangeConsultation from '@/components/exchange/ExchangeConsultation';
import ExchangeCalculator from '@/components/exchange/ExchangeCalculator';
import ExchangeTrustPillars from '@/components/exchange/ExchangeTrustPillars';
import { ExchangeStats, ExchangeFinalCTA } from '@/components/exchange/ExchangeShared';

export const metadata = {
  title: 'Gold Exchange Program | Zoniraz',
  description: 'Upgrade your old gold into timeless jewellery with the Zoniraz Exchange Program. Calculate your estimated value and book an appointment today.',
};

export default function ExchangePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Section 1: Hero */}
      <ExchangeHero />

      {/* Section 2: Why Zoniraz Exchange (Trust Pillars) */}
      <ExchangeTrustPillars />

      {/* Section 3: Social Trust Stats */}
      <ExchangeStats />

      {/* Section 4: Gold Calculator */}
      <ExchangeCalculator />

      {/* Section 5: Get in Touch / Consultation */}
      <ExchangeConsultation />

      {/* Section 6: How Exchange Works */}
      <ExchangeHowItWorks />

      {/* Section 7: Service Cards */}
      <ExchangeServiceCards />

      {/* Section 8: Final CTA */}
      <ExchangeFinalCTA />
    </main>
  );
}
