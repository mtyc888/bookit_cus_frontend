/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Make sure to use https:// for production
        destination: 'http://13.229.116.85:3001/api/:path*'
      }
    ]
  },
  // Enable experimental features for better SSR support
  experimental: {
    serverActions: true,
  },
  // Configure images if you're using next/image
  images: {
    unoptimized: true
  }
};

export default nextConfig;