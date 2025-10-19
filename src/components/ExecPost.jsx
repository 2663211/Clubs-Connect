// ExecPost.js
//Mukondi changes
import React, { useState, useEffect, useRef } from 'react';
import mail_icon from '../images/mail_icon.png';
import paperclipIcon from '../images/paperclip.png';
import { supabase } from '../supabaseClient';
import '../styles/ExecPost.css';

export default function ExecPost({ entityId, onPostCreated, showNotification }) {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleFileChange = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!user) {
      showNotification('You must be logged in to post.');
      return;
    }

    // Validation: Must have either caption or file
    if (!caption.trim() && !file) {
      showNotification('Please enter a caption or attach a file');
      return;
    }

    setLoading(true);

    try {
      // Get post permissions
      const selectElement = document.getElementById('p_r');
      const value = selectElement.value;

      // If no selection made, show notification
      if (!value) {
        showNotification('Please select post visibility (Members only or Everyone)');
        setLoading(false);
        return;
      }

      const memberOnly = value === 'Members_only';

      let mediaUrl = null;
      let mediaType = null;

      // Upload file if present
      if (file) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('media').getPublicUrl(filePath);
        mediaUrl = data.publicUrl;

        mediaType = file.type.startsWith('image')
          ? 'image'
          : file.type.startsWith('video')
            ? 'video'
            : 'audio';
      }

      // Insert post
      const { error: insertError } = await supabase.from('posts').insert([
        {
          caption: caption.trim() || null,
          media_url: mediaUrl,
          media_type: mediaType,
          cso_id: entityId,
          user_id: user.id,
          member_only: memberOnly,
        },
      ]);

      if (insertError) throw insertError;

      // Reset form
      setCaption('');
      setFile(null);
      selectElement.value = '';
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Call parent callback (this will show success notification)
      onPostCreated();
    } catch (err) {
      console.error(err);
      showNotification(`Error creating post: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="exec-post" onSubmit={handleSubmit}>
      <textarea
        placeholder="Create a post"
        value={caption}
        onChange={e => setCaption(e.target.value)}
        rows={4}
        className="post-caption-input"
      />

      {file && <p className="post-file-name">📎 {file.name}</p>}

      <div className="post-actions-row">
        <button type="submit" disabled={loading} className="post-submit-button">
          {loading ? 'Posting...' : 'Post'}
        </button>

        <label className="post-images-label">
          <img src={paperclipIcon} alt="Attach" className="post-paperclip-icon" />
          Images
          <input
            type="file"
            onChange={handleFileChange}
            className="post-file-input"
            ref={fileInputRef}
            accept="image/*,video/*,audio/*"
          />
        </label>

        <label htmlFor="p_r" className="post-restriction-label">
          <img src={mail_icon} className="cover" id="mail_icon" alt="post-mail-icon" />
          POST FOR:
          <select className="post_restriction" id="p_r" defaultValue="">
            <option className="post-item" value="">
              Select...
            </option>
            <option className="post-item" value="Members_only">
              Members only
            </option>
            <option className="post-item" value="Everyone">
              Everyone
            </option>
          </select>
        </label>
      </div>
    </form>
  );
}
