import React, { useState, useEffect } from 'react';
import '../styles/StudySessions.css';
import StudentHeader from './StudentHeader';

// Using CORS proxy to bypass CORS restrictions
const API_BASE_URL = 'https://corsproxy.io/?https://studynester.onrender.com';

console.log('Using API URL:', API_BASE_URL);

export default function StudySessions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState([]);
  const [sessions, setSessions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch groups and their sessions
  const fetchGroupsAndSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all groups
      const groupsResponse = await fetch(`${API_BASE_URL}/groups`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!groupsResponse.ok) throw new Error(`HTTP error! status: ${groupsResponse.status}`);

      const groupsData = await groupsResponse.json();
      const groupsList = Array.isArray(groupsData) ? groupsData : [];
      setGroups(groupsList);

      // Fetch sessions for each group
      const sessionPromises = groupsList.map(group =>
        fetch(`${API_BASE_URL}/sessions/${group.id}`)
          .then(res => (res.ok ? res.json() : []))
          .catch(() => [])
      );

      const sessionResults = await Promise.all(sessionPromises);
      const sessionMap = {};

      groupsList.forEach((group, index) => {
        sessionMap[group.id] = Array.isArray(sessionResults[index]) ? sessionResults[index] : [];
      });

      setSessions(sessionMap);
    } catch (error) {
      console.error('Error fetching groups and sessions:', error);
      setError(`Failed to load study sessions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupsAndSessions();
  }, []);

  // Get all sessions with their group info for searching
  const getAllSessionsWithGroups = () => {
    const allSessions = [];
    groups.forEach(group => {
      const groupSessions = sessions[group.id] || [];
      groupSessions.forEach(session => {
        allSessions.push({
          ...session,
          groupName: group.name,
          groupDescription: group.description,
          groupId: group.id,
        });
      });
    });
    return allSessions;
  };

  const filteredSessions = getAllSessionsWithGroups().filter(session => {
    const searchLower = searchTerm.toLowerCase();
    return (
      session?.title?.toLowerCase().includes(searchLower) ||
      session?.description?.toLowerCase().includes(searchLower) ||
      session?.location?.toLowerCase().includes(searchLower) ||
      session?.groupName?.toLowerCase().includes(searchLower) ||
      session?.groupDescription?.toLowerCase().includes(searchLower)
    );
  });

  const handleSearchChange = e => setSearchTerm(e.target.value);
  const clearSearch = () => setSearchTerm('');

  const formatDateTime = dateString => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="dashboard">
      <StudentHeader />

      <main>
        <div className="page-content">
          <h1 style={{ textAlign: 'center', color: '#043673', fontFamily: 'Kavoon', fontSize: 64 }}>
            Study Sessions
          </h1>
        </div>

        {/* Search */}
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
              placeholder="Search study sessions..."
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
              {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} found
            </div>
          )}

          {/* Sessions Display */}
          <div className="events-container">
            {loading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                Loading study sessions...
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
                <button onClick={fetchGroupsAndSessions} className="retry-button">
                  Try Again
                </button>
              </div>
            ) : filteredSessions.length > 0 ? (
              filteredSessions.map((session, index) => (
                <div key={session.id || index} className="event-card">
                  <h3>{session.title || 'Untitled Session'}</h3>

                  <p className="event-date">
                    <strong>Group:</strong> {session.groupName}
                  </p>

                  <p className="event-date">
                    <strong>Start:</strong> {formatDateTime(session.start_time)}
                  </p>

                  <p className="event-date">
                    <strong>End:</strong> {formatDateTime(session.end_time)}
                  </p>

                  {session.location && (
                    <p className="event-location">
                      <strong>Location:</strong> {session.location}
                    </p>
                  )}

                  {session.description && (
                    <p className="event-description">{session.description}</p>
                  )}

                  {session.groupDescription && (
                    <p
                      className="event-description"
                      style={{ fontStyle: 'italic', marginTop: '12px' }}
                    >
                      <strong>About the group:</strong> {session.groupDescription}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="no-events">No study sessions available</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
