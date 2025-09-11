// ExecPost.js
//Mukondi changes
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/ExecPost.css';

export default function ExecPost({ entityId }) {
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

  const handleSubmit = async () => {
    if (!user) return alert('You must be logged in to post.');
    if (!file) return alert('Please select a file.');

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

      // 2. Insert post with entityId
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

      alert('Post created successfully!');
      setCaption('');
      setFile(null);

      window.location.reload(); // Refresh to show new post
    } catch (err) {
      console.error(err);
      alert('Error creating post: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exec-post">
      <h3>Create Post</h3>

      <textarea
        placeholder="Write your caption..."
        value={caption}
        onChange={e => setCaption(e.target.value)}
        rows={4}
        className="post-caption-input"
      />

      <input type="file" onChange={handleFileChange} className="post-file-input" />

      <button onClick={handleSubmit} disabled={loading} className="post-submit-button">
        {loading ? 'Posting...' : 'Post'}
      </button>
      <form>
        <label for="post_restriction">Post for: </label>
        <select name="post_restriction" id="p_r" defaultValue={''}>
          <option value="">Please choose who should see this post</option>
          <option value="Members_only">Members_only</option>
          <option value="Everyone">Everyone</option>
        </select>
      </form>
    </div>
  );
}
