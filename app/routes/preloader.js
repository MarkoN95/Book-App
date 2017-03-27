/*
 * The reason for all those JSON.parse(JSON.stringify(obj)) are that redux only want plain js objects in his state
 * Since the mongoose docs are not plain objects, the ReduxImmutaleStateInvarian() middlware of redux sreams loudly
 */

const Trade = require("../../models/trade");
const Book = require("../../models/book");
const checker = require("../../models/utils/checker");
const errors = require("../../models/utils/errors");
const clone = require("../../client/js/utils/deepcopy");
const { load, addToStage } = require("../../client/js/actions/trade");
const { GET_OTHER_LIBRARY_REQUEST, TRADE_REQUEST } = require("../../client/js/actions/types");

module.exports = {
  tradeUI: function(req, cb) {
    const user = req.redux_store.getState().user;
    const publicUser = {
      id: user.id,
      username: user.username,
      image_url: user.image_url
    };
    req.redux_store.dispatch(load("self", publicUser));
    req.redux_store.dispatch(load("self_library", clone(user.library)));

    if(!checker.objectId(req.query.id)) {
      return cb({ message: "invalid tradeId" });
    }

    Trade.findOne({ _id: req.query.id }, (err, trade) => {
      if(err || !trade) {
        err.__redux_request_type__ = TRADE_REQUEST;
        return cb(err || errors.tradeNotFoundError());
      }

      const selfRole = trade.initiand._id.toString() === user.id ? "initiand" : "acceptand";
      const otherRole = selfRole === "initiand" ? "acceptand" : "initiand";

      const otherProfile = {
        id: trade[otherRole]._id.toString(),
        username: trade[otherRole][trade[otherRole].login_method].username,
        image_url: trade[otherRole][trade[otherRole].login_method].image_url
      };

      req.redux_store.dispatch(load("id", trade._id.toString()));
      req.redux_store.dispatch(load("other", otherProfile));

      Book.getLibraryByOwnerId(trade[otherRole]._id.toString(), (err, library) => {
        if(err) {
          err.__redux_request_type__ = GET_OTHER_LIBRARY_REQUEST;
          return cb(err);
        }
        req.redux_store.dispatch(load("other_library", JSON.parse(JSON.stringify(library))));

        trade[otherRole + "_stage"].forEach((bid) => {
          let foundBook = library.find(b => b.id === bid.toString());
          if(foundBook) {
            foundBook = JSON.parse(JSON.stringify(foundBook));
          }
          foundBook = Object.assign({}, foundBook, { available: true });
          req.redux_store.dispatch(addToStage("other", foundBook));
        });

        trade[selfRole + "_stage"].forEach((bid) => {
          let foundBook = req.redux_store.getState().trade.self_library.find(b => b.id === bid.toString());
          if(foundBook) {
            foundBook = JSON.parse(JSON.stringify(foundBook));
          }
          foundBook = Object.assign({}, foundBook, { available: true });
          req.redux_store.dispatch(addToStage("self", foundBook));
        });

        req.redux_store.dispatch(load("loaded", true));

        cb();
      });
    });
  }
};
