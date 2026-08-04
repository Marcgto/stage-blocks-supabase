import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AppHeader from '../components/AppHeader';
import PageDescriptor from '../components/PageDescriptor';
import AppFooter from '../components/AppFooter';

export default function MainMenuPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sceneCount, setSceneCount] = useState(0);

  useEffect(() => {
    loadProject();
    loadSceneCount();
  }, [projectId]);

  // Re-load counts whenever this component gets focus
  useEffect(() => {
    const handleFocus = () => {
      loadSceneCount();
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

  const loadSceneCount = async () => {
    try {
      const { count: sceneCountResult, error: sceneError } = await supabase
        .from('scenes')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);

      if (!sceneError && sceneCountResult !== null) {
        setSceneCount(sceneCountResult);
      }
    } catch (err) {
      console.error('Error loading scene count:', err);
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

      {/* Main content - Menu Sections */}
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
          {/* Project Details Button - ACTIVE */}
          <button
            onClick={() => navigate(`/project/${projectId}/details`)}
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
            Project Details
          </button>

          {/* Blocks Button - UNLOCKS when 1+ scenes exist */}
          <button
            disabled={sceneCount === 0}
            onClick={() => navigate(`/project/${projectId}/blocks`)}
            style={{
              width: '220px',
              height: '160px',
              backgroundColor: sceneCount > 0 ? '#5A2020' : '#3A2020',
              border: sceneCount > 0 ? '2px solid #A68C2C' : '2px solid #666666',
              borderRadius: '4px',
              color: sceneCount > 0 ? '#A68C2C' : '#888888',
              fontSize: '16px',
              fontWeight: 600,
              cursor: sceneCount > 0 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '1rem',
              transition: 'background-color 0.2s ease',
              opacity: sceneCount > 0 ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (sceneCount > 0) {
                e.target.style.backgroundColor = '#6B2C2C';
              }
            }}
            onMouseLeave={(e) => {
              if (sceneCount > 0) {
                e.target.style.backgroundColor = '#5A2020';
              }
            }}
            title={sceneCount === 0 ? 'Add at least 1 scene first' : ''}
          >
            Blocks
          </button>

          {/* Full Script Button - UNLOCKS when 1+ scenes exist */}
          <button
            disabled={sceneCount === 0}
            onClick={() => navigate(`/project/${projectId}/full-script`)}
            style={{
              width: '220px',
              height: '160px',
              backgroundColor: sceneCount > 0 ? '#5A2020' : '#3A2020',
              border: sceneCount > 0 ? '2px solid #A68C2C' : '2px solid #666666',
              borderRadius: '4px',
              color: sceneCount > 0 ? '#A68C2C' : '#888888',
              fontSize: '16px',
              fontWeight: 600,
              cursor: sceneCount > 0 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '1rem',
              transition: 'background-color 0.2s ease',
              opacity: sceneCount > 0 ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (sceneCount > 0) {
                e.target.style.backgroundColor = '#6B2C2C';
              }
            }}
            onMouseLeave={(e) => {
              if (sceneCount > 0) {
                e.target.style.backgroundColor = '#5A2020';
              }
            }}
            title={sceneCount === 0 ? 'Add at least 1 scene first' : ''}
          >
            Full Script
          </button>
        </div>
      </main>

      {/* Footer - Back & Logout */}
      <AppFooter backTo="/" showLogout={true} />
    </div>
  );
}