import React, { useEffect, useState } from "react";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/events"); // server API
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (!events.length) return <p>No upcoming events.</p>;

  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.title}</strong> <br />
            {new Date(event.date).toLocaleString()} <br />
            {event.location} <br />
            {event.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
