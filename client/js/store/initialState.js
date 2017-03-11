function createRequest() {
  return {
    isPending: false,
    success: null,
    error: null,
    data: null
  };
}

module.exports = {
  login: {
    username: "",
    password: ""
  },
  loginRequest: createRequest(),
  register: {
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    full_name: "",
    city: "",
    state: ""
  },
  registerRequest: createRequest(),
  user: null,
  logoutRequest: createRequest()
};
