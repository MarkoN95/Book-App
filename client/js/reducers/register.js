const types = require("../actions/types");

const register = function(state, action) {
  switch(action.type) {
    case types.UPDATE_FORM_INPUT:
      return action.form !== "register" ? state : Object.assign({}, state, {
        [action.field]: action.value
      });

    default:
      return state;
  }
};

module.exports = register;
