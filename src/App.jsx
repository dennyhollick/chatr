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
      // if (this.document.getElementsByClassName("chatbar-username).value().length > 0) {
      //   let newUser = this.event.target.value
      //   this.setState( { 
      //   currentUser: 
      //     {
      //     name: newUser
      //     }
      //   }
      // )
      // this.event.target.value = '';
      // }
      let newMessage = {
        username: this.state.currentUser.name,
        content: event.target.value
      };
      event.target.value = '';
      this.chattyWebSocket.send(JSON.stringify(newMessage));   
    }
  }


  nameKeyPress(event) {
    if (event.key == 'Enter') {
      let newUser = event.target.value
      this.setState( { 
        currentUser: 
          {
          name: newUser
          }
        }
      )
      event.target.value = '';
    }
  }

    blurSubmitName(event) {
    if (event.target.value.length > 0 ) {
      let newUser = event.target.value
      this.setState( { 
        currentUser: 
          {
          name: newUser
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