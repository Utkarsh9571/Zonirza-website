import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import SignUpClientPage from './SignUpClientPage';

export const metadata: Metadata = constructMetadata({
  title: 'Create Account',
  description: 'Register for a secure Zoniraz customer account.',
  path: '/signup',
  noIndex: true,
});

export default function SignUpPage() {
  return <SignUpClientPage />;
}
