/*
 *   NEXTJS CONFIG FILE
*/

const withImage = require('next-images');
const withCSS = require('@zeit/next-css');

module.exports = withCSS(withImage({
  useFileSystemPublicRoutes: true, // Change to False, to don't read pages/
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    return config
  }
}));