// next.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime', 'recharts', 'react-chrono', '@mui/material', '@emotion/react', 'hoist-non-react-statics', 'decimal.js-light', 'react-is'],
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui.shadcn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'radix-ui.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.framer.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'socket.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tainacan.github.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'seeklogo.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ngrok.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zod.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'leafletjs.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'recharts.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.brmodelo.com.br',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vercel.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'supabase.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'planetscale.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.deepl.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'http.mercadopago.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fastify.dev',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    config.resolve.alias['@splinetool/react-spline'] = path.resolve(__dirname, 'node_modules/@splinetool/react-spline/dist/react-spline.js');

    return config;
  },
};

export default nextConfig;