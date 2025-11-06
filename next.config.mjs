/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.ctfassets.net',
            },
            {
                protocol: 'https',
                hostname: 'oftavkrverzqlgjmvjii.supabase.co'
            }
        ]
    },
    experimental: {
        instrumentationHook: true,
      },
};

export default nextConfig;
