import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ExecPost from './ExecPost';
import '../styles/CSOPage.css';
import FollowButton from './FollowButton';

export default function EntityPage() {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const [entity, setEntity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [canPost, setCanPost] = useState(false);

  // Fetch logged-in user and check permissions
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user && entityId) {
        // Check if user has posting rights for this entity
        const { data: execData } = await supabase
          .from('cso_exec')
          .select('can_post')
          .eq('cso_id', entityId)
          .eq('exec_id', user.id)
          .single();

        // Also check if user is SGO
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setCanPost(execData?.can_post || profileData?.role === 'sgo');
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
  );
}
