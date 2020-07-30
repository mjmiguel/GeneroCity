import React, {useState} from 'react'
import {Form, Button} from 'react-bootstrap';
import {Route, Switch, NavLink, Link} from 'react-router-dom';
import '../scss/style.css'
import './OnlineChatRoom'
import OnelineChatRoom from './OnlineChatRoom';
export default function Available() {
  const [formData, setformData] = useState({username : '', room: ''});
  // const [room, setRoom] = useState('');
  const { username, room } = formData;
  const onChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  } 

  console.log(formData);

  return (
    <div>
      <Form>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Temporary Username"
            name="username"
            value={username}
            onChange={(e) => onChange(e)}
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label> Choose chatroom! </Form.Label>
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
        <Link to="onlinechat" props={username}> 
          <Button variant="outline-primary"> Submit </Button>
        </Link>
      </Form>
    </div>
  );
}
