require("./user");
require("./book");
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const errors = require("./utils/errors");
const diff = require("./utils/diff");

const Trade = mongoose.Schema({
  initiand: { type: ObjectId, ref: "user" },
  acceptand: { type: ObjectId, ref: "user" },
  initiand_stage: [
    { type: ObjectId, ref: "book" }
  ],
  acceptand_stage: [
    { type: ObjectId, ref: "book" }
  ],
  state: {
    type: Object,
    default: { type: "initiated", by: "initiand" }
  }
});

Trade.statics.findAndModify = function(query, sort, doc, options, cb) {
  return this.collection.findAndModify(query, sort, doc, options, cb);
};

/*
 * Description: Creates a new Trade
 *
 * parites:     object with properties "initiand" and "acceptand" who hold an ObjectId
 * stages:      an object with properties "initiand" and "acceptand" who both hold an array with book id's
 * cb:          callback function with signature callback(err). err may be null or not
 */
Trade.statics.initiate = function(parties, stages, cb) {

  mongoose.model("book").find(
    { _id: { $in: stages.initiand.concat(stages.acceptand) } },
    (err, books) => {
      if(err) {
        return cb(err);
      }

      for(var i = 0; i < books.length; i++) {
        if(!books[i].available) {
          return cb(errors.addedUnavaliableBooksError());
        }
      }

      let tradeInfo = {
        initiand: parties.initiand,
        acceptand: parties.acceptand,
        initiand_stage: stages.initiand,
        acceptand_stage: stages.acceptand,
        state: {
          type: "initiated",
          by: "initiand"
        }
      };

      let trade = new this(tradeInfo);

      trade.save((err) => {
        if(err) {
          return cb(err);
        }

        mongoose.model("book").findAndModify(
          { _id: { $in: stages.initiand.concat(stages.acceptand) } },
          [],
          { $set: { available: false } },
          {},
          (err) => {
            if(err) {
              return cb(err);
            }
            cb();
          }
        );
      });
    }
);


};

/*
 * Description: accepts a trade
 *
 * tradeId:     objectId of the tradeId
 * acceptandId: objectId of the acceptand of the trade
 * cb:          callback with signature callback(err) error may occur internally or if acceptandId is not the acceptand of the trade
 */
Trade.statics.accept = function(tradeId, acceptandId, cb) {
  this.findOne(
    { _id: tradeId, acceptand: acceptandId },
    (err, trade) => {
      if(err) {
        return cb(err);
      }
      if(!trade) {
        return cb(errors.tradeNotFoundError());
      }

      // free books and swap owners
      mongoose.model("book").findAndModify(
        { _id: { $in: trade.initiand_stage } },
        [],
        { $set: { available: true, owner: trade.acceptand } },
        {},
        (err) => {
          if(err) {
            return cb(err);
          }
          mongoose.model("book").findAndModify(
            { _id: { $in: trade.acceptand_stage } },
            [],
            { $set: { available: true, owner: trade.initiand } },
            (err) => {
              if(err) {
                return cb(err);
              }
              trade.remove((err) => {
                if(err) {
                  return cb(err);
                }
                cb();
              });
            }
          );
        }
      );
    }
  );
};

/*
 * Description: declines a trade
 *
 * tradeId:     objectId of tradeId
 * declinerId:  objectId of decliner
 * cb:          callback with signature callback(err) err can be internal or trade not found
 *
 */
Trade.statics.decline = function(tradeId, declinerId, cb) {
  this.findOne(
    { _id: tradeId },
    (err, trade) => {
      if(err) {
        return cb(err);
      }
      if(!trade) {
        return cb(errors.tradeNotFoundError());
      }

      mongoose.model("book").findAndModify(
        { owner: trade.initiand },
        [],
        { $set: { available: true } },
        {},
        (err) => {
          if(err) {
            return cb(err);
          }

          mongoose.model("book").findAndModify(
            { owner: trade.acceptand },
            [],
            { $set: { available: true } },
            {},
            (err) => {
              if(err) {
                return cb(err);
              }

              trade.remove((err) => {
                if(err) {
                  return cb(err);
                }
                cb();
              });
            }
          );
        }
      );
    }
  );
};

/*
 * Description:  negotiates a trade. It effectively updates the stagina area of both parties
 *               it frees all books that are no longer in the staging area and reserves all books that got added to it
 *               the magic happens in the diff() function
 *
 * negotiatorId: id of the person who wants to negotiate
 * tradeId:      id of trade
 * nextStages:   an object with properties "initiand" and "acceptand" that contains the next stages
 * cb:           callback function with signature callback(err). error can be internal or trade not found
 */
Trade.statics.negotiate = function(tradeId, negotiatorId, nextStages, cb) {
  this.findOne(
    { _id: tradeId },
    (err, trade) => {
      if(err) {
        return cb(err);
      }
      if(!trade) {
        return cb(errors.tradeNotFoundError());
      }

      let diffInitiand = diff(trade.initiand_stage, nextStages.initiand);
      let diffAcceptand = diff(trade.acceptand_stage, nextStages.acceptand);

      // free all books that are no longer in the staging area
      mongoose.model("book").findAndModify(
        { _id: { $in: diffInitiand.remove.concat(diffAcceptand.remove) } },
        [],
        { $set: { available: true } },
        {},
        (err) => {
          if(err) {
            return cb(err);
          }

          // reserve all books that got added to the staging area
          mongoose.model("book").findAndModify(
            { _id: { $in: diffInitiand.add.concat(diffAcceptand.add) } },
            [],
            { $set: { available: false } },
            {},
            (err) => {
              if(err) {
                return cb(err);
              }

              trade.initiand_stage = nextStages.initiand;
              trade.acceptand_stage = nextStages.acceptand;

              trade.state = {
                type: "negotiate",
                by: negotiatorId
              };

              trade.save((err) => {
                if(err) {
                  return cb(err);
                }
                cb();
              });
            }
          );
        }
      );
    }
  );
};

module.exports = mongoose.model("trade", Trade);
