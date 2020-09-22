/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router';
import ItemCard from './ItemCard.jsx';
import AddItem from './AddItem';
import '../scss/app.scss';

class Home extends Component {
  constructor(props) {
    super(props);
    // tracks AddItem values
  }

  componentDidMount() {
    this.props.getAllItems();
  }

  render() {
    const { displayedItems } = this.props;
    console.log('displayedItems is here:   ', this.props);
    // use map method to transform allItems into cards
    const cards = displayedItems.map((item, index) => {
      return (
        <div key={index} className="card">
          <ItemCard
            key={index}
            item={item}
            sendMessageButton={this.props.sendMessage}
            inProfile={false}
          />
        </div>
      );
    });
    console.log('This is cards in HOME:  ', cards);
    return (
      <>
        <section className="innerNav">
          <section className="leftNav"></section>
          <section className="rightNav">
            {/* <!-- Button trigger modal --> */}
            <button
              type="button"
              className="btn btn-dark addItemBtn"
              data-toggle="modal"
              data-target="#addItemModal"
            >
              Add Item
            </button>
          </section>
        </section>
        {/* <!!-- Modal Button - Display Content is in AddItem.jsx --!!> */}
        <div
          className="modal fade"
          id="addItemModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalScrollableTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalScrollableTitle">
                  Add an Item
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <AddItem
                  handleItemChange={this.props.handleItemChange}
                  handleSubmit={this.props.handleSubmit}
                  handleFileChange={this.props.handleFileChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="containerContainer">
          <section className="itemsContainer">{cards}</section>
        </div>
      </>
    );
  }
}

export default Home;
