const composeReducers = require("./compose");
const createRequestReducer = require("./request");
const createFormReducer = require("./form");

const {
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  LOGOUT_REQUEST,
  BOOK_SEARCH_REQUEST
} = require("../actions/types");

const login             = createFormReducer("login");
const loginRequest      = createRequestReducer(LOGIN_REQUEST);
const register          = createFormReducer("register");
const registerRequest   = createRequestReducer(REGISTER_REQUEST);
const user              = require("./user");
const logoutRequest     = createRequestReducer(LOGOUT_REQUEST);
const bookSearch        = createFormReducer("bookSearch");
const bookSearchRequest = createRequestReducer(BOOK_SEARCH_REQUEST);


module.exports = composeReducers({
  login,
  loginRequest,
  register,
  registerRequest,
  user,
  logoutRequest,
  bookSearch,
  bookSearchRequest
});
