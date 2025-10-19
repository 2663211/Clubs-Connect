import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import StudentDashboard from './StudentDashboard';
import { supabase } from '../supabaseClient';
import { jsx, jsxs } from 'react/jsx-runtime';

// Mock dependencies
jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

jest.mock('react-router-dom', async () => {
  const actual = await jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ entityId: undefined }),
  };
});

const mockNavigate = jest.fn();

jest.mock('./StudentHeader', () => ({
  default: () => <div data-testid="student-header">Student Header</div>,
}));

jest.mock('./Search', () => ({
  default: () => <div data-testid="search">Search Component</div>,
}));

jest.mock('./FollowButton', () => ({
  default: ({ csoId }) => <button data-testid={`follow-btn-${csoId}`}>Follow</button>,
}));

jest.mock('./LikeButton', () => ({
  default: ({ postId }) => <button data-testid={`like-btn-${postId}`}>Like</button>,
}));

jest.mock('./CommentSection', () => ({
  default: ({ postId, studentNumber }) => (
    <div data-testid={`comment-section-${postId}`}>
      Comment Section for post {postId}
    </div>
  ),
}));

// Helper to wrap component with Router
const renderWithRouter = (component, route = '/') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {component}
    </MemoryRouter>
  );
};

describe('StudentDashboard Component - UI Tests', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const mockFollowData = [
    { cso_id: 1 },
    { cso_id: 2 },
  ];

  const mockPosts = [
    {
      id: 1,
      cso_id: 1,
      caption: 'First post caption',
      media_url: 'https://example.com/image1.jpg',
      media_type: 'image',
      member_only: false,
      created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      id: 2,
      cso_id: 2,
      caption: 'Second post with video',
      media_url: 'https://example.com/video.mp4',
      media_type: 'video',
      member_only: false,
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: 3,
      cso_id: 1,
      caption: null,
      media_url: 'https://example.com/audio.mp3',
      media_type: 'audio',
      member_only: false,
      created_at: new Date(Date.now() - 2592000000).toISOString(), // 1 month ago
    },
  ];

  const mockCSOData = [
    {
      id: 1,
      name: 'Wits DevSoc',
      logo_url: 'https://example.com/logo1.jpg',
    },
    {
      id: 2,
      name: 'Drama Society',
      logo_url: 'https://example.com/logo2.jpg',
    },
  ];

  const mockFollowerCounts = [
    { cso_id: 1 },
    { cso_id: 1 },
    { cso_id: 1 },
    { cso_id: 2 },
    { cso_id: 2 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();

    supabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    supabase.from.mockImplementation((table) => {
      if (table === 'cso_follow') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({
            data: mockFollowerCounts,
            error: null,
          }),
        };
      }
      if (table === 'posts') {
        return {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: mockPosts,
            error: null,
          }),
        };
      }
      if (table === 'cso') {
        return {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({
            data: mockCSOData,
            error: null,
          }),
        };
      }
    });

    // Setup follow data separately
    const mockFollowChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn(function(col, val) {
        if (col === 'follow_status') {
          return {
            ...this,
            then: (resolve) => resolve({ data: mockFollowData, error: null }),
          };
        }
        return this;
      }),
    };

    supabase.from.mockImplementation((table) => {
      if (table === 'cso_follow') {
        return mockFollowChain;
      }
      if (table === 'posts') {
        return {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: mockPosts,
            error: null,
          }),
        };
      }
      if (table === 'cso') {
        return {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({
            data: mockCSOData,
            error: null,
          }),
        };
      }
    });
  });

  describe('Initial Rendering', () => {
    test('renders loading state initially', () => {
      renderWithRouter(<StudentDashboard />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders StudentHeader component', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('student-header')).toBeInTheDocument();
      });
    });

    test('renders Search component', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('search')).toBeInTheDocument();
      });
    });

    test('renders posts section after loading', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const postsSection = document.querySelector('.posts');
      expect(postsSection).toBeInTheDocument();
    });
  });

  describe('No Posts State', () => {
    test('displays "No posts yet" when user follows no CSOs', async () => {
      supabase.from.mockImplementation((table) => {
        if (table === 'cso_follow') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            then: (resolve) => resolve({ data: [], error: null }),
          };
        }
      });

      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.getByText('No posts yet.')).toBeInTheDocument();
      });
    });

    test('displays "No posts yet" when followed CSOs have no posts', async () => {
      supabase.from.mockImplementation((table) => {
        if (table === 'cso_follow') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            then: (resolve) => resolve({ data: mockFollowData, error: null }),
          };
        }
        if (table === 'posts') {
          return {
            select: jest.fn().mockReturnThis(),
            in: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          };
        }
      });

      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.getByText('No posts yet.')).toBeInTheDocument();
      });
    });
  });

  describe('Post Display', () => {
    test('renders all posts from followed CSOs', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.getByText('First post caption')).toBeInTheDocument();
        expect(screen.getByText('Second post with video')).toBeInTheDocument();
      });
    });

    test('renders CSO names for each post', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.getAllByText('Wits DevSoc').length).toBeGreaterThan(0);
        expect(screen.getByText('Drama Society')).toBeInTheDocument();
      });
    });

    test('renders CSO logos', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        const logos = screen.getAllByRole('img', { name: /Wits DevSoc|Drama Society/i });
        expect(logos.length).toBeGreaterThan(0);
      });
    });

    test('displays follower counts correctly', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        // Check that follower count elements exist
        const followerElements = document.querySelectorAll('.followerCount');
        expect(followerElements.length).toBeGreaterThan(0);
        
        // Check that follower text is displayed (flexible check)
        const hasFollowerText = Array.from(followerElements).some(el => 
          el.textContent.includes('follower')
        );
        expect(hasFollowerText).toBe(true);
      });
    });

    test('displays follower count with correct singular/plural format', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        const followerElements = document.querySelectorAll('.followerCount');
        expect(followerElements.length).toBe(3); // 3 posts total
        
        // Verify each has a number and "follower" or "followers" text
        followerElements.forEach(el => {
          expect(el.textContent).toMatch(/\d+ followers?/);
        });
      });
    });


    test('displays singular "follower" for count of 1', async () => {
      const singleFollower = [{ cso_id: 1 }];
      
      supabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      let callCount = 0;
      supabase.from.mockImplementation((table) => {
        if (table === 'cso_follow') {
          callCount++;
          // First call: get followed CSOs
          if (callCount === 1) {
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              then: (resolve) => resolve({ data: mockFollowData, error: null }),
            };
          }
          // Second call: get follower counts
          return {
            select: jest.fn().mockReturnThis(),
            in: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({
              data: singleFollower,
              error: null,
            }),
          };
        }
        if (table === 'posts') {
          return {
            select: jest.fn().mockReturnThis(),
            in: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({
              data: [mockPosts[0]],
              error: null,
            }),
          };
        }
        if (table === 'cso') {
          return {
            select: jest.fn().mockReturnThis(),
            in: jest.fn().mockResolvedValue({
              data: [mockCSOData[0]],
              error: null,
            }),
          };
        }
      });


      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        const followerElement = screen.getByText((content, element) => {
          return element.textContent === '1 follower';
        });
        expect(followerElement).toBeInTheDocument();
      });
    });

    test('displays post timestamps using timeSince format', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.getByText('1 hour ago')).toBeInTheDocument();
        expect(screen.getByText('1 day ago')).toBeInTheDocument();
        expect(screen.getByText('1 month ago')).toBeInTheDocument();
      });
    });

    test('renders post captions when available', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.getByText('First post caption')).toBeInTheDocument();
        expect(screen.getByText('Second post with video')).toBeInTheDocument();
      });
    });

    test('does not render caption section when caption is null', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        const postCaptions = document.querySelectorAll('.postCaption');
        expect(postCaptions.length).toBe(2); // Only 2 posts have captions
      });
    });
  });

  describe('Media Display', () => {
    test('renders image media with correct src', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        const image = screen.getByAltText('Post media');
        expect(image).toBeInTheDocument();
        expect(image.src).toContain('image1.jpg');
        expect(image.classList.contains('postImage')).toBe(true);
      });
    });

    test('renders video media with controls', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        const video = document.querySelector('.postVideo');
        expect(video).toBeInTheDocument();
        expect(video).toHaveAttribute('controls');
      });
    });

    test('renders video source with correct src', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        const videoSource = document.querySelector('.postVideo source');
        expect(videoSource).toBeInTheDocument();
        expect(videoSource.src).toContain('video.mp4');
        expect(videoSource.type).toBe('video/mp4');
      });
    });

    test('renders audio media with controls', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        const audio = document.querySelector('.postAudio');
        expect(audio).toBeInTheDocument();
        expect(audio).toHaveAttribute('controls');
      });
    });

    test('renders audio source with correct src', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        const audioSource = document.querySelector('.postAudio source');
        expect(audioSource).toBeInTheDocument();
        expect(audioSource.src).toContain('audio.mp3');
        expect(audioSource.type).toBe('audio/mpeg');
      });
    });
  });

  describe('Engagement Buttons', () => {
    test('renders Like button for each post', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('like-btn-1')).toBeInTheDocument();
        expect(screen.getByTestId('like-btn-2')).toBeInTheDocument();
        expect(screen.getByTestId('like-btn-3')).toBeInTheDocument();
      });
    });

    test('renders Comment button for each post', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        const commentButtons = screen.getAllByText('Comment');
        expect(commentButtons.length).toBe(3);
      });
    });

    test('renders Follow button for each CSO', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.getAllByTestId('follow-btn-1').length).toBe(2);
        expect(screen.getAllByTestId('follow-btn-2').length).toBe(1);
      });
    });
  });

  describe('Comment Section Interactions', () => {
    test('comment section is hidden by default', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.queryByTestId('comment-section-1')).not.toBeInTheDocument();
      });
    });

    test('shows comment section when Comment button is clicked', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.getByText('First post caption')).toBeInTheDocument();
      });

      const commentButtons = screen.getAllByText('Comment');
      fireEvent.click(commentButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('comment-section-1')).toBeInTheDocument();
      });
    });

    test('hides comment section when Comment button is clicked again', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.getByText('First post caption')).toBeInTheDocument();
      });

      const commentButtons = screen.getAllByText('Comment');
      fireEvent.click(commentButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('comment-section-1')).toBeInTheDocument();
      });

      fireEvent.click(commentButtons[0]);

      await waitFor(() => {
        expect(screen.queryByTestId('comment-section-1')).not.toBeInTheDocument();
      });
    });

    

    test('only one comment section can be open at a time', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.getByText('First post caption')).toBeInTheDocument();
      });

      const commentButtons = screen.getAllByText('Comment');
      
      // Open first comment section
      fireEvent.click(commentButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('comment-section-1')).toBeInTheDocument();
      });

      // Open second comment section
      fireEvent.click(commentButtons[1]);

      await waitFor(() => {
        expect(screen.queryByTestId('comment-section-1')).not.toBeInTheDocument();
        expect(screen.getByTestId('comment-section-2')).toBeInTheDocument();
      });
    });

    test('passes correct postId to CommentSection component', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.getByText('First post caption')).toBeInTheDocument();
      });

      const commentButtons = screen.getAllByText('Comment');
      fireEvent.click(commentButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Comment Section for post 1')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    test('navigates to entity page when CSO details are clicked', async () => {
      renderWithRouter(<StudentDashboard />);

      await waitFor(() => {
        expect(screen.getAllByText('Wits DevSoc').length).toBeGreaterThan(0);
      });

      const csoDetails = document.querySelector('.cso-details');
      fireEvent.click(csoDetails);

      expect(mockNavigate).toHaveBeenCalledWith('/entities/1');
    });

  });


  

  
  });
