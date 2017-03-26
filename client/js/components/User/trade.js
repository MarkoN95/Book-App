const React = require("react");
const { Image, Button } = require("react-bootstrap");
const { string, object, func } = React.PropTypes;

const styles = require("./styles.css");

const displayTradeTitle = function(trade, selfId) {
  switch(trade.state.type) {
    case "initiated":
      if(trade.initiand.id === selfId) {
        return "You want to trade with " + trade.acceptand.username;
      }
      return trade.initiand.username + " wants to trade with you";

    case "negotiate":
      if(trade.state.by === selfId) {
        if(trade.initiand.id === selfId) {
          return "You want to negotiate with " + trade.acceptand.username;
        }
        if(trade.acceptand.id === selfId) {
          return "You want to negotiate with " + trade.initiand.username;
        }
      }
      else {
        if(trade.initiand.id === trade.state.by) {
          return trade.initiand.username + " wants to negotiate with you";
        }
        if(trade.acceptand.id === trade.state.by) {
          return trade.acceptand.username + " wants to negotiate with you";
        }
      }
  }
};

const Trade = function(props) {
  return(
    <div className={styles.tradeLink}>
      <div>
        <Image
          src={props.data.acceptand.image_url}
          className={styles.tradeImage}
          responsive
          circle
        />
        <span className={styles.tradePartner}>
          {displayTradeTitle(props.data, props.selfId)}
        </span>
      </div>
      <Button className="btnInverse pull-right" onClick={props.action.bind(this, props.data, props.selfId)}>
        View
      </Button>
    </div>
  );
};

Trade.propTypes = {
  selfId: string.isRequired,
  data: object.isRequired,
  action: func.isRequired
};

module.exports = Trade;
