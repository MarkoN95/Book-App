const types = require("./types");

module.exports = {
  load: function(what, data) {
    return {
      type: types.LOAD_TRADE_DATA,
      what,
      data
    };
  },
  addToStage: function(who, data) {
    return {
      type: types.ADD_TO_STAGE,
      who,
      data
    };
  },
  removeFromStage: function(who, data) {
    return {
      type: types.REMOVE_FROM_STAGE,
      who,
      data
    };
  }
};
