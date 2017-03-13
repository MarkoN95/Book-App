const types = require("../actions/types");

const user = function(state, action) {
  switch(action.type) {
    case types.UPDATE_USER:
      return action.user;

    case types.ADD_TO_LIBRARY:
      return Object.assign({}, state, {
        library: state.library.concat([action.book])
      });

    default:
      return state;
  }
};

module.exports = user;
