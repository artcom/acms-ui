/* eslint-disable import/no-commonjs */

const HtmlPlugin = require("html-webpack-plugin")
const { EnvironmentPlugin } = require("webpack")

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
      }
    ]
  },
  plugins: [
    new EnvironmentPlugin({
      CONFIG_SERVER_URI: null,
      CMS_CONFIG_PATH: null,
      ASSET_SERVER_URI: null
    }),
    new HtmlPlugin({
      template: "./src/index.html"
    })
  ],
  devServer: {
    port: 5000
  }
})
