/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'res.cloudinary.com',
      'wizzhq.xyz',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wizzhq.xyz',
      },
      // Remove localhost in production; only use in dev if needed
    ],
    unoptimized: true, // Keep this since Apache serves static files
  },
  experimental: {
    serverComponentsExternalPackages: ['grammy'],
  },
  // Remove unnecessary rewrites since Apache handles /uploads/
  async rewrites() {
    return [];
  },
  // Optional: Add basePath or env for consistent URLs
  env: {
    NEXT_PUBLIC_BASE_URL: 'https://wizzhq.xyz',
  },
};

export default nextConfig;