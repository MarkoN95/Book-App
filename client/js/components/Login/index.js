const React = require("react");
const { Grid, Row, Col, Form, FormGroup, FormControl, ControlLabel, Button } = require("react-bootstrap");

const styles = require("./styles.css");

const About = React.createClass({
  render: function() {
    return (
      <Grid fluid>
        <Row>
          <Col md={4} sm={8} xs={10} mdOffset={4} smOffset={2} xsOffset={1}>
            <h3 className="text-center">Native Login</h3>
            <Form>
              <FormGroup>
                <ControlLabel>Username</ControlLabel>
                <FormControl
                  type="text"
                  name="username"
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  type="password"
                  name="password"
                />
              </FormGroup>
              <Button type="submit" className="btnInverse">
                Login
              </Button>
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

module.exports = About;
