const React = require("react");
const { Route, IndexRoute } = require("react-router");

const Main = require("./components/Main");
const Home = require("./components/Home");
const Login = require("./components/Login");
const Register = require("./components/Register");

const routes = function() {
  return (
    <Route path="/" component={Main}>
      <IndexRoute component={Home}/>
      <Route path="/login" component={Login}/>
      <Route path="/register" component={Register}/>
    </Route>
  );
};

module.exports = routes;
