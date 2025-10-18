import { BrowserRouter } from 'react-router-dom';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SGODashboard from './SGODashboard';

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

jest.mock('../supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() =>
          Promise.resolve({
            data: [
              { id: 1, full_name: 'Alice Johnson', role: 'student', avatar_url: null },
              { id: 2, full_name: 'Bob Smith', role: 'exec', avatar_url: null },
              { id: 3, full_name: 'Charlie Adams', role: 'student', avatar_url: null },
            ],
            error: null,
          })
        ),
      })),
    })),
    auth: {
      signOut: jest.fn(() => Promise.resolve({ error: null })),
    },
  },
}));

afterEach(() => {
  cleanup();
  mockedNavigate.mockReset();
});

test('renders all navigation buttons', () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );

  expect(screen.getByText('Dashboard')).toBeInTheDocument();
  expect(screen.getByText('Announcements')).toBeInTheDocument();
  expect(screen.getByText('CSOs')).toBeInTheDocument();
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

  const entitiesButton = screen.getByText('CSOs');
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

test('User management heading renders correctly', () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );

  const userManagement = screen.getByText(/user management/i);
  expect(userManagement).toBeInTheDocument();
});

test('renders search input', () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );

  // Check if the search input is in the document
  const searchInput = screen.getByPlaceholderText(/search user/i);
  expect(searchInput).toBeInTheDocument();

  // search icon is rendered
  const searchIcon = screen.getByAltText(/search/i);
  expect(searchIcon).toBeInTheDocument();
});

test('allows typing in the search input', async () => {
  const user = userEvent.setup();

  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );

  // Find the input by its placeholder text
  const searchInput = screen.getByPlaceholderText(/search user/i);

  // Simulate typing
  await user.type(searchInput, 'Alice');

  // Assert that the input's value updates correctly
  expect(searchInput).toHaveValue('Alice');
});

test('renders a list of users', async () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );

  const userNames = ['Alice Johnson', 'Bob Smith', 'Charlie Adams'];

  for (const name of userNames) {
    const userElement = await screen.findByText(name);
    expect(userElement).toBeInTheDocument();
  }
});
