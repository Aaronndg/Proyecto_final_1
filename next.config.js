/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@supabase/ssr'],
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr']
  }
}

module.exports = nextConfig