const React = require("react");
const { Image } = require("react-bootstrap");
const { string } = React.PropTypes;

const styles = require("./styles.css");

const Book = function(props) {
  return (
    <div className={styles.book}>
      <Image src={props.url} responsive className={styles.cover}/>
    </div>
  );
};

Book.propTypes = {
  url: string.isRequired
};

module.exports = Book;
