import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';
import Footer from './Footer';
import Card from './Card';
import clubImage from '../images/clubs.png';
import events from '../images/event.jpg';
import collab from '../images/collab.jpg';

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <>
      <header className="HomePageHeader">
        <img src="logo192.png" alt="Clubs Connect" className="logo" />
        <nav>
          <ul>
            <li>
              <button
                onClick={() => navigate('/auth', { state: { form: 'signup' } })}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Sign Up
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/auth', { state: { form: 'login' } })}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Log In
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="HomePageMain">
        <h1>Welcome to Clubs Connect</h1>
        <p>Your one-stop platform for all club activities and events.</p>
        <section className="card-container">
          <Card
            image={clubImage}
            description="Clubs for every interest—explore cultural, academic, business, political, religion and social groups to enrich your campus experience."
          />
          <Card
            image={events}
            description="Stay informed about upcoming club events, important announcements, and the latest news."
          />
          <Card
            image={collab}
            description="Collaborate with diverse clubs to create memorable experiences and foster lasting connections across campus."
          />
        </section>
      </main>

      <Footer />
    </>
  );
}
