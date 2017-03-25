const React = require("react");
const { connect } = require("react-redux");
const { Grid, Row, Col, Button, Image } = require("react-bootstrap");
const { object, func } = React.PropTypes;
const Book = require("../Book");

const actions = Object.assign({}, require("../../actions/trade"), require("../../actions/user"));
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
    let { other_stage, other_library, self_stage, self_library, other, self, trade_request } = this.props.trade;
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

    if(!self) { self = {}; }
    if(!other) { other = {}; }
    return(
      <Grid className="mainGrid" fluid>
        <Row className={styles.tradeBackGround}>
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
            {
              other_stage.length === 0 &&
              <p className={styles.stageDesc}>Your Demands</p>
            }
          </Col>
          <Col sm={6} xs={12} className={styles.library}>
            <div className={styles.user}>
              <Image
                src={other.image_url}
                className={styles.userImg}
                responsive
                circle
              />
              <span className={styles.userLib}>
                {other.username + "'s Library"}
              </span>
            </div>
            <hr style={{color: "#dddddd"}}/>
            <div>
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
            </div>
          </Col>
        </Row>
        <div className={styles.divider}/>
        <Row className={styles.tradeBackGround}>
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
            {
              self_stage.length === 0 &&
              <p className={styles.stageDesc}>Your Offer</p>
            }
          </Col>
          <Col sm={6} xs={12} className={styles.library}>
            <div className={styles.user}>
              <Image
                src={self.image_url}
                className={styles.userImg}
                responsive
                circle
              />
              <span className={styles.userLib}>
                Your Library
              </span>
            </div>
            <hr style={{color: "#dddddd"}}/>
            <div>
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
            </div>
          </Col>
        </Row>
        <div className={styles.divider}/>
        {
          trade_request.error &&
          <Row>
            <Col xs={12}>
              <p className="error-msg">
                {trade_request.error.message}
              </p>
            </Col>
          </Row>
        }
        <Row className={styles.actionBtns}>
          {
            router.location.pathname === "/trade/new" &&
            <Col xs={12} className="text-center">
              <Button bsStyle="info" onClick={initiateTrade} disabled={trade_request.isPending}>
                {trade_request.isPending ? "Processing..." : "Propose Trade"}
              </Button>
            </Col>
          }
          {
            router.location.pathname === "/trade" &&
            <Col xs={4} className="text-left">
              <Button bsStyle="danger" onClick={declineTrade} disabled={trade_request.isPending}>
                {trade_request.isPending ? "Processing..." : "Decline"}
              </Button>
            </Col>
          }
          {
            router.location.pathname === "/trade" &&
            <Col xs={4} className="text-center">
              <Button bsStyle="info" onClick={negotiateTrade} disabled={trade_request.isPending}>
                {trade_request.isPending ? "Processing..." : "Negotiate"}
              </Button>
            </Col>
          }
          {
            router.location.pathname === "/trade" &&
            <Col xs={4} className="text-right">
              <Button bsStyle="success" onClick={acceptTrade} disabled={trade_request.isPending}>
                {trade_request.isPending ? "Processing..." : "Accept"}
              </Button>
            </Col>
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

const mapDispatchToProps = function(dispatch, ownProps) {
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
      dispatch(thunks.initiateTrade(ownProps));
    },
    acceptTrade: function() {
      dispatch(thunks.acceptTrade(ownProps));
    },
    declineTrade: function() {
      dispatch(thunks.declineTrade(ownProps));
    },
    negotiateTrade: function() {
      dispatch(thunks.negotiateTrade(ownProps));
    }
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Trade);
