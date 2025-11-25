/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'oftavkrverzqlgjmvjii.supabase.co'
            }
        ]
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '3MB',
        },
    },
};

export default nextConfig;
