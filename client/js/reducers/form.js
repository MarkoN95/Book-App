const types = require("../actions/types");

const createFormReducer = function createFormReducer(form) {
  return function(state, action) {
    switch(action.type) {
      case types.UPDATE_FORM_INPUT:
        return action.form !== form ? state : Object.assign({}, state, {
          [action.field]: action.value
        });

      default:
        return state;
    }
  };
};

module.exports = createFormReducer;
