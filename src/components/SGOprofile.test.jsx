import { BrowserRouter, MemoryRouter, Link, Routes, Route } from 'react-router-dom';
import { render, screen, cleanup, within, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SGODashboard from './SGODashboard';
import SGOEntities from './SGOentities';
import SGOProfile from './SGOprofile.js';
import App from '../App.js';
import Auth from './Auth';
import { supabase } from '../supabaseClient';

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

afterEach(() => {
  cleanup();
  mockedNavigate.mockReset();
});

test('All navigation buttons are rendered', () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );

  expect(screen.getByText('Dashboard')).toBeInTheDocument();
  expect(screen.getByText('Announcements')).toBeInTheDocument();
  expect(screen.getByText('Entities')).toBeInTheDocument();
  expect(screen.getByText('Profile')).toBeInTheDocument();
  expect(screen.getByText('Logout')).toBeInTheDocument();
});

test('Logout button navigates to /auth', async () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
  const logoutButton = screen.getByText('Logout');
  await userEvent.click(logoutButton);
  expect(mockedNavigate).toHaveBeenCalledWith('/auth');
});

test('Dashboard button navigates to /dashboard/sgo', async () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
  const dashboardButton = screen.getByText('Dashboard');
  await userEvent.click(dashboardButton);
  expect(mockedNavigate).toHaveBeenCalledWith('/dashboard/sgo');
});

test('Announcements button navigates to /announcements/sgo', async () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
  const announcementsButton = screen.getByText('Announcements');
  await userEvent.click(announcementsButton);
  expect(mockedNavigate).toHaveBeenCalledWith('/announcements/sgo');
});

test('Entities button navigates to /entities/sgo', async () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
  const entitiesButton = screen.getByText('Entities');
  await userEvent.click(entitiesButton);
  expect(mockedNavigate).toHaveBeenCalledWith('/entities/sgo');
});

test('Profile button navigates to /profile/sgo', async () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
  const profileButton = screen.getByText('Profile');
  await userEvent.click(profileButton);
  expect(mockedNavigate).toHaveBeenCalledWith('/profile/sgo');
});
