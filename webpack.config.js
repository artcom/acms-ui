/* eslint-disable import/no-commonjs */

const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = (env = {}) => ({
  mode: env.production ? "production" : "development",
  devtool: env.production ? "source-map" : "eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: false
            }
          }
        ]
      }
    ]
  },
  resolve: {
    fallback: {
      path: false, // do not include a polyfill for path
      stream: require.resolve("stream-browserify")
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    })
  ],
  devServer: {
    port: 5000
  }
})
