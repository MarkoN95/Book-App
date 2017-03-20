const Trade = require("../../models/trade");
const ensureAuth = require("../auth/utils/ensure_auth");

const express = require("express");
const router = express.Router();

router.post("/api/trade/initiate", ensureAuth, (req, res) => {

});

router.put("/api/trade/accept", ensureAuth, (req, res) => {

});

router.delete("/api/trade/decline", ensureAuth, (req, res) => {

});

router.put("/api/trade/negotiate", ensureAuth, (req, res) => {

});

module.exports = function() {
  return router;
};
