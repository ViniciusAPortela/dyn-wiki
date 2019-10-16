/*
 *   NEXTJS CONFIG FILE
*/

const withImage = require('next-images');
const withCSS = require('@zeit/next-css');

module.exports = withCSS(withImage({
  useFileSystemPublicRoutes: true, // Change to False, to don't read pages/
}));