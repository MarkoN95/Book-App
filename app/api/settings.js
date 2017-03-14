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

router.put("/api/setting/password", (req, res) => {
  // TODO:
  //User.changePassword(req.user._id, req.body, (err) => {});
});

module.exports = function() {
  return router;
};
