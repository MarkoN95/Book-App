const React = require("react");
const { Route, IndexRoute } = require("react-router");

const Main = require("./components/Main");
const Home = require("./components/Home");
const Login = require("./components/Login");
const Register = require("./components/Register");
const User = require("./components/User");
const Settings = require("./components/Settings");

const { purgeForm } = require("./actions/thunks");

const routes = function(store) {

  const purge = function() {
    const args = [].concat.apply([], arguments);

    return function() {
      args.forEach((form) => {
        store.dispatch(purgeForm(form));
      });
    };
  };

  const requireAuth = (nextState, replaceState) => {
    if(!store.getState().user) {
      replaceState({ pathname: "/login" });
    }
  };

  return (
    <Route path="/" component={Main}>
      <IndexRoute component={Home}/>
      <Route
        path="/login"
        component={Login}
        onLeave={purge("login")}
      />
      <Route
        path="/register"
        component={Register}
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
        onEnter={requireAuth}
        onLeave={purge("public_info", "change_pw")}
      />
    </Route>
  );
};

module.exports = routes;
