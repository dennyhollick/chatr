import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import NavBar from './NavBar.jsx';
import ReactDOM from 'react-dom';

const sanitizer = require('sanitizer');
const generateRandomAnimalName = require('random-animal-name-generator');
let animalName = generateRandomAnimalName();

// Function causes scroll to bottom after new content added.

let scroll = function scrollToBottom() {
  const node = ReactDOM.findDOMNode(this.messagesEnd);
  node.scrollIntoView({ behavior: 'smooth' });
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
      messages: [
        {
          uuid: '594203a4-ecf3-46ba-9560-48e9f959b19f',
          content: 'We added a Giphy feature! Use \'/\' in the chatbar to get a random gif, or use \'/something\' to find a gif related to what you want!'
        }
      ],
      blurredNameChange: false,
    }
    this.enterKeyPressOnMessage = this.enterKeyPressOnMessage.bind(this);
    this.enterKeyPressOnName = this.enterKeyPressOnName.bind(this);
    this.blurSubmitName = this.blurSubmitName.bind(this);
  }

  // Event Functions

  enterKeyPressOnMessage(event) {
    if (event.key == 'Enter' && event.target.value.length > 0) {
      let newMessage = {
        username: this.state.currentUser.name,
        content: sanitizer.escape(event.target.value),
        colour: this.state.userColour,
        type: 'newMessage'
      };
      event.target.value = '';
      this.chattyWebSocket.send(JSON.stringify(newMessage));   
    }
  }

  enterKeyPressOnName(event) {
    if (event.key == 'Enter') {
      let newUserName = (event.target.value.length > 0) ? sanitizer.escape(event.target.value) : `Anonymous ${animalName}`;
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
      let newUserName = sanitizer.escape(event.target.value);
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

  //Once mounted:

  componentDidMount() {
    let self = this;
    this.chattyWebSocket = new WebSocket('ws://localhost:3001');
      console.log('componentDidMount <App />');

    this.chattyWebSocket.onopen = function (event) {
      console.log('The connection is open'); 
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

  //updates scroll on new updates

  componentDidUpdate() {
    this.messagesEnd.scrollIntoView();
  }

  render() {
    return (
      <div>
        <NavBar numUsers={this.state.totalUsers}/>
        <MessageList messages={this.state.messages}/>
        <ChatBar user={this.state.currentUser} onMessage={this.enterKeyPressOnMessage} nameChange={this.enterKeyPressOnName} blurSubmit={this.blurSubmitName}></ChatBar>
        <div style={{ float:'left', clear: 'both' }}
             ref={(el) => { this.messagesEnd = el; }} />
      </div>
    );
  }

}
export default App;