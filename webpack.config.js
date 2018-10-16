/* eslint-disable import/no-commonjs */

const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")

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
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)$/,
        use: { loader: "file-loader", options: { name: "[path][name].[ext]" } }
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      GIT_JSON_API_URI: null,
      ASSET_SERVER_URI: null
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],
  devServer: {
    host: "0.0.0.0",
    disableHostCheck: true
  }
})
