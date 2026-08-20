const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",

  entry: "./src/index.tsx",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader"
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ],

  devServer: {
    port: 3000,
    open: true,
    hot: true
  }
};