import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/digi-gold',
        destination: '/',
        permanent: false,
      },
      {
        source: '/digi-gold/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/account/digi-gold',
        destination: '/account',
        permanent: false,
      },
      {
        source: '/account/digi-gold/:path*',
        destination: '/account',
        permanent: false,
      },
      {
        source: '/admin/digi-gold',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/admin/digi-gold/:path*',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/plans/gold-reserve',
        destination: '/plans/gold-mine',
        permanent: false,
      },
      {
        source: '/plans/gold-reserve/:path*',
        destination: '/plans/gold-mine',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
