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
  render: function() {
    let { title, author } = this.props.data;
    let { mouseOver } = this.state;
    let { cover, coverInfo, show, blur } = styles;
    return(
      <div className={styles.book}>
        <div onMouseEnter={this.toggle.bind(this, true)} onMouseLeave={this.toggle.bind(this, false)}>
          <Image
            src={this.props.data.url}
            className={mouseOver ? cover + " " + blur : cover}
            responsive
          />
          <div className={mouseOver ? coverInfo + " " + show : coverInfo}>
            <span><b>Title:</b></span>
            <p>{title}</p>

            <span><b>Author:</b></span>
            <p>{author}</p>
          </div>
        </div>
        <Button className="btnInverse edge"  onClick={this.props.action} block>
          {this.props.type}
        </Button>
      </div>
    );
  }
});

module.exports = Book;
