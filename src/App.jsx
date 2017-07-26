import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {
        name: 'Bob'
      }, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        {
          username: 'Bob',
          content: 'Has anyone seen my marbles?'
        }, {
          username: 'Anonymous',
          content: 'No, I think you lost them. You lost your marbles Bob. You lost them for good.'
        }
      ]
    }
    this.enterKeyPress = this.enterKeyPress.bind(this);
  }

  enterKeyPress(event) {
    if (event.key == 'Enter') {
      let newMessage = {
        username: this.state.currentUser.name,
        content: event.target.value
      };
      const newMessages = this.state.messages.concat(newMessage);
      this.setState({messages: newMessages});
      event.target.value = '';
      this.chattyWebSocket.send(JSON.stringify(newMessage));   
    }
  }

  componentDidMount() {
    this.chattyWebSocket = new WebSocket("ws://localhost:3001");
    console.log("componentDidMount <App />");
    chattyWebSocket.onopen = function (event) {
      console.log("The connection is open"); 
    };
  }


  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages={this.state.messages}/>
        <ChatBar user={this.state.currentUser} onMessage={this.enterKeyPress}></ChatBar>
      </div>
    );
  }

}
export default App;