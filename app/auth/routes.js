const User = require("../../models/user");

const passport = require("passport");
const express = require("express");
const router = express.Router();

const ensureAuth = require("./utils/ensure_auth");
const check_input = require("../utils/input_checker");

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

  router.post("/auth/local/login", check_input("login"), passport.authenticate("local"), (req, res) => {
    res.json(req.user.normalize("ownProfile"));
  });

  router.post("/auth/local/logout", ensureAuth, (req, res) => {
    req.logout();
    req.session.destroy();
    res.status(204).end();
  });

  router.post("/auth/local/register", check_input("register"), (req, res) => {
    const userinfo = {
      local: {
        username: req.body.username,
        email: req.body.email
      },
      public: {
        full_name: req.body.full_name,
        city: req.body.city,
        state: req.body.state
      },
      login_method: "local"
    };

    User.register(new User(userinfo), req.body.password, (err, user) => {
      if(err) {
        return res.json(err);
      }
      passport.authenticate("local")(req, res, () => {
        res.json(user.normalize("ownProfile"));
      });
    });
  });

  return router;
};
