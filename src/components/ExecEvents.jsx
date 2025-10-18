import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/Execevents.css';

import StudentHeader from './StudentHeader';
import { supabase } from '../supabaseClient';

const API_BASE_URL = 'https://api.allorigins.win/raw?url=https://clubs-connect-api.onrender.com';

console.log('Using API URL:', API_BASE_URL);

export default function StudentDashboard(entityId) {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);

  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New event state
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    exec_id: null, // initialize as null
    poster_image: '',
    category: '',
  });

  // Fetch events

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'GET',

        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const now = new Date();
      const upcoming = Array.isArray(data) ? data.filter(event => new Date(event.date) >= now) : [];

      setEvents(upcoming);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(`Failed to load events: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user, role, and exec_id
  useEffect(() => {
    const fetchUserAndRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);

        // Fetch role from profiles
        const { data: profile, error: profileError } = await supabase

          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) console.error('Error fetching role:', profileError.message);
        else setRole(profile?.role || null);

        // Fetch exec_id from executive table
        const { data: exec, error: execError } = await supabase
          .from('executive')
          .select('id')
          .eq('student_number', user.id)
          .single();

        if (execError) console.error('Error fetching exec_id:', execError.message);
        else setNewEvent(prev => ({ ...prev, exec_id: exec?.id || null }));
      } else {
        setUser(null);
        setRole(null);
      }
    };

    fetchUserAndRole();

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(
    event =>
      event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event?.location?.toLowerCase().includes(searchTerm.toLowerCase())
    //event?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = e => setSearchTerm(e.target.value);
  const clearSearch = () => setSearchTerm('');

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async e => {
    e.preventDefault();

    try {
      let posterUrl = '';

      if (file) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('event_posters')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('event_posters').getPublicUrl(filePath);

        posterUrl = data.publicUrl;
      }

      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEvent,
          poster_image: posterUrl, // attach uploaded URL here
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      await fetchEvents();
      setIsModalOpen(false);

      // reset
      setNewEvent({
        title: '',
        date: '',
        location: '',
        description: '',
        exec_id: newEvent.exec_id,
        category: '',
        poster_image: '',
      });
      setFile(null);
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event.');
    }
  };

  async function createCalendarEvent(event) {
    const token = sessionStorage.getItem('provider_token');

    if (!token) {
      if (window.confirm('You need to connect Google Calendar. Connect now?')) {
        const clientId = '6362194905-pmodrrbvhbvqpcqnqcm3blupqkb96fbl.apps.googleusercontent.com';
        const redirectUri = window.location.origin + window.location.pathname;
        const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.events');
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&prompt=consent`;

        window.location.href = authUrl;
      }
      return;
    }

    const calendarEvent = {
      summary: event.title || 'Untitled Event',
      description: event.description,
      start: {
        dateTime: new Date(event.date).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(new Date(event.date).getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    try {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(calendarEvent),
        }
      );

      const data = await response.json();
      if (response.ok) alert('Event created! Check your Google Calendar.');
      else alert('Failed to create event: ' + (data.error?.message || 'Unknown error'));
    } catch (err) {
      console.error('Calendar error:', err);
      alert('Something went wrong adding to calendar.');
    }
  }

  useEffect(() => {
    if (window.location.hash.includes('access_token')) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const token = params.get('access_token');
      if (token) sessionStorage.setItem('provider_token', token);
      window.location.hash = '';
    }
  }, []);

  const handleFileChange = e => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('event_posters')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('event_posters').getPublicUrl(filePath);
      const postersUrl = data.publicUrl;

      const postersType = file.type.startsWith('image')
        ? 'image'
        : file.type.startsWith('video')
          ? 'video'
          : 'audio';

      const { error: insertError } = await supabase.from('event_posters').insert([
        {
          media_url: postersUrl,
          media_type: postersType,
          exec_id: entityId,
        },
      ]);

      if (insertError) throw insertError;

      alert('Event poster uploaded successfully!');
      setFile(null);
      window.location.reload();
    } catch (error) {
      console.error('Error uploading event poster:', error);
      alert('Failed to upload event poster.');
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <StudentHeader />

      <main>
        <div className="page-content">
          <h1 style={{ textAlign: 'center', color: '#043673', fontFamily: 'Kavoon', fontSize: 64 }}>
            Upcoming Events
          </h1>

          {role === 'exec' && (
            <button className="CreateEvent" onClick={() => setIsModalOpen(true)}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Create New Event</span>
            </button>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <>
            <div className="overlay" onClick={() => setIsModalOpen(false)} />
            <div className="modal">
              <div className="modal-header">
                <button className="close-button" onClick={() => setIsModalOpen(false)}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCreateEvent} className="event-form">
                  <label>
                    Title
                    <input
                      type="text"
                      name="title"
                      value={newEvent.title}
                      onChange={handleInputChange}
                      required
                    />
                  </label>

                  <label>
                    Date & Time
                    <input
                      type="datetime-local"
                      name="date"
                      value={newEvent.date}
                      onChange={handleInputChange}
                      required
                    />
                  </label>

                  <label>
                    Location
                    <input
                      type="text"
                      name="location"
                      value={newEvent.location}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Category
                    <input
                      type="text"
                      name="category"
                      value={newEvent.category}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Description
                    <textarea
                      name="description"
                      value={newEvent.description}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Event Poster Image
                    <input
                      type="file"
                      id="fileInput"
                      name="poster_image"
                      accept=".jpg,.png,.jpeg"
                      onChange={handleFileChange}
                    ></input>
                  </label>
                  <button type="submit" className="submit-btn">
                    Save Event
                  </button>
                </form>
              </div>
            </div>
          </>
        )}

        {/* Search + Events */}

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
              placeholder="Search events..."
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
              filteredEvents.map((event, index) => (
                <div key={event.id || index} className="event-card">
                  <h3>{event.title || 'Untitled Event'}</h3>

                  <p className="event-date">
                    {event.date ? new Date(event.date).toLocaleString() : 'Date TBD'}
                  </p>
                  {event.location && <p className="event-location">{event.location}</p>}
                  {event.description && (
                    <>
                      <p className="event-description">{event.description}</p>
                      {event.poster_image && (
                        <img
                          src={event.poster_image}
                          alt={`${event.title} poster`}
                          className="event-poster"
                        />
                      )}

                      <button
                        className="add-to-calendar-btn"
                        onClick={() => createCalendarEvent(event)}
                      >
                        Add to Calendar
                      </button>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="no-events">No events available</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
