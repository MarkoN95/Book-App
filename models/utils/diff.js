/*
 * Description:  takes two arrays and an optional comparator function. returns an object with two new arrays
 *               The first one under property remove contains all elements that were in the _old but not in the _new array
 *               The second one under property add contains all elements that were in the _new but not in the _old
 *
 * _old:         Array of items
 * _new:         Array of items
 * equals:       Optinal comparator function. defaults to primitive === equality
 */
module.exports = function diff(_old, _new, equals) {

  if(typeof equals !== "function") {
    equals = (a, b) => { return a === b; };
  }

  let result = {};

  // keep everything that is in "_old" but not in "_new"
  result.remove = _old.filter((item) => {
    return !equals(item, _new.find(d => equals(d, item)));
  });

  // keep everything that is in "_new" but not in "_old"
  result.add = _new.filter((item) => {
    return !equals(item, _old.find(d => equals(d, item)));
  });

  return result;
};
