import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/addCSO.css';

// Simplified Executive Search Component
function ExecutiveSearch({ executives, selectedExecutives, onAdd, onRemove }) {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter out already selected executives
  const availableExecutives = executives.filter((exec) => {
    const matchesSearch = exec.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const notSelected = !selectedExecutives.find(
      (selected) => selected.id === exec.id
    );
    return matchesSearch && notSelected;
  });

  const selectExecutive = (executive) => {
    onAdd(executive);
    setSearch('');
    setShowSuggestions(false);
  };

  return (
    <section>
      <input
        type="search"
        placeholder="Type to search executives..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
      />

      {/* Show suggestions dropdown */}
      {showSuggestions && search && availableExecutives.length > 0 && (
        <ul className="suggestions-dropdown">
          {availableExecutives.map((exec) => (
            <li key={exec.id} onClick={() => selectExecutive(exec)}>
              {exec.name}
            </li>
          ))}
        </ul>
      )}

      {/* Show selected executives */}
      {selectedExecutives.length > 0 && (
        <section>
          <strong>Selected executives:</strong>
          <ul className="executive-chips">
            {selectedExecutives.map((exec) => (
              <li key={exec.id} className="chip">
                {exec.name}
                <button onClick={() => onRemove(exec.id)}>×</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}

// Main Add CSO Component
function AddCSO() {
  const navigate = useNavigate();

  // Initial form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cluster: '',
    subscription: '',
    executives: [],
  });

  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [executives, setExecutives] = useState([]);
  const [selectedExecutives, setSelectedExecutives] = useState([]);

  // Load executives on component mount
  useEffect(() => {
    loadExecutives();
  }, []);

  // Simplified function to load executives
  async function loadExecutives() {
    try {
      // Get executive records
      const { data: execData } = await supabase
        .from('executive')
        .select('id, "student/staff_number"');

      if (!execData || execData.length === 0) return;

      // Get profile names
      const studentNumbers = execData
        .map((e) => e['student/staff_number'])
        .filter(Boolean);

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', studentNumbers);

      // Combine data
      const executivesWithNames = execData.map((exec) => ({
        id: exec.id,
        student_staff_number: exec['student/staff_number'],
        name:
          profiles?.find((p) => p.id === exec['student/staff_number'])
            ?.full_name || 'Unknown',
      }));

      setExecutives(executivesWithNames);
    } catch (error) {
      showMessage('Failed to load executives', 'error');
    }
  }

  // Helper function to show messages
  function showMessage(text, type = 'info') {
    setMessage(text);
    setMessageType(type);
  }

  // Handle form field changes
  function updateField(fieldName, value) {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  }

  // Handle executive selection
  function addExecutive(executive) {
    setSelectedExecutives([...selectedExecutives, executive]);
    setFormData((prev) => ({
      ...prev,
      executives: [...prev.executives, executive.id],
    }));
  }

  // Handle executive removal
  function removeExecutive(executiveId) {
    setSelectedExecutives((prev) => prev.filter((e) => e.id !== executiveId));
    setFormData((prev) => ({
      ...prev,
      executives: prev.executives.filter((id) => id !== executiveId),
    }));
  }

  // Handle logo file selection
  function selectLogoFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      showMessage('Please select an image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showMessage('File size must be less than 5MB', 'error');
      return;
    }

    setLogoFile(file);
    showMessage('');
  }

  // Upload logo to storage
  async function uploadLogo(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('cso-logos')
      .upload(fileName, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from('cso-logos').getPublicUrl(fileName);

    return publicUrl;
  }

  // Handle form submission
  async function createCSO(event) {
    event.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.cluster) {
        throw new Error('Name and cluster are required');
      }

      // Upload logo if selected
      let logo_url = null;
      if (logoFile) {
        logo_url = await uploadLogo(logoFile);
      }

      // Create CSO record
      const { data: cso, error } = await supabase
        .from('cso')
        .insert([
          {
            name: formData.name,
            description: formData.description,
            cluster: formData.cluster,
            subscription: formData.subscription,
            logo_url,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Link executives if any selected
      if (formData.executives.length > 0) {
        const links = formData.executives.map((execId) => ({
          cso_id: cso.id,
          exec_id: execId,
          portfolio: 'Member',
          can_post: true,
          start_date: new Date().toISOString().split('T')[0],
        }));

        const { error: linkError } = await supabase
          .from('cso_exec')
          .insert(links);

        if (linkError) throw linkError;
      }

      // Success - redirect
      showMessage('CSO created successfully!', 'success');
      setTimeout(() => navigate('/entities/sgo'), 2000);
    } catch (error) {
      showMessage(error.message || 'Failed to create CSO', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="add-cso-container">
      <h1>Add a club, society, or organization</h1>

      {message && <p className={`status-message ${messageType}`}>{message}</p>}

      <form onSubmit={createCSO} className="cso-form">
        {/* Logo Upload */}
        <label>
          Logo
          <input type="file" accept="image/*" onChange={selectLogoFile} />
          <small>Upload an image file (max 5MB)</small>
        </label>

        {/* CSO Name */}
        <label>
          CSO Name *
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />
        </label>

        {/* Description */}
        <label>
          Description
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows="3"
          />
        </label>

        {/* Cluster Selection */}
        <label>
          Cluster *
          <select
            value={formData.cluster}
            onChange={(e) => updateField('cluster', e.target.value)}
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

        {/* Subscription Required */}
        <fieldset className="subscription">
          <legend>Subscription Required</legend>
          <label>
            <input
              type="radio"
              value="no"
              checked={formData.subscription === 'no'}
              onChange={(e) => updateField('subscription', e.target.value)}
            />
            No
          </label>
          <label>
            <input
              type="radio"
              value="yes"
              checked={formData.subscription === 'yes'}
              onChange={(e) => updateField('subscription', e.target.value)}
            />
            Yes
          </label>
        </fieldset>

        {/* Executive Selection */}
        <fieldset>
          <legend>Executive(s)</legend>
          <ExecutiveSearch
            executives={executives}
            selectedExecutives={selectedExecutives}
            onAdd={addExecutive}
            onRemove={removeExecutive}
          />
        </fieldset>

        {/* Form Actions */}
        <section className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Creating CSO...' : 'Add CSO'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/entities/sgo')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </section>
      </form>
    </main>
  );
}

export default AddCSO;

