const React = require("react");
const { connect } = require("react-redux");
const { Grid, Row, Col, Form, FormGroup, FormControl, ControlLabel, Button, Glyphicon } = require("react-bootstrap");
const { object, shape, bool, func } = React.PropTypes;
const Confirm = require("./confirm");

const types = require("../../actions/types");
const actions = require("../../actions/update");
const thunks = require("../../actions/thunks");
const styles = require("./styles.css");

const modal = {
  title: "Are you sure?",
  message: "This will delete everything. Your personal information and your library. All your pending trades will be canceled"
};

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
    changePublicInfo: func.isRequired,
    changePassword: func.isRequired,
    toggleModal: func.isRequired,
    deleteAccount: func.isRequired,
    visible: bool.isRequired,
    deleteAccountRequest: shape({
      isPending: bool.isRequired,
      success: bool,
      error: object,
      data: object
    })
  },
  render: function() {
    let {
      updateInput,
      updatePassword,
      public_info,
      change_pw,
      public_infoRequest,
      change_pwRequest,
      changePublicInfo,
      changePassword,
      toggleModal,
      deleteAccount,
      visible,
      deleteAccountRequest
    } = this.props;
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
            <Form onSubmit={changePassword}>
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
        <Row>
          <Col md={6} sm={8} xs={10} mdOffset={3} smOffset={2} xsOffset={1}>
            <h3 className="text-center text-danger">Danger Zone</h3>
            <div className={styles.dangerBorder}>
              <Button bsStyle="danger" onClick={toggleModal}>
                Delete Account
              </Button>
              {
                deleteAccountRequest.error &&
                <p className="error-msg">
                  {deleteAccountRequest.error.message}
                </p>
              }
              <Confirm
                visible={visible}
                cancel={toggleModal}
                confirm={deleteAccount}
                title={modal.title}
                message={modal.message}
              />
            </div>
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
    change_pwRequest: state.settings.change_pwRequest,
    visible: state.settings.deleteAccount.visible,
    deleteAccountRequest: state.settings.deleteAccount.request
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
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
      dispatch(thunks.changePassword(ownProps));
    },
    toggleModal: function() {
      dispatch(actions.toggleModal());
    },
    deleteAccount: function() {
      dispatch(thunks.deleteAccount(ownProps));
    }
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
