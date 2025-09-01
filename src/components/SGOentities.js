import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SGOentities.css';
import { handleLogout } from './Auth';
import { supabase } from '../supabaseClient'; 

export default function SGODashboard() {
  const navigate = useNavigate();
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
  fetchEntities();
  }, []);

  async function fetchEntities() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('cso').select('*');
      if (error) throw error;
      setEntities(data);
    } catch (err) {
      console.error('Failed to fetch entities:', err.message);
    } finally {
      setLoading(false);
    }
  }

  
  
  return (
    <article>
      <header className="EntityHeader">
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

       <button
          className="create-entity-btn"
          onClick={() => navigate('/entities/add')}
        >
          Create Entity
        </button>

         <section className="entities-list">
          {loading ? (
            <p>Loading entities...</p>
          ) : entities.length === 0 ? (
            <p>No entities found.</p>
          ) : (
            <ul>
              {entities.map((entity) => (
                <li key={entity.id}>
                  <strong>{entity.name}</strong> — {entity.cluster}
                </li>
              ))}
            </ul>
          )}
        </section>

      </main>
    </article>
  );

}
















