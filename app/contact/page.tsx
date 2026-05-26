import { Metadata } from 'next';
import ContactContent from './ContactContent';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: "Help & Contact Us",
  description: "Get in touch with the Zoniraz luxury support team. Call our toll-free number or send a message directly to get help with your premium jewellery order.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactContent />;
}
