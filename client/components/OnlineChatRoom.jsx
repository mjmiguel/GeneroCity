import React from 'react'

export default function OnelineChatRoom() {
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
