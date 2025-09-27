import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import Homepage from './homepage';

import { handleLogout } from './Auth';

// Mock useNavigate from react-router-dom
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const renderWithRouter = ui => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Homepage Component', () => {
  beforeEach(() => {
    mockedNavigate.mockReset();
  });

  test('renders home page header title', () => {
    renderWithRouter(<Homepage />);
    expect(screen.getByAltText(/Clubs Connect/i)).toBeInTheDocument();
  });

  test('renders all navigation buttons', () => {
    renderWithRouter(<Homepage />);
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });

  test('navigates to Sign Up on click', () => {
    renderWithRouter(<Homepage />);
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    expect(mockedNavigate).toHaveBeenCalledWith('/auth', { state: { form: 'signup' } });
  });

  test('navigates to Log In on click', () => {
    renderWithRouter(<Homepage />);
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));
    expect(mockedNavigate).toHaveBeenCalledWith('/auth', { state: { form: 'login' } });
  });

  test('renders heading', () => {
    renderWithRouter(<Homepage />);
    const heading = screen.getByRole('heading', { name: /Welcome to Clubs Connect/i });
    expect(heading).toBeInTheDocument();
  });
  test('renders slogan', () => {
    renderWithRouter(<Homepage />);
    const slogan = screen.getByText(/Your one-stop platform/i);
    expect(slogan).toBeInTheDocument();
  });

  test('renders three card descriptions', () => {
    renderWithRouter(<Homepage />);
    expect(screen.getByText(/Clubs for every interest/i)).toBeInTheDocument();
    expect(screen.getByText(/Stay informed about upcoming club events/i)).toBeInTheDocument();
    expect(screen.getByText(/Collaborate with diverse clubs/i)).toBeInTheDocument();
  });
});
