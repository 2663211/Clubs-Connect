// ExecPost.js
//Mukondi changes
import React, { useState, useEffect, useRef } from 'react';
import mail_icon from '../images/mail_icon.png';
import paperclipIcon from '../images/paperclip.png';

import { supabase } from '../supabaseClient';
import '../styles/ExecPost.css';

export default function ExecPost({ entityId, onPostCreated, onPostError }) {
  const [caption, setCaption] = useState('');

  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null); // ✅ ref for file input

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
      onPostError?.('You must be logged in to post.');
      return;
    }
    if (!file) {
      onPostError?.('Please select a file.');
      return;
    }

    setLoading(true);

    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      //Get post permissions Mukondi
      var e = document.getElementById('p_r');
      var value = e.value;
      var post_permission = '';
      if (value === 'Members_only') {
        post_permission = 'true';
      } else {
        post_permission = 'false';
      }

      const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      const mediaUrl = data.publicUrl;

      const mediaType = file.type.startsWith('image')
        ? 'image'
        : file.type.startsWith('video')
          ? 'video'
          : 'audio';

      // 2. Insert post
      const { error: insertError } = await supabase.from('posts').insert([
        {
          caption,
          media_url: mediaUrl,
          media_type: mediaType,
          cso_id: entityId,
          //Mukondi
          member_only: post_permission,
        },
      ]);

      if (insertError) throw insertError;

      // ✅ Reset form
      setCaption('');
      setFile(null);

      window.location.reload(); // Refresh to show new post
    } catch (err) {
      console.error(err);
      onPostError?.(`Error creating post: ${err.message}`);
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

      {/* ✅ Just wrap these three items in a div */}
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
          />
        </label>

        <label htmlFor="p_r" className="post-restriction-label">
          <img src={mail_icon} className="cover" id="mail_icon" alt="post-mail-icon" />
          POST FOR:
          <select className="post_restriction" id="p_r" defaultValue={''}>
            <option className="post-item" value=""></option>
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
