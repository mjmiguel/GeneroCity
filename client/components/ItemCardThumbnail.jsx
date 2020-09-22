import React, { Component } from 'react';
//import Carousel, { Modal, ModalGateway } from 'react-images'; // Used for popup modal picture carousel
import '../scss/app.scss';

class ItemCardThumbnail extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // this.props.thumbURL created in ItemCard.jsx while returning the ItemCardThumbnail div
    return <img src={this.props.thumbURL} width="80" height="165" />;
  }
}

// npm install react-images
// React Bootstrap Modals https://react-bootstrap.github.io/components/modal/

export default ItemCardThumbnail;
