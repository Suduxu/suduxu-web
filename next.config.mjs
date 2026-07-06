import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// Your production docs subdomain (no protocol). Used for the rewrite below.
const DOCS_HOST = 'docs.suduxu.dev';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    return {
      // Runs BEFORE the filesystem/routes are checked.
      // When a request arrives on docs.suduxu.dev, serve the /docs tree,
      // so docs.suduxu.dev/quickstart === suduxu.dev/docs/quickstart.
      beforeFiles: [
        {
          source: '/',
          has: [{ type: 'host', value: DOCS_HOST }],
          destination: '/docs',
        },
        {
          source: '/:path*',
          has: [{ type: 'host', value: DOCS_HOST }],
          destination: '/docs/:path*',
        },
      ],
    };
  },
};

export default withMDX(config);
