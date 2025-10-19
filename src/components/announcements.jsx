import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/announcements.css';
import Avatar from '../images/avatar.png';
import Back from '../images/back.png';
import Attachments from '../images/paperclip.png';
import Icon from '../images/csd.jpeg';

function timeSince(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval === 1 ? '1 year ago' : `${interval} years ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval === 1 ? '1 month ago' : `${interval} months ago`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval === 1 ? '1 day ago' : `${interval} days ago`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval === 1 ? '1 hour ago' : `${interval} hours ago`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;

  return 'Just now';
}

export default function AnnouncementPage() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [canPost, setCanPost] = useState(false);
  const [canView, setCanView] = useState(false);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [notification, setNotification] = useState({ message: '', visible: false });

  // Helper function to show notifications
  const showNotification = message => {
    setNotification({ message, visible: true });
    setTimeout(() => setNotification({ message: '', visible: false }), 3000);
  };

  // Fetch logged-in user and permissions
  useEffect(() => {
    const fetchUserAndPermissions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, full_name, role, avatar_url')
          .eq('id', user.id)
          .single();

        setUserProfile(profileData);

        // Only SGO can post/edit/delete
        setCanPost(profileData?.role === 'sgo');

        // Exec + SGO can view
        setCanView(profileData?.role === 'exec' || profileData?.role === 'sgo');
      }
    };

    fetchUserAndPermissions();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Fetch announcements
  const fetchAnnouncements = useCallback(async () => {
    if (!canView) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(
          `
          id, caption, media_url, media_type, created_at, user_id,
          profiles ( full_name, avatar_url )
         `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Failed to fetch announcements:', err.message);
    } finally {
      setLoading(false);
    }
  }, [canView]);

  useEffect(() => {
    if (user) fetchAnnouncements();
  }, [user, fetchAnnouncements]);

  const handleFileChange = e => setFile(e.target.files[0]);

  // CREATE
  const handleSubmit = async e => {
    e.preventDefault();
    if (!user || !canPost) return;
    if (!caption.trim()) {
      showNotification('Please enter announcement text.');
      return;
    }

    setPosting(true);

    try {
      let mediaUrl = null;
      let mediaType = null;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const filePath = `announcements/${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('announcements')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('announcements').getPublicUrl(filePath);
        mediaUrl = data.publicUrl;

        mediaType = file.type.startsWith('image')
          ? 'image'
          : file.type.startsWith('video')
            ? 'video'
            : 'audio';
      }

      const { error: insertError } = await supabase.from('announcements').insert([
        {
          caption,
          media_url: mediaUrl,
          media_type: mediaType,
          user_id: user.id,
        },
      ]);

      if (insertError) throw insertError;

      showNotification('Announcement posted successfully!');
      setCaption('');
      setFile(null);
      await fetchAnnouncements();
    } catch (err) {
      console.error(err);
      showNotification('Error posting announcement: ' + err.message);
    } finally {
      setPosting(false);
    }
  };

  // EDIT
  const handleEditSubmit = async id => {
    if (!editCaption.trim()) {
      showNotification('Caption cannot be empty!');
      return;
    }

    try {
      const { error } = await supabase
        .from('announcements')
        .update({ caption: editCaption })
        .eq('id', id);

      if (error) throw error;

      showNotification('Announcement updated!');
      setEditingId(null);
      setEditCaption('');
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      showNotification('Error editing post: ' + err.message);
    }
  };

  // DELETE
  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id);

      if (error) throw error;

      setAnnouncements(announcements.filter(a => a.id !== id));
      showNotification('Announcement deleted successfully!');
    } catch (err) {
      console.error(err);
      showNotification('Error deleting post: ' + err.message);
    }
  };

  if (loading) {
    return <div className="announcement-loading">Loading...</div>;
  }

  return (
    <article className="dashboard">
      <button onClick={() => navigate('/dashboard/sgo')} className="announcement-back-link">
        <img src={Back} alt="Back" className="announcement-back-icon" />
        Dashboard
      </button>

      <div className="announcement-main-container">
        <header className="announcement-header">
          <img src={Icon} alt="SGO" className="announcement-cso-logo-large" />
          <h1 className="announcement-header-title">Student Governance Office</h1>
        </header>

        {/* Notification Box */}
        {notification.visible && (
          <aside className="announcement-notification-box" role="status" aria-live="polite">
            <p>{notification.message}</p>
          </aside>
        )}

        {/* Post creation (SGO only) */}
        {canPost && (
          <section className="announcement-creation-box">
            <textarea
              placeholder="Create an announcement"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={3}
              className="announcement-input"
            />

            {/* Show file name if attached */}
            {file && <p className="announcement-file-name">📎 {file.name}</p>}

            <div className="announcement-post-controls">
              <button onClick={handleSubmit} disabled={posting} className="announcement-post-btn">
                {posting ? 'Posting...' : 'Post'}
              </button>

              <label className="announcement-images-label">
                <img src={Attachments} alt="Attach" className="announcement-paperclip-icon" />
                Images
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="announcement-file-input"
                  accept="image/*,video/*,audio/*"
                />
              </label>
            </div>
          </section>
        )}

        {/* Announcements */}
        <section className="announcement-posts">
          {announcements.length === 0 ? (
            <p className="announcement-no-posts">No announcements yet.</p>
          ) : (
            <div className="announcement-post-container">
              {announcements.map(a => (
                <article key={a.id} className="announcement-post-section">
                  <header className="announcement-post-header">
                    <div className="announcement-CSOInfo">
                      <img
                        src={a.profiles?.avatar_url || Avatar}
                        alt="Author"
                        className="announcement-author-avatar"
                      />
                      <div className="announcement-cso-details">
                        <p className="announcement-sgoName">
                          {a.profiles?.full_name || 'SGO Officer name'}
                        </p>
                        <p className="announcement-postDate">{timeSince(a.created_at)}</p>
                      </div>
                    </div>

                    {/* Dropdown menu at top right (SGO only) */}
                    {canPost && (
                      <div className="announcement-dropdown">
                        <button className="announcement-dropdown-toggle">⋮</button>
                        <div className="announcement-dropdown-menu">
                          {editingId !== a.id && (
                            <>
                              <button
                                className="announcement-dropdown-item"
                                onClick={() => {
                                  setEditingId(a.id);
                                  setEditCaption(a.caption);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="announcement-dropdown-item delete"
                                onClick={() => handleDelete(a.id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </header>

                  {editingId === a.id ? (
                    <div className="announcement-edit-box">
                      <textarea
                        value={editCaption}
                        onChange={e => setEditCaption(e.target.value)}
                        rows={3}
                        className="announcement-input"
                      />
                      <div className="announcement-edit-actions">
                        <button
                          className="announcement-btn-save"
                          onClick={() => handleEditSubmit(a.id)}
                        >
                          Save
                        </button>
                        <button
                          className="announcement-btn-cancel"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="announcement-postCaption">{a.caption}</p>
                  )}

                  {/* Media */}
                  {a.media_url && (
                    <div className="announcement-post-media">
                      {a.media_type === 'image' && (
                        <img
                          src={a.media_url}
                          alt="Announcement"
                          className="announcement-post-image"
                        />
                      )}
                      {a.media_type === 'video' && (
                        <video controls className="announcement-post-video">
                          <source src={a.media_url} type="video/mp4" />
                        </video>
                      )}
                      {a.media_type === 'audio' && (
                        <audio controls className="announcement-post-audio">
                          <source src={a.media_url} type="audio/mpeg" />
                        </audio>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
