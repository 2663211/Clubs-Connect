// FollowButton.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function FollowButton({ csoId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFollowStatus = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: followData, error } = await supabase
        .from('cso_follow')
        .select('follow_status')
        .eq('cso_id', csoId)
        .eq('student_number', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching follow status:', error.message);
      }

      if (followData) {
        setIsFollowing(followData.follow_status === true);
      } else {
        setIsFollowing(false);
      }

      setLoading(false);
    };

    checkFollowStatus();
  }, [csoId]);

  const handleFollowToggle = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setLoading(true);

    if (isFollowing) {
      // Unfollow
      const { error } = await supabase
        .from('cso_follow')
        .delete()
        .eq('cso_id', csoId)
        .eq('student_number', user.id);

      if (error) {
        console.error('Error unfollowing:', error.message);
      } else {
        setIsFollowing(false);
      }
    } else {
      // Follow
      const { error } = await supabase.from('cso_follow').insert([
        {
          cso_id: csoId,
          student_number: user.id,
          follow_status: true,
        },
      ]);

      if (error) {
        console.error('Error following:', error.message);
      } else {
        setIsFollowing(true);
      }
    }

    setLoading(false);
  };

  return (
    <button className="follow-btn" onClick={handleFollowToggle} disabled={loading}>
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
