import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {

  render() {

    let lis = this
      .props
      .messages
      .map((message, index) => {
        return <Message key={index} message={message}/>

      })

    return (
      <div className="messages">
        {lis}
      </div>
    )
  }
}

export default MessageList;
