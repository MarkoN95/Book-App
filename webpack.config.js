const path = require("path");
const merge = require("webpack-merge");
const { dev, loaders, plugins, utils } = require("./config/parts");

const PATHS = {
  template: path.join(__dirname, "client", "index.pug"),
  client: path.join(__dirname, "client"),
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
  loaders.loadJS({ include: PATHS.app })
);

const client = {
  development: function development() {
    return merge(
      common,
      {
        entry: ["react-hot-loader/patch", PATHS.app],
        output: {
          devtoolModuleFilenameTemplate: "webpack:///[resource-path]",
          path: path.join(PATHS.build, "client"),
          filename: "[name].js"
        }
      },
      loaders.loadImages({
        options: {
          name: "images/[name].[ext]"
        }
      }),
      loaders.loadPug({ include: PATHS.client }),
      plugins.HTMLPlugin({ template: PATHS.template }),
      dev.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
        proxy: {
          "/api": "http://localhost:8124",
          "/auth": "http://localhost:8124"
        }
      }),
      loaders.loadCSS({ include: PATHS.client }),
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
    return merge(
      common,
      {
        entry: [
          "webpack/hot/poll?1000",
          PATHS.server
        ],
        output: {
          path: path.join(PATHS.build, "server"),
          filename: "backend.js"
        },
        target: "node",
        node: {
          __dirname: true,
          __filename: true
        }
      },
      utils.nodeModules(),
      dev.sourceMap({ type: "source-map" }),
      plugins.addStackTrace(),
      plugins.hmr(),
      plugins.namedModules()
    );
  },
  production: function production() {
    //server production config here
    return;
  }
};

module.exports = function(env) {
  if(env === "development") {
    process.env.BABEL_ENV = env;

    switch(process.env.npm_lifecycle_event) {
      case "start:client":
        return client.development();

      case "start:server":
        return server.development();
    }
  }

  if(env === "production") {
    switch(process.env.npm_lifecycle_event) {
      case "build:client":
        return client.production();

      case "build:server":
        return server.production();
    }
  }
};
