const React = require("react");
const { Grid, Row, Col, Form, FormGroup, FormControl, Button } = require("react-bootstrap");

const styles = require("./styles.css");

const Home = React.createClass({
  render: function() {
    return (
      <Grid fluid>
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
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  type="email"
                  name="email"
                  placeholder="email address"
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  type="password"
                  name="password"
                  placeholder="password"
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  type="password"
                  name="confirm_password"
                  placeholder="confirm password"
                />
              </FormGroup>

              <h4 className={styles.personal}>Personal Information</h4>
              <p>(You can leave these blank and fill them out later)</p>

              <FormGroup>
                <FormControl
                  type="text"
                  name="full_name"
                  placeholder="full name"
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  type="text"
                  name="city"
                  placeholder="city"
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  type="text"
                  name="state"
                  placeholder="state"
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

module.exports = Home;
