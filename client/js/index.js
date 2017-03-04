const React = require("react");
const ReactDOM = require("react-dom");
const { Provider } = require("react-redux");
const { Router, browserHistory } = require("react-router");
const { AppContainer } = require("react-hot-loader");

const routes = require("./routes");
const configureStore = require("./store/configureStore");
const initialState = require("./store/initialState");

const store = configureStore(initialState);

const render = (routes) => {
  if(module.hot) {
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <Router history={browserHistory}>
            {routes(store)}
          </Router>
        </Provider>
      </AppContainer>,
      document.getElementById("app")
    );
  }
  else {
    ReactDOM.render(
      <Provider store={store}>
        <Router history={browserHistory}>
          {routes(store)}
        </Router>
      </Provider>,
      document.getElementById("app")
    );
  }
};

render(routes);

if(module.hot) {
  module.hot.accept("./routes", () => {
    const nextRoutes = require("./routes");
    render(nextRoutes);
  });
}
