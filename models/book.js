require("./user");
const mongoose = require("mongoose");
const normalizerPlugin = require("./plugins/normalizer");

const Book = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  title: { type: String, trim: true },
  author: { type: String, trim: true },
  thumbnail_url: { type: String, default: "/media/dummy_book.png" },
  available: Boolean,
  createdAt: Date
});

const autoPopulateOwner = function(next) {
  this.populate({
    path: "owner",
    select: "-trades -library"
  });
  next();
};

Book.pre("find", autoPopulateOwner);

Book.plugin(normalizerPlugin, {
  normalizer: require("./utils/normalizers").book.default
});

module.exports = mongoose.model("book", Book);
