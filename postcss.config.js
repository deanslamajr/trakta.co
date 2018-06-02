/* eslint-disable import/no-extraneous-dependencies */
// PostCSS-Loader config options
module.exports = (ctx) => {
  return {
    plugins: [require('postcss-import')({ addDependencyTo: ctx.webpack }), require('postcss-simple-vars'), require('postcss-cssnext')]
  }
}
