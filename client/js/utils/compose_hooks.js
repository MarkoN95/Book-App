module.exports = function composeHooksSync() {
  const hooks = [].concat.apply([], arguments);

  return function(nextState, replaceState) {
    hooks.forEach((hook) => {
      hook.call(this, nextState, replaceState);
    });
  };
};
