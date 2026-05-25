'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { useRouter } from 'next/navigation';

const cards = [
  {
    id: 'visit',
    title: 'Visit Our Store',
    imageSrc: '/images/site/visit_store.png'
  },
  {
    id: 'book',
    title: 'Book an Appointment',
    imageSrc: '/images/site/book_appointment.png'
  },
  {
    id: 'expert',
    title: 'Talk to an Expert',
    imageSrc: '/images/site/talk_expert.png'
  }
];

export default function ExchangeServiceCards() {
  const router = useRouter();

  const handleAction = (id: string) => {
    if (id === 'visit') {
      const el = document.getElementById('how-it-works-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'book') {
      router.push('/contact');
    } else if (id === 'expert') {
      const el = document.getElementById('consultation-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-[#12100e] border border-brand-text/10 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm cursor-pointer hover:shadow-xl transition-shadow flex flex-col"
              onClick={() => handleAction(card.id)}
            >
              {/* Image Container */}
              <div className="p-4 relative flex-grow min-h-[250px]">
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <Image 
                    src={card.imageSrc} 
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-serif font-bold text-brand-text dark:text-white">
                  {card.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
