import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/StudentDashboard.css';
import { handleLogout } from './Auth';


// Add active class to navigation links when clicked
document.querySelectorAll('.nav-links').forEach(link => {
    link.addEventListener('click', function() {
        // Remove active class from all links
        document.querySelectorAll('.nav-links').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
    });
});
export default function StudentHeader(){
    const navigate = useNavigate();
    return(
        <header className="StudentHeader">
            <h1>Clubs Connect</h1>
            <nav>
              <ul className="nav-bar">
                 <li className='nav-links'>
                  <button
                    onClick={() => navigate('/dashboard/student')}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                  >
                    NewsFeed
                  </button>
                </li>
                 <li className='nav-links'>
                  <button
                    onClick={() => navigate('/dashboard/exec')}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                  >
                    Search
                  </button>
                </li>
                 <li className='nav-links'>
                  <button
                    onClick={() => navigate('/chat')}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                  >
                    Chat
                  </button>
                </li>
                 <li className='nav-links'>
                  <button
                    onClick={() => navigate('/profile/student')}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                  >
                    Profile
                  </button>
                </li>
                <li className='nav-links'>
                  <button
                  onClick={async () => {
                    await handleLogout();
                    navigate('/auth');     
                  }}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                >
                  Logout
                </button>
                </li>
          
              </ul>
            </nav>
          </header>

    )
}
    