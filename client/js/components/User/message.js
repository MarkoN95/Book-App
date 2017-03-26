const React = require("react");
const { object, func } = React.PropTypes;

const styles = require("./styles.css");

const friendlyDate = function(date) {
  if(!(date instanceof Date)) {
    date = new Date(date);
  }
  var parts = date.toString().split(" ");
  return [parts[1], parts[2], parts[3]].join(" ");
};

const Message = function(props) {
  return(
    <div
      className={props.message.seen ? styles.messageSeen : styles.message}
      onMouseOver={props.onMouseOver.bind(this, props.message)}>
      <span><b>From </b>{friendlyDate(props.message.from) + ":"}</span>
      <span className={styles.messageText}>{props.message.text}</span>
    </div>
  );
};

Message.propTypes = {
  message: object,
  onMouseOver: func.isRequired
};

module.exports = Message;
