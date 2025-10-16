import React, { useEffect, useState } from 'react';
import { MoreVertical } from 'lucide-react'; // clean icon for 3 dots (install lucide-react if not yet)
import { useNavigate } from 'react-router-dom';
import '../styles/SGOentities.css';
import { handleLogout } from './Auth';
import { supabase } from '../supabaseClient';

export default function SGOentities() {
  const navigate = useNavigate();
  const [entities, setEntities] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: '',
    type: 'success',
    visible: false,
  });

  useEffect(() => {
    fetchEntities();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('.entity-menu-container')) {
        setOpenMenu(null);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  async function fetchEntities() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('cso').select(`
        id,
        name,
        description,
        cluster,
        logo_url,
        cso_exec (
          exec_id,
          executive:exec_id (
            student_number,
            profile:student_number (full_name)
          )
        )
      `);
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

      const { error } = await supabase.from('cso').delete().eq('id', entityId);
      if (error) throw error;

      setEntities(prev => prev.filter(e => e.id !== entityId));
      setDeleteModal({ open: false, entityId: null });

      // Show success notification
      setNotification({
        message: `${entityToDelete?.name} has been deleted successfully.`,
        type: 'success',
        visible: true,
      });

      // Hide after 3 seconds
      setTimeout(() => setNotification({ message: '', type: 'success', visible: false }), 3000);
    } catch (err) {
      console.error('Failed to delete entity:', err.message);

      setNotification({
        message: 'Failed to delete entity. Please try again.',
        type: 'error',
        visible: true,
      });

      setTimeout(() => setNotification({ message: '', type: 'success', visible: false }), 3000);
    }
  }

  const toggleMenu = entityId => {
    setOpenMenu(openMenu === entityId ? null : entityId);
  };

  return (
    <article>
      <header className="EntityHeader">
        <h1>Clubs Connect</h1>
        <nav>
          <ul className="ent-nav-links">
            <li>
              <button
                onClick={() => navigate('/dashboard/sgo')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/announcements/sgo')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Announcements
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/entities/sgo')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                CSOs
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/profile/sgo')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                }}
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
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="content">
        <button className="create-entity-btn" onClick={() => navigate('/entities/add')}>
          Create CSO
        </button>

        {notification.visible && (
          <aside
            className={`notification-box ${notification.type}`}
            role="status"
            aria-live="polite"
          >
            <p>{notification.message}</p>
          </aside>
        )}

        <section className="sgocc-entities-list">
          {loading ? (
            <p>Loading entities...</p>
          ) : entities.length === 0 ? (
            <p>No entities found.</p>
          ) : (
            entities.map(entity => (
              <article key={entity.id} className="sgocc-entity-card">
                <div className="entity-menu-container">
                  <button
                    className="entity-menu-trigger"
                    onClick={() => toggleMenu(entity.id)}
                    aria-label="Entity options"
                    aria-haspopup="true"
                    aria-expanded={openMenu === entity.id}
                  >
                    <MoreVertical size={20} />
                  </button>

                  {openMenu === entity.id && (
                    <nav className="entity-dropdown-menu" role="menu">
                      <ul>
                        <li role="none">
                          <button
                            role="menuitem"
                            onClick={() => {
                              navigate(`/entities/${entity.id}`);
                              setOpenMenu(null);
                            }}
                            className="dropdown-item"
                          >
                            Go to page
                          </button>
                        </li>
                        <li role="none">
                          <button
                            role="menuitem"
                            onClick={() => {
                              navigate(`/entities/${entity.id}/members/add`);
                              setOpenMenu(null);
                            }}
                            className="dropdown-item"
                          >
                            Add Members
                          </button>
                        </li>
                        <li role="none">
                          <button
                            role="menuitem"
                            onClick={() => {
                              navigate(`/entities/${entity.id}/update`);
                              setOpenMenu(null);
                            }}
                            className="dropdown-item"
                          >
                            Update CSO
                          </button>
                        </li>
                        <li role="none">
                          <button
                            role="menuitem"
                            onClick={() => {
                              setDeleteModal({ open: true, entityId: entity.id });
                              setOpenMenu(null);
                            }}
                            className="dropdown-item dropdown-item-danger"
                          >
                            Delete CSO
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </div>

                {entity.logo_url && (
                  <img src={entity.logo_url} alt={entity.name} className="sgocc-entity-logo" />
                )}
                <header>
                  <h2>{entity.name}</h2>
                  <p className="sgocc-entity-cluster">{entity.cluster}</p>
                </header>

                {entity.description && (
                  <section className="sgocc-entity-description">
                    <p>{entity.description}</p>
                  </section>
                )}

                {/* Executives rendering */}
                {entity.cso_exec && entity.cso_exec.length > 0 && (
                  <section className="entity-executives">
                    <ul>
                      {entity.cso_exec.map(exec => (
                        <li key={exec.exec_id}>
                          Executive: {exec.executive?.profile?.full_name || 'Unknown'}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
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
                <button onClick={() => handleDelete(deleteModal.entityId)}>Yes, Delete</button>
                <button onClick={() => setDeleteModal({ open: false, entityId: null })}>
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
