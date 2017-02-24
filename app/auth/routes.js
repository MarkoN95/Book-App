const passport = require("passport");
const express = require("express");
const router = express.Router();

//const ensureAuth = require("./utils/ensure_auth");

module.exports = function authRoutes(opt) {
  if(!Array.isArray(opt.social)) {
    throw new TypeError("authRoutes() expects social property of config to be an array");
  }

  opt.social.forEach((method) => {
    router.get("/auth/" + method, passport.authenticate(method));

    router.get(
      "/auth/" + method + "/callback",
      passport.authenticate(method, { failureRedirect: "/login" }),
      (req, res, next) => {
        next();
      }
    );
  });
  /*
  router.post("/auth/local/login", (req, res) => {

  });

  router.post("/auth/local/logout", ensureAuth, (req, res) => {

  });

  router.post("/auth/local/register", (req, res) => {

  });
  */
  return router;
};
