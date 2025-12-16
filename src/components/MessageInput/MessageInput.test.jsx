import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessageInput from './MessageInput';

describe('MessageInput', () => {
  it('should render input and button', () => {
    render(<MessageInput onSend={vi.fn()} />);

    expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('should call onSend when button is clicked', async () => {
    const user = userEvent.setup();
    const handleSend = vi.fn();
    render(<MessageInput onSend={handleSend} />);

    const input = screen.getByRole('textbox', { name: /message/i });
    await user.type(input, 'Hello world');

    const button = screen.getByRole('button', { name: /send/i });
    await user.click(button);

    expect(handleSend).toHaveBeenCalledWith('Hello world');
  });

  it('should clear input after sending', async () => {
    const user = userEvent.setup();
    const handleSend = vi.fn();
    render(<MessageInput onSend={handleSend} />);

    const input = screen.getByRole('textbox', { name: /message/i });
    await user.type(input, 'Hello world');
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(input).toHaveValue('');
  });

  it('should send message on Enter key', async () => {
    const user = userEvent.setup();
    const handleSend = vi.fn();
    render(<MessageInput onSend={handleSend} />);

    const input = screen.getByRole('textbox', { name: /message/i });
    await user.type(input, 'Hello world{Enter}');

    expect(handleSend).toHaveBeenCalledWith('Hello world');
    expect(input).toHaveValue('');
  });

  it('should not send empty message', async () => {
    const user = userEvent.setup();
    const handleSend = vi.fn();
    render(<MessageInput onSend={handleSend} />);

    const button = screen.getByRole('button', { name: /send/i });
    await user.click(button);

    expect(handleSend).not.toHaveBeenCalled();
  });

  it('should not send message with only whitespace', async () => {
    const user = userEvent.setup();
    const handleSend = vi.fn();
    render(<MessageInput onSend={handleSend} />);

    const input = screen.getByRole('textbox', { name: /message/i });
    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(handleSend).not.toHaveBeenCalled();
  });
});
