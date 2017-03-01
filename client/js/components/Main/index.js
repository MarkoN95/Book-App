const React = require("react");
const { Link } = require("react-router");
const { Navbar, Nav, NavItem } = require("react-bootstrap");
const { LinkContainer } = require("react-router-bootstrap");

require("../../../css/index.css");
const styles = require("./styles.css");

const Main = React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },
  render: function() {
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
            <Nav pullRight>
              <LinkContainer to="/login">
                <NavItem>Login</NavItem>
              </LinkContainer>
              <LinkContainer to="/register">
                <NavItem>Register</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Main;
