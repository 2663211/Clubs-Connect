import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentDashboard.css';
import StudentHeader from './StudentHeader';

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <article className="dashboard">
      <StudentHeader />

      <main>
        <h1>Student Dashboard</h1>

        <p>Welcome, student! Here you can view your clubs, events, and updates.</p>
        <button
          onClick={() => navigate('/entities/sgo')}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Entities
        </button>
      </main>
    </article>
  );
}
