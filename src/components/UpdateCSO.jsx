import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/addCSO.css';
import '../styles/UpdateCSO.css';

function ExecutiveSearch({ executives, selectedExecutives, onAdd, onRemove }) {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const availableExecutives = executives.filter(exec => {
    const matchesSearch = exec.name.toLowerCase().includes(search.toLowerCase());
    const notSelected = !selectedExecutives.find(selected => selected.id === exec.id);
    return matchesSearch && notSelected;
  });

  const selectExecutive = exec => {
    onAdd(exec);
    setSearch('');
    setShowSuggestions(false);
  };

  return (
    <section>
      <input
        type="search"
        placeholder="Type to search executives..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
      />

      {showSuggestions && availableExecutives.length > 0 && (
        <ul className="suggestions-dropdown">
          {availableExecutives.map(exec => (
            <li key={exec.id} onMouseDown={() => selectExecutive(exec)}>
              {exec.name}
            </li>
          ))}
        </ul>
      )}

      {selectedExecutives.length > 0 && (
        <section>
          <strong>Selected executives:</strong>
          <ul className="executive-chips">
            {selectedExecutives.map(exec => (
              <li key={exec.id} className="chip">
                {exec.name}
                <button type="button" onClick={() => onRemove(exec.id)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}

export default function UpdateCSO({ cso, onUpdateSuccess }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cluster: '',
    subscription: '',
    executives: [],
  });
  const [logoFile, setLogoFile] = useState(null);
  const [executives, setExecutives] = useState([]);
  const [selectedExecutives, setSelectedExecutives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Prefill CSO data
  useEffect(() => {
    if (cso) {
      setFormData({
        name: cso.name || '',
        description: cso.description || '',
        cluster: cso.cluster || '',
        subscription: cso.subscription || '',
        executives: cso.executives?.map(e => e.exec_id) || [],
      });
      setSelectedExecutives(cso.executives || []);
    }
    loadExecutives();
  }, [cso]);

  async function loadExecutives() {
    try {
      const { data: execData } = await supabase.from('executive').select('id, "student_number"');
      if (!execData || execData.length === 0) return;

      const studentNumbers = execData.map(e => e['student_number']).filter(Boolean);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', studentNumbers);

      const executivesWithNames = execData.map(exec => ({
        id: exec.id,
        student_number: exec['student_number'],
        name: profiles?.find(p => p.id === exec['student_number'])?.full_name || 'Unknown',
      }));
      setExecutives(executivesWithNames);
    } catch {
      setMessage('Failed to load executives');
      setMessageType('error');
    }
  }

  function updateField(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function addExecutive(exec) {
    setSelectedExecutives([...selectedExecutives, exec]);
    setFormData(prev => ({
      ...prev,
      executives: [...prev.executives, exec.id],
    }));
  }

  function removeExecutive(execId) {
    setSelectedExecutives(prev => prev.filter(e => e.id !== execId));
    setFormData(prev => ({
      ...prev,
      executives: prev.executives.filter(id => id !== execId),
    }));
  }

  function selectLogoFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file');
      setMessageType('error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size must be less than 5MB');
      setMessageType('error');
      return;
    }

    setLogoFile(file);
    setMessage('');
  }

  async function uploadLogo(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

    const { error } = await supabase.storage.from('cso-logos').upload(fileName, file);
    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from('cso-logos').getPublicUrl(fileName);
    return publicUrl;
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let logo_url = cso.logo_url;
      if (logoFile) logo_url = await uploadLogo(logoFile);

      const { error } = await supabase
        .from('cso')
        .update({
          name: formData.name,
          description: formData.description,
          cluster: formData.cluster,
          subscription: formData.subscription,
          logo_url,
        })
        .eq('id', cso.id);

      if (error) throw error;

      // Update executives: delete old links first
      await supabase.from('cso_exec').delete().eq('cso_id', cso.id);
      if (formData.executives.length > 0) {
        const links = formData.executives.map(execId => ({
          cso_id: cso.id,
          exec_id: execId,
          portfolio: 'Member',
          can_post: true,
          start_date: new Date().toISOString().split('T')[0],
        }));
        const { error: linkError } = await supabase.from('cso_exec').insert(links);
        if (linkError) throw linkError;
      }

      setMessage('CSO updated successfully!');
      setMessageType('success');
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      setMessage(err.message || 'Failed to update CSO');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="add-cso-container">
      <h1>Update {formData.name || 'CSO'}</h1>
      {message && <p className={`status-message ${messageType}`}>{message}</p>}

      <form onSubmit={handleUpdate} className="cso-form">
        <label>
          Logo
          <input type="file" accept="image/*" onChange={selectLogoFile} />
          <small>Upload an image file (max 5MB)</small>
        </label>

        <label>
          CSO Name *
          <input
            type="text"
            value={formData.name}
            onChange={e => updateField('name', e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={formData.description}
            onChange={e => updateField('description', e.target.value)}
            rows="3"
          />
        </label>

        <label>
          Cluster *
          <select
            value={formData.cluster}
            onChange={e => updateField('cluster', e.target.value)}
            required
          >
            <option value="">Select a cluster...</option>
            <option value="political">Political Cluster</option>
            <option value="academic">Academic Cluster</option>
            <option value="social">Social Cluster</option>
            <option value="cultural">Cultural Cluster</option>
            <option value="religious">Religious Cluster</option>
            <option value="sport">WITS Sport</option>
            <option value="council">School Council</option>
          </select>
        </label>

        <fieldset className="subscription">
          <legend>Subscription Required</legend>
          <label>
            <input
              type="radio"
              value="no"
              checked={formData.subscription === 'no'}
              onChange={e => updateField('subscription', e.target.value)}
            />{' '}
            No
          </label>
          <label>
            <input
              type="radio"
              value="yes"
              checked={formData.subscription === 'yes'}
              onChange={e => updateField('subscription', e.target.value)}
            />{' '}
            Yes
          </label>
        </fieldset>

        <fieldset>
          <legend>Executive(s)</legend>
          <ExecutiveSearch
            executives={executives}
            selectedExecutives={selectedExecutives}
            onAdd={addExecutive}
            onRemove={removeExecutive}
          />
        </fieldset>

        <footer className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update CSO'}
          </button>
          <button type="button" onClick={() => navigate('/entities/sgo')}>
            Cancel
          </button>
        </footer>
      </form>
    </main>
  );
}
