
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ["https://*.cloudworkstations.dev"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.cloudworkstations.dev; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://*.cloudworkstations.dev; font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https://i.imgur.com https://placehold.co https://upload.wikimedia.org; connect-src 'self' wss://*.cloudworkstations.dev https://*.cloudworkstations.dev;",
          },
          {
            key: 'Set-Cookie',
            value: 'SameSite=Strict; Secure',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
