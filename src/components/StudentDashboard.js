import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentDashboard.css';
import StudentHeader from './StudentHeader';
import Search from './Search';

export default function StudentDashboard() {
  // const navigate = useNavigate();

  return (
    <article className="dashboard">
      <StudentHeader />
      <Search />
    </article>
  );
}
