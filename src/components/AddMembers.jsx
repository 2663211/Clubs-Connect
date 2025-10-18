import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/AddMembers.css';

export default function AddMembersPage() {
  const { id } = useParams(); // cso_id
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cso, setCso] = useState(null);

  // State for the confirmation modal
  const [addModal, setAddModal] = useState({ open: false, userId: null });
  const [removeModal, setRemoveModal] = useState({ open: false, userId: null });

  const fetchCSO = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('cso').select('id, name').eq('id', id).single();
      if (error) throw error;
      setCso(data);
    } catch (err) {
      console.error('Failed to fetch CSO:', err.message);
    }
  }, [id]);

  const fetchMembers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('cso_members')
        .select('student_number, profiles:student_number (id, full_name, role, avatar_url)')
        .eq('cso_id', id);
      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  }, [id]);

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, avatar_url')
        .order('full_name', { ascending: true });
      if (error) throw error;

      const memberIds = members.map(m => m.student_number);
      const availableUsers = data ? data.filter(u => !memberIds.includes(u.id)) : [];
      setUsers(availableUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [members]);

  useEffect(() => {
    fetchCSO();
    fetchMembers();
  }, [fetchCSO, fetchMembers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleAddMember(studentId) {
    try {
      const { error } = await supabase
        .from('cso_members')
        .insert([{ cso_id: id, student_number: studentId }]);
      if (error) throw error;

      const addedUser = users.find(u => u.id === studentId);
      setMembers([...members, { student_number: studentId, profiles: addedUser }]);
      setUsers(users.filter(u => u.id !== studentId));
      setAddModal({ open: false, userId: null });
    } catch (err) {
      console.error('Failed to add member:', err.message);
      alert('❌ Failed to add member');
    }
  }

  async function handleRemoveMember(studentId) {
    try {
      const { error } = await supabase
        .from('cso_members')
        .delete()
        .eq('cso_id', id)
        .eq('student_number', studentId);
      if (error) throw error;

      setMembers(members.filter(m => m.student_number !== studentId));
      setUsers([...users, members.find(m => m.student_number === studentId).profiles]);
      setRemoveModal({ open: false, userId: null });
    } catch (err) {
      console.error('Failed to remove member:', err.message);
      alert('❌ Failed to remove member');
    }
  }

  return (
    <main>
      <header className="addmembers-header">
        <h1>Add Members to {cso?.name || 'CSO'}</h1>
        <button className="am-back-button" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
      </header>

      {/* --- Current Members --- */}
      <section className="addmembers-section">
        <h2>Current Members</h2>
        <header className="addmembers-user-header">
          <span className="am-avatar-text">Avatar</span>
          <span className="am-name-text">Name</span>
          <span className="am-role-text">Role</span>
          <span className="am-action-text">Action</span>
        </header>

        {members.length === 0 ? (
          <p className="addmembers-empty">No members yet.</p>
        ) : (
          members.map(m => (
            <article key={m.student_number} className="addmembers-user-row">
              {m.profiles?.avatar_url ? (
                <img src={m.profiles.avatar_url} alt={m.profiles.full_name} className="am-avatar" />
              ) : (
                <span className="am-avatar-placeholder">{m.profiles?.full_name[0]}</span>
              )}
              <span className="am-name-text">{m.profiles?.full_name}</span>
              <span className="am-role-text">{m.profiles?.role}</span>
              <span className="am-action-text">
                <button onClick={() => setRemoveModal({ open: true, userId: m.student_number })}>
                  Remove from CSO
                </button>
              </span>
            </article>
          ))
        )}
      </section>

      {/* --- All Users --- */}
      <section className="addmembers-section">
        <h2>All Users</h2>
        <header className="addmembers-user-header">
          <span className="am-avatar-text">Avatar</span>
          <span className="am-name-text">Name</span>
          <span className="am-role-text">Role</span>
          <span className="am-action-text">Action</span>
        </header>

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map(user => (
            <article key={user.id} className="addmembers-user-row">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="am-avatar" />
              ) : (
                <span className="am-avatar-placeholder">{user.full_name[0]}</span>
              )}
              <span className="am-name-text">{user.full_name}</span>
              <span className="am-role-text">{user.role}</span>
              <span className="am-action-text">
                <button onClick={() => setAddModal({ open: true, userId: user.id })}>
                  Add to CSO
                </button>
              </span>
            </article>
          ))
        )}
      </section>

      {/* --- Confirmation Modal --- */}
      {addModal.open && (
        <aside className="am-modal-overlay" role="dialog" aria-modal="true">
          <section className="am-modal">
            <header>
              <h2>Confirm Add Member</h2>
            </header>
            <p>
              Are you sure you want to add {users.find(u => u.id === addModal.userId)?.full_name} to{' '}
              {cso?.name}?
            </p>
            <footer className="am-modal-actions">
              <button onClick={() => handleAddMember(addModal.userId)}>Yes, Add</button>
              <button onClick={() => setAddModal({ open: false, userId: null })}>Cancel</button>
            </footer>
          </section>
        </aside>
      )}

      {removeModal.open && (
        <aside className="am-modal-overlay" role="dialog" aria-modal="true">
          <section className="am-modal">
            <header>
              <h2>Confirm Remove Member</h2>
            </header>
            <p>
              Are you sure you want to remove{' '}
              {members.find(m => m.student_number === removeModal.userId)?.profiles?.full_name} from{' '}
              {cso?.name}?
            </p>
            <footer className="am-modal-actions">
              <button onClick={() => handleRemoveMember(removeModal.userId)}>Yes, Remove</button>
              <button onClick={() => setRemoveModal({ open: false, userId: null })}>Cancel</button>
            </footer>
          </section>
        </aside>
      )}
    </main>
  );
}
