const axios = require("axios");
const {
  request,
  updateUser,
  addToLibrary,
  removeFromLibrary,
  updatePublicInfo,
  toggleModal,
  updateFormInput
} = Object.assign({}, require("./request"), require("./user"), require("./update"));

const {
  REGISTER_REQUEST,
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  BOOK_SEARCH_REQUEST,
  BOOK_ADD_REQUEST,
  BOOK_REMOVE_REQUEST,
  UPDATE_PUBLIC_REQUEST,
  CHANGE_PW_REQUEST,
  DELETE_ACCOUNT_REQUEST
} = require("./types");

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
  purgeForm: function(form) {
    return function(dispatch) {

      const formFields = {
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
  }
};
