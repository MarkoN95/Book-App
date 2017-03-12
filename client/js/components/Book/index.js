const React = require("react");
const { Image, Button } = require("react-bootstrap");
const { string, object, func } = React.PropTypes;

const styles = require("./styles.css");

const Book = React.createClass({
  propTypes: {
    data: object.isRequired,
    type: string.isRequired,
    action: func.isRequired
  },
  getInitialState: function() {
    return {
      mouseOver: false
    };
  },
  toggle: function(bool) {
    this.setState({
      mouseOver: bool
    });
  },
  format: function(str) {
    return str.length > 25 ? str.substr(0, 20) + "..." : str;
  },
  formatBook: function(book) {
    let v = book.volumeInfo;
    return {
      id: book.id,
      title: v.title || "",
      author: v.authors ? v.authors[0] : "",
      thumbnail_url: v.imageLinks ? v.imageLinks.thumbnail : "client/media/dummy_book.png"
    };
  },
  render: function() {
    let { type, data } = this.props;
    let { mouseOver } = this.state;
    let { cover, coverInfo, show, blur } = styles;

    //format only necessary when they come raw from the api and not from the own server
    let book = type === "add" ? this.formatBook(data) : data;
    return(
      <div className={styles.book}>
        <div onMouseEnter={this.toggle.bind(this, true)} onMouseLeave={this.toggle.bind(this, false)}>
          <Image
            src={book.thumbnail_url}
            className={mouseOver ? cover + " " + blur : cover}
            responsive
          />
          <div className={mouseOver ? coverInfo + " " + show : coverInfo}>
            <span><b>Title:</b></span>
            <p>{this.format(book.title)}</p>

            <span><b>Author:</b></span>
            <p>{this.format(book.author)}</p>
          </div>
        </div>
        <Button className="btnInverse edge"  onClick={this.props.action.bind(this, book)} block>
          {this.props.type}
        </Button>
      </div>
    );
  }
});

module.exports = Book;
