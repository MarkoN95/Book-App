const React = require("react");
const { connect } = require("react-redux");
const { Link } = require("react-router");
const { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon } = require("react-bootstrap");
const { LinkContainer } = require("react-router-bootstrap");
const { node, object, shape, bool, func } = React.PropTypes;

const thunks = require("../../actions/thunks");

require("../../../css/index.css");
const styles = require("./styles.css");

const Main = React.createClass({
  propTypes: {
    children: node,
    user: object,
    logout: func.isRequired,
    request: shape({
      isPending: bool.isRequired,
      success: bool,
      error: object,
      data: object
    })
  },
  render: function() {
    const { user, request, logout } = this.props;
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
                <NavDropdown title="" id="nav-dropdown">
                  <li role="presentation">
                    <Link to="/user/settings">
                      <Glyphicon glyph="cog"/> Settings
                    </Link>
                  </li>
                  <MenuItem divider/>
                  <li role="presentation">
                    <a href="#" onClick={logout}>
                      <Glyphicon glyph="log-out"/>
                      {
                        request.isPending ? "Loading..." :
                        request.error ? <span className="error-msg"> logout failed</span> : " Logout"
                      }
                    </a>
                  </li>
                </NavDropdown>
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
    user: state.user,
    request: state.logoutRequest
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    logout: function() {
      dispatch(thunks.logout(ownProps));
    }
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
