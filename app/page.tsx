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
    'name': 'Luxury Jewelers',
    'image': 'https://example.com/images/og-image.jpg',
    '@id': 'https://example.com/#jewelrystore',
    'url': 'https://example.com',
    'telephone': '+919999999999',
    'email': 'support@example.com',
    'priceRange': '$$$$',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '123 Luxury Lane',
      'addressLocality': 'Mumbai',
      'addressRegion': 'Maharashtra',
      'postalCode': '400001',
      'addressCountry': 'IN',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 19.0760,
      'longitude': 72.8777,
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
