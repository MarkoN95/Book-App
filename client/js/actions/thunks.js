const clone = require("../utils/deepcopy");
const axios = require("axios");
const {
  request,
  updateUser,
  addToLibrary,
  removeFromLibrary,
  updatePublicInfo,
  toggleModal,
  updateFormInput,
  load,
  addToStage,
  setBookAvailability,
  addTrade,
  deleteTrade,
  replaceTrade,
  saveLastSearch,
  markMessageAsSeen
} = Object.assign(
  {},
  require("./request"),
  require("./user"),
  require("./update"),
  require("./trade")
);

const {
  REGISTER_REQUEST,
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  BOOK_SEARCH_REQUEST,
  BOOK_ADD_REQUEST,
  BOOK_REMOVE_REQUEST,
  UPDATE_PUBLIC_REQUEST,
  CHANGE_PW_REQUEST,
  DELETE_ACCOUNT_REQUEST,
  MARKETPLACE_SEARCH_REQUEST,
  GET_OTHER_LIBRARY_REQUEST,
  TRADE_REQUEST
} = require("./types");

const formatError = require("../utils/format_error");
const diff = require("../../../models/utils/diff");
/*
 * makeAjaxRequest() description:
 *
 * dispatch: the redux dispatch function
 * type: the redux action type (should be a string)
 * verb: http verb (get, post, put, delete)
 * body: optional request body
 * onSuccess: this handler is wrapped in a dispatch call and should return a redux action the response is passed as it's argument
 * final: use this function for any side effects (only called if request succeeds).
 * finalFirst: boolean used to call the final callback before the onSuccess handler
 * clearError: time in ms after which to remove the error from screen. Defaults to 3000ms
 *
 */

