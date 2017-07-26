import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <footer className="chatbar">
          <input className="chatbar-username" placeholder={this.props.user.name} />
          <input className="chatbar-message" onKeyPress={this.props.onMessage} placeholder="Type a message and hit ENTER" />
        </footer>
   );
  }
}
export default ChatBar;