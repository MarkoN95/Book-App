const React = require("react");
const { Link } = require("react-router");

const Main = React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },
  render: function() {
    return (
      <div>
        <h1>Hello World</h1>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/home">Home</Link></li>
        </ul>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Main;
