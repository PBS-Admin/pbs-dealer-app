const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    APP_VERSION: process.env.npm_package_version,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Large-Allocation',
            value: 'true',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
