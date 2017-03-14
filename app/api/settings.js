const express = require("express");
const router = express.Router();

const ensureAuth = require("../auth/utils/ensure_auth");
const User = require("../../models/user");

router.put("/api/settings/public", ensureAuth, (req, res) => {
  User.updatePublicInfo(req.user._id, req.body, (err) => {
    if(err) {
      return res.status(500).send(err);
    }
    res.status(204).end();
  });
});

router.put("/api/settings/password", ensureAuth, (req, res) => {
  User.changePassword(req.user._id, req.body, (err) => {
    if(err) {
      return res.status(err.status || 500).send(err);
    }
    req.logout();
    req.session.destroy();
    res.status(204).end();
  });
});

module.exports = function() {
  return router;
};
