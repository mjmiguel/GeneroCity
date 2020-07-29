import React, { Component } from 'react';
const path = require('path');
import 'bootstrap/dist/css/bootstrap.min.css';
import '../scss/app.scss';
import SignUp from './SignUp.jsx';
import Login from './Login.jsx';
import Home from './Home.jsx';
import Profile from './Profile.jsx';
import AddItem from './AddItem.jsx';
import Chat from './chat/Chat.jsx';
import Messages from './chat/Messages.jsx';
import Landing from './Landing.jsx';
import Nav from './Nav.jsx';
import { Route, Switch, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // store most state in App component, make available to child components as props
      isloggedIn: false,
      allItems: [], // (each item is an object)
      displayedItems: [],
      displayCat: 'All',
      userEmail: 'Dave',
      userPoints: '',
      userFirstName: 'Dave',
      userLastName: "O'Sullivan",
      password: '',
      userStreet: '',
      userStreet2: '',
      userCity: '',
      userState: '',
      userZip: '',
      msgRooms: ['Bridget', 'Scott'],
      /* State for a single item */
      itemTitle: '',
      itemDescription: '',
      itemCategory: '',
      itemImage: '',
      claimed: false,
      user_id: '2',
      redirect: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleSignUpSubmit = this.handleSignUpSubmit.bind(this);
    this.getAllItems = this.getAllItems.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    // this.checkSession = this.checkSession.bind(this);
  }
  componentDidMount() {
    this.getAllItems();
    // this.checkSession(); ---- session auth incomplete
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  /*--------- Send a message to another user from ItemCard button ------*/
  // somewhere (maybe here) we need a POST request to update both users' 'msgRooms' array in DB
  handleSendMessage(e) {
    e.preventDefault();
    const newUserMessages = [...this.state.msgRooms];
    newUserMessages.push(`Owner of ${e.target.value}`);
    this.setState({ msgRooms: newUserMessages });
    this.props.history.push('/messages');
  }
  /*----------- handle file change (image input) (AddItem)-----------------*/

  handleFileChange(e) {
    console.log('input Image:', e.target.value);
    this.setState({
      itemImage:
        e.target
          .value /**URL.createObjectURL(e.target.files[0]) to display image before submit (for file uploads, not URLs) */,
    });
  }

  /*--- GET request to retrieve item filter by category---- */

  handleFilterChange(e) {
    e.preventDefault();
    const categoryName = e.target.value;
    const allItems = this.state.allItems;
    let displayedItems = [];

    if (!categoryName || categoryName === 'All') {
      displayedItems = [...this.state.allItems];
      this.setState({ displayCat: 'All', displayedItems });
    } else {
      allItems.forEach((item) => {
        if (item.category === categoryName) displayedItems.push(item);
      });
      this.setState({
        displayCat: categoryName,
        displayedItems: displayedItems,
      });
    }
  }

  /*---- POST request to add item to server---- */
  handleSubmit(e) {
    e.preventDefault();

    const { itemTitle, itemDescription, itemCategory, itemImage, claimed, user_id } = this.state;
    const body = {
      title: itemTitle,
      description: itemDescription,
      image: itemImage,
      category: itemCategory,
      status: claimed,
      user_id,
    };
    const url = '/item/add';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        res.json();
        const newItems = this.state.allItems.slice();
        newItems.push(body);
        this.setState({ allItems: newItems });
      })
      .catch((err) => {
        console.log('AddItem Post error: ', err);
      });
  }

  /*--- POST request to /LOG-IN---- */
  handleLoginSubmit(e) {
    e.preventDefault();

    const { userEmail, password } = this.state;
    const body = { userEmail, password };

    fetch('/log-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        console.log('res in /log-in', res);
        res.json();

        this.setState({ isLoggedIn: true, password: '' });
        this.props.history.push('/');
      })
      .catch((err) => {
        console.log('/LOG-IN Post error: ', err);
        this.setState({ userEmail: '', password: '' });
      });
  }

  /*----------------POST request To SIGNUP-------------------*/
  handleSignUpSubmit(e) {
    e.preventDefault();

    const { userFirstName, userLastName, password, userEmail, userStreet, userState, userCity, userZip } = this.state;
    const body = {
      email: userEmail,
      password,
      firstName: userFirstName,
      lastName: userLastName,
      zipCode: userZip,
      street: userStreet,
      city: userCity,
      state: userState,
    };

    console.log('submit signUp req body:', body);

    fetch('/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      // TODO: setState with isLoggedIn, clear pw
      // return to home page
      .then((res) => {
        // console.log('res', res);
        this.props.history.push('/');
        // this.setState({})
      })
      .catch((err) => {
        console.log('AddItem Post error: ', err);
        // todo - clear all fields with setState
        this.setState({});
      });
  }

  // ---------------------check session - called in componentDidMount-------------------------
  // checkSession() {
  //   fetch('/api/checksession')
  //   .then(res => res.json())
  //   .then(res =>  {
  //     // if (res.status === 200) {
  //     console.log("res.email in checkSession", res.email)
  //     // on successful status, update state email and pw
  //     this.setState({email: [res.email], isLoggedIn: true})

  //   })
  //   .catch(err => {
  //     console.log('/api/checksession GET error:', err);
  //   })
  // }

  /*--- GET Request for All items--- */
  getAllItems() {
    // call in componentDidMount
    fetch('/item/all')
      .then((res) => res.json())
      .then((res) => {
        console.log('res', res.items);
        // update state with array
        this.setState({ allItems: res.items, displayedItems: res.items, displayCat: '' });
      })
      // this.props.history.push('/'))
      .catch((err) => {
        console.log('/item/all GET error: ', err);
      });
  }

  render() {
    return (
      <div className="backgroundColor" style={{ backgroundColor: '#FDFDFD' }}>
        <Nav displayCat={this.state.displayCat} handleFilterChange={this.handleFilterChange} />
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <Home
                {...props}
                displayedItems={this.state.displayedItems}
                userItems={this.state.userItems}
                userEmail={this.state.userEmail}
                userAddress={this.state.userAddress}
                userId={this.state.user_id}
                sendMessage={this.handleSendMessage}
                handleSubmit={this.handleSubmit}
                handleFileChange={this.handleFileChange}
                handleChange={this.handleChange}
                handleFilterChange={this.handleFilterChange}
              />
            )}
          />
          <Route
            exact
            path="/additem"
            render={(props) => (
              <AddItem
                {...props} // add props here
              />
            )}
          />
          <Route
            exact
            path="/login"
            render={(props) => (
              <Login
                {...props} // add props here
                handleLoginSubmit={this.handleLoginSubmit}
                handleChange={this.handleChange}
              />
            )}
          />
          <Route
            exact
            path="/signup"
            render={(props) => (
              <SignUp
                handleChange={this.handleChange}
                handleSignUpSubmit={this.handleSignUpSubmit}
                {...props} // add props here
              />
            )}
          />
          <Route
            exact
            path="/profile"
            render={(props) => (
              <Profile
                {...props}
                allItems={this.state.allItems}
                userId={this.state.user_id}
                userEmail={this.state.userEmail}
                userFirstName={this.state.userFirstName}
                userLastName={this.state.userLastName}
              />
            )}
          />
          <Route
            exact
            path="/chat"
            render={(props) => (
              <Chat
                {...props}
                allItems={this.state.allItems}
                userEmail={this.state.userEmail}
                userLocation={this.state.userZip}
              />
            )}
          />

          <Route
            exact
            path="/messages"
            render={(props) => <Messages {...props} msgRooms={this.state.msgRooms} userEmail={this.state.userEmail} />}
          />

          <Route exact path="/landing" render={(props) => <Landing />} />
        </Switch>
      </div>
    );
  }
}
export default withRouter(App);
