import { Section } from '@/components/new-ui/Section';

export default function Loading() {
  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Category Header Banner Skeleton */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-brand-text/5 animate-pulse">
        <div className="relative z-10 text-center px-6 space-y-8">
          <div className="w-40 h-3 bg-brand-gold/30 mx-auto rounded-full"></div>
          <div className="w-96 h-20 bg-brand-text/10 mx-auto rounded-full"></div>
          <div className="w-24 h-[1px] bg-brand-gold/50 mx-auto mt-12"></div>
        </div>
      </section>

      {/* Product Grid Section Skeleton */}
      <Section className="!py-32">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-10">
          <div className="space-y-4">
            <div className="w-24 h-3 bg-brand-gold/30 rounded-full animate-pulse"></div>
            <div className="w-64 h-12 bg-brand-text/10 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse flex flex-col space-y-6">
              <div className="aspect-[4/5] w-full bg-brand-text/5 rounded-[40px]"></div>
              <div className="space-y-3">
                <div className="w-3/4 h-5 bg-brand-text/10 rounded-full"></div>
                <div className="w-1/2 h-4 bg-brand-gold/20 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
