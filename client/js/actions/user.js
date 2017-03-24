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
  },
  updatePublicInfo: function(info) {
    return {
      type: types.UPDATE_PUBLIC_INFO,
      info
    };
  },
  setBookAvailability: function(bookIds, status) {
    return {
      type: types.SET_BOOKS,
      bookIds,
      status
    };
  },
  addTrade: function(trade) {
    return {
      type: types.ADD_TRADE,
      trade
    };
  },
  deleteTrade: function(tradeId) {
    return {
      type: types.DELETE_TRADE,
      tradeId
    };
  },
  replaceTrade: function(trade) {
    return {
      type: types.REPLACE_TRADE,
      trade
    };
  }
};
