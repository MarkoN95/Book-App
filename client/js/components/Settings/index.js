const React = require("react");
const { connect } = require("react-redux");
const { Grid, Row, Col, Form, FormGroup, FormControl, ControlLabel, Button, Glyphicon } = require("react-bootstrap");
const { object, shape, bool, func } = React.PropTypes;

const actions = require("../../actions/update");
const thunks = require("../../actions/thunks");
const styles = require("./styles.css");

const Settings = React.createClass({
  propTypes: {
    public_info: object.isRequired,
    public_infoRequest: shape({
      isPending: bool.isRequired,
      success: bool,
      error: object,
      data: object
    }),
    change_pw: object.isRequired,
    change_pwRequest: shape({
      isPending: bool.isRequired,
      success: bool,
      error: object,
      data: object
    }),
    updateInput: func.isRequired,
    updatePassword: func.isRequired,
    changePublicInfo: func.isRequired
  },
  render: function() {
    let { updateInput, updatePassword, public_info, change_pw, public_infoRequest, change_pwRequest, changePublicInfo } = this.props;
    return(
      <Grid className="mainGrid" fluid>
        <Row>
          <Col md={6} sm={8} xs={10} mdOffset={3} smOffset={2} xsOffset={1}>
            <h3 className="text-center">Update your public Information</h3>
            <Form onSubmit={changePublicInfo}>
              <FormGroup>
                <ControlLabel>Full Name</ControlLabel>
                <FormControl
                  type="text"
                  name="full_name"
                  value={public_info.full_name}
                  onChange={updateInput}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>City</ControlLabel>
                <FormControl
                  type="text"
                  name="city"
                  value={public_info.city}
                  onChange={updateInput}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>State</ControlLabel>
                <FormControl
                  type="text"
                  name="state"
                  value={public_info.state}
                  onChange={updateInput}
                />
              </FormGroup>
              {
                public_infoRequest.error &&
                <FormGroup>
                  <FormControl.Static>
                    {public_infoRequest.error.message}
                  </FormControl.Static>
                </FormGroup>
              }
              <Button type="submit" className="btnInverse" disabled={public_infoRequest.isPending}>
                {public_infoRequest.isPending ? "Loading..." : "Update"}
              </Button>
              {" "}
              {
                public_infoRequest.success &&
                <Glyphicon glyph="ok" className={styles.green}/>
              }
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md={6} sm={8} xs={10} mdOffset={3} smOffset={2} xsOffset={1}>
            <h3 className="text-center">Change your password</h3>
            <p>(You will be logged out afterwards)</p>
            <Form>
              <FormGroup>
                <ControlLabel>Old Password</ControlLabel>
                <FormControl
                  type="password"
                  name="old_pw"
                  value={change_pw.old_pw}
                  onChange={updatePassword}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>New Password</ControlLabel>
                <FormControl
                  type="password"
                  name="new_pw"
                  value={change_pw.new_pw}
                  onChange={updatePassword}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Confirm New Password</ControlLabel>
                <FormControl
                  type="password"
                  name="confirm_new_pw"
                  value={change_pw.confirm_new_pw}
                  onChange={updatePassword}
                />
              </FormGroup>
              {
                change_pwRequest.error &&
                <FormGroup>
                  <FormControl.Static>
                    {change_pwRequest.error.message}
                  </FormControl.Static>
                </FormGroup>
              }
              <Button type="submit" className="btnInverse" disabled={change_pwRequest.isPending}>
                {change_pwRequest.isPending ? "Loading..." : "Update"}
              </Button>
              {" "}
              {
                change_pwRequest.success &&
                <Glyphicon glyph="ok" className={styles.green}/>
              }
            </Form>
          </Col>
        </Row>
      </Grid>
    );
  }
});

const mapStateToProps = function(state) {
  return {
    public_info: state.settings.public_info,
    public_infoRequest: state.settings.public_infoRequest,
    change_pw: state.settings.change_pw,
    change_pwRequest: state.settings.change_pwRequest
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    updateInput: function(e) {
      dispatch(actions.updateFormInput("public_info", e.target.name, e.target.value));
    },
    updatePassword: function(e) {
      dispatch(actions.updateFormInput("change_pw", e.target.name, e.target.value));
    },
    changePublicInfo: function(e) {
      e.preventDefault();
      dispatch(thunks.changePublicInfo());
    },
    changePassword: function(e) {
      e.preventDefault();
      //dispatch(thunks.changePassword());
    }
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
