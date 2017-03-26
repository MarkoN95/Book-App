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

    case types.ADD_TRADE:
      return Object.assign({}, state, {
        trades: state.trades.concat([action.trade])
      });

    case types.DELETE_TRADE:
      return Object.assign({}, state, {
        trades: state.trades.filter(t => t.id !== action.tradeId)
      });

    case types.REPLACE_TRADE:
      return Object.assign({}, state, {
        trades: state.trades.map(t => t.id !== action.trade.id ? t : action.trade)
      });

    case types.SET_BOOKS:
      return Object.assign({}, state, {
        library: state.library.map((book) => {
          if(action.bookIds.indexOf(book.id) !== -1) {
            return Object.assign({}, book, {
              available: action.status
            });
          }
          return book;
        })
      });

    case types.MARK_MESSAGE_AS_SEEN:
      return Object.assign({}, state, {
        message_cache: state.message_cache.map((msg) => {
          if(msg.id === action.msgId) {
            return Object.assign({}, msg, { seen: true });
          }
          return msg;
        })
      });

    default:
      return state;
  }
};

module.exports = user;
