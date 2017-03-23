const React = require("react");
const { connect } = require("react-redux");
const { object } = React.PropTypes;

const Trade = React.createClass({
  propTypes: {
    trade: object
  },
  render: function() {
    return(
      <h3>Trade</h3>
    );
  }
});

const mapStateToProps = function(state, ownProps) {
  if(ownProps.location.pathname === "/trade/new") {
    return {
      trade: state.trade
    };
  }
};

module.exports = connect(
  mapStateToProps
)(Trade);
