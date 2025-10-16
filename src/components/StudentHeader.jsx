import React, { use, useState } from 'react';
import { TiThMenu } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import '../styles/StudentDashboard.css';
import { handleLogout } from './Auth';

// Add active class to navigation links when clicked
document.querySelectorAll('.nav-links').forEach(link => {
  link.addEventListener('click', function () {
    // Remove active class from all links
    document.querySelectorAll('.nav-links').forEach(l => l.classList.remove('active'));

    // Add active class to clicked link
    this.classList.add('active');
  });
});


export default function StudentHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu =() =>{
    setIsOpen(!isOpen)
  }
  const navigate = useNavigate();
  return (
    <header className="StudentHeader">
      <h1>Clubs Connect</h1>
      <nav>
        <ul className={isOpen ? "nav-bar active" : "nav-bar"}>
          <li className="nav-links">
            <button onClick={() => navigate('/dashboard/student')}>NewsFeed</button>
          </li>
          {/* <li className="nav-links">
            <button onClick={() => navigate('/search')}>Search</button>
          </li> */}

          {/* <li className="nav-links">
            <button onClick={() => navigate('/chat')}>Chat</button>
          </li> */}
          <li className="nav-links">
            <button
              onClick={() => navigate('/events')}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Events
            </button>
          </li>
          {/* <li className="nav-links">
            <button
              onClick={() => navigate('/search')}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Search
            </button>

            <button onClick={() => navigate('/chat')}>Chat</button>
          </li> */}

          <li className="nav-links">
            <button onClick={() => navigate('/profile/student')}>Profile</button>
          </li>
          <li className="nav-links">
            <button
              onClick={async () => {
                await handleLogout();
                navigate('/auth');
              }}
            >
              Logout
            </button>
          </li>
        </ul>
        <section className="icon" onClick={toggleMenu}>
          <TiThMenu />
        </section>
      </nav>
    </header>
  );
}
