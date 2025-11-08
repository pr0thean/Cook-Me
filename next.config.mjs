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
};

export default nextConfig;
