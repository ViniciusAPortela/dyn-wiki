/*
 *   NEXTJS CONFIG FILE
*/

const withCSS = require('@zeit/next-css');
const withImages = require('next-images');

module.exports = withCSS(withImages({
  cssModules: true
}));