/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'res.cloudinary.com',
      'wizzhq.xyz',
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wizzhq.xyz',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
    unoptimized: true,
  },
  experimental: { // [!code ++] // [!code focus]
    serverComponentsExternalPackages: ['grammy'], // [!code ++] // [!code focus]
  }, // [!code ++] // [!code focus]
  // Add this to ensure static file serving works correctly
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ];
  },
}

export default nextConfig;
