const webpack = require('webpack')
const { resolve } = require('path')
const { environment, config } = require('@rails/webpacker')
const typescript =  require('./loaders/typescript')
environment.loaders.append('typescript', typescript)
environment.loaders.append('html', {
  test: /\.html$/,
  use: [{
    loader: 'html-loader',
    options: {
      minimize: true,
      removeAttributeQuotes: false,
      caseSensitive: true,
      customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ],
      customAttrAssign: [ /\)?\]?=/ ]
    }
  }]
})
environment.plugins.append('ContextReplacement',
  new webpack.ContextReplacementPlugin(
    /angular(\\|\/)core(\\|\/)(@angular|esm5)/,
    resolve(config.source_path)
  )
)
module.exports = environment
