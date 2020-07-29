/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import '../scss/app.scss';

// eslint-disable-next-line react/prefer-stateless-function
class ItemCard extends Component {
  constructor(props) {
    super(props);
  }
  // eslint-disable-next-line lines-between-class-members
  render() {
    const {
      _id,
      category,
      description,
      image,
      status,
      title,
      user_id,
    } = this.props.item;
    const { sendMessageButton } = this.props;

    console.log('This is this.props:  ', this.props.item.image);

    let claimed = status ? 'Yes' : 'No';
    let messageButton;
    if (this.props.inProfile) {
      messageButton = null;
    } else {
      messageButton = (
        <button
          type="button"
          class="btn btn-primary appButton"
          style={{ width: '100%' }}
          value={title}
          onClick={(e) => sendMessageButton(e)}
          position="bottom"
        >
          Message Lister
        </button>
      );
    }

    /*
      PREVIEW IMAGE CONTAINER WORK
    */

    const image1 = this.props.item.image1;
    const image2 = this.props.item.image2;
    const image3 = this.props.item.image3;
    // Preview image array. If no image, turn it to stock image
    const previewImagesArray = [image1, image2, image3]
      .map((image) =>
        image
          ? image
          : 'https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'
      )
      .map((thumbImage, index) => {
        return (
          <div className="imagePreview">
            <div key={index} item={thumbImage} />
          </div>
        );
      });

    // render() {
    //   const { displayedItems } = this.props; // provides this.state.allItems as an array
    //   console.log('displayedItems is here:   ', this.props);
    //   // use map method to transform allItems into cards
    //   const cards = displayedItems.map((item, index) => {
    //     return (
    //       <div className="card">
    //         <ItemCard
    //           key={index}
    //           item={item}
    //           sendMessageButton={this.props.sendMessage}
    //           inProfile={false}
    //         />
    //       </div>
    //     );
    //   });
    /* TO DO: 
      backend: add location
      frontend: add description & image
      questions: value on message listener button?
    */

    /* 
      Bootstrap Cards (card-img-top)
      https://getbootstrap.com/docs/4.0/components/card/
    */

    return (
      <div class="card-container">
        <div class="image-holder">
          <img
            class="card-img-top"
            src={image}
            alt="Product Image"
            height="200"
          />
        </div>
        <section className="imagePreviewContainer">
          {/* Image preview container syntax goes here */}
          {previewImagesArray}
        </section>
        <div class="card-body">
          <h5 class="card-title">{title}</h5>
          <p class="card-text">
            {/* Location: Enter Location Here <br /> */}
            <br />
            {description} <br />
            Category: {category}
            <br />
            Claimed: {claimed}
          </p>
          {messageButton}
        </div>
      </div>
    );
  }
}

export default ItemCard;
