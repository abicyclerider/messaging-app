import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessageList from './MessageList';

describe('MessageList', () => {
  const mockUsers = [
    { id: 1, username: 'alice', avatar: 'https://example.com/alice.jpg' },
    { id: 2, username: 'bob', avatar: 'https://example.com/bob.jpg' },
  ];

  const mockMessages = [
    {
      id: 'msg1',
      senderId: 1,
      receiverId: 2,
      text: 'Hello Bob!',
      timestamp: new Date('2025-12-15T09:00:00'),
    },
    {
      id: 'msg2',
      senderId: 2,
      receiverId: 1,
      text: 'Hi Alice!',
      timestamp: new Date('2025-12-15T09:05:00'),
    },
  ];

  it('should render messages correctly', () => {
    render(<MessageList messages={mockMessages} currentUserId={1} users={mockUsers} />);

    expect(screen.getByText('Hello Bob!')).toBeInTheDocument();
    expect(screen.getByText('Hi Alice!')).toBeInTheDocument();
  });

  it('should display empty state when no messages', () => {
    render(<MessageList messages={[]} currentUserId={1} users={mockUsers} />);

    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
  });

  it('should show sender username for received messages', () => {
    render(<MessageList messages={mockMessages} currentUserId={1} users={mockUsers} />);

    // Should show bob's username for the message he sent
    expect(screen.getByText('bob')).toBeInTheDocument();
    // Should not show alice's username for her own message
    expect(screen.queryByText('alice')).not.toBeInTheDocument();
  });

  it('should apply correct CSS classes for sent and received messages', () => {
    const { container } = render(
      <MessageList messages={mockMessages} currentUserId={1} users={mockUsers} />
    );

    const messages = container.querySelectorAll('.message');
    expect(messages[0]).toHaveClass('message-sent'); // Alice's message
    expect(messages[1]).toHaveClass('message-received'); // Bob's message
  });
});
