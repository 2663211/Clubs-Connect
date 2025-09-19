import React, { useEffect, useState } from 'react';
import StudentHeader from './StudentHeader';
import { useNavigate } from 'react-router-dom';
import coverPhoto from '../images/coverPhoto.jpeg';
import profilePhoto from '../images/ProfilePhoto.jpeg';
import coverPhoto2 from '../images/coverPhoto2.png';
import '../styles/StudentProfile.css';
import edit from '../images/icons8-edit-50.png';
import { supabase } from '../supabaseClient';
import FollowButton from './FollowButton';

export default function StudentProfile() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: 'Mmakwena',
    about: '',
    coverPic: coverPhoto2,
    profilePic: profilePhoto,
  });

  const [user, setUser] = useState(null);

  //fetching the necessary data from supabase
  //fetching profile/user data
  const fetchProfile = async userId => {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, bio,avatar_url,cover_url')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  };

  //setting what is in the database to the profile
  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser(); // 👈 get logged-in user
      if (!user) return;

      setUser(user);
      const profile = await fetchProfile(user.id);
      if (profile) {
        setUserInfo({
          name: profile.full_name || 'Unnamed User',
          about: profile.bio || '',
          coverPic: profile.cover_url || coverPhoto2,
          profilePic: profile.avatar_url || profilePhoto,
        });
        setEditData({
          name: profile.full_name || 'Unnamed User',
          about: profile.bio || '',
          coverPic: profile.cover_url || coverPhoto2,
          profilePic: profile.avatar_url || profilePhoto,
        });
      }
    };
    loadProfile();
  }, []);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(userInfo);

  // Handle text changes (name, about)
  const handleChange = e => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  // Handle file input changes separately

  const handleFileChange = async e => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    const file = files[0];

    // 1. Local preview
    setEditData({
      ...editData,
      [name]: URL.createObjectURL(file),
    });

    try {
      if (!user) return;

      // 2. Create a unique file path for Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      // 3. Upload to Supabase Storage bucket "profile_photos"
      const { error: uploadError } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 4. Get the public URL
      const { data } = supabase.storage.from('profile_photos').getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // 5. Save that URL in editData (so Save button will persist it)
      setEditData(prev => ({
        ...prev,
        [name]: publicUrl,
      }));
    } catch (err) {
      console.error('Upload failed:', err.message);
      alert('Error uploading image: ' + err.message);
    }
  };
  const handleCoverFileChange = async e => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    const file = files[0];

    // 1. Local preview
    setEditData({
      ...editData,
      [name]: URL.createObjectURL(file),
    });

    try {
      if (!user) return;

      // 2. Create a unique file path for Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      // 3. Upload to Supabase Storage bucket "profile_photos"
      const { error: uploadError } = await supabase.storage
        .from('cover_photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 4. Get the public URL
      const { data } = supabase.storage.from('cover_photos').getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // 5. Save that URL in editData (so Save button will persist it)
      setEditData(prev => ({
        ...prev,
        [name]: publicUrl,
      }));
    } catch (err) {
      console.error('Upload failed:', err.message);
      alert('Error uploading image: ' + err.message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  //updates the profile for when the user edits
  const updateProfile = async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates) // object containing fields to update
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error.message);
      return null;
    }

    return data;
  };

  // hsndles updates
  const handleUpdate = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser(); // 👈 get logged-in user
    if (!user) return;
    const updated = await updateProfile(user.id, {
      full_name: editData.name,
      bio: editData.about,
      avatar_url: editData.profilePic,
      cover_url: editData.coverPic,
    });

    if (updated) {
      console.log('Profile updated:');
    }
  };

  const handleSave = e => {
    e.preventDefault(); // stop page reload
    setUserInfo(editData);
    setIsEditing(false);
    handleUpdate();
  };

  const [csos, setCsos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch CSOs and follow status for current user
  useEffect(() => {
    const fetchCsos = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser(); // 👈 get logged-in user
      if (!user) return;

      // get all CSOs
      const { data: csoData, error: csoError } = await supabase
        .from('cso')
        .select('id, name, cluster, logo_url');

      if (csoError) {
        console.error('Error fetching CSOs:', csoError.message);
        setLoading(false);
        return;
      }

      // get which CSOs current user follows
      const { data: followData, error: followError } = await supabase
        .from('cso_follow')
        .select('cso_id, follow_status')
        .eq('student_number', user.id);

      if (followError) {
        console.error('Error fetching follow data:', followError.message);
        setLoading(false);
        return;
      }

      // map CSOs + follow status
      const followMap = followData.reduce((acc, f) => {
        acc[f.cso_id] = f.follow_status;
        return acc;
      }, {});

      // only include CSOs not followed
      const unfollowedCsos = csoData
        .map(cso => ({
          ...cso,
          isFollowing: followMap[cso.id] || false,
        }))
        .filter(cso => !cso.isFollowing);

      setCsos(unfollowedCsos);

      setLoading(false);
    };

    fetchCsos();
  }, [user]);

  // Toggle follow / unfollow
  const handleFollowToggle = async (csoId, isFollowing) => {
    const {
      data: { user },
    } = await supabase.auth.getUser(); // 👈 get logged-in user
    if (!user) return;
    if (!user.id) return;

    if (isFollowing) {
      // unfollow → update or delete
      const { error } = await supabase
        .from('cso_follow')
        .delete()
        .eq('cso_id', csoId)
        .eq('student_number', user.id);

      if (error) console.error('Error unfollowing:', error.message);
    } else {
      // follow → insert
      const { error } = await supabase.from('cso_follow').insert([
        {
          cso_id: csoId,
          student_number: user.id,
          follow_status: true,
        },
      ]);

      if (error) console.error('Error following:', error.message);
    }

    // refresh list
    // refresh list → remove followed CSO from view
    setCsos(prev => prev.filter(cso => cso.id !== csoId));
  };

  const [visibleCount, setVisibleCount] = useState(5); // 👈 show 5 at first

  // ... your existing fetchCsos useEffect and handleFollowToggle code ...

  // Function to show more CSOs
  const handleShowMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {isEditing ? (
        // --- EDIT MODE ---
        <section className="profile-form">
          <form className="inputs" onSubmit={handleSave}>
            <label htmlFor="myCoverfile">
              Select a Cover Photo:
              <input
                type="file"
                id="myCoverfile"
                name="coverPic"
                onChange={handleCoverFileChange}
              />
            </label>
            <br />

            <label htmlFor="myProfilefile">
              Select a Profile Photo:
              <input type="file" id="myProfilefile" name="profilePic" onChange={handleFileChange} />
            </label>
            <br />

            <label htmlFor="ProfileName">
              Enter Your Name:
              <input type="text" name="name" value={editData.name} onChange={handleChange} />
            </label>
            <br />

            <label htmlFor="About">
              About:
              <textarea
                id="About"
                name="about"
                rows="8"
                cols="70"
                placeholder="Tell us about yourself..."
                value={editData.about}
                onChange={handleChange}
              />
            </label>
            <br />

            <button type="submit">Save</button>
          </form>
        </section>
      ) : (
        // --- VIEW MODE ---
        <>
          <StudentHeader />
          <section className="profie-page">
            <section className="profile-content">
              <section className="ProfilePhotos">
                <img src={userInfo.coverPic} id="cover" alt="cover photo" />
                <img src={userInfo.profilePic} id="profile" alt="profile photo" />
                <img src={edit} onClick={handleEdit} id="editProfile" alt="edit profile" />
              </section>

              <section className="UserInfo">
                <h2 className="Name">{userInfo.name}</h2>
                <p className="about">{userInfo.about}</p>
              </section>
            </section>
            <aside className="interests">
              {/* //<div className="card"> */}
              <h3>Interests:</h3>
              {csos.slice(0, visibleCount).map(cso => (
                <div className="interest-item" key={cso.id}>
                  <img
                    src={cso.logo_url || 'https://dummyimage.com/40x40/000000/ffffff&text=W'}
                    alt={cso.name}
                  />
                  <div onClick={() => navigate(`/entities/${cso.id}`)}>
                    <p className="title">{cso.name}</p>
                    <p className="subtitle">{cso.cluster}</p>
                    <p className="subtitle">Number of followers</p>
                  </div>
                  <FollowButton csoId={cso.id} />
                  {/* <button
                    className="follow-btn"
                    onClick={() => handleFollowToggle(cso.id, cso.isFollowing)}
                  >
                    {cso.isFollowing ? 'unfollow' : 'Follow'}
                  </button> */}
                </div>
              ))}

              {/* <div className="interest-item">
                <img src="https://dummyimage.com/40x40/000000/ffffff&text=W" alt="Entity name"/>
                <div>
                <p className="title">Wits DevSoc</p>
                <p className="subtitle">Category</p>
                <p className="subtitle">Number of followers</p>
                </div>
                    <button className="follow-btn">Follow</button>
            </div> 
            <button className="show-more">Show more suggestions</button>
            {/* </div> */}

              {visibleCount < csos.length && (
                <button className="show-more" onClick={handleShowMore}>
                  Show more suggestions
                </button>
              )}
            </aside>
          </section>
        </>
      )}
    </>
  );
}
