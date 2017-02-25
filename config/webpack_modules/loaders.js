const ExtractTextPlugin = require("extract-text-webpack-plugin");

exports.loadCSS = function({ include, exclude }) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,
          use: ["style-loader", "css-loader"]
        }
      ]
    }
  };
};

exports.extractCSS = function({ include, exclude, use }) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,
          use: {
            modules: ExtractTextPlugin.extract({
              use,
              fallback: "style-loader"
            })
          }
        }
      ],
      plugins: [
        new ExtractTextPlugin("[name].[contenthash].css")
      ]
    }
  };
};

exports.loadJS = function({ include, exclude }) {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          include,
          exclude,
          loader: "babel-loader",
          options: {
            cacheDirectory: true
          }
        }
      ]
    }
  };
};

exports.loadImages = function({ include, exclude, options }) {
  return {
    module: {
      rules: [
        {
          test: /\.(png|jpg)$/,
          include,
          exclude,
          use: {
            loader: "url-loader",
            options
          }
        }
      ]
    }
  };
};

exports.loadPug = function({ include, exclude }) {
  return {
    module: {
      rules: [
        {
          test: /\.pug$/,
          include,
          exclude,
          loader: "pug-loader"
        }
      ]
    }
  };
};
