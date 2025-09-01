import React from 'react';
import { useNavigate } from 'react-router-dom'
import '../styles/SGOprofile.css';
import { handleLogout } from './Auth';

export default function SGODashboard() {
  const navigate = useNavigate();
  
  return (
    <article className="dashboard">
      <header className="ProfileHeader">
        <h1>Clubs Connect</h1>
        <nav>
          <ul className="nav-links">
             <li>
              <button
                onClick={() => navigate('/dashboard/sgo')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Dashborad
              </button>
            </li>
             <li>
              <button
                onClick={() => navigate('/entities/sgo')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Entities
              </button>
            </li>
             <li>
              <button
                onClick={() => navigate('/profile/sgo')}
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

      <main className="content">

        <h1>YOU WILL VIEW YOUR PROFILE HERE</h1>
        
        



      </main>
    </article>
  );

}
