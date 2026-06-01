import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import BlogClientPage from './BlogClientPage';

export const metadata: Metadata = constructMetadata({
  title: 'Zoniraz Journal | Luxury Jewellery Stories & Styling Guides',
  description: 'Step into the world of luxury. Read the Zoniraz Journal for bridal jewellery guides, gold and diamond care tips, styling trends, and heritage stories.',
  path: '/blog',
});

export default function BlogPage() {
  return <BlogClientPage />;
}
