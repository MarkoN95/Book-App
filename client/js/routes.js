const React = require("react");
const { Route, IndexRoute } = require("react-router");

const Main = require("./components/Main");
const Marketplace = require("./components/Marketplace");
const Login = require("./components/Login");
const Register = require("./components/Register");
const User = require("./components/User");
const Settings = require("./components/Settings");
const Trade = require("./components/Trade");

const { purgeForm, populatePublicInfoForm, purgeTradeUI } = require("./actions/thunks");
const composeSync = require("./utils/compose_hooks");

const routes = function(store) {

  const populate = function() {
    store.dispatch(populatePublicInfoForm());
  };

  const purge = function() {
    const args = [].concat.apply([], arguments);

    return function() {
      args.forEach((form) => {
        store.dispatch(purgeForm(form));
      });
    };
  };

  const clearTradeUI = function() {
    store.dispatch(purgeTradeUI());
  };

  const requireAuth = (nextState, replaceState) => {
    if(!store.getState().user) {
      replaceState({ pathname: "/login" });
    }
  };

  const redirectAuth = (nextState, replaceState) => {
    if(store.getState().user) {
      replaceState({ pathname: "/user" });
    }
  };

  return (
    <Route path="/" component={Main}>
      <IndexRoute component={Marketplace}/>
      <Route
        path="/trade/new"
        component={Trade}
        onEnter={requireAuth}
        onLeave={clearTradeUI}
      />
      <Route
        path="/trade"
        component={Trade}
        onEnter={requireAuth}
        onLeave={clearTradeUI}
      />
      <Route
        path="/login"
        component={Login}
        onEnter={redirectAuth}
        onLeave={purge("login")}
      />
      <Route
        path="/register"
        component={Register}
        onEnter={redirectAuth}
        onLeave={purge("register")}
      />
      <Route
        path="/user"
        component={User}
        onEnter={requireAuth}
        onLeave={purge("bookSearch")}
      />
      <Route
        path="/user/settings"
        component={Settings}
        onEnter={composeSync(requireAuth, populate)}
        onLeave={purge("public_info", "change_pw")}
      />
    </Route>
  );
};

module.exports = routes;
