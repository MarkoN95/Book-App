const React = require("react");
const { connect } = require("react-redux");
const { Grid, Row, Col, Form, FormGroup, FormControl, ControlLabel, Button } = require("react-bootstrap");
const { string, func, shape, bool, object } = React.PropTypes;

const actions = require("../../actions/update");
const thunks = require("../../actions/thunks");
const styles = require("./styles.css");

const Login = React.createClass({
  propTypes: {
    updateInput: func.isRequired,
    login: func.isRequired,
    username: string.isRequired,
    password: string.isRequired,
    request: shape({
      isPending: bool.isRequired,
      success: bool,
      error: object,
      data: object
    })
  },
  render: function() {
    var {
      username,
      password,
      updateInput,
      request
    } = this.props;

    return (
      <Grid className="mainGrid" fluid>
        <Row className={styles.loginContainer}>
          <Col md={4} sm={8} xs={10} mdOffset={4} smOffset={2} xsOffset={1}>
            <h3 className="text-center">Native Login</h3>
            <Form onSubmit={this.props.login}>
              <FormGroup>
                <ControlLabel>Username</ControlLabel>
                <FormControl
                  type="text"
                  name="username"
                  value={username}
                  onChange={updateInput}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  type="password"
                  name="password"
                  value={password}
                  onChange={updateInput}
                />
              </FormGroup>
              <Button type="submit" className="btnInverse" disabled={request.isPending}>
                {request.isPending ? "Loading..." : "Login"}
              </Button>

              {
                request.error &&
                <FormGroup>
                  <FormControl.Static>
                    {request.error.message}
                  </FormControl.Static>
                </FormGroup>
              }
            </Form>
            <div className={styles.socialLogin}>
              <h3 className={"text-center " + styles.socialLoginTitle}>Social Media Login</h3>
              <a href="/auth/github">
                <Button
                  bsSize="large"
                  bsStyle="primary"
                  className={"btnInverse " + styles.socialLink}
                  block>
                  Github <i className="fa fa-github"/>
                </Button>
              </a>
              <a href="auth/twitter">
                <Button
                  bsSize="large"
                  bsStyle="primary"
                  className={"btnInverse " + styles.socialLink}
                  block>
                  Twitter <i className="fa fa-twitter"/>
                </Button>
              </a>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
});

const mapStateToProps = function(state) {
  return {
    username: state.login.username,
    password: state.login.password,
    request: state.loginRequest
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    updateInput: function(e) {
      dispatch(actions.updateFormInput("login", e.target.name, e.target.value));
    },
    login: function(e) {
      e.preventDefault();
      dispatch(thunks.login(ownProps));
    }
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
