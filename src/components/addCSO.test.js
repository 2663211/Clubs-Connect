import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AddCSO from './addCSO';
import SGOEntities from './SGOentities';
import userEvent from '@testing-library/user-event';

test('renders AddCSO heading', () => {
  render(
    <MemoryRouter initialEntries={['/entities/add']}>
      <Routes>
        <Route path="/entities/add" element={<AddCSO />} />
      </Routes>
    </MemoryRouter>
  );

  const heading = screen.getByRole('heading', { name: /add a club, society, or organization/i });
  expect(heading).toBeInTheDocument();
});

test('renders all CSO form fields', () => {
  render(
    <MemoryRouter>
      <AddCSO />
    </MemoryRouter>
  );

  expect(screen.getByLabelText(/CSO Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Cluster/i)).toBeInTheDocument();

  expect(screen.getByText(/Subscription Required/i)).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: /no/i })).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: /yes/i })).toBeInTheDocument();

  expect(screen.getByText(/Executive\(s\)/i)).toBeInTheDocument();

  expect(screen.getByRole('button', { name: /add cso/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
});

test('Cancel button navigates back to SGOEntities page', async () => {
  render(
    <MemoryRouter initialEntries={['/entities/add']}>
      <Routes>
        <Route path="/entities/add" element={<AddCSO />} />
        <Route path="/entities/sgo" element={<SGOEntities />} />
      </Routes>
    </MemoryRouter>
  );

  const user = userEvent.setup();

  const cancelButton = screen.getByRole('button', { name: /cancel/i });
  await user.click(cancelButton);

  const createButton = await screen.findByRole('button', { name: /create entity/i });
  expect(createButton).toBeInTheDocument();
});
