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
            bodySizeLimit: '4MB', // a post can carry 3 photos of up to 1 MB each,
        },
    },
};

export default nextConfig;
