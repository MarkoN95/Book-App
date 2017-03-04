const axios = require("axios");
const { REGISTER_REQUEST } = require("./types");
const { request, updateUser } = Object.assign({}, require("./request"), require("./user"));

module.exports = {
  register: function(ownProps) {
    return function(dispatch, getState) {
      dispatch(request(REGISTER_REQUEST, "begin"));

      axios.post("/auth/local/register", getState().register)
      .then((res) => {
        dispatch(request(REGISTER_REQUEST, "done"));
        dispatch(updateUser(res.data));
        ownProps.router.push("/user");
      })
      .catch((err) => {
        dispatch(request(REGISTER_REQUEST, "fail", err));
      });
    };
  }
};
