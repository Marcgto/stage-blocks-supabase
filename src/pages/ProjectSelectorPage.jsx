import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AppHeader from '../components/AppHeader';
import PageDescriptor from '../components/PageDescriptor';
import AppFooter from '../components/AppFooter';

export default function ProjectSelectorPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProjects(data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!newProjectName.trim()) {
      setError('Please enter a project name');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error: insertError } = await supabase
        .from('projects')
        .insert([
          {
            user_id: user.id,
            name: newProjectName.trim()
          }
        ])
        .select();

      if (insertError) throw insertError;

      setProjects([data[0], ...projects]);
      setNewProjectName('');
      setError('');
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (deleteError) throw deleteError;

      setProjects(projects.filter(p => p.id !== projectId));
      setDeleteConfirm(null);
      setError('');
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
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
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Header */}
      <AppHeader projectName={null} />

      {/* Page Descriptor */}
      <PageDescriptor description="Create, join or leave a project." />

      {/* Error message */}
      {error && (
        <div style={{
          width: '460px',
          marginBottom: '1rem',
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

      {/* Main content */}
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '460px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Create New Project Form */}
        <form onSubmit={handleCreateProject} style={{
          backgroundColor: '#5A2020',
          border: '2px solid #A68C2C',
          borderRadius: '4px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#A68C2C',
            margin: 0
          }}>
            New Project
          </h2>

          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Project name"
            style={{
              padding: '0.75rem',
              backgroundColor: '#3A1A1A',
              border: '2px solid #A68C2C',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '14px'
            }}
          />

          <button
            type="submit"
            style={{
              padding: '0.75rem',
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
            Create Project
          </button>
        </form>

        {/* Projects List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#A68C2C',
            margin: 0,
            marginBottom: '0.5rem'
          }}>
            Projects ({projects.length})
          </h2>

          {projects.length === 0 ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#888888',
              fontSize: '14px'
            }}>
              No projects yet. Create one above!
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center'
                }}
              >
                {/* Project Rectangle */}
                <button
                  onClick={() => navigate(`/project/${project.id}`)}
                  style={{
                    flex: 1,
                    height: '60px',
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
                    padding: '1rem',
                    textAlign: 'center',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#6B2C2C'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#5A2020'}
                >
                  {project.name}
                </button>

                {/* Delete X Button - Square 60×60 */}
                <button
                  onClick={() => setDeleteConfirm(project.id)}
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#3A1A1A',
                    border: '2px solid #A68C2C',
                    borderRadius: '4px',
                    color: '#A68C2C',
                    fontSize: '20px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#6B2C2C'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3A1A1A'}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: '#5A2020',
            border: '2px solid #A68C2C',
            borderRadius: '4px',
            padding: '1.5rem',
            maxWidth: '400px',
            color: '#A68C2C'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              margin: '0 0 1rem 0'
            }}>
              Delete Project?
            </h3>
            <p style={{
              color: '#888888',
              marginBottom: '1.5rem',
              fontSize: '14px'
            }}>
              Are you sure? This action cannot be undone.
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#5A2020',
                  border: '2px solid #A68C2C',
                  borderRadius: '4px',
                  color: '#A68C2C',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#6B2C2C'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#5A2020'}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deleteConfirm)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#3A1A1A',
                  border: '2px solid #A68C2C',
                  borderRadius: '4px',
                  color: '#A68C2C',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#6B2C2C'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3A1A1A'}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Logout only (no back button) */}
      <AppFooter showBack={false} showLogout={true} />
    </div>
  );
}