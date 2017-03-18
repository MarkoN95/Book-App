const React = require("react");
const { connect } = require("react-redux");
const { Grid, Row, Col, Form, FormGroup, FormControl, InputGroup, DropdownButton, MenuItem } = require("react-bootstrap");
const { string, bool, object, shape, func } = React.PropTypes;
const Book = require("../Book");

const actions = require("../../actions/update");
const thunks = require("../../actions/thunks");

const Marketplace = React.createClass({
  propTypes: {
    query: string.isRequired,
    request: shape({
      isPending: bool.isRequired,
      success: bool,
      error: object,
      data: object
    }),
    update: func.isRequired,
    searchMarketplace: func.isRequired,
    searchWithOption: func.isRequired
  },
  render: function() {
    let { query, request, update, searchMarketplace, searchWithOption } = this.props;
    return (
      <Grid  className="mainGrid" fluid>
        <Row>
          <Col md={8} sm={8} xs={12} mdOffset={2} smOffset={2}>
            <h3 className="text-center">Search the Marketplace and start trading</h3>
            <Form onSubmit={searchMarketplace}>
              <FormGroup>
                <InputGroup>
                  <FormControl
                    type="text"
                    name="query"
                    placeholder="title or author"
                    value={query}
                    onChange={update}
                  />
                  <DropdownButton
                    onSelect={searchWithOption}
                    className="btnInverse"
                    componentClass={InputGroup.Button}
                    id="marketplace-search-options"
                    title="find"
                  >
                    <MenuItem eventKey="all">All Books</MenuItem>
                    <MenuItem eventKey="latest">Latest Additions</MenuItem>
                  </DropdownButton>
                </InputGroup>
              </FormGroup>
            </Form>
            <hr/>
          </Col>
        </Row>
        <Row>
          <Col md={8} sm={8} xs={12} mdOffset={2} smOffset={2}>
            {
              request.error &&
              !request.isPending &&
              <p className="error-msg">
                {request.error.message}
              </p>
            }
            {
              request.isPending &&
              <div className="text-center">
                <i className="fa fa-spinner fa-spin fa-2x"/>
              </div>
            }
            {
              request.data &&
              request.data.items &&
              request.data.items.map((book) => {
                return(
                  <Book key={book.id} data={book} type="trade" action={(book) => { console.log(book); }}/>
                );
              })
            }
            {
              request.data &&
              request.data.items &&
              request.data.items.length === 0 &&
              <h4 className="text-center">No books</h4>
            }
          </Col>
        </Row>
      </Grid>
    );
  }
});

const mapStateToProps = function(state) {
  return {
    query: state.marketplace.search.query,
    request: state.marketplace.request
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    update: function(e) {
      dispatch(actions.updateFormInput("search", e.target.name, e.target.value));
    },
    searchMarketplace: function(e) {
      e.preventDefault();
      dispatch(thunks.findBooks());
    },
    searchWithOption: function(eventKey) {
      dispatch(thunks.findBooks(eventKey));
    }
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Marketplace);
