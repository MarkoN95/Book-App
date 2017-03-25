function createRequest() {
  return {
    isPending: false,
    success: null,
    error: null,
    data: null
  };
}

module.exports = {
  trade: {
    id: null, // no id when generating  new trade
    self: null,
    other: null,
    self_library: [],
    other_library: [],
    self_stage: [],
    other_stage: [],
    request_other_libraray: createRequest(),
    trade_request: createRequest(),
    loaded: false
  },
  marketplace: {
    search: {
      query: "",
    },
    lastInput: {
      type: null,
      text: ""
    },
    request: createRequest()
  },
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
  logoutRequest: createRequest(),
  bookSearch: {
    query: ""
  },
  bookSearchRequest: createRequest(),
  addBook: {
    id: null,
    request: createRequest()
  },
  removeBook: {
    id: null,
    request: createRequest()
  },
  settings: {
    public_info: {
      full_name: "",
      city: "",
      state: ""
    },
    public_infoRequest: createRequest(),
    change_pw: {
      old_pw: "",
      new_pw: "",
      confirm_new_pw: ""
    },
    change_pwRequest: createRequest(),
    deleteAccount: {
      visible: false,
      request: createRequest()
    }
  }
};
