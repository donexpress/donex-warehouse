/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    WAREHOUSE_ENV: process.env.WAREHOUSE_ENV,
    WAREHOUSE_API_HOST: process.env.WAREHOUSE_API_HOST,
  },
}
const withSass = require('@zeit/next-sass')
module.exports = withSass({
  /* config options here */
})

module.exports = nextConfig
