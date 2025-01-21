/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://13.229.116.85:3001/api/:path*'
      }
    ]
  },
  // Add this for better error handling
  onError: async (err, req, res) => {
    console.error('Application error:', err);
  }
};

export default nextConfig;