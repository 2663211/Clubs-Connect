import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/UpdateCSO.css';

// Simplified Executive Search Component
function ExecutiveSearch({ executives, selectedExecutives, onAdd, onRemove }) {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter out already selected executives
  const availableExecutives = executives.filter(exec => {
    const matchesSearch = exec.name.toLowerCase().includes(search.toLowerCase());
    const notSelected = !selectedExecutives.find(selected => selected.id === exec.id);
    return matchesSearch && notSelected;
  });

  const selectExecutive = executive => {
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
        onChange={e => setSearch(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        className="update-search-input"
      />

      {/* Show suggestions dropdown */}
      {showSuggestions && availableExecutives.length > 0 && (
        <ul className="update-suggestions-dropdown">
          {availableExecutives.map(exec => (
            <li key={exec.id} onMouseDown={() => selectExecutive(exec)}>
              {exec.name}
            </li>
          ))}
        </ul>
      )}

      {/* Show selected executives */}
      {selectedExecutives.length > 0 && (
        <section>
          <strong>Selected executives:</strong>
          <ul className="update-executive-chips">
            {selectedExecutives.map(exec => (
              <li key={exec.id} className="update-chip">
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

// Main Update CSO Component
function UpdateCSO() {
  const navigate = useNavigate();
  const { csoId } = useParams(); // Get CSO ID from URL

  // Initial form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cluster: '',
    subscription: '',
    executives: [],
  });

  const [currentLogoUrl, setCurrentLogoUrl] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [executives, setExecutives] = useState([]);
  const [selectedExecutives, setSelectedExecutives] = useState([]);

  // Load CSO data and executives on component mount

  // Load existing CSO data
  const loadCSOData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch CSO details
      const { data: cso, error } = await supabase.from('cso').select('*').eq('id', csoId).single();

      if (error) throw error;

      if (!cso) {
        throw new Error('CSO not found');
      }

      // Populate form with existing data
      setFormData({
        name: cso.name || '',
        description: cso.description || '',
        cluster: cso.cluster || '',
        subscription: cso.subscription || '',
        executives: [],
      });

      setCurrentLogoUrl(cso.logo_url);

      // Load existing executives for this CSO
      const { data: csoExecs, error: execError } = await supabase
        .from('cso_exec')
        .select('exec_id, executive(id, student_number)')
        .eq('cso_id', csoId);

      if (execError) throw execError;

      if (csoExecs && csoExecs.length > 0) {
        // Get student numbers
        const studentNumbers = csoExecs.map(ce => ce.executive?.student_number).filter(Boolean);

        // Get profile names
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', studentNumbers);

        // Build selected executives list
        const selectedExecs = csoExecs.map(ce => ({
          id: ce.exec_id,
          student_number: ce.executive?.student_number,
          name: profiles?.find(p => p.id === ce.executive?.student_number)?.full_name || 'Unknown',
        }));

        setSelectedExecutives(selectedExecs);
        setFormData(prev => ({
          ...prev,
          executives: selectedExecs.map(e => e.id),
        }));
      }

      setLoading(false);
    } catch (error) {
      showMessage(error.message || 'Failed to load CSO data', 'error');
      setLoading(false);
    }
  }, [csoId]);

  // Simplified function to load all executives
  const loadExecutives = useCallback(async () => {
    try {
      // Get executive records
      const { data: execData } = await supabase.from('executive').select('id, "student_number"');

      if (!execData || execData.length === 0) return;

      // Get profile names
      const studentNumbers = execData.map(e => e['student_number']).filter(Boolean);

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', studentNumbers);

      // Combine data
      const executivesWithNames = execData.map(exec => ({
        id: exec.id,
        student_number: exec['student_number'],
        name: profiles?.find(p => p.id === exec['student_number'])?.full_name || 'Unknown',
      }));

      setExecutives(executivesWithNames);
    } catch (error) {
      showMessage('Failed to load executives', 'error');
    }
  }, []);

  useEffect(() => {
    loadCSOData();
    loadExecutives();
  }, [loadCSOData, loadExecutives]);

  // Helper function to show messages
  function showMessage(text, type = 'info') {
    setMessage(text);
    setMessageType(type);
  }

  // Handle form field changes
  function updateField(fieldName, value) {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  }

  // Handle executive selection
  function addExecutive(executive) {
    setSelectedExecutives([...selectedExecutives, executive]);
    setFormData(prev => ({
      ...prev,
      executives: [...prev.executives, executive.id],
    }));
  }

  // Handle executive removal
  function removeExecutive(executiveId) {
    setSelectedExecutives(prev => prev.filter(e => e.id !== executiveId));
    setFormData(prev => ({
      ...prev,
      executives: prev.executives.filter(id => id !== executiveId),
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

    const { error } = await supabase.storage.from('cso-logos').upload(fileName, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from('cso-logos').getPublicUrl(fileName);

    return publicUrl;
  }

  // Handle form submission
  async function updateCSOData(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.cluster) {
        throw new Error('Name and cluster are required');
      }

      // Upload new logo if selected
      let logo_url = currentLogoUrl;
      if (logoFile) {
        logo_url = await uploadLogo(logoFile);
      }

      // Update CSO record
      const { data: cso, error } = await supabase
        .from('cso')
        .update({
          name: formData.name,
          description: formData.description,
          cluster: formData.cluster,
          subscription: formData.subscription,
          logo_url,
        })
        .eq('id', csoId)
        .select()
        .single();

      if (error) throw error;

      // Update executives - remove old ones and add new ones
      // First, delete existing links
      await supabase.from('cso_exec').delete().eq('cso_id', csoId);

      // Then add new links if any
      if (formData.executives.length > 0) {
        const links = formData.executives.map(execId => ({
          cso_id: csoId,
          exec_id: execId,
          portfolio: 'Member',
          can_post: true,
          start_date: new Date().toISOString().split('T')[0],
        }));

        const { error: linkError } = await supabase.from('cso_exec').insert(links);

        if (linkError) throw linkError;
      }

      // Success - redirect
      showMessage('CSO updated successfully!', 'success');
      setTimeout(() => navigate('/entities/sgo'), 2000);
    } catch (error) {
      showMessage(error.message || 'Failed to update CSO', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="update-modal-backdrop">
        <main className="update-cso-container">
          <h1>Loading CSO data...</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="update-modal-backdrop">
      <main className="update-cso-container">
        <h1>Update club, society, or organization</h1>

        {message && <p className={`update-status-message ${messageType}`}>{message}</p>}

        <form onSubmit={updateCSOData} className="update-cso-form">
          {/* Current Logo Display */}
          {currentLogoUrl && !logoFile && (
            <div className="update-current-logo">
              <strong>Current Logo:</strong>
              <img src={currentLogoUrl} alt="Current logo" />
            </div>
          )}

          {/* Logo Upload */}
          <label>
            {currentLogoUrl ? 'Change Logo' : 'Logo'}
            <input type="file" accept="image/*" onChange={selectLogoFile} />
            <small>Upload an image file (max 5MB)</small>
          </label>

          {/* CSO Name */}
          <label>
            CSO Name *
            <input
              type="text"
              value={formData.name}
              onChange={e => updateField('name', e.target.value)}
              required
            />
          </label>

          {/* Description */}
          <label>
            Description
            <textarea
              value={formData.description}
              onChange={e => updateField('description', e.target.value)}
              rows="3"
            />
          </label>

          {/* Cluster Selection */}
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

          {/* Subscription Required */}
          <fieldset className="update-subscription">
            <legend>Subscription Required</legend>
            <label>
              <input
                type="radio"
                value="no"
                checked={formData.subscription === 'no'}
                onChange={e => updateField('subscription', e.target.value)}
              />
              No
            </label>
            <label>
              <input
                type="radio"
                value="yes"
                checked={formData.subscription === 'yes'}
                onChange={e => updateField('subscription', e.target.value)}
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
          <section className="update-form-actions">
            <button type="submit" disabled={submitting} className="update-btn update-btn-primary">
              {submitting ? 'Updating CSO...' : 'Update CSO'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/entities/sgo')}
              className="update-btn update-btn-secondary"
            >
              Cancel
            </button>
          </section>
        </form>
      </main>
    </div>
  );
}

export default UpdateCSO;
