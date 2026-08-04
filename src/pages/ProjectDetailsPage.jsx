import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [characterCount, setCharacterCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    loadProject();
    loadCounts();
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

  const loadCounts = async () => {
    // Get character count
    const { data: characters, error: charError } = await supabase
      .from('characters')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId);

    if (!charError) {
      setCharacterCount(characters?.length || 0);
    }

    // Get member count
    const { data: members, error: memError } = await supabase
      .from('project_members')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId);

    if (!memError) {
      setMemberCount(members?.length || 0);
    }
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

      {/* Main content - Setup Sections */}
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
          {/* Characters Button - ACTIVE */}
          <button
            onClick={() => navigate(`/project/${projectId}/characters`)}
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
            Characters
          </button>

          {/* Members Button - UNLOCKS when 1+ characters exist */}
          <button
            disabled={characterCount === 0}
            onClick={() => navigate(`/project/${projectId}/members`)}
            style={{
              width: '160px',
              height: '160px',
              backgroundColor: characterCount > 0 ? '#5A2020' : '#3A2020',
              border: characterCount > 0 ? '2px solid #A68C2C' : '2px solid #666666',
              borderRadius: '4px',
              color: characterCount > 0 ? '#A68C2C' : '#888888',
              fontSize: '16px',
              fontWeight: 600,
              cursor: characterCount > 0 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '1rem',
              transition: 'background-color 0.2s ease',
              opacity: characterCount > 0 ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (characterCount > 0) {
                e.target.style.backgroundColor = '#6B2C2C';
              }
            }}
            onMouseLeave={(e) => {
              if (characterCount > 0) {
                e.target.style.backgroundColor = '#5A2020';
              }
            }}
            title={characterCount === 0 ? 'Add at least 1 character first' : ''}
          >
            Members
          </button>

          {/* Scenes Button - UNLOCKS when 1+ members exist */}
          <button
            disabled={memberCount === 0}
            onClick={() => navigate(`/project/${projectId}/scenes`)}
            style={{
              width: '160px',
              height: '160px',
              backgroundColor: memberCount > 0 ? '#5A2020' : '#3A2020',
              border: memberCount > 0 ? '2px solid #A68C2C' : '2px solid #666666',
              borderRadius: '4px',
              color: memberCount > 0 ? '#A68C2C' : '#888888',
              fontSize: '16px',
              fontWeight: 600,
              cursor: memberCount > 0 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '1rem',
              transition: 'background-color 0.2s ease',
              opacity: memberCount > 0 ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (memberCount > 0) {
                e.target.style.backgroundColor = '#6B2C2C';
              }
            }}
            onMouseLeave={(e) => {
              if (memberCount > 0) {
                e.target.style.backgroundColor = '#5A2020';
              }
            }}
            title={memberCount === 0 ? 'Add at least 1 member first' : ''}
          >
            Scenes
          </button>
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