import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useMessages } from '../../hooks/useMessages';
import { initialUsers } from '../../utils/mockData';
import { getConversationId } from '../../utils/mockData';
import ConversationList from '../../components/ConversationList/ConversationList';
import MessageList from '../../components/MessageList/MessageList';
import MessageInput from '../../components/MessageInput/MessageInput';
import './Chat.css';

export default function Chat() {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const { sendMessage, getMessages, markAsRead } = useMessages();

  const selectedUserId = userId ? parseInt(userId) : null;
  const selectedUser = selectedUserId
    ? initialUsers.find((u) => u.id === selectedUserId)
    : null;

  // Get conversation ID and messages for the selected user
  const conversationId = selectedUserId
    ? getConversationId(currentUser.id, selectedUserId)
    : null;

  const messages = conversationId ? getMessages(conversationId) : [];

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (conversationId) {
      markAsRead(conversationId, currentUser.id);
    }
  }, [conversationId, currentUser.id, markAsRead]);

  // Handle sending a message
  const handleSendMessage = (text) => {
    if (selectedUserId) {
      sendMessage(currentUser.id, selectedUserId, text);
    }
  };

  return (
    <div className="chat-page">
      <ConversationList />

      <div className="chat-main">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <img
                src={selectedUser.avatar}
                alt={`${selectedUser.username}'s avatar`}
                className="chat-header-avatar"
              />
              <div className="chat-header-info">
                <h2 className="chat-header-username">{selectedUser.username}</h2>
                <span className="chat-header-status">{selectedUser.status}</span>
              </div>
            </div>

            <MessageList
              messages={messages}
              currentUserId={currentUser.id}
              users={initialUsers}
            />

            <MessageInput onSend={handleSendMessage} />
          </>
        ) : (
          <div className="chat-empty">
            <div className="chat-empty-content">
              <h2>Select a conversation</h2>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
