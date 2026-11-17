/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_STANDALONE === 'true' ? 'standalone' : undefined,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: { optimizePackageImports: ['lucide-react', 'framer-motion'] },
  // Next.js dev rejimidagi pastki burchakdagi "N" belgisini o'chirish
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
