const composeReducers = require("./compose");
const createFormReducer = require("./form");
const createRequestReducer = require("./request");

const types = require("../actions/types");

const public_info = createFormReducer("public_info");
const public_infoRequest = createRequestReducer(types.UPDATE_PUBLIC_REQUEST);

const change_pw = createFormReducer("change_pw");
const change_pwRequest = createRequestReducer(types.CHANGE_PW_REQUEST);

module.exports = composeReducers({
  public_info,
  public_infoRequest,
  change_pw,
  change_pwRequest
});
