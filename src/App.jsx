import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {
        name: 'Bob'
      }, 
      messages: []
    }
    this.enterKeyPress = this.enterKeyPress.bind(this);
    // this.componentDidMount = this.componentDidMount.bind(this);
  }



  enterKeyPress(event) {
    if (event.key == 'Enter') {
      let newMessage = {
        username: this.state.currentUser.name,
        content: event.target.value
      };
      event.target.value = '';
      this.chattyWebSocket.send(JSON.stringify(newMessage));   
    }
  }

  componentDidMount() {
    let self = this;
    this.chattyWebSocket = new WebSocket("ws://localhost:3001");
      console.log("componentDidMount <App />");

    this.chattyWebSocket.onopen = function (event) {
      console.log("The connection is open"); 
    };
    this.chattyWebSocket.onmessage = function (event) {
      const newMessage = JSON.parse(event.data);
      const newMessages = self.state.messages.concat(newMessage);
      self.setState({messages: newMessages})
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