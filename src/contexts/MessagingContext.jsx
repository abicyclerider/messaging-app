import { createContext, useState, useMemo } from 'react';
import { initialMessages, generateMessageId, getConversationId } from '../utils/mockData';

export const MessagingContext = createContext(null);

export function MessagingProvider({ children }) {
  const [messages, setMessages] = useState(initialMessages);

  // Compute conversations from messages
  const conversations = useMemo(() => {
    const conversationMap = new Map();

    messages.forEach((message) => {
      const { conversationId, senderId, receiverId, text, timestamp, read } = message;

      if (!conversationMap.has(conversationId)) {
        conversationMap.set(conversationId, {
          id: conversationId,
          participants: [senderId, receiverId],
          messages: [],
          lastMessage: null,
          unreadCount: 0,
        });
      }

      const conversation = conversationMap.get(conversationId);
      conversation.messages.push(message);

      // Update last message if this is newer
      if (!conversation.lastMessage || timestamp > conversation.lastMessage.timestamp) {
        conversation.lastMessage = { text, timestamp };
      }
    });

    // Convert to array and sort by most recent
    return Array.from(conversationMap.values()).sort((a, b) => {
      const aTime = a.lastMessage?.timestamp || 0;
      const bTime = b.lastMessage?.timestamp || 0;
      return bTime - aTime;
    });
  }, [messages]);

  const sendMessage = (senderId, receiverId, text) => {
    if (!text || !text.trim()) {
      return null;
    }

    const conversationId = getConversationId(senderId, receiverId);
    const newMessage = {
      id: generateMessageId(),
      conversationId,
      senderId,
      receiverId,
      text: text.trim(),
      timestamp: new Date(),
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const getConversation = (userId1, userId2) => {
    const conversationId = getConversationId(userId1, userId2);
    return conversations.find((conv) => conv.id === conversationId) || null;
  };

  const getMessages = (conversationId) => {
    return messages
      .filter((msg) => msg.conversationId === conversationId)
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const markAsRead = (conversationId, userId) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.conversationId === conversationId && msg.receiverId === userId && !msg.read) {
          return { ...msg, read: true };
        }
        return msg;
      })
    );
  };

  const getUnreadCount = (conversationId, userId) => {
    return messages.filter(
      (msg) => msg.conversationId === conversationId && msg.receiverId === userId && !msg.read
    ).length;
  };

  const value = {
    messages,
    conversations,
    sendMessage,
    getConversation,
    getMessages,
    markAsRead,
    getUnreadCount,
  };

  return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>;
}
