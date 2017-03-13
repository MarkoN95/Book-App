const types = require("./types");

module.exports = {
  updateUser: function(user) {
    return {
      type: types.UPDATE_USER,
      user: user
    };
  },
  addToLibrary: function(book) {
    return {
      type: types.ADD_TO_LIBRARY,
      book
    };
  },
  removeFromLibrary: function(id) {
    return {
      type: types.REMOVE_FROM_LIBRARY,
      id
    };
  }
};
