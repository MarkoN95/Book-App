const types = require("../actions/types");

const login = function(state, action) {
  switch(action.type) {
    case types.UPDATE_FORM_INPUT:
      return action.form !== "login" ? state : Object.assign({}, state, {
        [action.field]: action.value
      });

    default:
      return state;
  }
};

module.exports = login;
