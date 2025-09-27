import React, { useState, useEffect } from 'react';
import '../styles/StudentDashboard.css';
import { supabase } from '../supabaseClient';

export function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [entryExist, setEntryExist] = useState(false);

  useEffect(() => {
    const checkLikeStatus = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if user already has a comment/like entry for this post
      const { data: existingEntry, error } = await supabase
        .from('Comments')
        .select('liked')
        .eq('post_id', postId)
        .eq('student_number', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching like status:', error.message);
      }

      if (existingEntry) {
        setEntryExist(true);
        //setLike(likeCheck?.[0]?.liked === true);
        setLiked(existingEntry?.[0]?.liked === true);
      } else {
        setEntryExist(false);
        setLiked(false);
      }

      // Fetch like count from posts
      const { data: postData, error: LikeStatusError } = await supabase
        .from('posts')
        .select('like_count')
        .eq('id', postId)
        .single();

      if (LikeStatusError) {
        console.error('Error fetching like count:', LikeStatusError.message);
      } else if (postData) {
        setLikesCount(postData.like_count || 0);
      }

      setLoading(false);
    };

    checkLikeStatus();
  }, [postId]);

  const handleLikeToggle = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setLoading(true);

    // Check if user already has a comment/like entry for this post
    const { data: existingEntry, error } = await supabase
      .from('Comments')
      .select('liked')
      .eq('post_id', postId)
      .eq('student_number', user.id)
      .order('created_at', { ascending: false })
      .limit(1);
    let newCount = likesCount;

    if (liked) {
      // UNLIKE
      const { error } = await supabase
        .from('Comments')
        .update({ liked: false })
        .eq('post_id', postId)
        .eq('student_number', user.id);

      if (error) {
        console.error('Error unliking:', error.message);
      } else {
        setLiked(false);
        newCount = likesCount - 1;
        //setLikesCount(prev => prev - 1);
        setLikesCount(newCount);
        await supabase.from('posts').update({ like_count: newCount }).eq('id', postId);
      }
    } else {
      // LIKE

      if (existingEntry) {
        // update existing entry
        const { error } = await supabase
          .from('Comments')
          .update({ liked: true })
          .eq('post_id', postId)
          .eq('student_number', user.id);

        if (error) console.error('Error liking:', error.message);
      } else {
        // create new entry
        const { error } = await supabase.from('Comments').insert([
          {
            post_id: postId,
            student_number: user.id,
            liked: true,
          },
        ]);
        if (error) console.error('Error inserting like:', error.message);
      }

      setLiked(true);
      newCount = likesCount + 1;
      //setLikesCount(prev => prev + 1);
      setLikesCount(newCount);
      await supabase.from('posts').update({ like_count: newCount }).eq('id', postId);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleLikeToggle}
      className={`like-btn ${liked ? 'liked' : ''}`}
      disabled={loading}
    >
      {likesCount} {liked ? '👍Likes' : 'Likes'}
    </button>
  );
}
