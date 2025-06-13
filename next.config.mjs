/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { // Untuk bucket 'avatars'
        protocol: 'https',
        hostname: 'ensmpyuuszdrbjasmelh.supabase.co', // Hostname dari error
        port: '',
        pathname: '/storage/v1/object/public/avatars/**', // Path untuk bucket avatars
      },
      { // Untuk bucket 'trialalo' folder 'products' (dari diskusi sebelumnya)
        protocol: 'https',
        hostname: 'ensmpyuuszdrbjasmelh.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/tralalelo/products/**',
      },
      // Tambahkan pattern lain jika ada sumber gambar berbeda
    ],
  },
  // ... konfigurasi Next.js lainnya jika ada
};

export default nextConfig;