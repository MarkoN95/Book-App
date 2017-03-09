require("./user");
require("./book");
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

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

module.exports = mongoose.model("trade", Trade);
