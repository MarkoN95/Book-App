const React = require("react");
const { connect } = require("react-redux");
const { Grid, Row } = require("react-bootstrap");
const { object } = React.PropTypes;

const User = React.createClass({
  propTypes: {
    user: object
  },
  renderProfile: function() {
    const { user } = this.props;
    const info = [];
    if(user) {
      for(var p in user) {
        if(user.hasOwnProperty(p)) {
          info.push(<p>{p + ": " + user[p]}</p>);
        }
      }
      return info;
    }
  },
  render: function() {
    return(
      <Grid className="mainGrid" fluid>
        <Row>
          <h3>User page</h3>
          <h3>User Information:</h3>
          {this.renderProfile()}
        </Row>
      </Grid>
    );
  }
});

const mapStateToProps = function(state) {
  return {
    user: state.user
  };
};

module.exports = connect(
  mapStateToProps
)(User);
