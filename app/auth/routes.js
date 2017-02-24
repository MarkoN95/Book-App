const User = require("../../models/user");

const passport = require("passport");
const express = require("express");
const router = express.Router();

const ensureAuth = require("./utils/ensure_auth");

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

  router.post("/auth/local/login", passport.authenticate("local"), (req, res) => {
    //TODO: normalize req.user before information is sent
    res.json(req.user);
  });

  router.post("/auth/local/logout", ensureAuth, (req, res) => {
    req.logout();
    req.session.destroy();
    res.json({ message: "successfully logged out" });
  });

  router.post("/auth/local/register", (req, res) => {
    const userinfo = {
      local: {
        username: req.body.username,
        email: req.body.email
      },
      public: {
        full_name: req.body.full_name,
        city: req.body.city,
        state: req.body.state
      }
    };

    User.register(new User(userinfo), req.body.password, (err, user) => {
      if(err) {
        return res.json(err);
      }
      passport.authenticate("local")(req, res, () => {
        // TODO: normalize user before information is sent
        res.json(user);
      });
    });
  });

  return router;
};
