module.exports = {
  invalidObjectIdError: function(msg) {
    return {
      error: {
        message: msg || "object id is invalid"
      }
    };
  },
  unavailableBookError: function(msg) {
    return {
      error: {
        message: msg || "you can't perform any actions on a book that is in an active trade"
      }
    };
  },
  bookNotFoundError: function(msg) {
    return {
      error: {
        message: msg || "the book is not in our database"
      }
    };
  }
};
