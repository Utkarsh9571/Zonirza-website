import Image from 'next/image';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle?: string;
  image: string;
  children?: React.ReactNode;
  overlayClassName?: string;
  className?: string;
}

export const Hero = ({ title, subtitle, image, children, overlayClassName, className }: HeroProps) => {
  return (
    <section className={cn('relative h-[80vh] md:h-screen w-full flex items-center justify-center overflow-hidden', className)}>
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className={cn('absolute inset-0 bg-white/30 backdrop-blur-[1px]', overlayClassName)}></div>
      
      <div className="relative z-10 text-center px-6 max-w-6xl">
        {subtitle && (
          <p className="text-brand-gold text-[11px] md:text-[13px] uppercase tracking-[0.6em] font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {subtitle}
          </p>
        )}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light text-brand-text leading-[1.1] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {title}
        </h1>
        {children && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {children}
          </div>
        )}
      </div>
    </section>
  );
};
