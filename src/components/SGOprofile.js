import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SGOprofile.css';
import { handleLogout } from './Auth';
import StudentHeader from './StudentHeader';
import coverPhoto from '../images/coverPhoto.jpeg';
import profilePhoto from '../images/ProfilePhoto.jpeg';
import coverPhoto2 from '../images/coverPhoto2.png';
import emailPhoto from '../images/direct.png';
import edit from '../images/icons8-edit-50.png';
import { supabase } from '../supabaseClient';

export default function SGODashboard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: '',
    about: '',
    coverPic: coverPhoto2,
    profilePic: profilePhoto,
    email: '',
    role: 'sgo',
    officeNo: '',
    position: '',
    building: '',
    floor: '',
  });

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(userInfo);
  const [loading, setLoading] = useState(false);

  // Fetching profile/user data
  const fetchProfile = async userId => {
    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
      id,
      full_name,
      bio,
      avatar_url,
      cover_url,
      role,
      sgo (
        office_no,
        position,
        building,
        floor
      )
    `
      )
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  };

  // Setting what is in the database to the profile
  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);
      const profile = await fetchProfile(user.id);
      if (profile) {
        setUserInfo({
          name: profile.full_name || 'Unnamed User',
          about: profile.bio || '',
          coverPic: profile.cover_url || coverPhoto2,
          profilePic: profile.avatar_url || profilePhoto,
          email: user.email || '',
          role: profile.role || 'sgo',
          officeNo: profile.sgo?.office_no || 'N/A',
          position: profile.sgo?.position || 'N/A',
          building: profile.sgo?.building || 'N/A',
          floor: profile.sgo?.floor || 'N/A',
        });
        setEditData({
          name: profile.full_name || 'Unnamed User',
          about: profile.bio || '',
          coverPic: profile.cover_url || coverPhoto2,
          profilePic: profile.avatar_url || profilePhoto,
          email: user.email || '',
          role: profile.role || 'sgo',
          officeNo: profile.sgo?.office_no || 'N/A',
          position: profile.sgo?.position || 'N/A',
          building: profile.sgo?.building || 'N/A',
          floor: profile.sgo?.floor || 'N/A',
        });
      }
    };
    loadProfile();
  }, []);

  // Handle text changes (name, about)
  const handleChange = e => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  // Handle file input changes
  const handleFileChange = async e => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Local preview
    setEditData({
      ...editData,
      [name]: URL.createObjectURL(file),
    });

    try {
      if (!user) return;

      // Create a unique file path for Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage bucket "profile_photos"
      const { error: uploadError } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage.from('profile_photos').getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // Save that URL in editData
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

    // Local preview
    setEditData({
      ...editData,
      [name]: URL.createObjectURL(file),
    });

    try {
      if (!user) return;

      // Create a unique file path for Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage bucket "cover_photos"
      const { error: uploadError } = await supabase.storage
        .from('cover_photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage.from('cover_photos').getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // Save that URL in editData
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

  // Updates the profile when the user edits
  const updateProfile = async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error.message);
      return null;
    }

    return data;
  };

  // Handles updates
  const handleUpdate = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const updated = await updateProfile(user.id, {
      full_name: editData.name,
      bio: editData.about,
      avatar_url: editData.profilePic,
      cover_url: editData.coverPic,
    });

    const { error: sgoError } = await supabase.from('sgo').upsert(
      {
        sgo_id: user.id,
        office_no: editData.officeNo,
        position: editData.position,
        building: editData.building,
        floor: editData.floor,
      },
      { onConflict: ['sgo_id'] }
    );

    if (sgoError) {
      console.error('Error updating SGO info:', sgoError.message);
      return;
    }

    if (updated) {
      console.log('Profile updated successfully');
    }
  };

  const handleSave = e => {
    e.preventDefault();
    setUserInfo(editData);
    setIsEditing(false);
    handleUpdate();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <article className="dashboard">
      <header className="ProfileHeader">
        <h1>Clubs Connect</h1>
        <nav>
          <ul className="pro-nav-links">
            <li>
              <button
                onClick={() => navigate('/dashboard/sgo')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/announcements/sgo')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Announcements
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/entities/sgo')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Entities
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/profile/sgo')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={async () => {
                  await handleLogout();
                  navigate('/auth');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="content">
        {isEditing ? (
          // Edit Mode
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
                <input
                  type="file"
                  id="myProfilefile"
                  name="profilePic"
                  onChange={handleFileChange}
                />
              </label>
              <br />

              <label htmlFor="ProfileName">
                Enter Your Name:
                <input
                  type="text"
                  id="ProfileName"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                />
              </label>
              <br />

              <label htmlFor="Position">
                Position:
                <input
                  type="text"
                  id="Position"
                  name="position"
                  value={editData.position}
                  onChange={handleChange}
                />
              </label>
              <br />

              <label htmlFor="Building">
                Building:
                <input
                  type="text"
                  id="Building"
                  name="building"
                  value={editData.building}
                  onChange={handleChange}
                />
              </label>
              <br />

              <label htmlFor="Floor">
                Floor:
                <input
                  type="text"
                  id="Floor"
                  name="floor"
                  value={editData.floor}
                  onChange={handleChange}
                />
              </label>
              <br />

              <label htmlFor="OfficeNo">
                Office Number:
                <input
                  type="text"
                  id="OfficeNo"
                  name="officeNo"
                  value={editData.officeNo}
                  onChange={handleChange}
                />
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
          // View Mode
          <>
            <section className="profile-page">
              <section className="profile-content">
                <section className="ProfilePhotos">
                  <img src={userInfo.coverPic} id="cover" alt="Cover" />
                  <img src={userInfo.profilePic} id="profile" alt="Profile" />
                  <img src={edit} onClick={handleEdit} id="editProfile" alt="Edit profile" />
                  <a
                    href={`mailto:${userInfo.email}`}
                    onClick={e => {
                      setTimeout(async () => {
                        //copy to clipboard if it does not automatically open
                        await navigator.clipboard.writeText(userInfo.email);
                        alert(`Could not open mail app. Email copied: ${userInfo.email}`);
                      }, 1000);
                    }}
                  >
                    <img src={emailPhoto} id="email" alt="Email" />
                  </a>
                </section>

                <section className="UserInfo">
                  <h2 className="Name">{userInfo.name}</h2>
                  <p className="about">{userInfo.about}</p>
                  {userInfo.role === 'sgo' && (
                    <>
                      <p>
                        <strong>Position:</strong> {userInfo.position}
                        <br></br>
                        <strong>Building:</strong> {userInfo.building}
                        <br></br>
                        <strong>Floor:</strong> {userInfo.floor}
                        <br></br>
                        <strong>Office No:</strong> {userInfo.officeNo}
                        <br></br>
                      </p>
                    </>
                  )}
                </section>
              </section>
            </section>
          </>
        )}
      </main>
    </article>
  );
}
