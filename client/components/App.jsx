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
// import { isLoggedIn } from '../../server/controllers/SessionController';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // store most state in App component, make available to child components as props
      isLoggedIn: false,
      allItems: [], // (each item is an object)
      displayedItems: [],
      displayCat: 'All',
      user: {},
      // userEmail: 'Dave',
      // userPoints: '',
      // userFirstName: 'Dave',
      // userLastName: "O'Sullivan",
      // password: '',
      // userStreet: '',
      // userStreet2: '',
      // userCity: '',
      // userState: '',
      // userZip: '',
      msgRooms: ['Bridget', 'Scott'],
      /* State for a single item */
      newItem: { itemTitle: '', itemDescription: '', itemCategory: '', itemImage: '', claimed: false },
      user_id: '2',
      redirect: null,
    };
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleSignUpSubmit = this.handleSignUpSubmit.bind(this);
    this.getAllItems = this.getAllItems.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.checkSession = this.checkSession.bind(this);
  }
  // check session auth
  componentDidMount() {
    this.checkSession();
  }

  // }
  handleUserChange(e) {
    this.setState({ user: { ...this.state.user, [e.target.name]: e.target.value } });
    // console.log(this.state);
  }

  handleItemChange(e) {
    this.setState({ newItem: { ...this.state.newItem, [e.target.name]: e.target.value } });
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
    // console.log('input Image:', e.target.value);
    this.setState({
      newItem: { ...this.state.newItem, itemImage: e.target.value },
      /**URL.createObjectURL(e.target.files[0]) to display image before submit (for file uploads, not URLs) */
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

    const { itemTitle, itemDescription, itemCategory, itemImage, claimed } = this.state.newItem;
    const user_id = this.state.user_id;
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

    const { userEmail, password } = this.state.user;
    const body = { userEmail, password };



    fetch('/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((user) => {
        if(user.isLoggedIn) {
          this.props.history.push('/');
          this.setState({ isLoggedIn: true, user: user, user_id: user._id });
        } else {
          console.log('invalid username/password');
        }
      })
      .catch((err) => {
        console.log('/LOG-IN Post error: ', err);
        this.setState({ userEmail: '', password: '' });
      });
  }

  handleLogout() {
    fetch('/user/logout', {
      method: 'DELETE',
    })
      .then((res) => {res.json()
        this.setState({ isLoggedIn: false, user: '', user_id: '' });
        this.props.history.push('/');
      })
      .catch((err) => {
        console.log('/logout DELETE error: ', err);
      });
  }

  /*----------------POST request To SIGNUP-------------------*/
  handleSignUpSubmit(e) {
    e.preventDefault();

    const { userFirstName, userLastName, password, userEmail, userStreet, userState, userCity, userZip } = this.state.user;
    const body = {
      userEmail,
      password,
      firstName: userFirstName,
      lastName: userLastName,
      zipCode: userZip,
      street: userStreet,
      city: userCity,
      state: userState,
    };

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
      .then((user) => {
        // console.log('res', res);
        this.props.history.push('/');
        this.setState({ isLoggedIn: true, user: user, user_id: user._id });
      })
      .catch((err) => {
        console.log('AddItem Post error: ', err);
        // todo - clear all fields with setState
        this.setState({});
      });
  }

  // ---------------------check session - called in componentDidMount-------------------------
  checkSession() {
    fetch('/user/checksession')
    .then(res => res.json())
    .then(user =>  {
      if (user.isLoggedIn) {
        this.props.history.push('/');
        this.setState({ isLoggedIn: true, user: user, user_id: user._id });
      }
    })
    .catch(err => {
      console.log('/api/checksession GET error:', err);
    })
  }

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
      <Switch>
        <Route
          exact
          path="/"
          render={(props) =>
            this.state.isLoggedIn ? (
              <div className="backgroundColor" style={{ backgroundColor: '#FDFDFD' }}>
                <Nav
                  from="main"
                  displayCat={this.state.displayCat}
                  handleFilterChange={this.handleFilterChange}
                  handleLogout={this.handleLogout}
                />
                <Home
                  {...props}
                  displayedItems={this.state.displayedItems}
                  userItems={this.state.userItems}
                  userEmail={this.state.user.email}
                  userAddress={this.state.user.firstName}
                  userId={this.state.user_id}
                  sendMessage={this.handleSendMessage}
                  handleSubmit={this.handleSubmit}
                  handleFileChange={this.handleFileChange}
                  handleItemChange={this.handleItemChange}
                  handleFilterChange={this.handleFilterChange}
                  getAllItems={this.getAllItems}
                />
              </div>
            ) : (
              <div className="backgroundColor" style={{ backgroundColor: '#FDFDFD' }}>
                <Nav from="landing" displayCat={this.state.displayCat} handleFilterChange={this.handleFilterChange} />
                <Landing />
              </div>
            )
          }
        />
        <Route
          exact
          path="/additem"
          render={(props) => (
            <div className="backgroundColor" style={{ backgroundColor: '#FDFDFD' }}>
              <Nav
                from="additem"
                displayCat={this.state.displayCat}
                handleFilterChange={this.handleFilterChange}
                handleLogout={this.handleLogout}
              />
              <AddItem
                {...props} // add props here
              />
            </div>
          )}
        />
        <Route
          exact
          path="/login"
          render={(props) => (
            <div className="backgroundColor" style={{ backgroundColor: '#FDFDFD' }}>
              <Nav from="login" displayCat={this.state.displayCat} handleFilterChange={this.handleFilterChange} />
              <Login
                {...props} // add props here
                handleLoginSubmit={this.handleLoginSubmit}
                handleUserChange={this.handleUserChange}
              />
            </div>
          )}
        />
        <Route
          exact
          path="/signup"
          render={(props) => (
            <div className="backgroundColor" style={{ backgroundColor: '#FDFDFD' }}>
              <Nav from="signup" displayCat={this.state.displayCat} handleFilterChange={this.handleFilterChange} />
              <SignUp
                handleUserChange={this.handleUserChange}
                handleSignUpSubmit={this.handleSignUpSubmit}
                {...props} // add props here
              />
            </div>
          )}
        />
        <Route
          exact
          path="/profile"
          render={(props) => (
            <div className="backgroundColor" style={{ backgroundColor: '#FDFDFD' }}>
              <Nav
                from="profile"
                displayCat={this.state.displayCat}
                handleFilterChange={this.handleFilterChange}
                handleLogout={this.handleLogout}
              />
              <Profile {...props} allItems={this.state.allItems} userId={this.state.user_id} user={this.state.user} />
            </div>
          )}
        />
        <Route
          exact
          path="/chat"
          render={(props) => (
            <div className="backgroundColor" style={{ backgroundColor: '#FDFDFD' }}>
              <Nav
                from="chat"
                displayCat={this.state.displayCat}
                handleFilterChange={this.handleFilterChange}
                handleLogout={this.handleLogout}
              />
              <Chat
                {...props}
                allItems={this.state.allItems}
                userEmail={this.state.userEmail}
                userLocation={this.state.userZip}
              />
            </div>
          )}
        />

        <Route
          exact
          path="/messages"
          render={(props) => (
            <div className="backgroundColor" style={{ backgroundColor: '#FDFDFD' }}>
              <Nav
                from="messages"
                displayCat={this.state.displayCat}
                handleFilterChange={this.handleFilterChange}
                handleLogout={this.handleLogout}
              />
              <Messages {...props} msgRooms={this.state.msgRooms} userEmail={this.state.userEmail} />
            </div>
          )}
        />
        {/* Temporary route to manually get to main landing page */}
        <Route
          exact
          path="/landing"
          render={(props) => (
            <div className="backgroundColor" style={{ backgroundColor: '#FDFDFD' }}>
              <Nav from="landing" displayCat={this.state.displayCat} handleFilterChange={this.handleFilterChange} />
              <Landing />
            </div>
          )}
        />
      </Switch>
    );
  }
}
export default withRouter(App);
