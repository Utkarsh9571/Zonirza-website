import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/lib/blog/posts';
import { constructMetadata } from '@/lib/seo';
import BlogPostClient from './BlogPostClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find(p => p.slug === slug);
  
  if (!post) {
    return constructMetadata({
      title: 'Story Not Found',
      noIndex: true,
    });
  }

  return constructMetadata({
    title: post.title,
    description: post.excerpt || post.sections?.[0]?.text?.substring(0, 160) || post.title,
    path: `/blog/${post.slug}`,
    ogImage: post.image,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
