// FollowButton.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function FollowButton({ csoId }) {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: followData, error } = await supabase
        .from('cso_follow')
        .select('cso_id, follow_status')
        .eq('cso_id', csoId)
        .eq('student_number', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching follow status:', error.message);
        return;
      }

      if (followData) {
        setIsFollowing(true);
      }
    };

    checkFollowStatus();
  }, [csoId]);

  const handleFollowToggle = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (isFollowing) {
      // unfollow
      const { error } = await supabase
        .from('cso_follow')
        .delete()
        .eq('cso_id', csoId)
        .eq('student_number', user.id);

      if (error) {
        console.error('Error unfollowing:', error.message);
        return;
      }
      setIsFollowing(false);
    } else {
      // follow
      const { error } = await supabase.from('cso_follow').insert([
        {
          cso_id: csoId,
          student_number: user.id,
          follow_status: true,
        },
      ]);

      if (error) {
        console.error('Error following:', error.message);
        return;
      }
      setIsFollowing(true);
    }
  };

  return (
    <button className="follow-btn" onClick={handleFollowToggle}>
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
