import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card.js';
import '../styles/SGODashboard.css';

export default function SGODashboard() {
  const navigate = useNavigate();

  function cards() {
    return (
      <>
        <section className="card-container">
          <Card imageUrl="../images/clubs.png" description="Students" />
          <Card imageUrl="../images/clubs.png" description="Executives" />

          <Card
            imageUrl="../images/clubs.png"
            description="CSOs"
            onClick={() => navigate('/CSO')}
          />
        </section>
      </>
    );
  }

  return (
    <main>
      <h1>SGO Dashboard</h1>
      <p>
        Welcome, SGO member! Here you can manage clubs, approve events, and view
        student activities.
      </p>

      {/* Example usage of cards() to remove warning */}
      {cards()}
    </main>
  );
}
