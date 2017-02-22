const path = require("path");
const merge = require("webpack-merge");

const dev = require("./config/webpack_modules/dev");
const loaders = require("./config/webpack_modules/loaders");

const PATHS = {
  app: path.join(__dirname, "client", "js"),
  server: path.join(__dirname, "server.js"),
  build: path.join(__dirname, "build")
};

const common = merge(
  {
    resolve: {
      extensions: [".js", ".jsx"]
    }
  },
  loaders.loadImages({
    options: {
      name: "images/[name].[contenthash].[ext]"
    }
  }),
  loaders.loadJS({ include: PATHS.app })
);

const client = {
  development: function development() {
    return merge(
      common,
      {
        entry: {
          path: ["react-hot-loader/patch", PATHS.app]
        },
        output: {
          devtoolModuleFilenameTemplate: "webpack:///[resource-path]",
          path: path.join(PATHS.build, "client"),
          filename: "[name].js"
        }
      },
      dev.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
        proxy: {
          "/api": "http://localhost:8124"
        }
      }),
      loaders.loadCSS(),
      dev.sourceMap({ type: "cheap-module-eval-source-map" })
    );
  },
  production: function production() {
    return merge(
      common,
      {
        output: {
          path: path.join(PATHS.build, "client")
        }
      }
    );
  }
};

const server = {
  development: function development() {
    //server development config here
    return;
  },
  production: function production() {
    //server production config here
    return;
  }
};

module.exports = function(env) {
  if(env === "development") {
    return client.development();
  }

  if(env === "production") {
    return client.production();
  }
};
