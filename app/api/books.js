const ensureAuth = require("../auth/utils/ensure_auth");
const googleBooks = require("./lib/google_books");
const Book = require("../../models/book");
const User = require("../../models/user");

const express = require("express");
const router = express.Router();

const errors = {
  invalidQueryError: function(msg) {
    return {
      error: {
        message: msg || "invalid query parameters for the booksearch"
      }
    };
  }
};

function checkQuery(query) {
  return typeof query === "object" && query.q;
}

router.get("/api/books/search", (req, res) => {
  if(checkQuery(req.query)) {
    googleBooks(req.query).pipe(res);
  }
  else {
    res.status(400).json(errors.invalidQueryError());
  }
});

router.get("/api/books/find", (req, res) => {
  //find books from the marketplace here
});

router.post("/api/books/add", ensureAuth, (req, res) => {

  const info = {
    book_id: req.body.id,
    title: req.body.title,
    author: req.body.author,
    thumbnail_url: req.body.thumbnail_url
  };

  Book.addBook(req.user._id, new Book(info), (err, book) => {
    if(err) {
      return res.status(500).send(err);
    }
    User.addBook(req.user._id, book, (err) => {
      if(err) {
        return res.status(500).send(err);
      }
      res.json(book.normalize("ownLibrary"));
    });
  });
});

router.delete("/api/books/remove", ensureAuth, (req, res) => {
  
  Book.removeBook(req.user._id, req.query.id, (err) => {
    if(err) {
      return res.status(500).send(err);
    }
    User.removeBook(req.user._id, req.query.id, (err) => {
      if(err) {
        return res.status(500).send(err);
      }
      res.status(204).end();
    });
  });
});

module.exports = function() {
  return router;
};
