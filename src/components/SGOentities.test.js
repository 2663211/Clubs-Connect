import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SGODashboard from './SGODashboard';
import SGOEntities from './SGOentities';
import Auth from './Auth';

afterEach(() => {
  cleanup();
});

describe('SGOEntities page tests', () => {
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

    // Check Auth page loaded by looking for Login button
    const loginButton = await screen.findByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });
});
