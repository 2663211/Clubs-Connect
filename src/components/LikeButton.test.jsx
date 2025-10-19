import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import LikeButton from './LikeButton';
import { supabase } from '../supabaseClient';
jest.mock('../supabaseClient');

jest.mock('../supabaseClient');

const mockUser = { id: '123' };
const renderLikeButton = () => render(<LikeButton postId="post-1" />);

describe('LikeButton UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // mock user
    supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

    // default supabase mocks
    supabase.from.mockImplementation(table => {
      if (table === 'Comments') {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                order: () => ({
                  limit: () => Promise.resolve({ data: [], error: null }),
                }),
              }),
            }),
          }),
          update: () => Promise.resolve({ error: null }),
          insert: () => Promise.resolve({ error: null }),
        };
      }
      if (table === 'posts') {
        return {
          select: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve({
                  data: { like_count: 5 },
                  error: null,
                }),
            }),
          }),
          update: () => ({ eq: () => Promise.resolve({ error: null }) }),
        };
      }
    });
  });

  afterEach(() => {
    cleanup();
  });

  test('renders with initial like count and "Likes"', async () => {
    renderLikeButton();
    const button = await screen.findByRole('button');

    expect(button).toHaveTextContent('5 Likes');
  });

  test('clicking like updates UI to show 👍 and incremented count', async () => {
    renderLikeButton();
    const button = await screen.findByRole('button');

    expect(button).toHaveTextContent('5 Likes');

    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveTextContent('6 👍Likes');
    });
  });

  test('decrements like count after unliking', async () => {
    supabase.from.mockImplementation(table => {
      if (table === 'Comments') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue({
            data: [{ liked: true }],
            error: null,
          }),
          update: vi.fn().mockReturnThis(),
        };
      }
      if (table === 'posts') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: { like_count: 10 },
            error: null,
          }),
          update: vi.fn().mockReturnThis(),
        };
      }
    });

    renderLikeButton();

    await waitFor(() => {
      expect(screen.getByText(/10.*👍Likes/i)).toBeInTheDocument();
    });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/9.*Likes/i)).toBeInTheDocument();
    });
  });
});
