require("./user");
const mongoose = require("mongoose");
const normalizerPlugin = require("./plugins/normalizer");
const checker = require("./utils/checker");

const errors = require("./utils/errors");

const Book = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  book_id: String,
  title: { type: String, trim: true },
  author: { type: String, trim: true },
  thumbnail_url: { type: String, default: "/client/media/dummy_book.png" },
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

Book.statics.addBook = function(owner, book, cb) {
  if(!(book instanceof this)) {
    book = new this(book);
  }

  if(!checker.objectId(owner)) {
    return cb(errors.invalidOwnerError("we couldn't add your book. please log out and in and try again"));
  }

  book.set("owner", owner);
  book.set("available", true);
  book.set("createdAt", Date.now());

  book.save((err) => {
    if(err) {
      return cb(err);
    }
    cb(null, book);
  });
};

Book.pre("find", autoPopulateOwner);

Book.plugin(normalizerPlugin, {
  normalizers: require("./utils/normalizers").book
});

module.exports = mongoose.model("book", Book);
