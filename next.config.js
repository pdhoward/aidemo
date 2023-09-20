/**
 * @type {import('next').NextConfig}
 */
module.exports = {  
  env: {
    MUI_LICENSE_KEY: process.env.MUI_LICENSE_KEY
  },
  images: {
    domains: [
      "public.blob.vercel-storage.com",
      "res.cloudinary.com",
      "abs.twimg.com",
      "pbs.twimg.com",
      "avatars.githubusercontent.com",
      "www.google.com",
      "flag.vercel.app",
      "illustrations.popsy.co",
      "szjmaqc1hduisf59.public.blob.vercel-storage.com",
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'public.blob.vercel-storage.com',
        port: '',
        pathname: '/',
      },
     
    ],
  },
  reactStrictMode: false,
};
