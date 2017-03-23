const createRequestReducer = require("./request");
const types = require("../actions/types");

const getOtherLibraryRequst = createRequestReducer(types.GET_OTHER_LIBRARAY_REQUEST);
const tradeRequest = createRequestReducer(types.TRADE_REQUEST);

const trade = function(state, action) {
  var nextStage, nextLibrary;
  switch(action.type) {

    case types.LOAD_TRADE_DATA:
      return Object.assign({}, state, {
        [action.what]: action.data
      });

    case types.ADD_TO_STAGE:
      nextStage = action.who + "_stage";
      nextLibrary = action.who + "_library";

      return Object.assign({}, state, {
        [nextStage]: state[nextStage].concat([action.data]),
        [nextLibrary]: state[nextLibrary].filter(b => b.id !== action.data.id)
      });

    case types.REMOVE_FROM_STAGE:
      nextStage = action.who + "_stage";
      nextLibrary = action.who + "_library";

      action.data.available = true;

      return Object.assign({}, state, {
        [nextStage]: state[nextStage].filter(b => b.id !== action.data.id),
        [nextLibrary]: state[nextLibrary].concat([action.data])
      });

    case types.GET_OTHER_LIBRARAY_REQUEST:
      return Object.assign({}, state, {
        request_other_libraray: getOtherLibraryRequst(state.request_other_libraray, action)
      });

    case types.TRADE_REQUEST:
      return Object.assign({}, state, {
        trade_request: tradeRequest(state.trade_request, action)
      });

    default:
      return state;
  }
};

module.exports = trade;
