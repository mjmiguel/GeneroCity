import React, {useEffect, useState} from 'react'
import io from "socket.io-client";
const ENDPOINT = "localhost:3000";

export default function OnelineChatRoom(props) {
  
  const location = window.location.pathname;
  const [username, room] = location.split('/')[2].split('-').map(e => e.split(':')[1]);

  useEffect( () => {
      const chatForm = document.getElementById('chat-form');
      const chatMessages = document.querySelector('.chat-messages');
      const roomName = document.getElementById('room-name');
      const userList = document.getElementById('users');

      // Get username and room from URL
      const socket = io(ENDPOINT);

      // Join chatroom
      socket.emit('joinRoom', { username, room });

      // Get room and users
      socket.on('roomUsers', ({ room, users }) => {
        outputRoomName(room);
        outputUsers(users);
      });

      // Message from server
      socket.on('message', message => {
        console.log(message);
        outputMessage(message);

        // Scroll down
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });

      // Message submit
      chatForm.addEventListener('submit', e => {
        e.preventDefault();

        // Get message text
        const msg = e.target.elements.msg.value;

        // Emit message to server
        socket.emit('chatMessage', msg);

        // Clear input
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();
      });

      // Output message to DOM
      function outputMessage(message) {
        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
          ${message.text}
        </p>`;
        document.querySelector('.chat-messages').appendChild(div);
      }

      // Add room name to DOM
      function outputRoomName(room) {
        roomName.innerText = room;
      }

      // Add users to DOM
      function outputUsers(users) {
        userList.innerHTML = `
          ${users.map(user => `<li>${user.username}</li>`).join('')}
        `;
      }
    }
  )
  return (
    <div class="chat-container">
      <header class="chat-header">
        <h1>
          <i class="fas fa-smile"></i> Generosity Chat Room
        </h1>
        <a href="index.html" class="btn">
          Leave Room
        </a>
      </header>
      <main class="chat-main">
        <div class="chat-sidebar">
          <h3>
            <i class="fas fa-comments"></i> Room Name:
          </h3>
          <h2 id="room-name"></h2>
          <h3>
            <i class="fas fa-users"></i> Users
          </h3>
          <ul id="users"></ul>
        </div>
        <div class="chat-messages"></div>
        <div class="message"></div>
      </main>
      <div class="chat-form-container">
        <form id="chat-form">
          <input
            id="msg"
            type="text"
            placeholder="Enter Message"
            required
            autoComplete="off"
          />
            <button class="btn">
              <i class="fas fa-paper-plane"></i> Send
            </button>
        </form>
      </div>
    </div>
  );
}
