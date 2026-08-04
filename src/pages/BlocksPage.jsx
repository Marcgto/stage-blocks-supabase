import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function StageDirectionsPage() {
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
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 600,
          color: '#A68C2C',
          margin: 0
        }}>
          Stage Directions
        </h1>
      </header>

      {/* Main content */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#5A2020',
          border: '2px solid #A68C2C',
          borderRadius: '4px',
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <p style={{ color: '#A68C2C', fontSize: '16px' }}>
            Stage Directions
          </p>
          <p style={{ color: '#A68C2C', fontSize: '14px', opacity: 0.8 }}>
            Coming soon - Build complete project first
          </p>
        </div>
      </main>

      {/* Back Button */}
      <footer style={{
        display: 'flex',
        justifyContent: 'flex-start'
      }}>
        <button
          onClick={() => navigate(`/project/${projectId}`)}
          className="btn-theater"
          style={{
            padding: '0.75rem 1.5rem'
          }}
        >
          ← Back to Main Menu
        </button>
      </footer>
    </div>
  );
}