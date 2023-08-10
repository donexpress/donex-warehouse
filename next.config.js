/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
}
const withSass = require('@zeit/next-sass')
module.exports = withSass({
  /* config options here */
})

module.exports = nextConfig
