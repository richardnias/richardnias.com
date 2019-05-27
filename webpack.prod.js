const merge = require('webpack-merge')
const common = require('./webpack.common')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CompressionPlugin({
      filename: '[path][query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      deleteOriginalAssets: false
    })
  ]
})
