import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import NavBar from './NavBar.jsx';
const generateRandomAnimalName = require('random-animal-name-generator');
let animalName = generateRandomAnimalName();


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
        colour: this.state.userColour,
        type: 'newMessage'
      };
      event.target.value = '';
      this.chattyWebSocket.send(JSON.stringify(newMessage));   
    }
  }

  nameKeyPress(event) {
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

  //Send username to server

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
  }

  render() {
    return (
      <div>
        <NavBar numUsers={this.state.totalUsers}/>
        <MessageList messages={this.state.messages}/>
        <ChatBar user={this.state.currentUser} onMessage={this.enterKeyPress} nameChange={this.nameKeyPress} blurSubmit={this.blurSubmitName}></ChatBar>
      </div>
    );
  }

}
export default App;