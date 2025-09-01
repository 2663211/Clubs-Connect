import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SGOentities.css';
import { handleLogout } from './Auth';
import { supabase } from '../supabaseClient'; 

export default function SGODashboard() {
  const navigate = useNavigate();
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('success'); // 'success' | 'error' | 'info'



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

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    entityId: null,
  });

async function handleDelete(entityId) {

  try {
    const entityToDelete = entities.find(e => e.id === entityId);

    const { error } = await supabase
      .from('cso')
      .delete()
      .eq('id', entityId);

    if (error) throw error;

    setEntities(prev => prev.filter(e => e.id !== entityId));

    // Show success message
    setStatusMessage(`${entityToDelete?.name} has been deleted successfully.`);
    setStatusType('success');

    // Hide message after 3 seconds
    setTimeout(() => setStatusMessage(''), 3000);

  } catch (err) {
    console.error('Failed to delete entity:', err.message);
    setStatusMessage('Failed to delete entity. Please try again.');
    setStatusType('error');

    setTimeout(() => setStatusMessage(''), 3000);
  } finally {
    setDeleteModal({ open: false, entityId: null });
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

        {statusMessage && (
          <p className={`status-message ${statusType}`}>
            {statusMessage}
          </p>
        )}


        <section className="entities-grid">
          {loading ? (
            <p>Loading entities...</p>
          ) : entities.length === 0 ? (
            <p>No entities found.</p>
          ) : (
            entities.map((entity, index) => (
              <article key={entity.id} className="entity-card">
                {entity.logo_url && (
                  <img
                    src={entity.logo_url}
                    alt={entity.name}
                    className="entity-logo"
                  />
                )}
                <header>
                  <h2>{entity.name}</h2>
                  <p className="entity-cluster">{entity.cluster}</p>
                </header>

                {entity.description && (
                  <section className="entity-description">
                    <p>{entity.description}</p>
                  </section>
                )}

                <footer>
                  <button
                    className="btn-delete"
                    onClick={() =>
                      setDeleteModal({ open: true, entityId: entity.id })
                    }
                  >
                    Delete Entity
                  </button>
                </footer>
              </article>
            ))
          )}
        </section>

       {deleteModal.open && (
        <aside className="modal-overlay" role="dialog" aria-modal="true">
          <section className="modal">
            <header>
              <h2>Confirm Deletion</h2>
            </header>
            <p>
              Are you sure you want to delete{' '}
              {entities.find(e => e.id === deleteModal.entityId)?.name}?
            </p>
            <footer className="modal-actions">
              <button
                onClick={() => handleDelete(deleteModal.entityId)}
              >
                Yes, Delete
              </button>
              <button
                onClick={() =>
                  setDeleteModal({ open: false, entityId: null })
                }
              >
                Cancel
              </button>
            </footer>
          </section>
        </aside>
      )}
    

      </main>


    </article>
  );

}
















