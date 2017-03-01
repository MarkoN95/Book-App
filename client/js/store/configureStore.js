const { createStore, applyMiddleware, compose } = require("redux");
const reduxImmutableStateInvariant = require("redux-immutable-state-invariant");

const rootReducer = require("../reducers");

function configureStore(initialState) {
  var middlewares = [];
  var store;
  var devtools;

  if(process.env.NODE_ENV !== "production") {

    var w = window;
    middlewares.push(reduxImmutableStateInvariant());
    devtools = w && w.devToolsExtension ? w.devToolsExtension() : f => f;

    store = createStore(rootReducer, initialState, compose(
        applyMiddleware.apply(this, middlewares),
        devtools
    ));

    if(module.hot) {
      module.hot.accept("../reducers", () => {
        const nextReducer = require("../reducers");
        store.replaceReducer(nextReducer);
      });
    }

    return store;
  }

  store = createStore(rootReducer, initialState, compose(
    applyMiddleware.apply(this, middlewares)
  ));

  return store;
}

module.exports = configureStore;
