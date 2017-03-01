const { createStore, applyMiddleware, compose } = require("redux");
const reduxImmutableStateInvariant = require("redux-immutable-state-invariant");

const rootReducer = require("../reducers");

function configureStore(initialState) {
  var middlewares = [];
  var store;
  var composeDev;

  if(process.env.NODE_ENV !== "production") {

    middlewares.push(reduxImmutableStateInvariant());
    composeDev = (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE_) || compose;

    store = createStore(rootReducer, initialState, composeDev(
        applyMiddleware.apply(this, middlewares)
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
