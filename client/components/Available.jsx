import React, {useState} from 'react'
import {Form, Button} from 'react-bootstrap';
import {Route, Switch, NavLink, Link} from 'react-router-dom';
import '../scss/style.css'
import './OnlineChatRoom'

export default function Available() {
  const [formData, setformData] = useState({username : '', room: ''});
  // const [room, setRoom] = useState('');
  const { username, room } = formData;
  const onChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  } 

  console.log(formData);
// class="w-50 p-3 d-flex justify-content-center"
  //  <div className="loginWrapper container loginAndSignUp">
  //    <div className="row" style={{ height: "15vh" }}></div>
  //    <div className="col" style={{ maxWidth: "90%" }}>
      //  <h3 style={{ textAlign: "center", margin: "30px", color: "$warmGray" }}>
      //    feeling generous?
      //  </h3>
  //      <NavLink to="/signup" className="btn btn-primary loginAndSignUpBtn">
  //        signup
  //      </NavLink>
  //      <NavLink to="/login" className="btn btn-primary loginAndSignUpBtn">
  //        login
  //      </NavLink>
  //    </div>
  //    <div className="row" style={{ height: "20vh" }}></div>
  //  </div>;
  return (
    <div class="d-flex mt-20 justify-content-center">
      <Form >
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>
            <h3
              style={{
                textAlign: "center",
                margin: "30px",
                color: "$warmGray",
              }}
            >
              Username
            </h3>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Choose your username"
            name="username"
            value={username}
            onChange={(e) => onChange(e)}
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>
            <h3
              style={{
                textAlign: "center",
                margin: "30px",
                color: "$warmGray",
              }}
            >
              Choose chatroom!
            </h3>
          </Form.Label>
          <Form.Control
            as="select"
            name="room"
            value={room}
            onChange={(e) => onChange(e)}
          >
            <option value="All">All Categories</option>
            <option value="Appliances">Appliances</option>
            <option value="Plants">Plants</option>
            <option value="Sports">Sports</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </Form.Control>
        </Form.Group>
        <Link
          to={`onlinechat/username:${username}-room:${room}`}
          props={username}
        >
          <Button variant="outline-primary"> Go to your room </Button>
        </Link>
      </Form>
    </div>
  );
}
