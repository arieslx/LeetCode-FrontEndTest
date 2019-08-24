/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: './src/index.js',

  mode: 'production',

  output: {
    filename: '[name].[chunkhash:8].js',
  },

  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/
        },
        common: {
          test: /[\\/]src[\\/]common[\\/]/,
          minSize: 0
        },
        module1: {
          test: /[\\/]src[\\/]module-1[\\/]/,
          enforce: true
        },
        module2: {
          test: /[\\/]src[\\/]module-2[\\/]/,
          enforce: true
        }
      }
    },
  }
}