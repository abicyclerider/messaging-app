import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useMessages } from '../../hooks/useMessages';
import { initialUsers } from '../../utils/mockData';
import { formatDistanceToNow } from 'date-fns';
import './ConversationList.css';

export default function ConversationList() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const { conversations, getUnreadCount } = useMessages();

  // Get the other participant in the conversation
  const getOtherParticipant = (conversation) => {
    const otherUserId = conversation.participants.find((id) => id !== currentUser.id);
    return initialUsers.find((user) => user.id === otherUserId);
  };

  // Handle conversation click
  const handleConversationClick = (conversation) => {
    const otherUser = getOtherParticipant(conversation);
    if (otherUser) {
      navigate(`/chat/${otherUser.id}`);
    }
  };

  // Get conversations for the current user
  const userConversations = conversations.filter((conv) =>
    conv.participants.includes(currentUser.id)
  );

  return (
    <div className="conversation-list">
      <div className="conversation-list-header">
        <h2>Messages</h2>
      </div>

      <div className="conversation-list-items">
        {userConversations.length === 0 ? (
          <div className="conversation-list-empty">
            <p>No conversations yet</p>
          </div>
        ) : (
          userConversations.map((conversation) => {
            const otherUser = getOtherParticipant(conversation);
            const unreadCount = getUnreadCount(conversation.id, currentUser.id);
            const isActive = userId && parseInt(userId) === otherUser?.id;

            return (
              <div
                key={conversation.id}
                className={`conversation-item ${isActive ? 'active' : ''}`}
                onClick={() => handleConversationClick(conversation)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleConversationClick(conversation);
                  }
                }}
              >
                <img
                  src={otherUser?.avatar}
                  alt={`${otherUser?.username}'s avatar`}
                  className="conversation-avatar"
                />
                <div className="conversation-details">
                  <div className="conversation-header">
                    <span className="conversation-username">{otherUser?.username}</span>
                    <span className="conversation-time">
                      {conversation.lastMessage &&
                        formatDistanceToNow(conversation.lastMessage.timestamp, {
                          addSuffix: true,
                        })}
                    </span>
                  </div>
                  <div className="conversation-preview">
                    <span className="conversation-last-message">
                      {conversation.lastMessage?.text || 'No messages yet'}
                    </span>
                    {unreadCount > 0 && (
                      <span className="conversation-unread-badge">{unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
