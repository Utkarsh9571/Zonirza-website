import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import SignInClientPage from './SignInClientPage';

export const metadata: Metadata = constructMetadata({
  title: 'Sign In',
  description: 'Access your secure Luxury Jewelry customer account dashboard.',
  path: '/signin',
  noIndex: true,
});

export default function SignInPage() {
  return <SignInClientPage />;
}
