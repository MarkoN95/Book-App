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
  hasImage: Boolean,
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

Book.statics.findAndModify = function(query, sort, doc, options, cb) {
  return this.collection.findAndModify(query, sort, doc, options, cb);
};

Book.statics.addBook = function(owner, book, cb) {
  if(!(book instanceof this)) {
    book = new this(book);
  }

  if(!checker.objectId(owner)) {
    return cb(errors.invalidObjectIdError(400, "we couldn't add your book. Please try again"));
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

Book.statics.removeBook = function(userId, bookId, cb) {
  if(!checker.objectId(bookId)) {
    return cb(errors.invalidObjectIdError(400, "we couldn't remove your book. Please try again"));
  }

  this.findOne({ _id: bookId, owner: userId }, (err, book) => {
    if(err) {
      return cb(err);
    }
    if(!book) {
      return cb(errors.bookNotFoundError(400, "The book to be removed doesn't exist in our database"));
    }
    if(book.available) {
      book.remove((err) => {
        if(err) {
          return cb(err);
        }
        cb();
      });
    }
    else {
      cb(errors.unavailableBookError(400, "You can't delete an unavailable book"));
    }
  });
};

Book.statics.searchMarketplace = function(q, cb) {
  if(q.option) {
    let dbquery;
    switch(q.option) {
      case "all":
        dbquery = this.find({});
        break;

      case "latest":
        dbquery = this.find().sort({ createdAt: -1 }).limit(50);
        break;

      default:
        return cb(errors.invalidQueryError(400, "Unknown query option supplied"));
    }
    dbquery.exec((err, books) => {
      if(err) {
        return cb(err);
      }
      cb(null, books);
    });
  }
  else {
    this.find({
      $or: [
        { title: new RegExp(q.query, "i") },
        { author: new RegExp(q.query, "i") }
      ]
    },
    (err, books) => {
      if(err) {
        return cb(err);
      }
      cb(null, books);
    });
  }
};

Book.statics.getLibraryByOwnerId = function(ownerId, cb) {
  if(!checker.objectId(ownerId)) {
    return cb(errors.invalidObjectIdError());
  }

  this.find({ owner: ownerId }, (err, library) => {
    if(err) {
      return cb(err);
    }
    cb(null, library.map(book => book.normalize()));
  });
};

Book.pre("find", autoPopulateOwner);

Book.plugin(normalizerPlugin, {
  normalizers: require("./utils/normalizers").book
});

module.exports = mongoose.model("book", Book);
