const express = require("express");
const router = express.Router();

const React = require("react");
const { Provider } = require("react-redux");
const { renderToString } = require("react-dom/server");
const { match, RouterContext } = require("react-router");

const configureStore = require("../../client/js/store/configureStore");
const initialState = require("../../client/js/store/initialState");
const { TRADE_REQUEST } = require("../../client/js/actions/types");
const { updateUser, load } = Object.assign(
  {},
  require("../../client/js/actions/user"),
  require("../../client/js/actions/trade")
);

const routes = require("../../client/js/routes");
const preload = require("./preloader");

const assets = require("./serve_bundles.js")({
  root: process.cwd(),
  path: "/build/client",
  publicPath: "/",
  sort: {
    scripts: ["manifest", "vendor", "styles", "app"]
  }
});

router.get("*", (req, res, next) => {
  req.redux_store = configureStore(initialState);
  next();
});

router.get("*", (req, res, next) => {
  if(req.isAuthenticated()) {
    const user = JSON.parse(JSON.stringify(req.user.normalize("ownProfile")));
    req.redux_store.dispatch(updateUser(user));
  }
  next();
});

router.get("/trade", (req, res, next) => {
  if(!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  preload.tradeUI(req, (err) => {
    if(err) {
      if(err.__redux_request_type__) {
        req.redux_store.dispatch(err.__redux_request_type__, "fail", err);
      }
      if(err.__redux_request_type__ === TRADE_REQUEST) {
        req.redux_store.dispatch(load("other", {}));
      }
    }
    next();
  });
});

router.get("/trade/new", (req, res) => {
  res.redirect("/");
});

router.get("*", (req, res) => {
  match({ routes: routes(req.redux_store), location: req.url }, (err, redirect, props) => {
    if(err) {
      res.status(500).send(err);
    }
    else if(redirect) {
      res.redirect(redirect.pathname + redirect.search);
    }
    else if(props) {
      const html = renderToString(
        <Provider store={req.redux_store}>
          <RouterContext {...props}/>
        </Provider>
      );

      res.render("index", { app: html, assets: assets, preloadedState: req.redux_store.getState() });
    }
    else {
      res.status(404).send("not found");
    }
  });
});

module.exports = function() {
  return router;
};
