import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import { supabase } from '../supabaseClient';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
    storage: {
      from: jest.fn(),
    },
  },
}));

jest.mock('./StudentHeader', () => {
  return function MockStudentHeader() {
    return <div data-testid="student-header">Student Header</div>;
  };
});

global.fetch = jest.fn();

const mockEvents = [
  {
    id: 1,
    title: 'Test Event 1',
    date: new Date(Date.now() + 86400000).toISOString(),
    location: 'Test Location 1',
    description: 'Test Description 1',
    poster_image: 'http://test.com/image1.jpg',
    category: 'Workshop',
  },
  {
    id: 2,
    title: 'Test Event 2',
    date: new Date(Date.now() + 172800000).toISOString(),
    location: 'Test Location 2',
    description: 'Test Description 2',
    poster_image: 'http://test.com/image2.jpg',
    category: 'Social',
  },
];

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
};

describe('StudentDashboard - Critical Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    window.location.hash = '';

    supabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
    });

    supabase.from.mockImplementation(table => {
      if (table === 'profiles') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { role: 'student' },
            error: null,
          }),
        };
      }
      if (table === 'executive') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { id: 'exec-id-123' },
            error: null,
          }),
        };
      }
      return {};
    });

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockEvents,
      status: 200,
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <StudentDashboard entityId="test-entity-id" />
      </BrowserRouter>
    );
  };

  describe('Event Fetching & Display', () => {
    test('fetches and displays upcoming events', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      });

      expect(screen.getByText('Test Event 2')).toBeInTheDocument();
      expect(global.fetch).toHaveBeenCalledWith(
        'https://clubs-connect-api.onrender.com/api/events',
        expect.objectContaining({ method: 'GET' })
      );
    });

    test('filters out past events', async () => {
      const pastEvent = {
        id: 3,
        title: 'Past Event',
        date: new Date(Date.now() - 86400000).toISOString(),
        location: 'Past Location',
        description: 'Past Description',
      };

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => [...mockEvents, pastEvent],
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      });

      expect(screen.queryByText('Past Event')).not.toBeInTheDocument();
    });

    test('handles API error gracefully', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/Failed to load events/i)).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    test('filters events by search term', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search events...');
      fireEvent.change(searchInput, { target: { value: 'Event 1' } });

      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Event 2')).not.toBeInTheDocument();
      expect(screen.getByText('1 event found')).toBeInTheDocument();
    });

    test('clears search results', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search events...');
      fireEvent.change(searchInput, { target: { value: 'Event 1' } });

      const clearButton = screen.getByLabelText('Clear search');
      fireEvent.click(clearButton);

      expect(searchInput.value).toBe('');
      expect(screen.getByText('Test Event 2')).toBeInTheDocument();
    });
  });

  describe('Role-Based Access', () => {
    test('shows create button for exec users', async () => {
      supabase.from.mockImplementation(table => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { role: 'exec' },
              error: null,
            }),
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { id: 'exec-id-123' },
            error: null,
          }),
        };
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Create New Event')).toBeInTheDocument();
      });
    });

    test('hides create button for students', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      });

      expect(screen.queryByText('Create New Event')).not.toBeInTheDocument();
    });
  });

  describe('Event Creation', () => {
    beforeEach(() => {
      supabase.from.mockImplementation(table => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { role: 'exec' },
              error: null,
            }),
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { id: 'exec-id-123' },
            error: null,
          }),
        };
      });

      supabase.storage.from.mockReturnValue({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: 'http://test.com/uploaded-image.jpg' },
        }),
      });
    });

    test('creates new event successfully', async () => {
      renderComponent();

      test('opens modal when create button is clicked', async () => {
        renderComponent();

        await waitFor(() => {
          const createButton = screen.getByText('Create New Event');
          expect(createButton).toBeInTheDocument();
        });

        const createButton = screen.getByText('Create New Event');
        fireEvent.click(createButton);

        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Date & Time')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText('Title'), {
        target: { value: 'New Event' },
      });
      fireEvent.change(screen.getByLabelText('Date & Time'), {
        target: { value: '2025-12-01T10:00' },
      });
      fireEvent.change(screen.getByLabelText('Category'), {
        target: { value: 'Workshop' },
      });

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const saveButton = screen.getByText('Save Event');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'https://clubs-connect-api.onrender.com/api/events',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('New Event'),
          })
        );
      });
    });

    test('uploads poster image with event', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Create New Event')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Create New Event'));

      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText('Event Poster Image');

      Object.defineProperty(fileInput, 'files', { value: [file] });
      fireEvent.change(fileInput);

      fireEvent.change(screen.getByLabelText('Title'), {
        target: { value: 'Event with Image' },
      });
      fireEvent.change(screen.getByLabelText('Date & Time'), {
        target: { value: '2025-12-01T10:00' },
      });
      fireEvent.change(screen.getByLabelText('Category'), {
        target: { value: 'Workshop' },
      });

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const saveButton = screen.getByText('Save Event');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(supabase.storage.from).toHaveBeenCalledWith('event_posters');
      });
    });
  });

  describe('Google Calendar Integration', () => {
    test('adds event to calendar with valid token', async () => {
      sessionStorage.setItem('provider_token', 'mock-token');

      global.fetch.mockImplementation(url => {
        if (url.includes('googleapis.com')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ id: 'calendar-event-id' }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => mockEvents,
        });
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      });

      const addButton = screen.getAllByText('Add to Calendar')[0];
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              Authorization: 'Bearer mock-token',
            }),
          })
        );
      });

      expect(screen.getByText('Event added to your calendar!')).toBeInTheDocument();
    });

    test('prompts for OAuth when no token exists', async () => {
      const mockConfirm = jest.fn().mockReturnValue(true);
      window.confirm = mockConfirm;
      delete window.location;
      window.location = { href: '', origin: 'http://localhost', pathname: '/' };

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      });

      const addButton = screen.getAllByText('Add to Calendar')[0];
      fireEvent.click(addButton);

      expect(mockConfirm).toHaveBeenCalledWith('You need to connect Google Calendar. Connect now?');
      expect(window.location.href).toContain('accounts.google.com');
    });
  });
});
