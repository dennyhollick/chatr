import React, {Component} from 'react';

class Message extends Component {

  render() {
    const { username, content} = this.props.message;
    console.log(this.props.message);
    if (username) {
      return (
        <div className="message">
          <span className="message-username">{username}</span>
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