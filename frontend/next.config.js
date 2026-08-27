/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow rendering three.js elements in server side transitions smoothly
  transpilePackages: ['three'],
}

module.exports = nextConfig
