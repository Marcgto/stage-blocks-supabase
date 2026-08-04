import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function MainMenuPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (!error) {
      setProject(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4A1A1A'
      }}>
        <p style={{ color: '#A68C2C', fontSize: '18px' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#4A1A1A',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: '3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 600,
          color: '#A68C2C',
          margin: 0
        }}>
          {project?.name || 'Project'}
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#A68C2C',
          margin: 0,
          opacity: 0.9
        }}>
          Project Manager
        </p>
      </header>

      {/* Main Menu - Menu buttons */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '900px'
        }}>
          {/* Project Details Button - ACTIVE */}
          <button
            onClick={() => navigate(`/project/${projectId}/details`)}
            style={{
              width: '160px',
              height: '160px',
              backgroundColor: '#5A2020',
              border: '2px solid #A68C2C',
              borderRadius: '4px',
              color: '#A68C2C',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '1rem',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#6B2C2C'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#5A2020'}
          >
            Project Details
          </button>

          {/* Blocks Button - DISABLED (grayed out) */}
          <button
            disabled
            style={{
              width: '160px',
              height: '160px',
              backgroundColor: '#3A2020',
              border: '2px solid #666666',
              borderRadius: '4px',
              color: '#888888',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '1rem',
              opacity: 0.6
            }}
          >
            Blocks
          </button>

          {/* Full Script Button - DISABLED (grayed out) */}
          <button
            disabled
            style={{
              width: '160px',
              height: '160px',
              backgroundColor: '#3A2020',
              border: '2px solid #666666',
              borderRadius: '4px',
              color: '#888888',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '1rem',
              opacity: 0.6
            }}
          >
            Full Script
          </button>
        </div>
      </main>

      {/* Back to Project Selector Button */}
      <footer style={{
        display: 'flex',
        justifyContent: 'flex-start'
      }}>
        <button
          onClick={() => navigate('/')}
          className="btn-theater"
          style={{
            padding: '0.75rem 1.5rem'
          }}
        >
          ← Back to Project Selector
        </button>
      </footer>
    </div>
  );
}