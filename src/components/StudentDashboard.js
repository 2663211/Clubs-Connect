import React from 'react';
import { useNavigate } from 'react-router-dom'
import '../styles/StudentDashboard.css';
import { handleLogout } from './Auth';
import StudentHeader from './StudentHeader';


export default function StudentDashboard() {
  const navigate = useNavigate();
  
  return (
    <article className="dashboard">
      <StudentHeader/>

      <main>
      <h1>Student Dashboard</h1>
      <p>Welcome, student! Here you can view your clubs, events, and updates.</p>
    </main>

    </article>
  );

}



