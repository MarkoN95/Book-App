module.exports = {
  existingUserError: function(status, msg) {
    return {
      error: {
        message: msg || "this username is already taken"
      },
      status: status || 400
    };
  },
  invalidObjectIdError: function(status, msg) {
    return {
      error: {
        message: msg || "object id is invalid"
      },
      status: status || 400
    };
  },
  unavailableBookError: function(status, msg) {
    return {
      error: {
        message: msg || "you can't perform any actions on a book that is in an active trade"
      },
      status: status || 400
    };
  },
  bookNotFoundError: function(status, msg) {
    return {
      error: {
        message: msg || "the book is not in our database"
      },
      status: status || 400
    };
  },
  passwordsDontMatchError: function(status, msg) {
    return {
      error: {
        message: msg || "passwords don't match"
      },
      status: status || 400,
    };
  },
  wrongOldPasswordError: function(msg) {
    return {
      error: {
        message: msg || "old password is not correct"
      },
      status: status || 400,
    };
  },
  invalidQueryError: function(status, msg) {
    return {
      error: {
        message: msg || "invalid query parameters for the booksearch"
      },
      status: status || 400
    };
  }
};
