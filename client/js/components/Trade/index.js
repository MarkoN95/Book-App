const React = require("react");
const { connect } = require("react-redux");
const { Grid, Row, Col, Button } = require("react-bootstrap");
const { object, func } = React.PropTypes;
const Book = require("../Book");

const actions = require("../../actions/trade");
const thunks = require("../../actions/thunks");
const styles = require("./styles.css");

const Trade = React.createClass({
  propTypes: {
    router: object,
    trade: object,
    addToSelfStage: func.isRequired,
    addToOtherStage: func.isRequired,
    removeFromSelfStage: func.isRequired,
    removeFromOtherStage: func.isRequired,
    initiateTrade: func.isRequired,
    acceptTrade: func.isRequired,
    declineTrade: func.isRequired,
    negotiateTrade: func.isRequired
  },
  render: function() {
    let { other_stage, other_library, self_stage, self_library } = this.props.trade;
    let {
      router,
      addToSelfStage,
      addToOtherStage,
      removeFromSelfStage,
      removeFromOtherStage,
      initiateTrade,
      acceptTrade,
      declineTrade,
      negotiateTrade
    } = this.props;
    return(
      <Grid className="mainGrid" fluid>
        <Row>
          <Col sm={6} xs={12} className={styles.stage}>
            {other_stage.map((book) => {
              return(
                <Book
                  key={book.id}
                  data={book}
                  type="remove"
                  action={removeFromOtherStage}
                />
              );
            })}
          </Col>
          <Col sm={6} xs={12} className={styles.library}>
            {other_library.map((book) => {
              return(
                <Book
                  key={book.id}
                  data={book}
                  type="add"
                  action={addToOtherStage}
                />
              );
            })}
          </Col>
        </Row>
        <Row>
          <Col sm={6} xs={12} className={styles.stage}>
            {self_stage.map((book) => {
              return(
                <Book
                  key={book.id}
                  data={book}
                  type="remove"
                  action={removeFromSelfStage}
                />
              );
            })}
          </Col>
          <Col sm={6} xs={12} className={styles.library}>
            {self_library.map((book) => {
              return(
                <Book
                  key={book.id}
                  data={book}
                  type="add"
                  action={addToSelfStage}
                />
              );
            })}
          </Col>
        </Row>
        <Row>
          {
            router.location.pathname === "/trade/new" &&
            <Button className="btnInverse" onClick={initiateTrade}>
              Initiate Trade
            </Button>
          }
          {
            router.location.pathname === "/trade" &&
            <div>
              <Button className="btnInverse" onClick={declineTrade}>
                Decline Trade
              </Button>
              <Button className="btnInverse" onClick={negotiateTrade}>
                negotiate Trade
              </Button>
              <Button className="btnInverse" onClick={acceptTrade}>
                Accept Trade
              </Button>
            </div>
          }
        </Row>
      </Grid>
    );
  }
});

const mapStateToProps = function(state) {
  return {
    trade: state.trade
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    addToSelfStage: function(book) {
      dispatch(actions.addToStage("self", book));
    },
    removeFromSelfStage: function(book) {
      dispatch(actions.removeFromStage("self", book));
    },
    addToOtherStage: function(book) {
      dispatch(actions.addToStage("other", book));
    },
    removeFromOtherStage: function(book) {
      dispatch(actions.removeFromStage("other", book));
    },
    initiateTrade: function() {
      dispatch(thunks.initiateTrade());
    },
    acceptTrade: function() {
      dispatch(thunks.acceptTrade());
    },
    declineTrade: function() {
      dispatch(thunks.declineTrade());
    },
    negotiateTrade: function() {
      dispatch(thunks.negotiateTrade());
    }
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Trade);
