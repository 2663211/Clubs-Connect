import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import LikeButton from './LikeButton';
import { supabase } from '../supabaseClient';

jest.mock('../supabaseClient');

const mockUser = { id: '123' };
const renderLikeButton = (props = {}) => render(<LikeButton postId="post-1" {...props} />);

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

    expect(button).toHaveTextContent('0 Likes');
  });

  test('clicking like updates UI to show 👍 and incremented count', async () => {
    renderLikeButton();
    const button = await screen.findByRole('button');

    expect(button).toHaveTextContent('0 Likes');

    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveTextContent('6 👍Likes');
    });
  });

  test('clicking again unlikes and decrements count', async () => {
    renderLikeButton();
    const button = await screen.findByRole('button');

    // like first
    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveTextContent('6 👍Likes'));

    // unlike
    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveTextContent('5 Likes'));
  });

  test('button is disabled while loading', async () => {
    renderLikeButton();
    const button = await screen.findByRole('button');

    fireEvent.click(button);
    expect(button).toBeDisabled();

    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
