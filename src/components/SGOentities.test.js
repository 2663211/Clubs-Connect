import { BrowserRouter, Link, MemoryRouter } from 'react-router-dom';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';

import SGODashboard from './SGOentities.js';

afterEach(() => {
  cleanup();
});

test('All navigation buttons are rendered', async () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
  const Dash_button = screen.getByText(/dashboard/i);
  const Entity_button = screen.getByText('Entities');
  const profile_button = screen.getByText('Profile');
  const logout_button = screen.getByText('Logout');
  expect(logout_button).toBeInTheDocument();
  expect(profile_button).toBeInTheDocument();
  expect(Entity_button).toBeInTheDocument();
  expect(Dash_button).toBeInTheDocument();
});
test('Add entities button', () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
  const Entity_button = screen.getByText(/create entity/i);
  expect(Entity_button).toBeInTheDocument();
});
