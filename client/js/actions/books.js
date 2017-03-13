const types = require("./types");

module.exports = {
  selectBookId: function(id) {
    return {
      type: types.ADD_BOOK,
      id
    };
  }
};
