const Trade = require("../../models/trade");
const ensureAuth = require("../auth/utils/ensure_auth");
const check_input = require("../utils/input_checker");

const express = require("express");
const router = express.Router();

router.post("/api/trade/initiate", ensureAuth, check_input("trade_initiate"), (req, res) => {
  Trade.initiate(req.body.parties, req.body.stages, (err) => {
    if(err) {
      res.status(err.status || 500).send(err);
    }
    res.status(204).end();
  });
});

router.put("/api/trade/accept", ensureAuth, check_input("trade_accept"), (req, res) => {
  Trade.accept(req.body.tradeId, req.body.acceptandId, (err) => {
    if(err) {
      res.status(err.status || 500).send(err);
    }
    //TODO: reload library because user recieves new books and gives other books away
  });
});

router.delete("/api/trade/decline", ensureAuth, check_input("trade_decline"), (req, res) => {
  Trade.decline(req.body.tradeId, req.body.declinerId, (err) => {
    if(err) {
      res.status(err.status || 500).send(err);
    }
    res.status(204).end();
  });
});

router.put("/api/trade/negotiate", ensureAuth, check_input("trade_negotiate"), (req, res) => {
  Trade.negotiate(req.body.tradeId, req.body.negotiatorId, req.body.nextStages, (err) => {
    if(err) {
      res.status(err.status || 500).send(err);
    }
    res.status(204).end();
  });
});

module.exports = function() {
  return router;
};
