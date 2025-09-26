import React, { useState, useEffect, useRef } from 'react';
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
        },
      ]);

      if (insertError) throw insertError;

      // ✅ Reset form
      setCaption('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = ''; // clears file input

      onPostCreated?.();
    } catch (err) {
      console.error(err);
      onPostError?.(`Error creating post: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="exec-post" onSubmit={handleSubmit}>
      <h3>Create Post</h3>

      <textarea
        placeholder="Write your caption..."
        value={caption}
        onChange={e => setCaption(e.target.value)}
        rows={4}
        className="post-caption-input"
      />

      <input
        type="file"
        onChange={handleFileChange}
        className="post-file-input"
        ref={fileInputRef} // ✅ attach ref
      />

      <button type="submit" disabled={loading} className="post-submit-button">
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}
