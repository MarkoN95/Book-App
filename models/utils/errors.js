module.exports = {
  invalidObjectIdError: function(msg) {
    return {
      error: {
        message: msg || "object id is invalid"
      }
    };
  }
};
