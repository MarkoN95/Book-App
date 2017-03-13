const React = require("react");
const { Image, Button } = require("react-bootstrap");
const { string, object, func, bool } = React.PropTypes;

const styles = require("./styles.css");

const Book = React.createClass({
  propTypes: {
    pending: bool,
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
  limitLength: function(str) {
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
  to_ing: function(word) {
    const lastLetter = word.charAt(word.length - 1).toLowerCase();
    const isVowel = ["a", "e", "i", "o", "u"].indexOf(lastLetter) !== -1;
    return isVowel ? word.substr(0, word.length - 2) + "ing..." : word + "ing...";
  },
  render: function() {
    let { type, data, pending } = this.props;
    let { mouseOver } = this.state;
    let { cover, coverInfo, show, blur } = styles;

    //format only necessary when they come raw from the api and not from the own server
    let book = type === "add" ? this.formatBook(data) : data;
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
            <span><b>Author:</b></span>
            <p>{this.limitLength(book.author)}</p>
          </div>
          
        </div>
        <Button
          className="btnInverse edge"
          onClick={this.props.action.bind(this, book)}
          disabled={pending}
          block>
          {pending ? this.to_ing(type) : type}
        </Button>
      </div>
    );
  }
});

module.exports = Book;
