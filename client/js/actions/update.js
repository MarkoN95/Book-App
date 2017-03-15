const types = require("./types");

module.exports = {
  updateFormInput: function(form, field, value) {
    return {
      type: types.UPDATE_FORM_INPUT,
      form,
      field,
      value
    };
  },
  toggleModal: function() {
    return {
      type: types.TOGGLE_MODAL
    };
  }
};
