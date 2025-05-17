/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // These are needed if you're running an older Node.js version
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig; 