const React = require("react");
const { connect } = require("react-redux");
const { Grid, Row, Col, Image, Tabs, Tab } = require("react-bootstrap");
const { object } = React.PropTypes;

const styles = require("./styles.css");
const Book = require("../Book");

const User = React.createClass({
  propTypes: {
    user: object
  },
  testBooks: function(max) {
    let books = [];
    for(var i = 0; i < max; i++) {
      var data = {
        title: "Harry Potter",
        author: "J. K. Rowling",
        url: "/client/media/dummy_book.png"
      };
      books.push(<Book type="trade" data={data} action={() => { /*here starts the fun*/ }}/>);
    }
    return books;
  },
  render: function() {
    let { user } = this.props;
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
              <Tabs>
                <Tab eventKey={1} title="Library">
                  {this.testBooks(10)}
                </Tab>
                <Tab eventKey={2} title="Trades">
                  Active Trades here
                </Tab>
                <Tab eventKey={3} title="Add a Book">
                  Book search here
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
    user: state.user
  };
};

module.exports = connect(
  mapStateToProps
)(User);
