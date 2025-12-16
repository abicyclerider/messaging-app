import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthForm from './AuthForm';

describe('AuthForm', () => {
  it('should render login form correctly', () => {
    render(<AuthForm mode="login" onSubmit={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    // Email field should not be present in login mode
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
  });

  it('should render signup form correctly', () => {
    render(<AuthForm mode="signup" onSubmit={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should show error when username is empty', async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" onSubmit={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: /log in/i });
    await user.click(submitButton);

    expect(screen.getByRole('alert')).toHaveTextContent(/username is required/i);
  });

  it('should show error when password is empty', async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');

    const submitButton = screen.getByRole('button', { name: /log in/i });
    await user.click(submitButton);

    expect(screen.getByRole('alert')).toHaveTextContent(/password is required/i);
  });

  it('should show error when password is too short', async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), '12345');

    const submitButton = screen.getByRole('button', { name: /log in/i });
    await user.click(submitButton);

    expect(screen.getByRole('alert')).toHaveTextContent(/at least 6 characters/i);
  });

  it('should show error when email is empty in signup mode', async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="signup" onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    expect(screen.getByRole('alert')).toHaveTextContent(/email is required/i);
  });

  it('should call onSubmit with correct data in login mode', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<AuthForm mode="login" onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      email: '',
      password: 'password123',
    });
  });

  it('should call onSubmit with correct data in signup mode', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<AuthForm mode="signup" onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/username/i), 'newuser');
    await user.type(screen.getByLabelText(/email/i), 'new@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      username: 'newuser',
      email: 'new@test.com',
      password: 'password123',
    });
  });

  it('should clear error when user types', async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" onSubmit={vi.fn()} />);

    // Trigger error
    await user.click(screen.getByRole('button', { name: /log in/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Start typing
    await user.type(screen.getByLabelText(/username/i), 't');

    // Error should be cleared
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
