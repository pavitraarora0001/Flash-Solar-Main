/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  redirects: async () => [
    { source: '/flash-power-wall', destination: '/products/flash-power-wall', permanent: true },
    { source: '/flash-dc-house', destination: '/products/flash-dc-house', permanent: true },
    { source: '/flash-ac-house', destination: '/products/flash-ac-house', permanent: true },
    { source: '/contact-us', destination: '/contact', permanent: true },
    { source: '/about-us', destination: '/about', permanent: true },
    { source: '/our-services-2', destination: '/solutions', permanent: true },
    { source: '/services', destination: '/solutions', permanent: true },
    { source: '/inquiry', destination: '/enquiry', permanent: true },
    { source: '/vision', destination: '/about', permanent: true },
    { source: '/consultancy-and-education', destination: '/solutions', permanent: true },
    { source: '/flash-warranty-and-guarantee', destination: '/warranty', permanent: true },
  ],
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ],
};

export default nextConfig;

