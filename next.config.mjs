import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/docs',
        has: [{ type: 'host', value: 'suduxu.com' }],
        destination: 'https://docs.suduxu.com',
        permanent: true,
      },
      {
        source: '/docs/:path*',
        has: [{ type: 'host', value: 'suduxu.com' }],
        destination: 'https://docs.suduxu.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);