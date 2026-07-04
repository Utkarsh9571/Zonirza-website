import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import BlogClientPage from './BlogClientPage';

export const metadata: Metadata = constructMetadata({
  title: 'Luxury Jewelry Journal | Luxury Jewellery Stories & Styling Guides',
  description: 'Step into the world of luxury. Read the Luxury Jewelry Journal for bridal jewellery guides, gold and diamond care tips, styling trends, and heritage stories.',
  path: '/blog',
});

export default function BlogPage() {
  return <BlogClientPage />;
}
