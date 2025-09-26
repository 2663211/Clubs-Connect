//PABI'S CODE
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation } from 'react-router-dom';
import '../styles/Auth.css';
import { useNavigate } from 'react-router-dom';
//import StudentDashboard from './StudentDashboard';
//import SGODashboard from './SGODashboard';
//import ExecDashboard from './ExecDashboard';

export const handleLogout = async () => {
  await supabase.auth.signOut();
};

export default function Auth() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  //const [isRegistering, setIsRegistering] = useState(false)
  const [isSignedUp, setIsSignedUp] = useState(false);

  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(location.state?.form === 'signup');

  const allowedDomain = '@students.wits.ac.za';
  const isWitsEmail = email => email.toLowerCase().endsWith(allowedDomain);

  const navigate = useNavigate();

  // Fetch profile full_name and role from Supabase profiles table
  const fetchProfile = async userId => {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  };

  // Create profile if it does not exist (with default role student)
  const createProfileIfNotExists = async user => {
    const { data, error } = await supabase.from('profiles').select('id').eq('id', user.id).single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking profile:', error);
      return;
    }

    if (!data) {
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, full_name: fullName, role: 'student' }]);
      if (insertError) console.error('Error creating profile:', insertError);
    }
  };

  // Listen for auth state changes and set user/profile info
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (!isWitsEmail(session.user.email)) {
          supabase.auth.signOut();
          setError('Only Wits University emails are allowed.');
        } else {
          setUser(session.user);
          fetchProfile(session.user.id).then(profile => {
            setUserName(profile?.full_name || '');
            setRole(profile?.role || '');

            if (profile?.role === 'student') navigate('/dashboard/student');
            else if (profile?.role === 'sgo') navigate('/dashboard/sgo');
            else if (profile?.role === 'exec') navigate('/dashboard/student');
          });
        }
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        if (!isWitsEmail(session.user.email)) {
          await supabase.auth.signOut();
          setError('Only Wits University emails are allowed.');
          setUser(null);
          setRole('');
        } else {
          setUser(session.user);
          await createProfileIfNotExists(session.user);
          fetchProfile(session.user.id).then(profile => {
            setUserName(profile?.full_name || '');
            setRole(profile?.role || '');

            if (profile?.role === 'student') navigate('/dashboard/student');
            else if (profile?.role === 'sgo') navigate('/dashboard/sgo');
            else if (profile?.role === 'exec') navigate('/dashboard/student');
          });
        }
      } else {
        setUser(null);
        setUserName('');
        setRole('');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Signup handler
  const handleSignUp = async e => {
    e.preventDefault();
    if (!isWitsEmail(email)) {
      setError('Only Wits University emails are allowed.');
      return;
    }
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const userId = data.user.id;
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: userId, full_name: name }]);

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setIsSignedUp(true);
  };

  // Login handler
  const handleLogin = async e => {
    e.preventDefault();
    if (!isWitsEmail(email)) {
      setError('Only Wits University emails are allowed.');
      return;
    }
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const profile = await fetchProfile(data.user.id);
    setUser(data.user);
    setUserName(profile?.full_name || '');
    setRole(profile?.role || '');
    setLoading(false);

    if (profile?.role === 'student') navigate('/dashboard/student');
    else if (profile?.role === 'sgo') navigate('/dashboard/sgo');
    else if (profile?.role === 'exec') navigate('/dashboard/student');
  };

  // Google OAuth Sign in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth`, // ensures redirect goes to Auth page
      },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserName('');
    setRole('');
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  // Toggle between Register and Login forms
  const handleRegisterToggle = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setName('');
  };

  if (isSignedUp) {
    return (
      <section className="auth-container">
        <main>
          <p>
            Thank you for signing up! Please check your email at <b>{email}</b> to confirm your
            account. After confirming, you can log in.
          </p>
        </main>
      </section>
    );
  }

  return (
    <>
      {user ? (
        <main>
          {/*
        <section aria-label="User Info">
          <p>Welcome, {userName || user.user_metadata?.name || user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </section>
        
       

        {role === 'student' && <StudentDashboard />}
        {role === 'sgo' && <SGODashboard />}
        {role === 'exec' && <ExecDashboard />}

        */}
        </main>
      ) : (
        // Auth forms view with background container and styling
        <section className="auth-container" aria-label="Authentication Forms">
          <main>
            <header>
              <h1>Clubs Connect</h1>
            </header>

            {isRegistering ? (
              <form onSubmit={handleSignUp}>
                <fieldset>
                  <legend>Signup</legend>

                  <label htmlFor="name">Full Name</label>
                  <br />
                  <input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                  <br />
                  <br />

                  <label htmlFor="email">Email</label>
                  <br />
                  <input
                    id="email"
                    type="email"
                    placeholder="12345@students.wits.ac.za"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <br />
                  <br />

                  <label htmlFor="password">Password</label>
                  <br />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <br />
                  <br />

                  <button type="submit" disabled={loading}>
                    Sign up
                  </button>
                  <br />
                  <br />

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    style={{
                      backgroundColor: '#4285F4',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Sign up with Google
                  </button>
                </fieldset>

                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={handleRegisterToggle}
                    style={{
                      color: 'blue',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Login here
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleLogin} autoComplete="off">
                <fieldset>
                  <legend>Login</legend>

                  <label htmlFor="email">Email</label>
                  <br />
                  <input
                    id="email"
                    type="email"
                    placeholder="12345@students.wits.ac.za"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <br />
                  <br />

                  <label htmlFor="password">Password</label>
                  <br />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <br />
                  <br />

                  <button type="submit" disabled={loading}>
                    Login
                  </button>
                  <br />
                  <br />

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    style={{
                      backgroundColor: '#4285F4',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Sign in with Google
                  </button>
                </fieldset>

                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={handleRegisterToggle}
                    style={{
                      color: 'blue',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Sign up here
                  </button>
                </p>
              </form>
            )}

            {error && (
              <p role="alert" style={{ color: 'red' }}>
                {error}
              </p>
            )}
          </main>
        </section>
      )}
    </>
  );
}
