import { useContext } from 'react';
import { MessagingContext } from '../contexts/MessagingContext';

export const useMessages = () => {
  const context = useContext(MessagingContext);

  if (!context) {
    throw new Error('useMessages must be used within a MessagingProvider');
  }

  return context;
};
