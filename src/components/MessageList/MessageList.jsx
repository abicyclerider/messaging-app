import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import './MessageList.css';

export default function MessageList({ messages, currentUserId, users }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="message-list-empty">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  const getUserById = (userId) => {
    return users.find((u) => u.id === userId);
  };

  return (
    <div className="message-list" role="list">
      {messages.map((message) => {
        const isOwnMessage = message.senderId === currentUserId;
        const sender = getUserById(message.senderId);

        return (
          <div
            key={message.id}
            className={`message ${isOwnMessage ? 'message-sent' : 'message-received'}`}
          >
            {!isOwnMessage && (
              <img
                src={sender?.avatar}
                alt={`${sender?.username}'s avatar`}
                className="message-avatar"
              />
            )}
            <div className="message-content">
              {!isOwnMessage && <div className="message-sender">{sender?.username}</div>}
              <div className="message-bubble">
                <p className="message-text">{message.text}</p>
                <span className="message-time">
                  {format(new Date(message.timestamp), 'h:mm a')}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
