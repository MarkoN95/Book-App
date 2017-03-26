const React = require("react");
const { connect } = require("react-redux");
const { Grid, Row, Col, Image, Tabs, Tab, Form, FormGroup, InputGroup, FormControl, Button, Glyphicon } = require("react-bootstrap");
const { object, string, shape, bool, func } = React.PropTypes;

const types = require("../../actions/types");
const thunks = require("../../actions/thunks");
const actions = Object.assign({}, require("../../actions/update"), require("../../actions/books"));

const styles = require("./styles.css");
const Book = require("../Book");
const Trade = require("./trade");
const Message = require("./message");

const User = React.createClass({
  propTypes: {
    user: object,
    search: string.isRequired,
    update: func.isRequired,
    submitSearch: func.isRequired,
    addBook: func.isRequired,
    removeBook: func.isRequired,
    openTrade: func.isRequired,
    markMessageAsSeen: func.isRequired,
    bookSearch: shape({
      isPending: bool.isRequired,
      success: bool,
      error: object,
      data: object
    }),
    bookAdd: shape({
      id: string,
      request: shape({
        isPending: bool.isRequired,
        success: bool,
        error: object,
        data: object
      })
    }),
    bookRemove: shape({
      id: string,
      request: shape({
        isPending: bool.isRequired,
        success: bool,
        error: object,
        data: object
      })
    })
  },
  render: function() {
    let { user, bookSearch, bookAdd, bookRemove, submitSearch, search, update, addBook, removeBook, openTrade, markMessageAsSeen } = this.props;
    let totalUnreadMessages = 0;
    user.message_cache.forEach((m) => !m.seen ? ++totalUnreadMessages : false);
    return(
      <Grid className="mainGrid" fluid>
        <Row className={styles.profileRow}>
          <Col md={4} sm={4} xs={12}>
            <div className={styles.profileContainer}>
              <Image className={styles.thumbnail} src={user.image_url} circle responsive/>
              <h3 className="text-center">{user.username}</h3>
              <hr/>
              <ul className={styles.publicList}>
                <li>
                  Full Name: <span className={styles.publicInfo}>
                    {user.public.full_name}
                  </span>
                </li>
                <li>
                  City: <span className={styles.publicInfo}>
                    {user.public.city}
                  </span>
                </li>
                <li>
                  State: <span className={styles.publicInfo}>
                    {user.public.state}
                  </span>
                  </li>
              </ul>
            </div>
          </Col>
          <Col md={8} sm={8} xs={12}>
            <div className={styles.tabsContainer}>
              <Tabs id="user-tabs">
                <Tab eventKey={1} title="Library">
                  {
                    bookRemove.request.error &&
                    <p className="err-msg">
                      {bookRemove.request.error.message}
                    </p>
                  }
                  {
                    user.library.length === 0 &&
                    <p className={"text-center " + styles.noBooks}>
                      Your library is empty. You can add books from the
                      <span className="text-primary"> Add a Book</span> tab
                    </p>
                  }
                  {
                    user.library.length !== 0 &&
                    user.library.map((book) => {
                      return(
                        <Book
                          pending={bookRemove.request.isPending && book.id === bookRemove.id}
                          key={book.id}
                          data={book}
                          type="remove"
                          action={removeBook}/>
                      );
                    })
                  }
                </Tab>
                <Tab eventKey={2} title="Trades">
                  {
                    user.trades.length === 0 ?
                    <p className={"text-center " + styles.noTrades}>
                      You have no active trades
                    </p> :
                    user.trades.map((trade) => {
                      return(
                        <Trade key={trade.id} data={trade} selfId={user.id} action={openTrade}/>
                      );
                    })
                  }
                </Tab>
                <Tab eventKey={3} title={totalUnreadMessages === 0 ? "Messages" : "Messages (" + totalUnreadMessages + ")"}>
                  {
                    user.message_cache.length === 0 &&
                    <p className={"text-center " + styles.noMessages}>
                      You have no messages at the moment
                    </p>
                  }
                  {user.message_cache.map((msg) => {
                    return(
                      <Message key={msg.id} message={msg} onMouseOver={markMessageAsSeen}/>
                    );
                  })}
                </Tab>
                <Tab eventKey={4} title="Add a Book">
                  <Row>
                    <Col xs={8} xsOffset={2} className={styles.bookSearch}>
                      <Form onSubmit={submitSearch}>
                        <FormGroup>
                          <InputGroup>
                            <FormControl
                              name="query"
                              type="text"
                              placeholder="title or author"
                              value={search}
                              onChange={update}
                            />
                            <InputGroup.Button>
                              <Button type="submit" className="btnInverse">
                                {
                                  bookSearch.isPending ? <i className="fa fa-spinner fa-spin"></i> :
                                  <Glyphicon glyph="search"/>
                                }
                              </Button>
                            </InputGroup.Button>
                          </InputGroup>
                        </FormGroup>
                      </Form>
                    </Col>
                  </Row>
                <hr/>
                <Row>
                  <Col xs={12}>
                    {
                      bookAdd.request.error &&
                      <p className="error-msg">
                        {bookAdd.request.error.message}
                      </p>
                    }
                    {
                      bookSearch.error &&
                      <p className="error-msg">
                        {bookSearch.error.message}
                      </p>
                    }
                    {
                      bookSearch.data &&
                      bookSearch.data.items &&
                      bookSearch.data.items.map((book) => {
                        return(
                          <Book
                            success={bookAdd.id === book.id ? bookAdd.request.success : null}
                            pending={bookAdd.request.isPending && book.id === bookAdd.id}
                            key={book.id}
                            data={book}
                            type="add"
                            format
                            action={addBook}/>
                        );
                      })
                    }
                  </Col>
                </Row>
                </Tab>
              </Tabs>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
});

const mapStateToProps = function(state) {
  return {
    user: state.user,
    search: state.bookSearch.query,
    bookSearch: state.bookSearchRequest,
    bookAdd: state.addBook,
    bookRemove: state.removeBook
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    update: function(e) {
      dispatch(actions.updateFormInput("bookSearch", e.target.name, e.target.value));
    },
    submitSearch: function(e) {
      e.preventDefault();
      dispatch(thunks.searchBooks());
    },
    addBook: function(book) {
      dispatch(actions.selectBookId(types.ADD_BOOK, book.id));
      dispatch(thunks.addBook(book));
    },
    removeBook: function(book) {
      dispatch(actions.selectBookId(types.REMOVE_BOOK, book.id));
      dispatch(thunks.removeBook(book));
    },
    openTrade: function(trade, selfId) {
      let initialOther = trade.initiand.id === selfId ?
      Object.assign({}, trade.acceptand, { role: "acceptand" }) :
      Object.assign({}, trade.initiand, { role: "initiand" });
      dispatch(thunks.loadTradeUI(trade, initialOther, null, ownProps));
    },
    markMessageAsSeen: function(msg) {
      if(msg.seen) {
        return;
      }
      dispatch(thunks.markMessageAsSeen(msg.id));
    }
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
