const ensureAuth = require("../auth/utils/ensure_auth");
const googleBooks = require("./lib/google_books");
const Book = require("../../models/book");
const User = require("../../models/user");

const express = require("express");
const router = express.Router();

const check_input = require("../utils/input_checker");

router.get("/api/books/search", check_input("search"), (req, res) => {
  googleBooks(req.query).pipe(res);
});

router.get("/api/books/find", check_input("find"), (req, res) => {
  Book.searchMarketplace(req.query, (err, books) => {
    if(err) {
      return res.status(err.status || 500).send(err);
    }
    res.json({ items: books.map((book) => {
      return book.normalize();
    })
    });
  });
});

router.post("/api/books/add", ensureAuth, check_input("book"), (req, res) => {

  const info = {
    book_id: req.body.id,
    title: req.body.title,
    author: req.body.author,
    thumbnail_url: req.body.thumbnail_url,
    hasImage: req.body.hasImage
  };

  Book.addBook(req.user._id, new Book(info), (err, book) => {
    if(err) {
      return res.status(err.status || 500).send(err);
    }
    User.addBook(req.user._id, book, (err) => {
      if(err) {
        return res.status(err.status || 500).send(err);
      }
      res.json(book.normalize("ownLibrary"));
    });
  });
});

router.delete("/api/books/remove", ensureAuth, (req, res) => {

  Book.removeBook(req.user._id, req.query.id, (err) => {
    if(err) {
      return res.status(err.status || 500).send(err);
    }
    User.removeBook(req.user._id, req.query.id, (err) => {
      if(err) {
        return res.status(err.status || 500).send(err);
      }
      res.status(204).end();
    });
  });
});

router.get("/api/books/getLibrary", ensureAuth, (req, res) => {
  Book.getLibraryByOwnerId(req.query.ownerId, (err, library) => {
    if(err) {
      return res.status(err.status || 500).send(err);
    }
    res.json(library);
  });
});

module.exports = function() {
  return router;
};
