const React = require("react");
const { connect } = require("react-redux");
const { Grid, Row, Col, Form, FormGroup, FormControl, Button } = require("react-bootstrap");

const actions = require("../../actions/update");
const styles = require("./styles.css");

const Register = React.createClass({
  propTypes: {
    updateInput: React.PropTypes.func.isRequired,
    username: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    password: React.PropTypes.string.isRequired,
    confirm_password: React.PropTypes.string.isRequired,
    full_name: React.PropTypes.string.isRequired,
    city: React.PropTypes.string.isRequired,
    state: React.PropTypes.string.isRequired
  },
  render: function() {
    var {
      updateInput,
      username,
      email,
      password,
      confirm_password,
      full_name,
      city,
      state
    } = this.props;

    return (
      <Grid className="mainGrid" fluid>
        <Row>
          <Col md={4} sm={8} xs={10} mdOffset={4} smOffset={2} xsOffset={1}>
            <h3 className="text-center">Register</h3>
            <Form>
              <h4>Credentials</h4>
              <FormGroup>
                <FormControl
                  type="text"
                  name="username"
                  placeholder="username"
                  value={username}
                  onChange={updateInput}
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  type="email"
                  name="email"
                  placeholder="email address"
                  value={email}
                  onChange={updateInput}
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  type="password"
                  name="password"
                  placeholder="password"
                  value={password}
                  onChange={updateInput}
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  type="password"
                  name="confirm_password"
                  placeholder="confirm password"
                  value={confirm_password}
                  onChange={updateInput}
                />
              </FormGroup>

              <h4 className={styles.personal}>Personal Information</h4>
              <p>(You can leave these blank and fill them out later)</p>

              <FormGroup>
                <FormControl
                  type="text"
                  name="full_name"
                  placeholder="full name"
                  value={full_name}
                  onChange={updateInput}
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  type="text"
                  name="city"
                  placeholder="city"
                  value={city}
                  onChange={updateInput}
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  type="text"
                  name="state"
                  placeholder="state"
                  value={state}
                  onChange={updateInput}
                />
              </FormGroup>

              <Button type="submit" className="btnInverse">
                Register
              </Button>
            </Form>
          </Col>
        </Row>
      </Grid>
    );
  }
});

const mapStateToProps = function(state) {
  return {
    username: state.register.username,
    email: state.register.email,
    password: state.register.password,
    confirm_password: state.register.confirm_password,
    full_name: state.register.full_name,
    city: state.register.city,
    state: state.register.state
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    updateInput: function(e) {
      dispatch(actions.updateFormInput("register", e.target.name, e.target.value));
    }
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);
