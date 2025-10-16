// AddMembersPage.test.js
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import AddMembersPage from './AddMembers';
import { supabase } from '../supabaseClient';

jest.mock('../supabaseClient');

beforeEach(() => {
  supabase.from.mockImplementation((table) => {
    if (table === 'cso') {
      return {
        select: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({
                data: { id: '1', name: 'Tech Club' },
                error: null,
              }),
          }),
        }),
      };
    }

    if (table === 'cso_members') {
      return {
        select: () => ({
          eq: () =>
            Promise.resolve({
              data: [
                {
                  member_id: 'user-123',
                  profiles: { id: 'user-123', full_name: 'Jane Doe', role: 'Member' },
                },
              ],
              error: null,
            }),
        }),
        delete: jest.fn(() => ({
          eq: () => ({
            eq: () => Promise.resolve({ data: [{}], error: null }),
          }),
        })),
      };
    }

    if (table === 'profiles') {
      return {
        select: () => ({
          order: () =>
            Promise.resolve({
              data: [{ id: 'user-123', full_name: 'Jane Doe', role: 'Member' }],
              error: null,
            }),
        }),
      };
    }

    return {
      select: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    };
  });
});

afterEach(() => {
  jest.clearAllMocks();
});


test('renders Add Members heading', async () => {
  render(
    <MemoryRouter initialEntries={['/add-members/1']}>
      <Routes>
        <Route path="/add-members/:id" element={<AddMembersPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Use findByRole which waits for async rendering
  const heading = await screen.findByRole('heading', { name: /add members to/i });
  expect(heading).toBeInTheDocument();
});

test('clicking Back button navigates to Entities page', async () => {
  const user = userEvent.setup();

  // Simulate a navigation history: Entities page → Add Members page
  render(
    <MemoryRouter initialEntries={['/entities/sgo', '/add-members/1']} initialIndex={1}>
      <Routes>
        {/* Mock your Entities page with the actual Create CSO button */}
        <Route path="/entities/sgo" element={<button>Create CSO</button>} />

        <Route path="/add-members/:id" element={<AddMembersPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Wait for Add Members heading to ensure the page fully loaded
  await screen.findByRole('heading', { name: /add members to/i });

  // Click the Back button
  const backButton = screen.getByRole('button', { name: /back/i });
  await user.click(backButton);

  // Verify the Create CSO button from the Entities page appears
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /create cso/i })).toBeInTheDocument();
  });
});

test('renders Current Members and All Users sections', async () => {
  render(
    <MemoryRouter initialEntries={['/add-members/1']}>
      <Routes>
        <Route path="/add-members/:id" element={<AddMembersPage />} />
      </Routes>
    </MemoryRouter>
  );

  await screen.findByRole('heading', { name: /add members to/i });

  expect(screen.getByText(/current members/i)).toBeInTheDocument();
  expect(screen.getByText(/all users/i)).toBeInTheDocument();
});

test('shows existing members fetched from supabase', async () => {
  supabase.from.mockImplementation((table) => {
    if (table === 'cso') {
      return {
        select: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({
                data: { id: '1', name: 'Tech Club' },
                error: null,
              }),
          }),
        }),
      };
    }

    if (table === 'cso_members') {
      return {
        select: () => ({
          eq: () =>
            Promise.resolve({
              data: [
                { id: 1, member_id: 'user-123' },
              ],
              error: null,
            }),
        }),
      };
    }

    if (table === 'profiles') {
      return {
        select: () => ({
          order: () =>
            Promise.resolve({
              data: [
                { id: 'user-123', full_name: 'Jane Doe' },
              ],
              error: null,
            }),
        }),
      };
    }

    return { select: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }) };
  });

  render(
    <MemoryRouter initialEntries={['/add-members/1']}>
      <Routes>
        <Route path="/add-members/:id" element={<AddMembersPage />} />
      </Routes>
    </MemoryRouter>
  );

  const member = await screen.findByText('Jane Doe');
  expect(member).toBeInTheDocument();
});

test('adds a user when Add button is clicked', async () => {
  const user = userEvent.setup();

  const insertMock = jest.fn(() => Promise.resolve({ data: [{}], error: null }));

  supabase.from.mockImplementation((table) => {
    if (table === 'cso') {
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: { id: '1', name: 'Tech Club' }, error: null }),
          }),
        }),
      };
    }

    if (table === 'cso_members') {
      return {
        select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
        insert: insertMock, // ✅ return the spy here
      };
    }

    if (table === 'profiles') {
      return {
        select: () => ({
          order: () =>
            Promise.resolve({
              data: [{ id: 'user-123', full_name: 'Jane Doe' }],
              error: null,
            }),
        }),
      };
    }

    return { select: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }) };
  });

  render(
    <MemoryRouter initialEntries={['/add-members/1']}>
      <Routes>
        <Route path="/add-members/:id" element={<AddMembersPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Click the "Add to CSO" button for the user
  const addButton = await screen.findByRole('button', { name: /add to cso/i });
  await user.click(addButton);

  // Click the confirmation "Yes, Add" button in the modal
  const confirmButton = await screen.findByRole('button', { name: /yes, add/i });
  await user.click(confirmButton);

  // Wait for insert to be called
  await waitFor(() => {
    expect(insertMock).toHaveBeenCalled();
  });
});

test('removes a user when Remove button is clicked', async () => {
  const user = userEvent.setup();

  const deleteMock = jest.fn(() => Promise.resolve({ data: [{}], error: null }));

  // Mock supabase
  supabase.from.mockImplementation((table) => {
    if (table === 'cso') {
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: { id: '1', name: 'Tech Club' }, error: null }),
          }),
        }),
      };
    }

    if (table === 'cso_members') {
      return {
        select: () =>
          Promise.resolve({
            data: [
              {
                student_number: 'user-123',
                profiles: { id: 'user-123', full_name: 'Jane Doe', role: 'Member' },
              },
            ],
            error: null,
          }),
        delete: deleteMock, // ✅ spy on delete
      };
    }

    if (table === 'profiles') {
      return {
        select: () => ({
          order: () =>
            Promise.resolve({
              data: [
                { id: 'user-123', full_name: 'Jane Doe', role: 'Member' },
              ],
              error: null,
            }),
        }),
      };
    }

    return { select: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }) };
  });

  render(
    <MemoryRouter initialEntries={['/add-members/1']}>
      <Routes>
        <Route path="/add-members/:id" element={<AddMembersPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Wait for the member to appear
  const memberName = await screen.findByText('Jane Doe');
  expect(memberName).toBeInTheDocument();

  // Click "Remove from CSO" button
  const removeButton = await screen.findByRole('button', { name: /remove from cso/i });
  await user.click(removeButton);

  // Click the confirmation "Yes, Remove" button in the modal
  const confirmButton = await screen.findByRole('button', { name: /yes, remove/i });
  await user.click(confirmButton);

  // Wait for delete to be called
  await waitFor(() => {
    expect(deleteMock).toHaveBeenCalled();
  });
});
