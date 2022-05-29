/* eslint-disable no-undef */
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = (env = {}) => ({
  mode: env.production ? "production" : "development",
  devtool: env.production ? "source-map" : "eval-source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    fallback: {
      path: false, // do not include a polyfill for path
      stream: require.resolve("stream-browserify"),
    },
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
})
