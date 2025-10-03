/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/old-project',
        destination: '/projects/new-project',
        permanent: false,
      },
      {
        source: '/github',
        destination: 'https://github.com/iamaloksi',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
