const React = require("react");
const { Modal, Button } = require("react-bootstrap");
const { string, bool, func } = React.PropTypes;

const Confirm = React.createClass({
  propTypes: {
    visible: bool.isRequired,
    cancel: func.isRequired,
    confirm: func.isRequired,
    title: string,
    message: string
  },
  render: function() {
    return(
      <Modal show={this.props.visible} onHide={this.props.cancel}>
        <Modal.Header closeButton>
          <Modal.Title>
            {this.props.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {this.props.message}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btnInverse" onClick={this.props.cancel}>
            Cancel
          </Button>
          <Button bsStyle="danger" onClick={this.props.confirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

module.exports = Confirm;
