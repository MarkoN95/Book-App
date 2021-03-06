const composeReducers = require("./compose");
const createRequestReducer = require("./request");
const createFormReducer = require("./form");

const {
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  LOGOUT_REQUEST,
  BOOK_SEARCH_REQUEST,
  BOOK_ADD_REQUEST,
  ADD_BOOK,
  BOOK_REMOVE_REQUEST,
  REMOVE_BOOK,
  MARKETPLACE_SEARCH_REQUEST,
  SAVE_LAST_SEARCH
} = require("../actions/types");

const login             = createFormReducer("login");
const loginRequest      = createRequestReducer(LOGIN_REQUEST);
const register          = createFormReducer("register");
const registerRequest   = createRequestReducer(REGISTER_REQUEST);
const user              = require("./user");
const logoutRequest     = createRequestReducer(LOGOUT_REQUEST);
const bookSearch        = createFormReducer("bookSearch");
const bookSearchRequest = createRequestReducer(BOOK_SEARCH_REQUEST);
const settings          = require("./settings");
const trade             = require("./trade");

const marketplace = composeReducers({
  search: createFormReducer("search"),
  request: createRequestReducer(MARKETPLACE_SEARCH_REQUEST),
  lastInput: function(state, action) {
    switch(action.type) {
      case SAVE_LAST_SEARCH:
        return Object.assign({}, state, { type: action.search_type, text: action.text });

      default:
        return state;
    }
  }
});

const addBook = composeReducers({
  id: function(state, action) {
    switch(action.type) {
      case ADD_BOOK:
        return action.id;

      default:
        return state;
    }
  },
  request: createRequestReducer(BOOK_ADD_REQUEST)
});

const removeBook = composeReducers({
  id: function(state, action) {
    switch(action.type) {
      case REMOVE_BOOK:
        return action.id;

      default:
        return state;
    }
  },
  request: createRequestReducer(BOOK_REMOVE_REQUEST)
});

module.exports = composeReducers({
  trade,
  marketplace,
  login,
  loginRequest,
  register,
  registerRequest,
  user,
  logoutRequest,
  bookSearch,
  bookSearchRequest,
  addBook,
  removeBook,
  settings
});
