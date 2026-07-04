import { Metadata } from 'next';
import SipContent from './SipContent';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: "Systematic Investment Plan (SIP) in 24K Digital Gold",
  description: "Automate your wealth creation with the Luxury Jewelry Digital Gold SIP. Invest a fixed amount monthly, set gold accumulation goals, and secure your financial legacy.",
  path: "/digi-gold/sip",
});

export default function CreateSIP() {
  return <SipContent />;
}
