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
  },
  saveLastSearch: function(search_type, text) {
    return {
      type: types.SAVE_LAST_SEARCH,
      search_type,
      text
    };
  }
};
