import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import { supabase } from '../supabaseClient';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const createMockChain = (resolvedValue = { data: null, error: null }) => {
  const chain = {
    select: jest.fn().mockReturnValue({
      data: resolvedValue.data,
      error: resolvedValue.error,
    }),
    eq: jest.fn(),
    single: jest.fn(),
  };

  chain.eq.mockReturnValue(chain);
  chain.single.mockResolvedValue(resolvedValue);

  return chain;
};

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

// Mock StudentHeader to avoid its complexity
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
    category: 'Social',
  },
];

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
};

describe('StudentDashboard - Important Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();

    supabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
    });

    supabase.from.mockImplementation(table => {
      if (table === 'profiles') {
        return createMockChain({ data: { role: 'student' }, error: null });
      } else if (table === 'executive') {
        return createMockChain({ data: { id: 'exec-id-123' }, error: null });
      }
      return createMockChain();
    });

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockEvents,
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <StudentDashboard />
      </BrowserRouter>
    );
  };

  describe('Core Functionality', () => {
    test('fetches and displays events from API', async () => {
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

    test('displays error message on API failure', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/Failed to load events/i)).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    test('filters events based on search term', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search events...');
      fireEvent.change(searchInput, { target: { value: 'Event 1' } });

      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Event 2')).not.toBeInTheDocument();
    });
  });

  describe('Role-Based Features', () => {
    test('shows create button for exec users', async () => {
      supabase.from.mockImplementation(table => {
        if (table === 'profiles') {
          return createMockChain({ data: { role: 'exec' }, error: null });
        }
        return createMockChain({ data: { id: 'exec-id-123' }, error: null });
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
          return createMockChain({ data: { role: 'exec' }, error: null });
        }
        return createMockChain({ data: { id: 'exec-id-123' }, error: null });
      });

      supabase.storage.from.mockReturnValue({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: 'http://test.com/uploaded.jpg' },
        }),
      });
    });

    test('opens and closes modal', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Create New Event')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Create New Event'));

      await waitFor(() => {
        expect(screen.getByLabelText('Title')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('×'));

      await waitFor(() => {
        expect(screen.queryByLabelText('Title')).not.toBeInTheDocument();
      });
    });

    test('creates event with form data', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Create New Event')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Create New Event'));

      await waitFor(() => {
        expect(screen.getByLabelText('Title')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText('Title'), {
        target: { value: 'New Test Event' },
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

      fireEvent.click(screen.getByText('Save Event'));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'https://clubs-connect-api.onrender.com/api/events',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('New Test Event'),
          })
        );
      });
    });
  });

  describe('Calendar Integration', () => {
    test('prompts for OAuth when adding to calendar without token', async () => {
      const mockConfirm = jest.fn().mockReturnValue(false);
      window.confirm = mockConfirm;

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      });

      const addButtons = screen.getAllByText('Add to Calendar');
      fireEvent.click(addButtons[0]);

      expect(mockConfirm).toHaveBeenCalledWith('You need to connect Google Calendar. Connect now?');
    });

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

      const addButtons = screen.getAllByText('Add to Calendar');
      fireEvent.click(addButtons[0]);

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
    });
  });
});
