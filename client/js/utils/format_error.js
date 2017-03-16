module.exports = function formatError(err, type) {
  // ajax error
  if(err.response) {
    // intentional errors
    if(err.response.data && err.response.data.error) {
      return err.response.data.error;
    }
    // access protected routes errors
    if(err.response.status === 401) {
      // wrong login credentials
      if(type === "LOGIN_REQUEST") {
        return { message: "wrong username or password" };
      }
      return { message: "Unauthorized" };
    }
    // internal server errors
    if(err.response.status >= 500) {
      return { message: "internal server error" };
    }
  }
  return { message: "unknown error occured", throw: true };
};
