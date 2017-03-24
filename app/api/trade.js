const Trade = require("../../models/trade");
const User = require("../../models/user");
const ensureAuth = require("../auth/utils/ensure_auth");
const check_input = require("../utils/input_checker");

const express = require("express");
const router = express.Router();

router.post("/api/trade/initiate", ensureAuth, check_input("trade_initiate"), (req, res) => {
  Trade.initiate(req.body.parties, req.body.stages, (err, newTradeId) => {
    if(err) {
      res.status(err.status || 500).send(err);
    }
    Trade.findOne({ _id: newTradeId }, (err, trade) => {
      if(err) {
        return res.status(err.status || 500).send(err);
      }
      res.json(trade.normalize());
    });
  });
});

router.put("/api/trade/accept", ensureAuth, check_input("trade_accept"), (req, res) => {
  Trade.accept(req.body.tradeId, req.user._id, (err) => {
    if(err) {
      return res.status(err.status || 500).send(err);
    }
    User.findOne({ _id: req.user._id }, (err, user) => {
      if(err) {
        return res.status(err.status || 500).send(err);
      }
      res.json(user.normalize("ownProfile"));
    });
  });
});

router.delete("/api/trade/decline", ensureAuth, check_input("trade_decline"), (req, res) => {
  Trade.decline(req.query.tradeId, req.user._id, (err) => {
    if(err) {
      return res.status(err.status || 500).send(err);
    }
    res.status(204).end();
  });
});

router.put("/api/trade/negotiate", ensureAuth, check_input("trade_negotiate"), (req, res) => {
  Trade.negotiate(req.body.tradeId, req.user._id, req.body.nextStages, (err, nextTradeId) => {
    if(err) {
      return res.status(err.status || 500).send(err);
    }
    Trade.findOne({ _id: nextTradeId }, (err, trade) => {
      if(err) {
        return res.status(err.stastus || 500).send(err);
      }
      res.json(trade.normalize());
    });
  });
});

module.exports = function() {
  return router;
};
