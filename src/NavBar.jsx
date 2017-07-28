import React, {Component} from 'react';

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let numUsers = this.props.numUsers;
    return (
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
        <span className="navbar-counter">Total Connected Users: {numUsers}</span>
      </nav>
    );
  }
}
export default NavBar;