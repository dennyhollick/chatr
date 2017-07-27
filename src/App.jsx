import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import NavBar from './NavBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {
        name: 'Bob'
      }, 
      numUsersConnected: 0,
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
      const newBroadcast = JSON.parse(event.data);
      console.log(newBroadcast);
      if (newBroadcast.type === 'newBroadcast' || 'nameChange' || 'err') {
        const newMessages = self.state.messages.concat(newBroadcast);
        self.setState({messages: newMessages})
        }
      if (newBroadcast.type === 'systemStatus') {
        const numUsers = newBroadcast.totalUsers;
        console.log('Number of Users ', numUsers);
        self.setState({numUsersConnected: numUsers})
      }
    };
  }

  render() {
    return (
      <div>
        <NavBar numUsers={this.state.numUsersConnected}/>
        <MessageList messages={this.state.messages}/>
        <ChatBar user={this.state.currentUser} onMessage={this.enterKeyPress} nameChange={this.nameKeyPress} blurSubmit={this.blurSubmitName}></ChatBar>
      </div>
    );
  }

}
export default App;