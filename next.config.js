const withImages = require('next-images');
const path = require('path');

module.exports = withImages({
  basePath: '',
  reactStrictMode: false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  include: [path.resolve(__dirname, 'assets/img/logo')],
  webpack: config => {
    config.resolve.modules.push(path.resolve('./'))
    return config
  }
});