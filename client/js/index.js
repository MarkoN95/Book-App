const React = require("react");
const ReactDOM = require("react-dom");
const { Router, browserHistory } = require("react-router");
const { AppContainer } = require("react-hot-loader");

const routes = require("./routes");

const render = (routes) => {
  if(module.hot) {
    ReactDOM.render(
      <AppContainer>
        <Router history={browserHistory}>
          {routes()}
        </Router>
      </AppContainer>,
      document.getElementById("app")
    );
  }
  else {
    ReactDOM.render(
      <Router history={browserHistory}>
        {routes()}
      </Router>,
      document.getElementById("app")
    );
  }
};

render(routes);

if(module.hot) {
  module.hot.accept("./routes", () => {
    render(routes);
  });
}
