import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FollowButton from './FollowButton';
import { supabase } from '../supabaseClient';

jest.mock('../supabaseClient');

describe('Follow Button', () => {
  const mockUser = { id: '123' };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('renders button with "Follow" text when not following', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
    supabase.from.jest.fn().mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      }),
    });

    render(<FollowButton csoId="cso-1" />);

    await waitFor(() => expect(screen.getByRole('button')).toHaveTextContent('Follow'));
  });

  test('renders button with "Following" text when already following', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
    supabase.from.jest.fn().mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: { follow_status: true }, error: null }),
          }),
        }),
      }),
    });

    render(<FollowButton csoId="cso-1" />);

    await waitFor(() => expect(screen.getByRole('button')).toHaveTextContent('Following'));
  });

  test('toggles from Following → Follow when clicked', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

    // Initial: already following
    supabase.from.jest.fn().mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: { follow_status: true }, error: null }),
          }),
        }),
      }),
    });

    // When unfollow is clicked
    supabase.from.jest.fn().mockReturnValueOnce({
      delete: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      }),
    });

    render(<FollowButton csoId="cso-1" />);
    await screen.findByRole('button');

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(screen.getByRole('button')).toHaveTextContent('Follow'));
  });

  test('button is disabled while loading', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
    supabase.from.jest.fn().mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () =>
              new Promise(resolve => setTimeout(() => resolve({ data: null, error: null }), 100)),
          }),
        }),
      }),
    });

    render(<FollowButton csoId="cso-1" />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
