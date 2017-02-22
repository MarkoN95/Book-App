const webpack = require("webpack");
const PurifyCSSPlugin = require("purifycss-webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");

exports.purifyCSS = function({ paths }) {
  return {
    plugins: [
      new PurifyCSSPlugin({ paths })
    ]
  };
};

exports.clean = function(path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path])
    ]
  };
};

exports.hashedModuleIds = function() {
  return {
    plugins: [
      new webpack.HashedModuleIdsPlugin()
    ]
  };
};
