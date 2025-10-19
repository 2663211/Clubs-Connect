import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Search from './Search';
import { supabase } from '../supabaseClient';

// Mock supabase
jest.mock('../supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(),
    })),
  },
}));

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedNavigate,
}));

const renderWithRouter = ui => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Search Component', () => {
  const mockCSOs = [
    { id: 1, name: 'Drama Club', cluster: 'Arts', logo_url: '/drama.png' },
    { id: 2, name: 'Robotics Society', cluster: 'STEM', logo_url: '/robotics.png' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ data: mockCSOs, error: null }),
    }));
  });

  afterEach(() => {
    cleanup();
  });

  test('renders input field', () => {
    renderWithRouter(<Search />);
    expect(screen.getByPlaceholderText(/Search for CSO/i)).toBeInTheDocument();
  });

  test('fetches and displays CSOs on mount', async () => {
    renderWithRouter(<Search />);
    const input = screen.getByPlaceholderText(/Search for CSO/i);
    fireEvent.change(input, { target: { value: 'Drama' } });

    expect(await screen.findByText(/Drama Club/i)).toBeInTheDocument();
  });

  test('filters CSOs based on search query', async () => {
    renderWithRouter(<Search />);

    const input = screen.getByPlaceholderText(/Search for CSO/i);
    fireEvent.change(input, { target: { value: 'Drama' } });

    await waitFor(() => {
      expect(screen.getByText(/Drama Club/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText(/Robotics Society/i)).not.toBeInTheDocument();
    });
  });

  test('shows "No results found" when search has no matches', async () => {
    renderWithRouter(<Search />);

    const input = screen.getByPlaceholderText(/Search for CSO/i);
    fireEvent.change(input, { target: { value: 'Nonexistent' } });

    expect(screen.getByText(/No results found/i)).toBeInTheDocument();
  });

  test('navigates to CSO page on list item click', async () => {
    renderWithRouter(<Search />);

    const input = screen.getByPlaceholderText(/Search for CSO/i);
    fireEvent.change(input, { target: { value: 'Drama' } });
    const dramaClub = await screen.findByText(/Drama Club/i);
    fireEvent.click(dramaClub);

    expect(mockedNavigate).toHaveBeenCalledWith('/entities/1');
  });

  test('navigates to CSO page on search icon click', async () => {
    renderWithRouter(<Search />);

    const input = screen.getByPlaceholderText(/Search for CSO/i);
    fireEvent.change(input, { target: { value: 'Drama Club' } });
    await screen.findByText(/Drama Club/i);

    const icon = screen.getAllByAltText(/search-gif/i)[0];
    fireEvent.click(icon);

    expect(mockedNavigate).toHaveBeenCalledWith('/entities/1');
  });
});
