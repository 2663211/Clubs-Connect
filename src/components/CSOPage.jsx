<<<<<<< HEAD
=======
//Mukondi version
>>>>>>> master
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ExecPost from './ExecPost';
import '../styles/CSOPage.css';
<<<<<<< HEAD
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

=======
import FollowButton from './FollowButton';

>>>>>>> master
export default function EntityPage() {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const [entity, setEntity] = useState(null);
  const [posts, setPosts] = useState([]);
<<<<<<< HEAD
  const [entityLoading, setEntityLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [canPost, setCanPost] = useState(false);

  // edit states
  const [editingPostId, setEditingPostId] = useState(null);
  const [editCaption, setEditCaption] = useState('');

  // Fetch user
=======
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [exec, setExec] = useState(null);
  const [canPost, setCanPost] = useState(false);

  // Fetch logged-in user and check permissions
>>>>>>> master
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
<<<<<<< HEAD
        error,
      } = await supabase.auth.getUser();
      if (error) return console.error('Auth error:', error.message);
      setUser(user);

      if (user && entityId) {
        try{
        const {data: execRes, error} = await supabase
=======
      } = await supabase.auth.getUser();
      setUser(user);

      if (user && entityId) {
        // Fetch exec ID from the CSO exec table
        try {
          const { data: execData, error } = await supabase
>>>>>>> master
            .from('cso_exec')
            .select('exec_id')
            .eq('cso_id', entityId)
            .limit(1);

<<<<<<< HEAD
          //if(error) throw error;

            const{data: profileRes}= await supabase
=======
          if (error) throw error;
          console.log(execData[0].exec_id);

          // Also check if user is SGO
          const { data: profileData } = await supabase
>>>>>>> master
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

<<<<<<< HEAD
        if(profileRes.role === 'sgo'){
          setCanPost(true);
          fetchPosts(true);
        }else{
        if(execRes != null){
           const { data: execS_N } = await supabase
                .from('executive')
                .select('student_number')
                .eq('id', execRes[0].exec_id)
                .single();
              const s_n = execS_N.student_number;
              if (s_n === user.id) {
                setCanPost(true);
                fetchPosts(true);
              }
              else{
                fetchPosts(false);
              }
         }
      }
    } catch(err){
      console.error('Failed to fetch exec data:',err.message);
    }
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
  const fetchPosts = async user  => {
    try {
      //show member posts
      if(user===true){
        try{
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
  }
  else{
        try{
      const { data, error } = await supabase
        .from('posts')
        .select(
          'id, caption, media_url, media_type, created_at, user_id(id, full_name, avatar_url)'
        )
        .eq('cso_id', entityId)
        .eq('member_only',false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setPostsLoading(false);
    }
  }
}catch(err){
      console.error('Failed to fetch posts data:',err.message);
    }
};
  // useEffect(() => {
  //   fetchPosts();
  // }, [entityId]);

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

  // DELETE
  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting post: ' + err.message);
    }
  };

  if (entityLoading || postsLoading) return <div className="cso-loading">Loading...</div>;
  if (!entity) return <div className="cso-error">Entity not found</div>;

  return (
    <article className="cso-entity-dashboard">
      <button onClick={() => navigate(-1)} className="cso-back-link">
        <img src={Back} alt="Back" className="cso-back-icon" />
        Back
      </button>

      <div className="cso-page-layout">
        <div className="cso-main-container">
          <header className="cso-entity-header">
            <img src={entity.logo_url || Avatar} alt={entity.name} className="cso-entity-logo" />

            <div className="cso-name-button-wrapper">
              <h1 className="cso-entity-name">{entity.name}</h1>
              <FollowButton csoId={entity.id} />
            </div>
          </header>

          {canPost && <ExecPost entityId={entityId} onPostCreated={fetchPosts} />}

          <section className="cso-posts">
            {posts.length === 0 ? (
              <p className="cso-no-posts">No posts yet.</p>
            ) : (
              <div className="cso-post-container">
                {posts.map(post => {
                  const author = post.user_id || {};
                  return (
                    <article key={post.id} className="cso-post-section">
                      <header className="cso-post-header">
                        <div className="cso-author-info">
                          <img
                            src={author.avatar_url || Avatar}
                            alt="Author"
                            className="cso-author-avatar"
                          />
                          <section className="cso-author-details">
                            <p className="cso-author-name">{author.full_name || 'Unknown User'}</p>
                            <p className="cso-post-time">{timeSince(post.created_at)}</p>
                          </section>
                        </div>

                        {canPost && (
                          <div className="cso-dropdown">
                            <button className="cso-dropdown-toggle">⋮</button>
                            <div className="cso-dropdown-menu">
                              {editingPostId !== post.id && (
                                <>
                                  <button
                                    className="cso-dropdown-item"
                                    onClick={() => {
                                      setEditingPostId(post.id);
                                      setEditCaption(post.caption);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="cso-dropdown-item delete"
                                    onClick={() => handleDelete(post.id)}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </header>

                      {editingPostId === post.id ? (
                        <div className="cso-edit-box">
                          <textarea
                            value={editCaption}
                            onChange={e => setEditCaption(e.target.value)}
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid #ddd',
                              fontSize: '14px',
                              fontFamily: 'inherit',
                            }}
                          />
                          <div className="cso-edit-actions">
                            <button
                              className="cso-btn-save"
                              onClick={() => handleEditSubmit(post.id)}
                            >
                              Save
                            </button>
                            <button
                              className="cso-btn-cancel"
                              onClick={() => setEditingPostId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="cso-post-message">{post.caption}</p>
                      )}

                      {post.media_url && (
                        <div className="cso-post-media">
                          {post.media_type === 'image' && (
                            <img src={post.media_url} alt="media" className="cso-post-image" />
                          )}
                          {post.media_type === 'video' && (
                            <video controls className="cso-post-video">
                              <source src={post.media_url} type="video/mp4" />
                            </video>
                          )}
                          {post.media_type === 'audio' && (
                            <audio controls className="cso-post-audio">
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
        <aside className="cso-sidebar">
          <div className="cso-groups-joined">
            <h2>Groups Joined:</h2>
            <div className="cso-group-item">
              <img src={entity.logo_url || Avatar} alt={entity.name} className="cso-group-logo" />
              <div className="cso-group-info">
                <p className="cso-group-name">{entity.name}</p>
                <p className="cso-group-category">{entity.cluster || 'General'}</p>
                <p className="cso-group-followers">Active community</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </article>
=======
          if (profileData.role === 'sgo') {
            setCanPost(true);
          } else {
            if (execData != null) {
              const { data: execS_N } = await supabase
                .from('executive')
                .select('student_number')
                .eq('id', execData[0].exec_id)
                .single();

              const s_n = execS_N.student_number;
              if (s_n === user.id) {
                setCanPost(true);
              }
            }
          }
        } catch (err) {
          console.error('Failed to fetch entities:', err.message);
        }
      }
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, [entityId]);

  // Fetch entity details
  useEffect(() => {
    const fetchEntity = async () => {
      if (!entityId) return;

      try {
        const { data, error } = await supabase.from('cso').select('*').eq('id', entityId).single();

        if (error) throw error;
        setEntity(data);
      } catch (err) {
        console.error('Failed to fetch entity:', err.message);
      }
    };

    fetchEntity();
  }, [entityId]);

  // Fetch posts for this entity
  useEffect(() => {
    const fetchPosts = async () => {
      if (!entityId) return;

      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('cso_id', entityId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Failed to fetch posts:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [entityId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!entity) return <div className="error">Entity not found</div>;

  return (
    <div className="entity-page">
      {/* Entity Header */}
      <header className="entity-header">
        {entity.logo_url && <img src={entity.logo_url} alt={entity.name} className="entity-logo" />}
        <div className="entity-info">
          <h1>{entity.name}</h1>
          <p className="entity-cluster">{entity.cluster}</p>
          <p className="entity-description">{entity.description}</p>
          <FollowButton csoId={entity.id} />
        </div>
      </header>

      {/* Post Creation (if user has permission) */}
      {canPost && (
        <section className="post-creation-section">
          <ExecPost entityId={entityId} />
        </section>
      )}

      {/* Posts Display */}
      <section className="posts-section">
        <h2>Posts</h2>
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet.</p>
        ) : (
          <div className="posts-container">
            {posts.map(post => (
              <article key={post.id} className="post-card">
                {post.caption && <p className="post-caption">{post.caption}</p>}

                {post.media_url && (
                  <div className="post-media">
                    {post.media_type === 'image' && (
                      <img src={post.media_url} alt="Post media" className="post-image" />
                    )}
                    {post.media_type === 'video' && (
                      <video controls className="post-video">
                        <source src={post.media_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {post.media_type === 'audio' && (
                      <audio controls className="post-audio">
                        <source src={post.media_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                )}

                <p className="post-date">{new Date(post.created_at).toLocaleString()}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
    </div>
>>>>>>> master
  );
}
