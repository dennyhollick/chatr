import React, {Component} from 'react';

class Message extends Component {

  render() {
    const { username, content, colour} = this.props.message;
    if (username) {
      return (
        <div className="message">
          <span className="message-username" style={{color: colour}}>{username}</span>
          <span className="message-content">{content}</span>
        </div>
      )
    } else {
      return (
        <div className="message system">
          {content}
        </div>
      )
    }
  }
}

export default Message;