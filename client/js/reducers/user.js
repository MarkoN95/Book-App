const types = require("../actions/types");

const user = function(state, action) {
  switch(action.type) {
    case types.UPDATE_USER:
      return action.user;

    case types.ADD_TO_LIBRARY:
      return Object.assign({}, state, {
        library: state.library.concat([action.book])
      });

    case types.REMOVE_FROM_LIBRARY:
      return Object.assign({}, state, {
        library: state.library.filter(book => book.id !== action.id)
      });

    case types.UPDATE_PUBLIC_INFO:
      return Object.assign({}, state, {
        public: action.info
      });

    default:
      return state;
  }
};

module.exports = user;
