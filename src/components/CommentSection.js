import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import sendButton from '../images/send.png';
import waitingSend from '../images/waitingForSend.png';
import '../styles/CommentSection.css';

export default function CommentSection({ postId, studentNumber }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [like, setLike] = useState(false);

  // Fetch comments + like status
  useEffect(() => {
    async function fetchComments() {
      try {
        // get comments
        const { data, error } = await supabase
          .from('Comments')
          .select(
            `
            id,
            comment,
            created_at,
            profiles ( full_name )
          `
          )
          .eq('post_id', postId)
          .neq('comment', null)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setComments(data || '');

        // check like
        const { data: likeCheck, error: likeError } = await supabase
          .from('Comments')
          .select('liked')
          .eq('post_id', postId)
          .eq('student_number', studentNumber)
          .order('created_at', { ascending: false })
          .limit(1);

        if (likeError) throw likeError;
        setLike(likeCheck?.[0]?.liked === true);
      } catch (err) {
        console.error('Error fetching data:', err.message);
      }
    }

    fetchComments();
  }, [postId, studentNumber]);

  // Add a comment
  const handleAddComment = async e => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // Always insert a new row for each comment
      const { data: inserted, error: insertError } = await supabase
        .from('Comments')
        .insert([
          {
            post_id: postId,
            student_number: studentNumber,
            comment: newComment, // store just the latest string
            liked: like,
          },
        ])
        .select(
          `
        id,
        comment,
        created_at,
        profiles ( full_name )
      `
        )
        .single();

      if (insertError) throw insertError;

      // update local state with the new comment
      setComments(prev => [...prev, inserted]);

      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err.message);
    }
  };

  return (
    <section className="comment-section">
      <form onSubmit={handleAddComment} className="comment-form">
        <input
          type="text"
          value={newComment}
          placeholder="Write a comment..."
          onChange={e => setNewComment(e.target.value)}
        />
        <img
          src={newComment ? sendButton : waitingSend}
          alt="send-button"
          className="send-btn"
          onClick={handleAddComment}
        />
      </form>

      <ul>
        {comments.map(c => (
          <li key={c.id}>
            <strong>{c.profiles?.full_name || 'Unknown'}:</strong>
            {/* <ul>
              {c.comment?.map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul> */}
            <p>{c.comment}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
