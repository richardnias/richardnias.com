const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  plugins: [
    new CleanWebpackPlugin(['public']),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: 'src/favicon.png'
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../stats.html',
      openAnalyzer: false
    }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
      offlineGoogleAnalytics: true,
      runtimeCaching: [{
        urlPattern: new RegExp( '^https://fonts\.googleapis\.com'),
        handler: 'staleWhileRevalidate'
      },{
        urlPattern: new RegExp('^https://fonts\.gstatic\.com'),
        handler: 'cacheFirst'
      },{
        urlPattern: new RegExp('^https://www\.googletagmanager\.com/gtag'),
        handler: 'staleWhileRevalidate'
      },{
        urlPattern: new RegExp('^https://www\.google-analytics\.com'),
        handler: 'staleWhileRevalidate'
      }]
    })
  ],
  output: {
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[name].[hash].js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
