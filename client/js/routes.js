const React = require("react");
const { Route, IndexRoute } = require("react-router");

const Main = require("./components/Main");
const Home = require("./components/Home");
const Login = require("./components/Login");
const Register = require("./components/Register");
const User = require("./components/User");
const Settings = require("./components/Settings");

const routes = function(store) {

  const requireAuth = (nextState, replaceState) => {
    if(!store.getState().user) {
      replaceState({ pathname: "/login" });
    }
  };

  return (
    <Route path="/" component={Main}>
      <IndexRoute component={Home}/>
      <Route path="/login" component={Login}/>
      <Route path="/register" component={Register}/>
      <Route path="/user" component={User} onEnter={requireAuth}/>
      <Route path="/user/settings" component={Settings} onEnter={requireAuth}/>
    </Route>
  );
};

module.exports = routes;
