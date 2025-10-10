import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import SGODashboard from './SGODashboard';
import SGOEntities from './SGOentities';
import Auth from './Auth';
import AddCSO from './addCSO';

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

test('renders Create Entity button', () => {
  render(
    <MemoryRouter initialEntries={['/entities/sgo']}>
      <Routes>
        <Route path="/entities/sgo" element={<SGOEntities />} />
      </Routes>
    </MemoryRouter>
  );

  const createEntityButton = screen.getByRole('button', { name: /create entity/i });
  expect(createEntityButton).toBeInTheDocument();
});

test('navigates from dashboard to entities page', async () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/dashboard" element={<SGODashboard />} />
        <Route path="/entities/sgo" element={<SGOEntities />} />
      </Routes>
    </MemoryRouter>
  );

  const user = userEvent.setup();

  // Click the Entities button in dashboard
  const entitiesButton = screen.getByRole('button', { name: /entities/i });
  await user.click(entitiesButton);

  // Assert that SGOEntities page loaded
  const createEntityButton = await screen.findByRole('button', { name: /create entity/i });
  expect(createEntityButton).toBeInTheDocument();
});

test('logout navigates to Auth page', async () => {
  render(
    <MemoryRouter initialEntries={['/entities/sgo']}>
      <Routes>
        <Route path="/entities/sgo" element={<SGOEntities />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </MemoryRouter>
  );

  const user = userEvent.setup();

  const logoutButton = screen.getByRole('button', { name: /logout/i });
  await user.click(logoutButton);

  const loginButton = await screen.findByRole('button', { name: /login/i });
  expect(loginButton).toBeInTheDocument();
});

test('renders create entity button', () => {
  render(
    <MemoryRouter>
      <SGOEntities />
    </MemoryRouter>
  );

  const createEntityButton = screen.getByRole('button', { name: /create entity/i });
  expect(createEntityButton).toBeInTheDocument();
});

test('clicking create entity navigates to AddCSO page', async () => {
  render(
    <MemoryRouter initialEntries={['/entities/sgo']}>
      <Routes>
        <Route path="/entities/sgo" element={<SGOEntities />} />
        <Route path="/entities/add" element={<AddCSO />} />
      </Routes>
    </MemoryRouter>
  );
  const user = userEvent.setup();
  const createButton = screen.getByRole('button', { name: /create entity/i });
  await user.click(createButton);
  const heading = await screen.findByRole('heading', {
    name: /add a club, society, or organization/i,
  });
  expect(heading).toBeInTheDocument();
});
