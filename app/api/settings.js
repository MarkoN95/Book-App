const express = require("express");
const router = express.Router();

const check_input = require("../utils/input_checker");
const ensureAuth = require("../auth/utils/ensure_auth");
const User = require("../../models/user");

router.put("/api/settings/public", ensureAuth, (req, res) => {
  User.updatePublicInfo(req.user._id, req.body, (err) => {
    if(err) {
      return res.status(err.status || 500).send(err);
    }
    res.status(204).end();
  });
});

router.put("/api/settings/password", ensureAuth, check_input("settings"), (req, res) => {
  User.changePassword(req.user._id, req.body, (err) => {
    if(err) {
      return res.status(err.status || 500).send(err);
    }
    req.logout();
    req.session.destroy();
    res.status(204).end();
  });
});

router.delete("/api/settings/delete", (req, res) => {
  User.removeUser(req.user._id, (err) => {
    if(err) {
      return res.status(err.status || 500).send(err);
    }
    req.logout();
    req.session.destroy();
    res.status(204).end();
  });
});

router.put("/api/settings/markMessageAsSeen", ensureAuth, check_input("message"), (req, res) => {
  User.markMessageAsSeen(req.user._id, req.query.messageId, (err) => {
    if(err) {
      return res.status(400).end();
    }
    res.status(204).end();
  });
});

module.exports = function() {
  return router;
};
