import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/StudentDashboard.css';
import StudentHeader from './StudentHeader';
import Search from './Search';
import { supabase } from '../supabaseClient';
import FollowButton from './FollowButton';
import { LikeButton } from './LikeButton';
import sendButton from '../images/send.png';
import waitingSend from '../images/waitingForSend.png';
import CommentSection from './CommentSection';

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

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { entityId } = useParams();
  const [user, setUser] = useState(null);
  const [entity, setEntity] = useState([]);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCommentBox, setActiveCommentBox] = useState(null);

  useEffect(() => {
    const fetchFollowPost = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUser(user);

      try {
        // get CSOs user follows
        const { data: FollowData, error } = await supabase
          .from('cso_follow')
          .select('cso_id')
          .eq('student_number', user.id)
          .eq('follow_status', true);

        if (error) {
          console.error('Error fetching follow status:', error.message);
          return;
        }

        if (!FollowData || FollowData.length === 0) {
          setPosts([]);
          setLoading(false);
          return;
        }

        // fetch posts from followed CSOs
        const { data: postData, postError } = await supabase
          .from('posts')
          .select('*')
          .in(
            'cso_id',
            FollowData.map(f => f.cso_id)
          )
          .eq('member_only', false)
          .order('created_at', { ascending: false });

        if (postError) {
          console.error('Error fetching posts:', postError.message);
          return;
        }
        setPosts(postData);

        // fetch CSO info for those posts
        const { data: CSOData, CSOerror } = await supabase
          .from('cso')
          .select('id, name, logo_url')
          .in(
            'id',
            postData.map(p => p.cso_id)
          );

        if (CSOerror) {
          console.error('Error fetching CSO', CSOerror.message);
          return;
        }
        setEntity(CSOData);

        const { data: followerCounts, followerError } = await supabase
          .from('cso_follow')
          .select('cso_id', { count: 'exact' })
          .in(
            'cso_id',
            CSOData.map(c => c.id)
          )
          .eq('follow_status', true);

        if (followerError) {
          console.error('Error fetching follower counts:', followerError.message);
          return;
        }
        const counts = {};
        followerCounts.forEach(f => {
          counts[f.cso_id] = (counts[f.cso_id] || 0) + 1;
        });
        setFollowers(counts);
      } catch (err) {
        console.error('error fetching data', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowPost();
  }, [entityId]);

  const toggleCommentBox = postId => {
    setActiveCommentBox(prev => (prev === postId ? null : postId));
  };

  if (loading) return <div className="loading">Loading...</div>;
  return (
    <article className="dashboard">
      <StudentHeader />
      <Search />
      <section className="posts">
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet.</p>
        ) : (
          <div className="post-container">
            {posts.map(post => {
              const cso = entity.find(c => c.id === post.cso_id);

              return (
                <article key={post.id} className="post-section">
                  {cso && (
                    <header className="CSOInfo">
                      {cso.logo_url && (
                        <img src={cso.logo_url} alt={cso.name} className="cso-logo" />
                      )}
                      <section
                        className="cso-details"
                        onClick={() => navigate(`/entities/${cso.id}`)}
                      >
                        <p className="CSOname">{cso.name}</p>
                        <p className="followerCount">
                          {followers[cso.id] || 0}{' '}
                          {followers[cso.id] === 1 ? 'follower' : 'followers'}
                        </p>
                        <p className="postDate">{timeSince(post.created_at)}</p>
                      </section>
                      <FollowButton csoId={cso.id} />
                    </header>
                  )}

                  {post.caption && <p className="postCaption">{post.caption}</p>}

                  {post.media_url && (
                    <div className="postMedia">
                      {post.media_type === 'image' && (
                        <img src={post.media_url} alt="Post media" className="postImage" />
                      )}
                      {post.media_type === 'video' && (
                        <video controls className="postVideo">
                          <source src={post.media_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      {post.media_type === 'audio' && (
                        <audio controls className="postAudio">
                          <source src={post.media_url} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </div>
                  )}

                  <section className="engagement">
                    {/* <button className="like-btn">Like</button> */}
                    <LikeButton postId={post.id} />
                    <button
                      className={`comment-btn ${activeCommentBox === post.id ? 'active' : ''}`}
                      onClick={() => {
                        toggleCommentBox(post.id);
                      }}
                    >
                      Comment
                    </button>
                  </section>
                  {activeCommentBox === post.id && (
                    <section className="comment-section">
                      <CommentSection postId={post.id} studentNumber={user.id} />
                    </section>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </article>
  );
}
