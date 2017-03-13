const axios = require("axios");
const { request, updateUser, addToLibrary } = Object.assign({}, require("./request"), require("./user"));
const {
  REGISTER_REQUEST,
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  BOOK_SEARCH_REQUEST,
  BOOK_ADD_REQUEST
} = require("./types");

/*
 * makeAjaxRequest() description:
 *
 * dispatch: the redux dispatch function
 * type: the redux action type (should be a string)
 * verb: http verb (get, post, put, delete)
 * body: optional request body
 * onSuccess: this handler is wrapped in a dispatch call and should return a redux action the response is passed as it's argument
 * final: use this function for any side effects (onyl called if request succeeds).
 * finalFirst: boolean used to call the final callback before the onSuccess handler
 *
 */

function ajaxRequest({ dispatch, type, verb, url, body, onSuccess, final, finalFirst, passData, clearError }) {
  if(["get", "post", "put", "delete"].indexOf(verb) === -1) {
    throw new Error("invalid request verb: " + verb);
  }

  dispatch(request(type, "begin"));
  axios[verb](url, body)
  .then((res) => {
    dispatch(request(type, "done", null, passData ? res.data : null));
    finalFirst && typeof final === "function" && final();
    typeof onSuccess === "function" && onSuccess(res);
    !finalFirst && typeof final === "function" && final();
  })
  .catch((err) => {
    if(err.response && err.response.data) {
      dispatch(request(type, "fail", err.response.data.error));
    }
    else {
      dispatch(request(type, "fail", err));
    }

    setTimeout(function() {
      dispatch(request(type, "clear-error"));
    }, clearError || 3000);
  });
}

module.exports = {
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
          ownProps.router.push("/login");
        }
      });
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
  }
};
