module.exports = {
  request: function(type, cmd, error, data) {
    return {
      type,
      cmd,
      error,
      data
    };
  }
};
