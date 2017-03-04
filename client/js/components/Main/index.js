const React = require("react");
const { connect } = require("react-redux");
const { Link } = require("react-router");
const { Navbar, Nav, NavItem } = require("react-bootstrap");
const { LinkContainer } = require("react-router-bootstrap");
const { node, object } = React.PropTypes;

require("../../../css/index.css");
const styles = require("./styles.css");

const Main = React.createClass({
  propTypes: {
    children: node,
    user: object
  },
  render: function() {
    const { user } = this.props;
    return (
      <div>
        <Navbar inverse collapseOnSelect className={styles.sharpEdged}>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Book Trader</Link>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>
          <Navbar.Collapse>
            {
              !user &&
              <Nav pullRight>
                <LinkContainer to="/login">
                  <NavItem>Login</NavItem>
                </LinkContainer>
                <LinkContainer to="/register">
                  <NavItem>Register</NavItem>
                </LinkContainer>
              </Nav>
            }
            {
              user &&
              <Nav pullRight>
                <LinkContainer to="/user">
                  <NavItem>{user.username}</NavItem>
                </LinkContainer>
              </Nav>
            }
          </Navbar.Collapse>
        </Navbar>
        {this.props.children}
      </div>
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
)(Main);
