import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  slug: string;
  oldPrice?: string;
}

const ProductCard = ({ name, price, image, slug, oldPrice }: ProductCardProps) => {
  return (
    <Link href={`/product/${slug}`} className="group block h-full">
      <div className="bg-brand-white rounded-2xl overflow-hidden aspect-square relative mb-4 border border-brand-text/5 transition-all duration-700 group-hover:shadow-premium group-hover:-translate-y-2">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover p-6 sm:p-8 transition-transform duration-700 group-hover:scale-110"
        />
        {/* Mobile: Always visible, Desktop: Hover visible */}
        <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-brand-text text-brand-white flex items-center justify-center opacity-100 md:opacity-0 translate-y-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-brand-gold z-10 shadow-soft active:scale-95">
          <span className="text-xl font-light">+</span>
        </button>
      </div>
      <div className="space-y-1 text-center px-2">
        <h3 className="text-[12px] sm:text-[13px] font-medium text-brand-text/80 group-hover:text-brand-gold transition-colors duration-300 line-clamp-1">
          {name}
        </h3>
        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
          <p className="text-brand-gold text-[11px] sm:text-[12px] font-bold tracking-wider">{price}</p>
          {oldPrice && (
            <p className="text-brand-text/30 text-[9px] sm:text-[10px] line-through font-medium">{oldPrice}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
