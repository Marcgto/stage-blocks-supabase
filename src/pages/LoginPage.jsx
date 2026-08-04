import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#4A1A1A',
      padding: '1rem'
    }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .btn-login {
          background: #5A2020;
          color: #A68C2C;
          border: 2px solid #A68C2C;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          padding: 1rem;
          font-size: 16px;
          transition: background-color 0.2s ease;
          width: 100%;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .btn-login:hover {
          background: #6B2C2C;
        }
        .btn-actor {
          background: #5A2020;
          color: #A68C2C;
          border: 2px solid #A68C2C;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          padding: 1rem;
          font-size: 16px;
          transition: background-color 0.2s ease;
          width: 100%;
          display: block;
          text-align: center;
          text-decoration: none;
        }
        .btn-actor:hover {
          background: #6B2C2C;
        }
      `}</style>

      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: '#5A2020',
        border: '2px solid #A68C2C',
        borderRadius: '4px',
        padding: '2rem'
      }}>
        {/* Logo/Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          flexDirection: 'column'
        }}>
          <div style={{ fontSize: '48px' }}>🎭</div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#A68C2C', margin: 0 }}>
            Stage Blocks
          </h1>
          <p style={{ color: '#A68C2C', fontSize: '14px', marginTop: '0.5rem', opacity: 0.8 }}>
            Theater staging made simple
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: '#3A1010',
            border: '1px solid #A68C2C',
            borderRadius: '4px',
            color: '#ff9999'
          }}>
            <p style={{ fontSize: '14px', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Sign in button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="btn-login"
        >
          {loading ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'currentColor' }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Sign in with Google</span>
            </>
          )}
        </button>

        {/* Info text */}
        <p style={{ textAlign: 'center', color: '#A68C2C', fontSize: '14px', marginBottom: '2rem' }}>
          Project managers: Sign in to manage your shows and cast.
        </p>

        {/* Actor link */}
        <div style={{
          borderTop: '1px solid #A68C2C',
          paddingTop: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <p style={{ textAlign: 'center', color: '#A68C2C', fontSize: '14px', marginBottom: '1rem', opacity: 0.8 }}>
            Are you an actor?
          </p>
          <a href="/actor" className="btn-actor">
            Access as Actor
          </a>
        </div>
      </div>
    </div>
  );
}