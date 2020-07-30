import React, { Component, Fragment } from 'react';

import ItemCard from './ItemCard.jsx';
import EditItem from './EditItem';
import '../scss/app.scss'; // would each page have different css?

const path = require('path');

// create local state for get request of user profile
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userItems: [],
    };
    // handleChange on edit of items
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.getUserItems = this.getUserItems.bind(this);
    this.handleEditParamSet = this.handleEditParamSet.bind(this);
    //
  }

  componentDidMount() {
    this.getUserItems();
  }

  //handle event click
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleFileChange(e) {
    console.log('input Image:', e.target.value);
    this.setState({
      itemImage: e.target.value,
    });
  }

  handleEditParamSet(e) {
    // console.log(e.target.value);
    this.setState({
      _id: e.target.value,
    });
  }
  //

  /*--- GET request to get all items from server---- */

  getUserItems() {
    // const url = '/user/get';
    const id = this.props.userId;
    fetch(`/user/${id}`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({ userItems: res.allItems });
      })
      .catch((err) => {
        console.log('/item/user GET error: ', err);
      });
  }

  /*--- POST request to edit item to server---- */
  handleSubmit(e) {
    e.preventDefault();
    const { itemTitle, itemDescription, itemCategory, itemImage, claimed } = this.state;
    const itemId = this.state._id;
    const body = {
      title: itemTitle,
      description: itemDescription,
      image: itemImage,
      category: itemCategory,
      status: claimed,
    };

    console.log('submit EditItem req body:', body);
    fetch(`/item/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        res.json();
        // refresh state values
        // this.setState({ itemTitle: '', itemDescription: '', itemCategory: '', itemImage: '', itemAddress: '' })
        // return to home page
        // this.props.history.push('/')
      })
      .then((item) => {
        this.props.history.push('/');
        this.setState({ itemTitle: '', itemDescription: '', itemCategory: '', itemImage: '', itemAddress: '' });
      })
      .catch((err) => {
        console.log('AddItem Post error: ', err);
        // this.setState({ itemTitle: '', itemDescription: '', itemCategory: '', itemImage: '', itemAddress: '' })
        this.props.history.push('/');
      });
  }
  render() {
    const { userItems } = this.state;
    const cards = userItems.map((item, index) => {
      return (
        <section key={index} className="card">
          <ItemCard
            item={item}
            inProfile={true}
            name={item.itemTitle}
            userid={item.itemUserId}
            location={item.itemAddress}
            status={item.itemStatus}
          />
          <section className="cardItem">
            <button
              value={item._id}
              onClick={this.handleEditParamSet}
              type="button"
              className="btn btn-dark editItemBtn"
              data-toggle="modal"
              data-target="#editItemModal"
            >
              Edit Item
            </button>
          </section>
        </section>
      );
    });

    return (
      <>
        <div
          className="modal fade"
          id="editItemModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalScrollableTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalScrollableTitle">
                  Edit Item
                </h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <EditItem
                  handleChange={this.handleChange}
                  handleSubmit={this.handleSubmit}
                  handleFileChange={this.handleFileChange}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary loginAndSignUpBtn" data-dismiss="modal">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary loginAndSignUpBtn"
                  data-dismiss="modal"
                  onClick={(e) => this.handleSubmit(e)}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="userProfile">
          <h4>Welcome to Your Profile, {this.props.user.firstName}!</h4>
          <p>
            Name: {this.props.user.firstName} {this.props.user.lastName}
            <br />
            User Email: {this.props.user.email}
          </p>
          <h5>Your listed items:</h5>
        </section>
        <section className="itemsContainer">{cards}</section>
      </>
    );
  }
}

export default Profile;