function ajaxRequest({ dispatch, type, verb, url, body, onSuccess, final, finalFirst, passData, clearError }) {
  if(["get", "post", "put", "delete"].indexOf(verb) === -1) {
    throw new Error("invalid request verb: " + verb);
  }
  function noop() {}
  if(typeof onSuccess !== "function") {
    onSuccess = noop;
  }
  if(typeof final !== "function") {
    final = noop;
  }

  dispatch(request(type, "begin"));

  axios[verb](url, body)
  .then((res) => {
    dispatch(request(type, "done", null, passData ? res.data : null));

    if(finalFirst) {
      final();
      onSuccess(res);
    }
    else {
      onSuccess(res);
      final();
    }
  })
  .catch((err) => {
    let displayError = formatError(err, type);
    dispatch(request(type, "fail", displayError));

    if(this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(function() {
      dispatch(request(type, "clear-error"));
    }, clearError || 5000);

    if(process.env.NODE_ENV !== "production") {
      if(displayError.throw) {
        throw err;
      }
    }
  })
  .catch((err) => {
    if(process.env.NODE_ENV !== "production") {
      console.warn("Error caught by Promise.catch()");
      console.error(err);
    }
  });
}

const thunks = module.exports = {
  register: function(ownProps) {
    return function(dispatch, getState) {
      ajaxRequest({
        dispatch,
        type: REGISTER_REQUEST,
        verb: "post",
        url: "/auth/local/register",
        body: getState().register,
        onSuccess: function(res) {
          dispatch(updateUser(res.data));
        },
        final: function() {
          ownProps.router.push("/user");
        }
      });
    };
  },
  login: function(ownProps) {
    return function(dispatch, getState) {
      ajaxRequest({
        dispatch,
        type: LOGIN_REQUEST,
        verb: "post",
        url: "/auth/local/login",
        body: getState().login,
        onSuccess: function(res) {
          dispatch(updateUser(res.data));
        },
        final: function() {
          ownProps.router.push("/user");
        }
      });
    };
  },
  logout: function(ownProps) {
    var thunks = this;

    return function(dispatch) {
      ajaxRequest({
        dispatch,
        type: LOGOUT_REQUEST,
        verb: "post",
        url: "/auth/local/logout",
        finalFirst: true,
        onSuccess: function() {
          dispatch(updateUser(null));
        },
        final: function() {
          ownProps.router.push("/");

          dispatch(thunks.purgeAjaxResult("searchBooks"));
          dispatch(thunks.purgeAjaxResult("marketplace"));
          dispatch(thunks.purgeForm("search"));
          dispatch(thunks.purgeForm("bookSearch"));
        }
      });
    };
  },
  findBooks: function(option) {
    return function(dispatch, getState) {
      const query = getState().marketplace.search.query;
      ajaxRequest({
        dispatch,
        type: MARKETPLACE_SEARCH_REQUEST,
        verb: "get",
        url: "/api/books/find?" + (option ? "option=" + option : "query=" + query),
        passData: true
      });
    };
  },
  reloadMarketPlace: function() {
    return function(dispatch, getState) {
      const last = getState().marketplace.lastInput;

      if(last.type === null) {
        return;
      }
      ajaxRequest({
        dispatch,
        type: MARKETPLACE_SEARCH_REQUEST,
        verb: "get",
        url: "/api/books/find?" + (last.type === "option" ? "option=" + last.text : "query=" + last.text),
        passData: true
      });
    };
  },
  saveLastSearch: function(input) {
    return function(dispatch, getState) {
      const query = getState().marketplace.search.query;

      if(input.type === "option") {
        dispatch(saveLastSearch("option", input.option));
      }
      else if(input.type === "query") {
        dispatch(saveLastSearch("query", query));
      }
    };
  },
  searchBooks: function() {
    return function(dispatch, getState) {
      ajaxRequest({
        dispatch,
        type: BOOK_SEARCH_REQUEST,
        verb: "get",
        url: "/api/books/search" + "?q=" + getState().bookSearch.query,
        passData: true
      });
    };
  },
  addBook: function(book) {
    return function(dispatch) {

      if(!book) {
        let err = new Error("book id not found in search results");
        return dispatch(request(BOOK_ADD_REQUEST, "fail", err));
      }

      ajaxRequest({
        dispatch,
        type: BOOK_ADD_REQUEST,
        verb: "post",
        url: "api/books/add",
        body: book,
        onSuccess: function(res) {
          dispatch(addToLibrary(res.data));
        }
      });
    };
  },
  removeBook: function(book) {
    return function(dispatch) {

      if(!book) {
        let err = new Error("book id not found in library");
        return dispatch(request(BOOK_REMOVE_REQUEST, "fail", err));
      }

      ajaxRequest({
        dispatch,
        type: BOOK_REMOVE_REQUEST,
        verb: "delete",
        url: "/api/books/remove?id=" + book.id,
        onSuccess: function() {
          dispatch(removeFromLibrary(book.id));
        }
      });
    };
  },
  changePublicInfo: function() {
    return function(dispatch, getState) {
      ajaxRequest({
        dispatch,
        type: UPDATE_PUBLIC_REQUEST,
        verb: "put",
        url: "/api/settings/public",
        body: getState().settings.public_info,
        onSuccess: function() {
          dispatch(updatePublicInfo(getState().settings.public_info));
        }
      });
    };
  },
  changePassword: function(ownProps) {
    return function(dispatch, getState) {
      ajaxRequest({
        dispatch,
        type: CHANGE_PW_REQUEST,
        verb: "put",
        url: "/api/settings/password",
        body: getState().settings.change_pw,
        onSuccess: function() {
          dispatch(updateUser(null));
        },
        final: function() {
          ownProps.router.push("/login");
        }
      });
    };
  },
  deleteAccount: function(ownProps) {
    return function(dispatch) {
      ajaxRequest({
        dispatch,
        type: DELETE_ACCOUNT_REQUEST,
        verb: "delete",
        url: "/api/settings/delete",
        onSuccess: function() {
          dispatch(updateUser(null));
          dispatch(toggleModal());
        },
        final: function() {
          ownProps.router.push("/");
        }
      });
    };
  },
  purgeAjaxResult: function(type) {
    return function(dispatch) {
      const map = {
        marketplace: MARKETPLACE_SEARCH_REQUEST,
        searchBooks: BOOK_SEARCH_REQUEST
      };
      dispatch(request(map[type], "done", null, null));
    };
  },
  purgeForm: function(form) {
    return function(dispatch) {

      const formFields = {
        search: ["query"],
        login: ["username", "password"],
        register: ["username", "email", "password", "confirm_password", "full_name", "city", "state"],
        bookSearch: ["query"],
        public_info: ["full_name", "city", "state"],
        change_pw: ["old_pw", "new_pw", "confirm_new_pw"]
      };

      formFields[form].forEach((field) => {
        dispatch(updateFormInput(form, field, ""));
      });
    };
  },
  populatePublicInfoForm: function() {
    return function(dispatch, getState) {
      const user = getState().user;

      if(!user) {
        return;
      }

      const _public = user.public;

      dispatch(updateFormInput("public_info", "full_name", _public.full_name));
      dispatch(updateFormInput("public_info", "city", _public.city));
      dispatch(updateFormInput("public_info", "state", _public.state));
    };
  },
  loadTradeUI: function(trade, initialOther, initialBook, ownProps) {
    return function(dispatch, getState) {
      const user = getState().user;

      if(!user) {
        ownProps.router.push("/login");
        return;
      }

      const self_library = clone(user.library);
      const self = {
        id: user.id,
        username: user.username,
        image_url: user.image_url
      };
      const other = {
        id: initialOther.id,
        username: initialOther.username,
        image_url: initialOther.image_url
      };

      dispatch(load("self_library", self_library));
      dispatch(load("self", self));
      dispatch(load("other", other));

      if(trade.id) {
        dispatch(load("id", trade.id));
        ownProps.router.push({
          pathname: "/trade",
          query: {
            id: trade.id
          }
        });
      }
      else if(trade.new) {
        ownProps.router.push("/trade/new");
      }

      ajaxRequest({
        dispatch,
        type: GET_OTHER_LIBRARY_REQUEST,
        verb: "get",
        url: "/api/books/getLibrary?ownerId=" + initialOther.id,
        onSuccess: function(res) {
          dispatch(load("other_library", res.data));
        },
        final: function() {
          if(initialBook) {
            dispatch(addToStage("other", initialBook));
          }

          if(trade.id) {
            let loadedTrade = getState().trade;
            let otherLibrary = loadedTrade.other_library;
            let selfLibrary = loadedTrade.self_library;
            let selfRole = initialOther.role === "initiand" ? "acceptand" : "initiand";

            trade[initialOther.role + "_stage"].forEach((bid) => {
              let foundBook = otherLibrary.find((book) => {
                return book.id === bid;
              });
              foundBook = Object.assign({}, foundBook, { available: true });
              dispatch(addToStage("other", foundBook));
            });

            trade[selfRole + "_stage"].forEach((bid) => {
              let foundBook = selfLibrary.find((book) => {
                return book.id === bid;
              });
              foundBook = Object.assign({}, foundBook, { available: true });
              dispatch(addToStage("self", foundBook));
            });
          }
          dispatch(load("loaded", true));
        }
      });
    };
  },
  purgeTradeUI: function() {
    return function(dispatch) {
      dispatch(load("id", null));
      dispatch(load("self", null));
      dispatch(load("self_library", []));
      dispatch(load("self_stage", []));
      dispatch(load("other", null));
      dispatch(load("other_library", []));
      dispatch(load("other_stage", []));
      dispatch(load("loaded", false));
    };
  },
  initiateTrade: function(ownProps) {
    return function(dispatch, getState) {
      const trade = getState().trade;

      const payload = {
        parties: {
          initiand: trade.self.id,
          acceptand: trade.other.id
        },
        stages: {
          initiand: trade.self_stage.map(b => b.id),
          acceptand: trade.other_stage.map(b => b.id)
        }
      };

      ajaxRequest({
        dispatch,
        type: TRADE_REQUEST,
        verb: "post",
        url: "/api/trade/initiate",
        body: payload,
        onSuccess: function(res) {
          dispatch(setBookAvailability(payload.stages.initiand, false));
          dispatch(addTrade(res.data));
          dispatch(thunks.reloadMarketPlace());
        },
        final: function() {
          ownProps.router.push("/user");
        }
      });
    };
  },
  acceptTrade: function(ownProps) {
    return function(dispatch, getState) {
      const state = getState();

      const payload = {
        tradeId: state.trade.id
      };

      ajaxRequest({
        dispatch,
        type: TRADE_REQUEST,
        verb: "put",
        url: "/api/trade/accept",
        body: payload,
        onSuccess: function(res) {
          dispatch(updateUser(res.data));
          dispatch(thunks.reloadMarketPlace());
        },
        final: function() {
          ownProps.router.push("/user");
        }
      });
    };
  },
  declineTrade: function(ownProps) {
    return function(dispatch, getState) {
      const state = getState();

      const payload = {
        tradeId: state.trade.id,
      };

      let trade = state.user.trades.find(t => t.id === state.trade.id);
      let selfRole = trade.initiand.id === state.user.id ? "initiand" : "acceptand";
      let booksToFree = trade[selfRole + "_stage"];

      ajaxRequest({
        dispatch,
        type: TRADE_REQUEST,
        verb: "delete",
        url: "/api/trade/decline?tradeId=" + payload.tradeId,
        onSuccess: function() {
          dispatch(setBookAvailability(booksToFree, true));
          dispatch(deleteTrade(state.trade.id));
          dispatch(thunks.reloadMarketPlace());
        },
        final: function() {
          ownProps.router.push("/user");
        }
      });
    };
  },
  negotiateTrade: function(ownProps) {
    return function(dispatch, getState) {
      const state = getState();

      let trade = state.user.trades.find(t => t.id === state.trade.id);
      let selfRole = trade.initiand.id === state.user.id ? "initiand" : "acceptand";
      let otherRole = selfRole === "initiand" ? "acceptand" : "initiand";

      const payload = {
        tradeId: state.trade.id,
        nextStages: {
          [selfRole]: state.trade.self_stage.map(b => b.id),
          [otherRole]: state.trade.other_stage.map(b => b.id)
        }
      };

      let selfDiff = diff(
        trade[selfRole + "_stage"],
        state.trade.self_stage.map(b => b.id)
      );

      ajaxRequest({
        dispatch,
        type: TRADE_REQUEST,
        verb: "put",
        url: "/api/trade/negotiate",
        body: payload,
        onSuccess: function(res) {
          dispatch(replaceTrade(res.data));
          // selfDiff.add are books that were added to the stage so available must be set to false
          // selfDiff.remove are book that were removed from the stage so avaliable must be set to true
          dispatch(setBookAvailability(selfDiff.add, false));
          dispatch(setBookAvailability(selfDiff.remove, true));
          dispatch(thunks.reloadMarketPlace());
        },
        final: function() {
          ownProps.router.push("/user");
        }
      });
    };
  },
  markMessageAsSeen: function(msgId) {
    return function(dispatch) {
      dispatch(markMessageAsSeen(msgId));
      axios.put("/api/settings/markMessageAsSeen?messageId=" + msgId);
    };
  }
};
