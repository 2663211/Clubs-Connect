import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SGODashboard from './SGODashboard.js';
import SGOEntities from './SGOentities.js';
import App from '../App.js';
import Auth from './Auth';
import { supabase } from '../supabaseClient';

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

test('Logout button navigates to Auth page', async () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/dashboard" element={<SGODashboard />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </MemoryRouter>
  );

  //to locate button with this text
  const logoutButton = screen.getByText('Logout');
  await userEvent.click(logoutButton);

  // Check that the Auth page loaded by looking for the Login submit button
  const loginButton = screen.getByRole('button', { name: /login/i });
  expect(loginButton).toBeInTheDocument();
});

test('Entities button navigates to SGOEntities page', async () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/dashboard" element={<SGODashboard />} />
        <Route path="/entities" element={<SGOEntities />} />
      </Routes>
    </MemoryRouter>
  );

  const user = userEvent.setup();

  // Find the Entities button and click it
  const entitiesButton = screen.getByText('Entities');
  await user.click(entitiesButton);

  // Check that SGOEntities page loaded
  // Replace /entities page heading with something unique from your SGOEntities page
  const entitiesHeading = screen.getByRole('heading', { name: /entities/i });
  expect(entitiesHeading).toBeInTheDocument();
});
