/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.prismic.io']
  },
  swcMinify: true,
}
module.exports = nextConfig
