import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('should render without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // Should render the home page by default (not authenticated)
    expect(screen.getByRole('heading', { name: /welcome to messaging app/i })).toBeInTheDocument();
  });
});
