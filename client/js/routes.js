const React = require("react");
const { Route } = require("react-router");

const Main = require("./components/Main");
const About = require("./components/About");
const Home = require("./components/Home");

const routes = function() {
  return (
    <Route path="/" component={Main}>
      <Route path="/about" component={About}/>
      <Route path="/home" component={Home}/>
    </Route>
  );
};

module.exports = routes;
