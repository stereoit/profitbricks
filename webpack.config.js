const {resolve} = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = env => {
  return {
    entry: {
      app: './app.js',
      vender: ['react', 'formsy-react', 'formsy-material-ui'],
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: '[name].bundle.[chunkhash].js',
        pathinfo: !env.prod,
    },
    devtool: 'source-map',
    context: resolve(__dirname, 'frontend'),
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
        }
      ]
    },
    plugins:[
      new HtmlWebpackPlugin({ template: './index.html' }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vender'
      })
    ],
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:8081',
          secure: false
        }
      }
    }
  }
}
