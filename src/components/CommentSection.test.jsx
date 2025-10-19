import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentSection from './CommentSection';
import { supabase } from '../supabaseClient';

vi.mock('../supabaseClient');

describe('CommentSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('1.1 - renders without crashing', () => {
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        neq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [], error: null })
        })
      })
    });
    
    supabase.from.mockReturnValue({ select: mockSelect });
    
    render(<CommentSection postId={1} studentNumber="12345" />);
    expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument();
  });

  test('4.4 - prevents empty comment submission', async () => {
    const mockInsert = vi.fn();
    supabase.from.mockReturnValue({ 
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          neq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [], error: null })
          })
        })
      }),
      insert: mockInsert
    });

    render(<CommentSection postId={1} studentNumber="12345" />);
    
    const sendButton = screen.getByAltText('send-button');
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(mockInsert).not.toHaveBeenCalled();
    });
  });
});