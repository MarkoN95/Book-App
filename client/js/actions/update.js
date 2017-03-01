const types = require("./types.js");

module.exports = {
  updateFormInput: function(form/*login or register*/, field, value) {
    return {
      type: types.UPDATE_FORM_INPUT,
      form,
      field,
      value
    };
  }
};
