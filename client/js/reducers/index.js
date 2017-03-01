const composeReducers = require("./compose");

const login = require("./login");
const register = require("./register");

module.exports = composeReducers({
  login,
  register
});
