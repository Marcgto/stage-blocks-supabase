import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AppHeader from '../components/AppHeader';
import PageDescriptor from '../components/PageDescriptor';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#4A1A1A',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <AppHeader projectName={null} />

      {/* Page Descriptor */}
      <PageDescriptor description="Welcome to Stage Blocks" />

      {/* Main content - Login Form */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '460px',
          backgroundColor: '#5A2020',
          border: '2px solid #A68C2C',
          borderRadius: '4px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#A68C2C',
            margin: 0,
            textAlign: 'center'
          }}>
            Sign In
          </h2>

          {error && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#3A1A1A',
              border: '2px solid #A32D2D',
              borderRadius: '4px',
              color: '#A32D2D',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              padding: '1rem',
              backgroundColor: '#A68C2C',
              color: '#4A1A1A',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = '#D4A574';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = '#A68C2C';
            }}
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <p style={{
            fontSize: '12px',
            color: '#888888',
            textAlign: 'center',
            margin: 0
          }}>
            By signing in, you agree to our terms of service
          </p>
        </div>
      </main>
    </div>
  );
}