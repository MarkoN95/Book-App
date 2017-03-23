const React = require("react");
const { Link } = require("react-router");
const { Image, Button, Glyphicon } = require("react-bootstrap");
const { string, object, func, bool } = React.PropTypes;

const styles = require("./styles.css");

const Book = React.createClass({
  propTypes: {
    success: bool,
    pending: bool,
    data: object.isRequired,
    type: string.isRequired,
    action: func.isRequired,
    renderActionAsLink : bool,
    to: string,
    format: bool
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
  limitLength: function(str) {
    return str.length > 25 ? str.substr(0, 20) + "..." : str;
  },
  formatBook: function(book) {
    let v = book.volumeInfo;
    let hasImage = !!(v.imageLinks && v.imageLinks.thumbnail);
    return {
      id: book.id,
      title: v.title || "",
      author: v.authors ? v.authors[0] : "",
      thumbnail_url: v.imageLinks ? v.imageLinks.thumbnail : "client/media/dummy_book.png",
      hasImage: hasImage,
      available: true
    };
  },
  to_ing: function(word) {
    const lastLetter = word.charAt(word.length - 1).toLowerCase();
    const isVowel = ["a", "e", "i", "o", "u"].indexOf(lastLetter) !== -1;
    return isVowel ? word.substr(0, word.length - 2) + "ing..." : word + "ing...";
  },
  actionButton: function() {
    let { success, pending, type, data, format } = this.props;
    let book = format ? this.formatBook(data) : data;
    return(
      <Button
        className="btnInverse edge"
        onClick={this.props.action.bind(this, book)}
        disabled={pending || !book.available}
        block>
        {pending ? this.to_ing(type) : type}
        {" "}
        {
          success &&
          <Glyphicon glyph="ok"/>
        }
      </Button>
    );
  },
  render: function() {
    let { data, renderActionAsLink, to, format } = this.props;
    let { mouseOver } = this.state;
    let { cover, coverInfo, show, blur } = styles;

    //format only necessary when they come raw from the api and not from the own server
    let book = format ? this.formatBook(data) : data;
    return(
      <div className={styles.book}>
        <div
          onMouseEnter={this.toggle.bind(this, true)}
          onMouseLeave={this.toggle.bind(this, false)}>

          <Image
            src={book.thumbnail_url}
            className={mouseOver ? cover + " " + blur : cover}
            responsive
          />

          <div className={mouseOver ? coverInfo + " " + show : coverInfo}>
            {
              !book.hasImage &&
              <span>
                <b>Title: </b>{book.title}<br/>
              </span>
            }
            <span>
              <b>Author:<br/></b>{this.limitLength(book.author)}
            </span>
          </div>

        </div>
        {
          renderActionAsLink ?
          <Link to={to}>
            {this.actionButton()}
          </Link> :
          this.actionButton()
        }
      </div>
    );
  }
});

module.exports = Book;
