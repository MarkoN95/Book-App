const React = require("react");
const { connect } = require("react-redux");
const { Grid, Row, Col, Image, Tabs, Tab, Form, FormGroup, InputGroup, FormControl, Button, Glyphicon } = require("react-bootstrap");
const { object, string, shape, bool, func } = React.PropTypes;

const thunks = require("../../actions/thunks");
const actions = require("../../actions/update");

const styles = require("./styles.css");
const Book = require("../Book");

const User = React.createClass({
  propTypes: {
    user: object,
    search: string.isRequired,
    update: func.isRequired,
    submitSearch: func.isRequired,
    addBook: func.isRequired,
    request: shape({
      isPending: bool.isRequired,
      success: bool,
      error: object,
      data: object
    })
  },
  render: function() {
    let { user, request, submitSearch, search, update, addBook } = this.props;

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
                  Library here
                </Tab>
                <Tab eventKey={2} title="Trades">
                  Active Trades here
                </Tab>
                <Tab eventKey={3} title="Add a Book">
                  <Row>
                    <Col xs={8} xsOffset={2} className={styles.bookSearch}>
                      <Form onSubmit={submitSearch}>
                        <FormGroup>
                          <InputGroup>
                            <FormControl
                              name="query"
                              type="text"
                              placeholder="book title"
                              value={search}
                              onChange={update}
                            />
                            <InputGroup.Button>
                              <Button type="submit" className="btnInverse">
                                {
                                  request.isPending ? <i className="fa fa-spinner fa-spin"></i> :
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
                      request.success &&
                      request.data.items &&
                      request.data.items.map((book) => {
                        return(<Book key={book.id} data={book} type="add" action={addBook}/>);
                      })
                    }
                    {
                      request.error &&
                      <span className="error-msg">
                        {request.error.message}
                      </span>
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
    request: state.bookSearchRequest
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    update: function(e) {
      dispatch(actions.updateFormInput("bookSearch", e.target.name, e.target.value));
    },
    submitSearch: function(e) {
      e.preventDefault();
      dispatch(thunks.searchBooks());
    },
    addBook: function(book) {
      console.log(book);
    }
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
