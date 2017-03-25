require("./user");
require("./book");
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const normalizerPlugin = require("./plugins/normalizer");

const errors = require("./utils/errors");
const diff = require("./utils/diff");
const checker = require("./utils/checker");

function toObjectId(id) {
  if(checker.objectId(id)) {
    return mongoose.Types.ObjectId(id);
  }
  if(process.env.NODE_ENV !== "production") {
    console.log("invalid ObjectID found: ", id);
  }
}

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

// example req.body

/*
  {
    parites: {
      initiand: 12345678,
      acceptand: 87654321,
    },
    stages: {
      initiand: [1234, 2345, 3456],
      acceptand: [8765, 7654, 6543]
    }
  }
*/

/*
 * Description: Creates a new Trade
 *
 * parites:     object with properties "initiand" and "acceptand" who hold an ObjectId
 * stages:      an object with properties "initiand" and "acceptand" who both hold an array with book id's
 * cb:          callback function with signature callback(err). err may be null or not
 */
Trade.statics.initiate = function(parties, stages, cb) {

  mongoose.model("book").find(
    { _id: { $in: stages.initiand.concat(stages.acceptand).map(toObjectId) } },
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

      trade.save((err, savedTrade) => {
        if(err) {
          return cb(err);
        }

        mongoose.model("book").update(
          { _id: { $in: stages.initiand.concat(stages.acceptand).map(toObjectId) } },
          { $set: { available: false } },
          { multi: true },
          (err) => {
            if(err) {
              return cb(err);
            }
            mongoose.model("user").update(
              { _id: { $in: [parties.initiand, parties.acceptand].map(toObjectId) } },
              { $push: { trades: savedTrade._id } },
              { multi: true },
              (err) => {
                if(err) {
                  return cb(err);
                }

                cb(null, savedTrade._id);
              }
            );
          }
        );
      });
    }
);


};

// example req.body

/*
  {
    tradeId: 1234,
    acceptandId: 4321
  }
*/

/*
 * Description: accepts a trade
 *
 * tradeId:     objectId of the tradeId
 * acceptandId: objectId of the acceptand of the trade
 * cb:          callback with signature callback(err) error may occur internally or if acceptandId is not the acceptand of the trade
 */
Trade.statics.accept = function(tradeId, accepterId, cb) {
  this.findOne(
    { $and: [
      { _id: toObjectId(tradeId) },
      {
        $or: [
          { initiand: toObjectId(accepterId) },
          { acceptand: toObjectId(accepterId) }
        ]
      }
    ] },
    //{ _id: toObjectId(tradeId), acceptand: toObjectId(accepterId) },
    (err, trade) => {
      if(err) {
        return cb(err);
      }
      if(!trade) {
        return cb(errors.tradeNotFoundError());
      }

      // free books and swap owners
      mongoose.model("book").update(
        { _id: { $in: trade.initiand_stage } },
        { $set: { available: true, owner: toObjectId(trade.acceptand._id) } },
        { multi: true },
        (err) => {
          if(err) {
            return cb(err);
          }
          mongoose.model("user").findOneAndUpdate(
            { _id: trade.initiand._id },
            { $pullAll: { library: trade.initiand_stage } },
            (err) => {
              if(err) {
                return cb(err);
              }
              mongoose.model("user").findOneAndUpdate(
                { _id: trade.initiand._id },
                { $push: { library: { $each: trade.acceptand_stage } } },
                (err) => {
                  if(err) {
                    return cb(err);
                  }
                  mongoose.model("book").update(
                    { _id: { $in: trade.acceptand_stage } },
                    { $set: { available: true, owner: toObjectId(trade.initiand._id) } },
                    { multi: true },
                    (err) => {
                      if(err) {
                        return cb(err);
                      }
                      mongoose.model("user").findOneAndUpdate(
                        { _id: trade.acceptand._id },
                        { $pullAll: { library: trade.acceptand_stage } },
                        (err) => {
                          if(err) {
                            return cb(err);
                          }
                          mongoose.model("user").findOneAndUpdate(
                            { _id: trade.acceptand._id },
                            { $push: { library: { $each: trade.initiand_stage } } },
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
                }
              );
            }
          );
        }
      );
    }
  );
};

// example req.query

/*
  {
    tradeId: 1234,
    declinerId: 4321
  }
*/

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
    { _id: toObjectId(tradeId) },
    (err, trade) => {
      if(err) {
        return cb(err);
      }
      if(!trade) {
        return cb(errors.tradeNotFoundError());
      }

      mongoose.model("book").update(
        { owner: trade.initiand._id },
        { $set: { available: true } },
        { multi: true },
        (err) => {
          if(err) {
            return cb(err);
          }

          mongoose.model("book").update(
            { owner: trade.acceptand._id },
            { $set: { available: true } },
            { multi: true },
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

// example req.body

/*
  {
    tradeId: 1234,
    negotiatorId: 4321,
    nextStages: {
      initiand: [1234, 2345, 3456],
      acceptand: [9876, 8765, 7654]
    }
  }
*/

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
    { _id: toObjectId(tradeId) },
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
      mongoose.model("book").update(
        { _id: { $in: diffInitiand.remove.concat(diffAcceptand.remove).map(toObjectId) } },
        { $set: { available: true } },
        { multi: true },
        (err) => {
          if(err) {
            return cb(err);
          }

          // reserve all books that got added to the staging area
          mongoose.model("book").update(
            { _id: { $in: diffInitiand.add.concat(diffAcceptand.add).map(toObjectId) } },
            { $set: { available: false } },
            { multi: true },
            (err) => {
              if(err) {
                return cb(err);
              }

              trade.initiand_stage = nextStages.initiand.map(toObjectId);
              trade.acceptand_stage = nextStages.acceptand.map(toObjectId);

              trade.state = {
                type: "negotiate",
                by: toObjectId(negotiatorId)
              };

              trade.save((err, savedTrade) => {
                if(err) {
                  return cb(err);
                }
                cb(null, savedTrade);
              });
            }
          );
        }
      );
    }
  );
};

Trade.pre("findOne", function(next) {
  this.populate("initiand acceptand");
  next();
});

Trade.pre("remove", function(next) {
  mongoose.model("user").update(
    { trades: this._id },
    { $pull: { trades: this._id } },
    { multi: true },
    (err) => {
      if(err) {
        return next(err);
      }
      next();
    }
  );
});

Trade.plugin(normalizerPlugin, {
  normalizers: require("./utils/normalizers").trade
});

module.exports = mongoose.model("trade", Trade);
