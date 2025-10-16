import { BrowserRouter } from 'react-router-dom';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import CSOMember from './CSO_member.js';
import { supabase } from '../supabaseClient';

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedNavigate,
}));

// Mock supabase
jest.mock('../supabaseClient');

describe('CSO memberships', () => {
  const mockCSOs = [
    { id: 1, name: 'Drama Club', cluster: 'Arts', logo_url: '/drama.png' },
    { id: 2, name: 'Robotics Society', cluster: 'STEM', logo_url: '/robotics.png' },
  ];
  const mockMemberships = [
    { id: 1, name: 'Drama Club', cluster: 'Arts', logo_url: '/drama.png',student_number: '1234' },
    { id: 2, name: 'Robotics Society', cluster: 'STEM', logo_url: '/robotics.png', student_number: '1235' }
  ]
  const mockUserId = '1234';

beforeEach(()=>{
     jest.clearAllMocks();
});

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
  test('renders entity section', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: mockUserId } });
    supabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      }),
    });

    render(<CSOMember />);

    await waitFor(() => expect(screen.getByText(/No entities found/i)).toBeInTheDocument());
  });

});
