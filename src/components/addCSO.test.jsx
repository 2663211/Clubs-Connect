import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, BrowserRouter } from 'react-router-dom';
import AddCSO from './addCSO';
import SGOEntities from './SGOentities';
import userEvent from '@testing-library/user-event';

test('basic truthy test', () => {
  expect(true).toBe(true);
});

test('renders without crashing', () => {
  render(
    <BrowserRouter>
      <div>Test</div>
    </BrowserRouter>
  );
});

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
