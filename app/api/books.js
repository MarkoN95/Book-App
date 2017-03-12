const ensureAuth = require("../auth/utils/ensure_auth");
const googleBooks = require("./lib/google_books");
const Books = require("../../models/book");

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

});

router.post("/api/books/add", ensureAuth, (req, res) => {

});

router.delete("/api/books/remove", ensureAuth, (req, res) => {

});

module.exports = function() {
  return router;
};
