import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import StudentHeader from './StudentHeader';

import { handleLogout } from './Auth';

// Mock useNavigate from react-router-dom
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Mock handleLogout
// jest.mock("./Auth", () => ({
//   handleLogout: jest.fn(),
// }));

const renderWithRouter = ui => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('StudentHeader Component', () => {
  beforeEach(() => {
    mockedNavigate.mockReset();
    handleLogout.mockReset();
  });

  test('renders header title', () => {
    renderWithRouter(<StudentHeader />);
    expect(screen.getByText(/Clubs Connect/i)).toBeInTheDocument();
  });

  test('renders all navigation buttons', () => {
    renderWithRouter(<StudentHeader />);
    expect(screen.getByText(/NewsFeed/i)).toBeInTheDocument();
    expect(screen.getByText(/Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Chat/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test('navigates to NewsFeed on click', () => {
    renderWithRouter(<StudentHeader />);
    fireEvent.click(screen.getByText(/NewsFeed/i));
    expect(mockedNavigate).toHaveBeenCalledWith('/dashboard/student');
  });

  //   test("navigates to Search on click", () => {
  //     renderWithRouter(<StudentHeader />);
  //     fireEvent.click(screen.getByText(/Search/i));
  //     expect(mockedNavigate).toHaveBeenCalledWith("/search");
  //   });

  //   test("navigates to Chat on click", () => {
  //     renderWithRouter(<StudentHeader />);
  //     fireEvent.click(screen.getByText(/Chat/i));
  //     expect(mockedNavigate).toHaveBeenCalledWith("/chat");
  //   });

  test('navigates to Profile on click', () => {
    renderWithRouter(<StudentHeader />);
    fireEvent.click(screen.getByText(/Profile/i));
    expect(mockedNavigate).toHaveBeenCalledWith('/profile/student');
  });

  //   test("calls handleLogout and navigates on logout", async () => {
  //     renderWithRouter(<StudentHeader />);
  //     fireEvent.click(screen.getByText(/Logout/i));

  //     expect(handleLogout).toHaveBeenCalled();
  //     // since handleLogout is async, simulate await resolution
  //     await Promise.resolve();
  //     expect(mockedNavigate).toHaveBeenCalledWith("/auth");
  //   });
});
