/* eslint-disable import/no-commonjs */

const path = require("path")
const webpack = require("webpack");

const publicPath = path.join(__dirname, "public")

module.exports = {
  entry: ["./src/main.js"],
  output: {
    path: publicPath,
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, "src")],
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)$/,
        use: ["file-loader?name=[path][name].[ext]"]
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      "GIT_JSON_API_URI",
      "ASSET_SERVER_URI"
    ])
  ],
  devServer: {
    contentBase: publicPath,
    host: "0.0.0.0",
    disableHostCheck: true
  }
}
