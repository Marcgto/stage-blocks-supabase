import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ProjectSelectorPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);

  useEffect(() => {
    loadUserAndProjects();
  }, []);

  const loadUserAndProjects = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) {
        setProjects(data || []);
      }
    }

    setLoading(false);
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    setCreatingProject(true);
    const { data, error } = await supabase
      .from('projects')
      .insert([{ user_id: user.id, name: newProjectName }])
      .select();

    if (!error && data) {
      setProjects([data[0], ...projects]);
      setNewProjectName('');
      setShowNewProjectModal(false);
    }
    setCreatingProject(false);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      await supabase.from('projects').delete().eq('id', projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: '#4A1A1A' }}>
        <p style={{ color: '#A68C2C', fontSize: '18px' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#4A1A1A', padding: '1rem' }}>
      {/* Header */}
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '24px' }}>🎭</div>
          <h1 style={{ fontSize: '24px', color: '#A68C2C', fontWeight: 600, margin: 0 }}>Stage Blocks</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <span style={{ color: '#A68C2C', fontSize: '14px' }}>{user?.email}</span>
          <button
            onClick={handleLogout}
            className="btn-theater"
            style={{ padding: '0.5rem 1rem', fontSize: '14px' }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '1rem' }}>
          <h2 style={{ fontSize: '20px', color: '#A68C2C', fontWeight: 600, margin: 0 }}>Your Projects</h2>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="btn-theater"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            + New Project
          </button>
        </div>

        {/* Projects grid */}
        {projects.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
            <p style={{ color: '#A68C2C', fontSize: '18px', marginBottom: '0.5rem' }}>No projects yet.</p>
            <p style={{ color: '#888', fontSize: '14px' }}>Create your first project to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-block"
                onClick={() => handleProjectClick(project.id)}
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}
              >
                <div>
                  <div className="project-block-title">{project.name}</div>
                  <div className="project-block-date">
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteProject(e, project.id)}
                  className="btn-theater"
                  style={{ fontSize: '12px', padding: '0.5rem', marginTop: '0.5rem', background: '#3A1010' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#4A1A1A',
            border: '2px solid #A68C2C',
            borderRadius: '4px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h2 style={{ color: '#A68C2C', marginBottom: '1rem', fontSize: '20px', fontWeight: 600 }}>Create New Project</h2>
            <input
              type="text"
              placeholder="Project name..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
              style={{
                width: '100%',
                padding: '1rem',
                marginBottom: '1rem',
                border: '1px solid #A68C2C',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                color: '#333',
                fontSize: '16px'
              }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="btn-theater"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={creatingProject}
                className="btn-theater"
                style={{ flex: 1 }}
              >
                {creatingProject ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}