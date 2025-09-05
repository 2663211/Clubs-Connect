import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SGODashboard from './SGODashboard.js';
import App from '../App.js';

afterEach(() => {
  cleanup();
});

test('All navigation buttons are rendered', async () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
  const Dash_button = screen.getByText('Dashboard');
  const Entity_button = screen.getByText('Entities');
  const profile_button = screen.getByText('Profile');
  const logout_button = screen.getByText('Logout');
  expect(logout_button).toBeInTheDocument();
  expect(profile_button).toBeInTheDocument();
  expect(Entity_button).toBeInTheDocument();
  expect(Dash_button).toBeInTheDocument();
});
test('User management rendering', () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
  const User_management = screen.getByText(/user management/i);
  expect(User_management).toBeInTheDocument();
});
