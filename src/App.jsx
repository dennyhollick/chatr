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
    this.nameKeyPress = this.nameKeyPress.bind(this);
    this.blurSubmitName = this.blurSubmitName.bind(this);
  }



  enterKeyPress(event) {
    if (event.key == 'Enter') {
      let newMessage = {
        username: this.state.currentUser.name,
        content: event.target.value,
        type: 'newMessage'
      };
      event.target.value = '';
      this.chattyWebSocket.send(JSON.stringify(newMessage));   
    }
  }


  nameKeyPress(event) {
    if (event.key == 'Enter') {
      let newUserName = (event.target.value.length > 0) ? event.target.value : 'Anonymous';
      let prevName = this.state.currentUser.name
      let serverNotification = {
        type: 'nameChange',
        oldUsername: prevName,
        newUserName: newUserName  
      }
      this.setState({ 
        currentUser: 
          {
          name: newUserName
          }
        })
      event.target.value = '';
      console.log(serverNotification);
      this.chattyWebSocket.send(JSON.stringify(serverNotification));   
    }
  }

    blurSubmitName(event) {
    if (event.target.value.length > 0 ) {
      let newUserName = event.target.value
      this.setState( { 
        currentUser: 
          {
          name: newUserName
          }
        }
      )
      event.target.value = '';
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
      console.log(newMessage);
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
        <ChatBar user={this.state.currentUser} onMessage={this.enterKeyPress} nameChange={this.nameKeyPress} blurSubmit={this.blurSubmitName}></ChatBar>
      </div>
    );
  }

}
export default App;