import React from 'react';
import { useNavigate } from 'react-router-dom'
import '../styles/ExecDashboard.css';
import { handleLogout } from './Auth';


export default function StudentDashboard() {
  const navigate = useNavigate();
  
  return (
    <article className="dashboard">
      <header className="ExecHeader">
        <h1>Clubs Connect</h1>
        <nav>
          <ul className="nav-links">
             <li>
              <button
                onClick={() => navigate('/profile')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Profile
              </button>
            </li>
            <li>
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

      <main>
      <h1>EXEC Dashboard</h1>
      
    </main>

    </article>
  );

}



