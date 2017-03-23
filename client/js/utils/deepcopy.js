function isNull(v) {
  return typeof v === "object" && !v;
}

function isPrimitive(v) {
  return ["number", "string", "boolean", "undefined"].indexOf(typeof v) !== -1 || isNull(v);
}

function isPlainObject(o) {
  return o && typeof o === "object" && o.constructor === Object;
}

function deepCopy(o, level = Infinity) {
  var copy;

  if(Array.isArray(o)) {
    copy = [];

    for(var i = 0; i < o.length; i++) {
      if(isPrimitive(o[i])) {
        copy[i] = o[i];
      }
      else {
        if(level != 0) {
          copy[i] = deepCopy(o[i], level - 1);
        }
        else {
          copy[i] = undefined;
        }
      }
    }

    return copy;
  }
  else if(isPlainObject(o)) {
    copy = {};

    for(var p in o) {
      if(o.hasOwnProperty(p)) {
        if(isPrimitive(o[p])) {
          copy[p] = o[p];
        }
        else {
          if(level != 0) {
            copy[p] = deepCopy(o[p], level - 1);
          }
          else {
            copy[p] = undefined;
          }
        }
      }
    }

    return copy;
  }
  else {
    return o;
  }
}

module.exports = deepCopy;
