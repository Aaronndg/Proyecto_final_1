/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@supabase/ssr'],
  // Forzar recompilación para Vercel
  generateEtags: false,
  poweredByHeader: false
}

module.exports = nextConfig