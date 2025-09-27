import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ExecPost from './ExecPost';
import '../styles/CSOPage.css';
import Back from '../images/back.png';
import Avatar from '../images/avatar.png';
import FollowButton from './FollowButton';

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

export default function EntityPage() {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const [entity, setEntity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [entityLoading, setEntityLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [canPost, setCanPost] = useState(false);

  // edit states
  const [editingPostId, setEditingPostId] = useState(null);
  const [editCaption, setEditCaption] = useState('');

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) return console.error('Auth error:', error.message);
      setUser(user);
      if (user && entityId) {
        const [execRes, profileRes] = await Promise.all([
          supabase
            .from('cso_exec')
            .select('can_post')
            .eq('cso_id', entityId)
            .eq('exec_id', user.id)
            .single(),
          supabase.from('profiles').select('role').eq('id', user.id).single(),
        ]);
        setCanPost(execRes.data?.can_post || profileRes.data?.role === 'sgo');
      }
    };
    fetchUser();
  }, [entityId]);

  // Fetch entity
  useEffect(() => {
    const fetchEntity = async () => {
      try {
        const { data, error } = await supabase
          .from('cso')
          .select('id,name,logo_url,cluster')
          .eq('id', entityId)
          .single();
        if (error) throw error;
        setEntity(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setEntityLoading(false);
      }
    };
    fetchEntity();
  }, [entityId]);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(
          'id, caption, media_url, media_type, created_at, user_id(id, full_name, avatar_url)'
        )
        .eq('cso_id', entityId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setPostsLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, [entityId]);

  // Save Edit
  const handleEditSubmit = async id => {
    if (!editCaption.trim()) return alert('Caption cannot be empty');
    try {
      await supabase.from('posts').update({ caption: editCaption }).eq('id', id);
      setEditingPostId(null);
      setEditCaption('');
      fetchPosts();
    } catch (err) {
      console.error('Edit error:', err.message);
    }
  };

  // Delete Post
  const handleDeletePost = async id => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    await supabase.from('posts').delete().eq('id', id);
    setPosts(posts.filter(p => p.id !== id));
  };

  if (entityLoading || postsLoading) return <div className="loading">Loading...</div>;
  if (!entity) return <div className="error">Entity not found</div>;

  return (
    <article className="entity-dashboard">
      <button onClick={() => navigate('/entities/sgo')} className="back-link">
        <img src={Back} alt="Back" className="back-icon" />
        Back
      </button>

      <div className="page-layout">
        <div className="main-container">
          <header className="entity-header">
            <img src={entity.logo_url || Avatar} alt={entity.name} className="entity-logo" />
            <h1 className="entity-name">{entity.name}</h1>
            <FollowButton csoId={entity.id} className="followBtn" />
          </header>

          {canPost && <ExecPost entityId={entityId} onPostCreated={fetchPosts} />}

          <section className="posts">
            {posts.length === 0 ? (
              <p className="no-posts">No posts yet.</p>
            ) : (
              <div className="post-container">
                {posts.map(post => {
                  const author = post.user_id || {};
                  return (
                    <article key={post.id} className="post-section">
                      <header className="post-header">
                        <div className="author-info">
                          <img
                            src={author.avatar_url || Avatar}
                            alt="Author"
                            className="author-avatar"
                          />
                          <section className="author-details">
                            <p className="author-name">{author.full_name || 'Unknown User'}</p>
                            <p className="post-time">{timeSince(post.created_at)}</p>
                          </section>
                        </div>

                        {canPost && (
                          <div className="dropdown">
                            <button className="dropdown-toggle">⋮</button>
                            <div className="dropdown-menu">
                              <button className="dropdown-item">Edit</button>
                              <button className="dropdown-item delete">Delete</button>
                            </div>
                          </div>
                        )}
                      </header>

                      {editingPostId === post.id ? (
                        <div className="edit-box">
                          <textarea
                            value={editCaption}
                            onChange={e => setEditCaption(e.target.value)}
                            rows={3}
                            className="announcement-input"
                          />
                          <div className="edit-actions">
                            <button className="btn-save" onClick={() => handleEditSubmit(post.id)}>
                              Save
                            </button>
                            <button className="btn-cancel" onClick={() => setEditingPostId(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="post-message">{post.caption}</p>
                      )}

                      {post.media_url && (
                        <div className="post-media">
                          {post.media_type === 'image' && (
                            <img src={post.media_url} alt="media" className="post-image" />
                          )}
                          {post.media_type === 'video' && (
                            <video controls className="post-video">
                              <source src={post.media_url} type="video/mp4" />
                            </video>
                          )}
                          {post.media_type === 'audio' && (
                            <audio controls className="post-audio">
                              <source src={post.media_url} type="audio/mpeg" />
                            </audio>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="groups-joined">
            <h2>Groups Joined:</h2>
            <div className="group-item">
              <img src={entity.logo_url || Avatar} alt={entity.name} className="group-logo" />
              <div className="group-info">
                <p className="group-name">{entity.name}</p>
                <p className="group-category">{entity.cluster || 'General'}</p>
                <p className="group-followers">Active community</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
