import { Metadata } from 'next';
import HomeContent from './HomeContent';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  path: '/',
});

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    'name': 'Zoniraz Jewelers',
    'image': 'https://zoniraz.com/images/og-image.jpg',
    '@id': 'https://zoniraz.com/#jewelrystore',
    'url': 'https://zoniraz.com',
    'telephone': '+919784836060',
    'email': 'zonirazjewelhouse@gmail.com',
    'priceRange': '$$$$',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Shop No. 7, Hanuman Burj',
      'addressLocality': 'Alwar',
      'addressRegion': 'Rajasthan',
      'postalCode': '301001',
      'addressCountry': 'IN',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 27.5529,
      'longitude': 76.6026,
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        'opens': '10:00',
        'closes': '20:00',
      },
    ],
  };

  return (
    <>
      <script
        id="jewelrystore-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent />
    </>
  );
}
