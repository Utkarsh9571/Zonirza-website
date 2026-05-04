import Link from 'next/link';
import { Button } from '@/components/new-ui/Button';
import { Section } from '@/components/new-ui/Section';

export default function NotFound() {
  return (
    <div className="bg-brand-bg min-h-screen flex items-center justify-center">
      <Section className="text-center">
        <div className="space-y-12">
          <div className="space-y-4">
            <p className="text-brand-gold text-[12px] uppercase tracking-[0.6em] font-bold italic">Discovery Interrupted</p>
            <h1 className="text-7xl md:text-9xl font-serif font-light text-brand-text leading-tight tracking-tighter">
              404 <br /> <span className="italic text-brand-gold">Lost in Luxury</span>
            </h1>
          </div>
          <p className="text-brand-text/40 text-sm md:text-lg max-w-lg mx-auto uppercase tracking-widest leading-relaxed">
            The masterpiece you are looking for is currently not in our collection. It may have been moved or is being refined by our artisans.
          </p>
          <div className="pt-8">
            <Link href="/">
              <Button size="lg">Return to Heritage</Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
