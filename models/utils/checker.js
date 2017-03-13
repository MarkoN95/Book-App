module.exports = {
  objectId: function(oid) {
    return /^[0-9a-fA-F]{24}$/.test(oid);
  }
};
