import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AppFooter({ showBack = true, showLogout = false, backTo = '/' }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <footer style={{
      display: 'flex',
      justifyContent: showBack ? 'space-between' : 'flex-end',
      alignItems: 'center',
      width: '460px',
      margin: '0 auto',
      marginTop: 'auto',
      paddingTop: '1.5rem',
      borderTop: '1px solid #A68C2C'
    }}>
      {/* Back Button - Left (optional) */}
      {showBack && (
        <button
          onClick={() => navigate(backTo)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#5A2020',
            border: '2px solid #A68C2C',
            color: '#A68C2C',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#6B2C2C'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#5A2020'}
        >
          ← Back
        </button>
      )}

      {/* Logout Button - Right (optional) */}
      {showLogout && (
        <button
          onClick={handleLogout}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#5A2020',
            border: '2px solid #A68C2C',
            color: '#A68C2C',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#6B2C2C'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#5A2020'}
        >
          Logout
        </button>
      )}
    </footer>
  );
}