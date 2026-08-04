import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AppHeader from '../components/AppHeader';
import PageDescriptor from '../components/PageDescriptor';
import AppFooter from '../components/AppFooter';

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

  // Re-load counts whenever this component gets focus
  useEffect(() => {
    const handleFocus = () => {
      loadCounts();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
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
    try {
      // Get character count
      const { count: charCount, error: charError } = await supabase
        .from('characters')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);

      if (!charError && charCount !== null) {
        setCharacterCount(charCount);
      }

      // Get member count
      const { count: memberCountResult, error: memError } = await supabase
        .from('project_members')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);

      if (!memError && memberCountResult !== null) {
        setMemberCount(memberCountResult);
      }
    } catch (err) {
      console.error('Error loading counts:', err);
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
      <AppHeader projectName={project?.name} />

      {/* Page Descriptor */}
      <PageDescriptor description="Dashboard" />

      {/* Main content - Setup Sections */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '500px'
        }}>
          {/* Members Button - ACTIVE BY DEFAULT */}
          <button
            onClick={() => navigate(`/project/${projectId}/members`)}
            style={{
              width: '220px',
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
            Members
          </button>

          {/* Characters Button - UNLOCKS when 1+ members exist */}
          <button
            disabled={memberCount === 0}
            onClick={() => navigate(`/project/${projectId}/characters`)}
            style={{
              width: '220px',
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
            Characters
          </button>

          {/* Scenes Button - UNLOCKS when 1+ characters exist */}
          <button
            disabled={characterCount === 0}
            onClick={() => navigate(`/project/${projectId}/scenes`)}
            style={{
              width: '220px',
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
            Scenes
          </button>
        </div>
      </main>

      {/* Footer - Back & Logout */}
      <AppFooter backTo="/" showLogout={true} />
    </div>
  );
}