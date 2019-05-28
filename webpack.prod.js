const merge = require('webpack-merge')
const common = require('./webpack.common')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CompressionPlugin({
      filename: '[path][query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      deleteOriginalAssets: false
    }),
    new CopyPlugin([
      { from: 'src/robots.txt', to: '' },
      { from: 'src/manifest.json', to: '' },
      { from: 'src/app-icon-192.png', to: ''}
    ])
  ]
})
