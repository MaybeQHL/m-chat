module.exports = {
  lintOnSave: false,
  publicPath: './',
  productionSourceMap: false,
  outputDir: process.env.IS_LIB ? 'lib-dist' : 'dist',
  css: {
    extract: false
  },
  devServer: {
    disableHostCheck: true
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()

    svgRule
      .test(/\.svg$/)
      .use('svg-url-loader') // npm install --save-dev svg-url-loader
      .loader('svg-url-loader')

    // config.module
    //   .rule("images")
    //   .use("url-loader")
    //   .loader("url-loader")
    //   .tap(options => Object.assign(options, { limit: Infinity }));
  }
}