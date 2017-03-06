
const normalizer = function(schema, opt) {
  if(!opt.normalizer || opt.normalizers) {
    throw new TypeError("normalizer() plugin expcts at a function under opt.normalizer or an object of functions under opt.normalizers");
  }

  schema.methods.normalize = function() {

  };
};

module.exports = normalizer;
