// ExecEvents.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExecEvents from './ExecEvents';
import { BrowserRouter } from 'react-router-dom';

beforeAll(() => {
  window.alert = jest.fn();
});

const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });

// Mock fetch
beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: async () => [],
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
  mockSessionStorage.clear();
  window.alert.mockClear();
});

describe('ExecEvents - Google Calendar', () => {
  it('renders events and "Add to Calendar" button', async () => {
    // event from app API
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: 'Test Event',
          date: new Date().toISOString(),
          description: 'Test description',
        },
      ],
    });

    render(
      <BrowserRouter>
        <ExecEvents />
      </BrowserRouter>
    );

    const addButton = await screen.findByRole('button', { name: /add to calendar/i });
    expect(addButton).toBeInTheDocument();
  });

  it('shows alert on Google Calendar API error', async () => {
    mockSessionStorage.getItem.mockReturnValue('fake-token');

    // First fetch returns one event
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: 'Test Event',
          date: new Date().toISOString(),
          description: 'Test description',
        },
      ],
    });

    // Second fetch simulates Google Calendar API POST failure
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'API error' } }),
    });

    render(
      <BrowserRouter>
        <ExecEvents />
      </BrowserRouter>
    );

    const addButton = await screen.findByRole('button', { name: /add to calendar/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to create event: API error');
    });
  });

  it('shows success alert on Google Calendar API success', async () => {
    mockSessionStorage.getItem.mockReturnValue('fake-token');

    // First fetch returns one event
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: 'Test Event',
          date: new Date().toISOString(),
          description: 'Test description',
        },
      ],
    });

    // Second fetch simulates Google Calendar API POST success
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'calendar-event-id' }),
    });

    render(
      <BrowserRouter>
        <ExecEvents />
      </BrowserRouter>
    );

    const addButton = await screen.findByRole('button', { name: /add to calendar/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Event created! Check your Google Calendar.');
    });
  });

  it('prompts user to connect Google Calendar if token is missing', async () => {
    mockSessionStorage.getItem.mockReturnValue(null);

    window.confirm = jest.fn(() => false);

    // event
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: 'Test Event', date: new Date().toISOString() }],
    });

    render(
      <BrowserRouter>
        <ExecEvents />
      </BrowserRouter>
    );

    const addButton = await screen.findByRole('button', { name: /add to calendar/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith(
        'You need to connect Google Calendar. Connect now?'
      );
    });
  });
});
