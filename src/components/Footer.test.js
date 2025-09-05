import { BrowserRouter, Link, MemoryRouter } from 'react-router-dom';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';

import Footer from './Footer.js';

test('Renders without issues', async () => {
  render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
});
test('Renders all the links', async () => {
  render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
  const links = screen.getAllByRole('link');
  expect(links.length).toEqual(6);
});
