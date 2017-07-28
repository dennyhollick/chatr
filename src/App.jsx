import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import NavBar from './NavBar.jsx';
import ReactDOM from 'react-dom';

const generateRandomAnimalName = require('random-animal-name-generator');
let animalName = generateRandomAnimalName();

// Function causes scroll to bottom after new content added.

let scroll = function scrollToBottom() {
  const node = ReactDOM.findDOMNode(this.messagesEnd);
  node.scrollIntoView({ behavior: "smooth" });
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {
        name: `Anonymous ${animalName}`
      }, 
      totalUsers: 0,
      userColour: '',
      messages: [],
      blurredNameChange: false,
    }
    this.enterKeyPressOnMessage = this.enterKeyPressOnMessage.bind(this);
    this.enterKeyPressOnName = this.enterKeyPressOnName.bind(this);
    this.blurSubmitName = this.blurSubmitName.bind(this);
  }

  // Event Functions

  enterKeyPressOnMessage(event) {
    if (event.key == 'Enter') {
      let newMessage = {
        username: this.state.currentUser.name,
        content: event.target.value,
        colour: this.state.userColour,
        type: 'newMessage'
      };
      event.target.value = '';
      this.chattyWebSocket.send(JSON.stringify(newMessage));   
    }
  }

  enterKeyPressOnName(event) {
    if (event.key == 'Enter') {
      let newUserName = (event.target.value.length > 0) ? event.target.value : `Anonymous ${animalName}`;
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
      this.chattyWebSocket.send(JSON.stringify(serverNotification));   
    }
  }

    blurSubmitName(event) {
    if (event.target.value.length > 0 ) {
      let oldUserName = this.state.currentUser.name;
      let newUserName = event.target.value;
      this.setState( { 
        currentUser: 
          {
          name: newUserName,
          },
        }
      )
      event.target.value = '';
    }
  }

//TODO move nested func out.

  componentDidMount() {
    let self = this;
    this.chattyWebSocket = new WebSocket("ws://localhost:3001");
      console.log("componentDidMount <App />");

    this.chattyWebSocket.onopen = function (event) {
      console.log("The connection is open"); 
    };
    this.chattyWebSocket.onmessage = function (event) {
      const newBroadcast = JSON.parse(event.data);
      if (newBroadcast.type === 'newBroadcast' || 'nameChange' || 'err') {
        const newMessages = self.state.messages.concat(newBroadcast);
        self.setState({messages: newMessages})
        }
      if (newBroadcast.type === 'systemStatus') {
        const subType = newBroadcast.subType;
        const subTypeData = newBroadcast[subType];
        self.setState({[subType]: subTypeData})
      }
    };
    scroll;
  }

componentDidUpdate() {
  this.messagesEnd.scrollIntoView();
}

  render() {
    return (
      <div>
        <NavBar numUsers={this.state.totalUsers}/>
        <MessageList messages={this.state.messages}/>
        <ChatBar user={this.state.currentUser} onMessage={this.enterKeyPressOnMessage} nameChange={this.enterKeyPressOnName} blurSubmit={this.blurSubmitName}></ChatBar>
        <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }} />
      </div>
    );
  }

}
export default App;