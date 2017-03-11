const axios = require("axios");
const { REGISTER_REQUEST, LOGIN_REQUEST, LOGOUT_REQUEST } = require("./types");
const { request, updateUser } = Object.assign({}, require("./request"), require("./user"));

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

function ajaxRequest({ dispatch, type, verb, url, body, onSuccess, final, finalFirst }) {
  if(["get", "post", "put", "delete"].indexOf(verb) === -1) {
    throw new Error("invalid request verb: " + verb);
  }
  if(typeof onSuccess !== "function") {
    throw new TypeError("onSuccess is not a function");
  }

  dispatch(request(type, "begin"));
  axios[verb](url, body)
  .then((res) => {
    dispatch(request(type, "done"));
    finalFirst && typeof final === "function" && final();
    dispatch(onSuccess(res.data));
    !finalFirst && typeof final === "function" && final();
  })
  .catch((err) => {
    dispatch(request(type, "fail", err));
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
        onSuccess: updateUser,
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
        onSuccess: updateUser,
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
          // this wrap is necessary because axios interprets 204 responses as an empty string
          // even though tecnically 204's contain no response text
          return updateUser(null);
        },
        final: function() {
          ownProps.router.push("/login");
        }
      });
    };
  }
};
