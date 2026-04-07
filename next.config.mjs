// next.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime', 'recharts', 'react-chrono', '@mui/material', '@emotion/react', 'hoist-non-react-statics', 'decimal.js-light', 'react-is'],
  turbopack: {},
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