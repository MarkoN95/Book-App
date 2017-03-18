module.exports = {
  existingUserError: function(status, msg) {
    return {
      error: {
        message: msg || "This username is already taken"
      },
      status: status || 400
    };
  },
  invalidObjectIdError: function(status, msg) {
    return {
      error: {
        message: msg || "Object id is invalid"
      },
      status: status || 400
    };
  },
  unavailableBookError: function(status, msg) {
    return {
      error: {
        message: msg || "You can't perform any actions on a book that is in an active trade"
      },
      status: status || 400
    };
  },
  bookNotFoundError: function(status, msg) {
    return {
      error: {
        message: msg || "The book is not in our database"
      },
      status: status || 400
    };
  },
  passwordsDontMatchError: function(status, msg) {
    return {
      error: {
        message: msg || "Passwords don't match"
      },
      status: status || 400,
    };
  },
  wrongOldPasswordError: function(status, msg) {
    return {
      error: {
        message: msg || "Old password is not correct"
      },
      status: status || 400,
    };
  },
  invalidQueryError: function(status, msg) {
    return {
      error: {
        message: msg || "Invalid query parameters for the booksearch"
      },
      status: status || 400
    };
  }
};
