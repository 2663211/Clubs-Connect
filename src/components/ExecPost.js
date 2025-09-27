import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/ExecPost.css';
import Attachments from '../images/paperclip.png';
import Mail from '../images/mail.png';
import Avatar from '../images/avatar.png';

export default function ExecPost({ entityId, onPostCreated }) {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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
    if (!user) return alert('You must be logged in to post.');
    if (!caption.trim() && !file) return alert('Please enter text or select a file.');

    setLoading(true);

    try {
      let mediaUrl = null;
      let mediaType = null;

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

      // Insert post with user_id field (matching your table schema)
      const { error: insertError } = await supabase.from('posts').insert([
        {
          caption,
          media_url: mediaUrl,
          media_type: mediaType,
          cso_id: entityId,
          user_id: user.id, // Changed from exec_id to user_id
        },
      ]);

      if (insertError) throw insertError;

      setCaption('');
      setFile(null);

      // Call the callback if provided
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      console.error(err);
      alert('Error creating post: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exec-post">
      <textarea
        placeholder="Create a post"
        value={caption}
        onChange={e => setCaption(e.target.value)}
        rows={3}
        className="post-caption-input"
      />

      {/* Show file name if attached */}
      {file && <p className="file-name">📎 {file.name}</p>}

      <div className="post-controls">
        <button onClick={handleSubmit} disabled={loading} className="post-submit-button">
          {loading ? 'Posting...' : 'Post'}
        </button>

        <label className="images-label">
          <img src={Attachments} alt="Attach" className="paperclip-icon" />
          Images
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
            accept="image/*,video/*,audio/*"
          />
        </label>

        <button className="post-for-button">
          <img src={Mail} alt="Post For" className="mail-icon" />
          POST FOR
        </button>
      </div>
    </div>
  );
}
