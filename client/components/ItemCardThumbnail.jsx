import React, { Component } from 'react';
//import Carousel, { Modal, ModalGateway } from 'react-images'; // Used for popup modal picture carousel
import '../scss/app.scss';

// New for popup
import ReactDOM from 'react-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
// import Lightbox from 'react-awesome-lightbox';
// import 'react-awesome-lightbox/build/style.css';

/*
 *
 */

class ItemCardThumbnail extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <img src={this.props.thumbURL} width="80" />;
  }
}

// npm install react-images
// React Bootstrap Modals https://react-bootstrap.github.io/components/modal/

export default ItemCardThumbnail;

// const images = [
//   {
//     source: 'shorturl.at/gQRTZ',
//   },
//   {
//     source: 'shorturl.at/gQRTZ',
//   },
// ];

// class ItemCardThumbnail extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       modalIsOpen: false,
//     };
//   }

//   toggleModal = () => {
//     this.setState((state) => ({ modalIsOpen: !state.modalIsOpen }));
//   };

//   render() {
//     const { modalIsOpen } = this.state;

//     return (
//       <ModalGateway>
//         {modalIsOpen ? (
//           <Modal onClose={this.toggleModal}>
//             <Carousel views={this.props.thumbURL} />
//           </Modal>
//         ) : null}
//       </ModalGateway>
//     );
//return <img src={this.props.thumbURL} width="82.8" />;
//   }
// }

/*




class ItemCardThumbnail extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <img src={this.props.thumbURL} width="80" />;
  }
}

// npm install react-images
// React Bootstrap Modals https://react-bootstrap.github.io/components/modal/

export default ItemCardThumbnail;

*/
