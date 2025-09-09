import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentDashboard.css';
import StudentHeader from './StudentHeader';

export default function StudentDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from your API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://clubs-connect-api.onrender.com/api/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Your API already returns an array
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on search term
  const filteredEvents = events.filter(
    event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.cso_exec?.cso_name &&
        event.cso_exec.cso_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <article className="dashboard">
      <StudentHeader />

      <main>
        <h2>Events</h2>

        {/* Enhanced Search Bar */}
        <div className="search-container">
          <div className="search-box">
            <svg
              className="search-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>

            <input
              type="text"
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search events by title, description, location, or organization..."
              autoComplete="off"
            />

            {searchTerm && (
              <button className="clear-button" onClick={clearSearch} aria-label="Clear search">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          {searchTerm && (
            <div className="search-results-count">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>

        {/* Events Display */}
        <div className="events-container">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              Loading events...
            </div>
          ) : error ? (
            <div className="error-message">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {error}
              <button onClick={fetchEvents} className="retry-button">
                Try Again
              </button>
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p className="event-date">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {event.location && (
                  <p className="event-location">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {event.location}
                  </p>
                )}
                {event.description && <p className="event-description">{event.description}</p>}
              </div>
            ))
          ) : (
            <div className="no-events">
              {searchTerm ? `No events found matching "${searchTerm}"` : 'No events available'}
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .search-container {
          margin: 20px 0;
          max-width: 600px;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          padding: 12px 16px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .search-box:focus-within {
          border-color: #4f46e5;
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.15);
        }

        .search-icon {
          color: #6b7280;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
          color: #374151;
          background: transparent;
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .clear-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          color: #6b7280;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clear-button:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .search-results-count {
          margin-top: 8px;
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .events-container {
          margin-top: 30px;
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }

        .loading {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
          font-size: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #4f46e5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .error-message {
          text-align: center;
          padding: 40px 20px;
          color: #dc2626;
          font-size: 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .retry-button {
          background: #dc2626;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .retry-button:hover {
          background: #b91c1c;
        }

        .event-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .event-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .event-card h3 {
          margin: 0 0 12px 0;
          color: #111827;
          font-size: 18px;
          font-weight: 600;
        }

        .event-date,
        .event-location {
          margin: 0 0 8px 0;
          color: #6b7280;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .event-description {
          margin: 12px 0;
          color: #374151;
          font-size: 14px;
          line-height: 1.5;
        }

        .event-organization {
          background: #4f46e5;
          color: white;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-block;
          margin-top: 12px;
        }

        .no-events {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
          font-size: 16px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        @media (max-width: 768px) {
          .search-container {
            max-width: 100%;
          }

          .search-box {
            padding: 10px 14px;
          }

          .search-input {
            font-size: 16px; /* Prevents zoom on iOS */
          }

          .events-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </article>
  );
}
