import React, {Component} from 'react';

const gifChek =  function checkIfGif (content) {
  let type = content.split('.').pop();
  let website = content.split('.')
  if (type == 'gif' && website[1] == 'giphy') {
    return true; 
  } else {
    return false;
  }
}

class Message extends Component {


  render() {
    const { username, content, colour } = this.props.message;
    
    if (content && gifChek(content)) {
      return (
         <div className="message">
          <span className="message-username" style={{color: colour}}>{username}</span>
          <span className="message-content"><img src={content}/></span>
        </div>
      )
    }
    else if (username) {
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