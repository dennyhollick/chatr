import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <footer className="chatbar">
          <input maxLength="50" className="chatbar-username" onKeyPress={this.props.nameChange} onBlur={this.props.blurSubmit} placeholder={this.props.user.name}  />
          <input className="chatbar-message" onKeyPress={this.props.onMessage} placeholder="Type a message and hit ENTER" />
        </footer>
   );
  }
}
export default ChatBar;