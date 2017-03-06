const composeReducers = require("./compose");
const createRequestReducer = require("./request");

const { LOGIN_REQUEST, REGISTER_REQUEST } = require("../actions/types");

const login = require("./login");
const register = require("./register");
const loginRequest = createRequestReducer(LOGIN_REQUEST);
const registerRequest = createRequestReducer(REGISTER_REQUEST);
const user = require("./user");

module.exports = composeReducers({
  login,
  loginRequest,
  register,
  registerRequest,
  user
});
