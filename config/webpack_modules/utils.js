const fs = require("fs");

exports.nodeModules = function({ additionalModules } = { additionalModules: [] }) {
  const externals = {};
  fs.readdirSync("node_modules")
    .concat(additionalModules)
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
