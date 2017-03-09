function checkNormalizers(config) {
  if(config.normalizer) {
    if(typeof config.normalizer !== "function") {
      throw new TypeError("expected normalizer to be a funcion. Insead got: " + typeof config.normalizer);
    }
  }
  else if(config.normalizers && typeof config.normalizers === "object") {
    Object.keys(config.normalizers).forEach((key) => {
      if(config.normalizers[key] && typeof config.normalizers[key] !== "function") {
        throw new TypeError("normalizers object at key: " + key + " is not a function");
      }
    });
  }
}

const normalizer = function(schema, opt) {
  const normalizers = {};

  checkNormalizers(opt);

  if(opt.normalizers) {
    Object.keys(opt.normalizers).forEach((key) => {
      normalizers[key] = opt.normalizers[key];
    });
  }
  else if(opt.normalizer) {
    normalizers.default = opt.normalizer;
  }

  schema.methods.normalize = function(fnType) {
    const type = fnType || "default";
    return normalizers[type](this);
  };
};

module.exports = normalizer;
