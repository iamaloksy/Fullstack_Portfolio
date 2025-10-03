/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',                // from home page
        destination: '/portfolio',  // redirect to portfolio page
        permanent: true,            // 308 permanent redirect
      },
      {
        source: '/old-project',     // old project link
        destination: '/projects/new-project',
        permanent: false,           // 307 temporary redirect
      },
      {
        source: '/github',          // shortcut URL
        destination: 'https://github.com/iamaloksi',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
