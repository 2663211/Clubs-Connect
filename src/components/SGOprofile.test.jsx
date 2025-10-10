import { BrowserRouter, MemoryRouter, Link, Routes, Route } from 'react-router-dom';
import { render, screen, cleanup, within, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SGODashboard from './SGODashboard.js';
import SGOEntities from './SGOentities.js';
import SGOProfile from './SGOprofile.js';
import App from '../App.js';
import Auth from './Auth';
import { supabase } from '../supabaseClient';

afterEach(() => {
  cleanup();
});

test('All navigation buttons are rendered', () => {
  render(
    <MemoryRouter initialEntries={['/dashboard/sgo']}>
      <SGODashboard />
    </MemoryRouter>
  );

  const Dash_button = screen.getByText('Dashboard');
  const Annoucement_button = screen.getByText('Announcements');
  const Entity_button = screen.getByText('Entities');
  const profile_button = screen.getByText('Profile');
  const logout_button = screen.getByText('Logout');

  expect(Dash_button).toBeInTheDocument();
  expect(Annoucement_button).toBeInTheDocument();
  expect(Entity_button).toBeInTheDocument();
  expect(profile_button).toBeInTheDocument();
  expect(logout_button).toBeInTheDocument();
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
  const logoutButton = screen.getByText('Logout');
  await userEvent.click(logoutButton);

  const loginButton = screen.getByRole('button', { name: /login/i });
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
  const dashboardButton = screen.getByRole('button', { name: /dashboard/i });
  await user.click(dashboardButton);

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

  const createEntityButton = await screen.findByRole('button', { name: /create entity/i });
  expect(createEntityButton).toBeInTheDocument();
});
