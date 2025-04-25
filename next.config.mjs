/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/dg4upid0d/**', // Match all paths under this hostname
        },
      ],
    },
  };
  
  export default nextConfig;