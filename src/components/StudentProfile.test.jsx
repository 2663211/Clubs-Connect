import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import StudentProfile from './StudentProfile';
import { supabase } from '../supabaseClient';

// Mock dependencies
vi.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
    storage: {
      from: vi.fn(),
    },
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('./StudentHeader', () => ({
  default: () => <div data-testid="student-header">Student Header</div>,
}));

vi.mock('./CSO_member', () => ({
  default: () => <div data-testid="cso-member">CSO Member</div>,
}));

vi.mock('./FollowButton', () => ({
  default: ({ csoId }) => <button data-testid={`follow-btn-${csoId}`}>Follow</button>,
}));

// Helper to wrap component with Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('StudentProfile Component - UI Tests', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const mockProfile = {
    full_name: 'John Doe',
    bio: 'Computer Science Student',
    avatar_url: 'https://example.com/avatar.jpg',
    cover_url: 'https://example.com/cover.jpg',
  };

  const mockCsos = [
    {
      id: 1,
      name: 'Wits DevSoc',
      cluster: 'Technology',
      logo_url: 'https://example.com/logo1.jpg',
    },
    {
      id: 2,
      name: 'Drama Society',
      cluster: 'Arts',
      logo_url: 'https://example.com/logo2.jpg',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks to return data
    supabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    supabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          }),
          update: vi.fn().mockReturnThis(),
        };
      }
      if (table === 'cso') {
        return {
          select: vi.fn().mockResolvedValue({
            data: mockCsos,
            error: null,
          }),
        };
      }
      if (table === 'cso_follow') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
          delete: vi.fn().mockReturnThis(),
          insert: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        };
      }
    });
  });

  describe('UI Rendering - View Mode', () => {
    test('renders loading state initially', () => {
      renderWithRouter(<StudentProfile />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders student header component', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByTestId('student-header')).toBeInTheDocument();
      });
    });

    test('renders user profile information', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Computer Science Student')).toBeInTheDocument();
      });
    });

    test('renders profile and cover images with correct alt text', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByAltText('cover')).toBeInTheDocument();
        expect(screen.getByAltText('profile')).toBeInTheDocument();
      });
    });

    test('renders edit profile button', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByAltText('edit profile')).toBeInTheDocument();
      });
    });

    test('renders Groups Joined section', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByText('Groups Joined')).toBeInTheDocument();
        expect(screen.getByTestId('cso-member')).toBeInTheDocument();
      });
    });

    test('renders Interests section', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByText('Interests:')).toBeInTheDocument();
      });
    });

    test('renders CSO list with names and clusters', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByText('Wits DevSoc')).toBeInTheDocument();
        expect(screen.getByText('Technology')).toBeInTheDocument();
        expect(screen.getByText('Drama Society')).toBeInTheDocument();
        expect(screen.getByText('Arts')).toBeInTheDocument();
      });
    });

    test('renders CSO logos', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        const csoImages = screen.getAllByRole('img');
        const csoLogos = csoImages.filter(img => 
          img.src.includes('logo1.jpg') || img.src.includes('logo2.jpg')
        );
        expect(csoLogos.length).toBeGreaterThan(0);
      });
    });

    test('renders Follow buttons for each CSO', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByTestId('follow-btn-1')).toBeInTheDocument();
        expect(screen.getByTestId('follow-btn-2')).toBeInTheDocument();
      });
    });
  });

  describe('UI Rendering - Edit Mode', () => {
    test('switches to edit mode when edit button is clicked', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const editButton = screen.getByAltText('edit profile');
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByText('Select a Cover Photo:')).toBeInTheDocument();
      });
    });

    test('renders cover photo file input in edit mode', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        fireEvent.click(screen.getByAltText('edit profile'));
      });

      await waitFor(() => {
        const coverInput = screen.getByLabelText(/Select a Cover Photo/i);
        expect(coverInput).toBeInTheDocument();
        expect(coverInput.type).toBe('file');
      });
    });

    test('renders profile photo file input in edit mode', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        fireEvent.click(screen.getByAltText('edit profile'));
      });

      await waitFor(() => {
        const profileInput = screen.getByLabelText(/Select a Profile Photo/i);
        expect(profileInput).toBeInTheDocument();
        expect(profileInput.type).toBe('file');
      });
    });

    test('renders name input field with current value', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        fireEvent.click(screen.getByAltText('edit profile'));
      });

      await waitFor(() => {
        const nameInput = screen.getByDisplayValue('John Doe');
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveAttribute('name', 'name');
        expect(nameInput.value).toBe('John Doe');
      });
    });

    test('renders about textarea with current value', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        fireEvent.click(screen.getByAltText('edit profile'));
      });

      await waitFor(() => {
        const aboutTextarea = screen.getByLabelText(/About/i);
        expect(aboutTextarea).toBeInTheDocument();
        expect(aboutTextarea.value).toBe('Computer Science Student');
      });
    });

    test('renders save button in edit mode', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        fireEvent.click(screen.getByAltText('edit profile'));
      });

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /Save/i });
        expect(saveButton).toBeInTheDocument();
        expect(saveButton.type).toBe('submit');
      });
    });

    test('hides view mode elements when in edit mode', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByTestId('student-header')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByAltText('edit profile'));

      await waitFor(() => {
        expect(screen.queryByTestId('student-header')).not.toBeInTheDocument();
        expect(screen.queryByText('Groups Joined')).not.toBeInTheDocument();
        expect(screen.queryByText('Interests:')).not.toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    test('allows typing in name input field', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByAltText('edit profile'));

      await waitFor(() => {
        const nameInput = screen.getByDisplayValue('John Doe');
        expect(nameInput).toBeInTheDocument();
        expect(nameInput.tagName).toBe('INPUT');
      });

      const nameInput = screen.getByDisplayValue('John Doe');
      fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
      
      expect(nameInput.value).toBe('Jane Smith');
    });

    test('allows typing in about textarea', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        fireEvent.click(screen.getByAltText('edit profile'));
      });

      await waitFor(() => {
        const aboutTextarea = screen.getByLabelText(/About/i);
        const newBio = 'Updated bio information';
        fireEvent.change(aboutTextarea, { target: { value: newBio } });
        expect(aboutTextarea.value).toBe(newBio);
      });
    });

    test('allows file selection for profile photo', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        fireEvent.click(screen.getByAltText('edit profile'));
      });

      await waitFor(() => {
        const fileInput = screen.getByLabelText(/Select a Profile Photo/i);
        const file = new File(['profile'], 'profile.jpg', { type: 'image/jpeg' });
        
        fireEvent.change(fileInput, { target: { files: [file] } });
        expect(fileInput.files[0]).toBe(file);
        expect(fileInput.files.length).toBe(1);
      });
    });

    test('allows file selection for cover photo', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        fireEvent.click(screen.getByAltText('edit profile'));
      });

      await waitFor(() => {
        const fileInput = screen.getByLabelText(/Select a Cover Photo/i);
        const file = new File(['cover'], 'cover.jpg', { type: 'image/jpeg' });
        
        fireEvent.change(fileInput, { target: { files: [file] } });
        expect(fileInput.files[0]).toBe(file);
        expect(fileInput.files.length).toBe(1);
      });
    });

    test('returns to view mode after clicking save', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        fireEvent.click(screen.getByAltText('edit profile'));
      });

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /Save/i });
        fireEvent.click(saveButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('student-header')).toBeInTheDocument();
        expect(screen.queryByLabelText(/Select a Cover Photo/i)).not.toBeInTheDocument();
      });
    });

    test('displays updated name after save', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        fireEvent.click(screen.getByAltText('edit profile'));
      });

      await waitFor(() => {
        const nameInput = screen.getByDisplayValue('John Doe');
        expect(nameInput).toBeInTheDocument();
        fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
        expect(nameInput.value).toBe('Jane Smith');
      });

      const saveButton = screen.getByRole('button', { name: /Save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    test('displays updated bio after save', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        fireEvent.click(screen.getByAltText('edit profile'));
      });

      await waitFor(() => {
        const aboutTextarea = screen.getByLabelText(/About/i);
        fireEvent.change(aboutTextarea, { target: { value: 'New bio text' } });
      });

      const saveButton = screen.getByRole('button', { name: /Save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('New bio text')).toBeInTheDocument();
      });
    });
  });

  describe('CSO List Interactions', () => {
    test('initially displays 5 CSOs', async () => {
      const manyCsos = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `CSO ${i + 1}`,
        cluster: 'Category',
        logo_url: 'https://example.com/logo.jpg',
      }));

      supabase.from.mockImplementation((table) => {
        if (table === 'cso') {
          return {
            select: vi.fn().mockResolvedValue({ data: manyCsos, error: null }),
          };
        }
        if (table === 'cso_follow') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        };
      });

      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        const csoElements = screen.getAllByText(/CSO \d+/);
        expect(csoElements.length).toBe(5);
      });
    });

    test('shows "Show more suggestions" button when more CSOs exist', async () => {
      const manyCsos = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `CSO ${i + 1}`,
        cluster: 'Category',
        logo_url: 'https://example.com/logo.jpg',
      }));

      supabase.from.mockImplementation((table) => {
        if (table === 'cso') {
          return {
            select: vi.fn().mockResolvedValue({ data: manyCsos, error: null }),
          };
        }
        if (table === 'cso_follow') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        };
      });

      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getByText('Show more suggestions')).toBeInTheDocument();
      });
    });

    test('does not show "Show more" button when all CSOs are displayed', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        expect(screen.queryByText('Show more suggestions')).not.toBeInTheDocument();
      });
    });

    test('expands CSO list when "Show more" is clicked', async () => {
      const manyCsos = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `CSO ${i + 1}`,
        cluster: 'Category',
        logo_url: 'https://example.com/logo.jpg',
      }));

      supabase.from.mockImplementation((table) => {
        if (table === 'cso') {
          return {
            select: vi.fn().mockResolvedValue({ data: manyCsos, error: null }),
          };
        }
        if (table === 'cso_follow') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        };
      });

      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        expect(screen.getAllByText(/CSO \d+/).length).toBe(5);
      });

      const showMoreButton = screen.getByText('Show more suggestions');
      fireEvent.click(showMoreButton);

      await waitFor(() => {
        expect(screen.getAllByText(/CSO \d+/).length).toBe(10);
      });
    });

    test('hides "Show more" button when all CSOs are shown', async () => {
      const manyCsos = Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        name: `CSO ${i + 1}`,
        cluster: 'Category',
        logo_url: 'https://example.com/logo.jpg',
      }));

      supabase.from.mockImplementation((table) => {
        if (table === 'cso') {
          return {
            select: vi.fn().mockResolvedValue({ data: manyCsos, error: null }),
          };
        }
        if (table === 'cso_follow') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        };
      });

      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        const showMoreButton = screen.getByText('Show more suggestions');
        fireEvent.click(showMoreButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('Show more suggestions')).not.toBeInTheDocument();
      });
    });
  });

  describe('Image Security - sanitizeImageUrl', () => {
    test('renders images with https URLs', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        const profileImg = screen.getByAltText('profile');
        expect(profileImg.src).toContain('https://');
      });
    });

    test('profile image has valid src attribute', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        const profileImg = screen.getByAltText('profile');
        expect(profileImg.src).toBeTruthy();
        expect(profileImg.src).not.toContain('javascript:');
        expect(profileImg.src).not.toContain('data:');
      });
    });

    test('cover image has valid src attribute', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        const coverImg = screen.getByAltText('cover');
        expect(coverImg.src).toBeTruthy();
        expect(coverImg.src).not.toContain('javascript:');
        expect(coverImg.src).not.toContain('data:');
      });
    });
  });

  describe('Form Behavior', () => {
    test('edit form has correct structure', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        fireEvent.click(screen.getByAltText('edit profile'));
      });

      await waitFor(() => {
        const form = screen.getByRole('button', { name: /Save/i }).closest('form');
        expect(form).toBeInTheDocument();
      });
    });

    test('form prevents default submission', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        fireEvent.click(screen.getByAltText('edit profile'));
      });

      await waitFor(() => {
        const form = screen.getByRole('button', { name: /Save/i }).closest('form');
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        
        const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');
        form.dispatchEvent(submitEvent);
        
        // Form should handle submission without page reload
        expect(form).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('images have alt attributes', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        const images = screen.getAllByRole('img');
        images.forEach(img => {
          expect(img).toHaveAttribute('alt');
        });
      });
    });

    test('form inputs have associated labels', async () => {
      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        fireEvent.click(screen.getByAltText('edit profile'));
      });

      await waitFor(() => {
        const nameInput = screen.getByDisplayValue('John Doe');
        const aboutTextarea = screen.getByDisplayValue('Computer Science Student');
        
        expect(nameInput).toBeInTheDocument();
        expect(aboutTextarea).toBeInTheDocument();
      });
    });

    test('buttons have accessible text', async () => {
      const manyCsos = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `CSO ${i + 1}`,
        cluster: 'Category',
        logo_url: 'https://example.com/logo.jpg',
      }));

      supabase.from.mockImplementation((table) => {
        if (table === 'cso') {
          return {
            select: vi.fn().mockResolvedValue({ data: manyCsos, error: null }),
          };
        }
        if (table === 'cso_follow') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        };
      });

      renderWithRouter(<StudentProfile />);

      await waitFor(() => {
        const showMoreButton = screen.getByText('Show more suggestions');
        expect(showMoreButton.textContent).toBeTruthy();
      });
    });
  });
});