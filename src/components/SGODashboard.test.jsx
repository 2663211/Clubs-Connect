import { BrowserRouter, MemoryRouter, Link, Routes, Route } from 'react-router-dom';
import { render, screen, cleanup, within, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SGODashboard from './SGODashboard.js';
import SGOEntities from './SGOentities.js';
import App from '../App.jsx';
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
  const Annoucement_button = screen.getByText('Announcements');
  const Entity_button = screen.getByText('Entities');
  const profile_button = screen.getByText('Profile');
  const logout_button = screen.getByText('Logout');
  expect(logout_button).toBeInTheDocument();
  expect(profile_button).toBeInTheDocument();
  expect(Entity_button).toBeInTheDocument();
  expect(Dash_button).toBeInTheDocument();
  expect(Annoucement_button).toBeInTheDocument();
});

test('User management heading rendering', () => {
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
  const loginButton = screen.getByRole('button', { name: /sign in with google/i });
  expect(loginButton).toBeInTheDocument();
});

test('Dashboard button navigates to SGODashboard page', async () => {
  render(
    <MemoryRouter initialEntries={['/entities/sgo']}>
      <Routes>
        <Route path="/entities/sgo" element={<SGOEntities />} />
        <Route path="/dashboard/sgo" element={<SGODashboard />} />
      </Routes>
    </MemoryRouter>
  );

  const user = userEvent.setup();
  // Click the Dashboard button
  const dashboardButton = screen.getByRole('button', { name: /dashboard/i });
  await user.click(dashboardButton);
  // Assert that SGODashboard page loaded by checking "User Management" heading
  const userManagementHeading = await screen.findByRole('heading', { name: /user management/i });
  expect(userManagementHeading).toBeInTheDocument();
});

test('Entities button navigates to SGOEntities page', async () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/dashboard" element={<SGODashboard />} />
        {/* match the actual path here */}
        <Route path="/entities/sgo" element={<SGOEntities />} />
      </Routes>
    </MemoryRouter>
  );
  const user = userEvent.setup();

  const entitiesButton = screen.getByText('Entities');
  await user.click(entitiesButton);
  // Look for "Create Entity" button in SGOEntities page
  const createEntityButton = await screen.findByRole('button', { name: /create entity/i });
  expect(createEntityButton).toBeInTheDocument();
});
