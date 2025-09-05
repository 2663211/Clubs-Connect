import { BrowserRouter, Link, MemoryRouter } from 'react-router-dom';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';

import SGODashboard from './CSO.js';

afterEach(() => {
  cleanup();
});

test('basic truthy test', () => {
  expect(true).toBe(true);
});
test('renders without crashing', () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
});
test('All buttons are rendered', async () => {
  render(
    <BrowserRouter>
      <SGODashboard />
    </BrowserRouter>
  );
  const Add_cso = screen.getByText(/add cso/i);
  const back = screen.getByText(/back/i);
  expect(back).toBeInTheDocument();
  expect(Add_cso).toBeInTheDocument();
});
