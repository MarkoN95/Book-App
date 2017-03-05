const fs = require("fs");

exports.nodeModules = function() {
  const externals = {};
  fs.readdirSync("node_modules")
    .filter((mod) => {
      return [".bin"].indexOf(mod) === -1;
    })
    .forEach((mod) => {
      externals[mod] = "commonjs " + mod;
    });

  return {
    externals
  };
};
