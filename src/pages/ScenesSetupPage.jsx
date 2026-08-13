import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AppHeader from '../components/AppHeader';
import PageDescriptor from '../components/PageDescriptor';
import AppFooter from '../components/AppFooter';

export default function ScenesSetupPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [sceneName, setSceneName] = useState('');
  const [sceneScript, setSceneScript] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedScene, setExpandedScene] = useState(null);
  const [draggedScene, setDraggedScene] = useState(null);

  useEffect(() => {
    loadProject();
    fetchScenes();
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

  const fetchScenes = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('scenes')
        .select('*')
        .eq('project_id', projectId)
        .order('sequence', { ascending: true });

      if (fetchError) throw fetchError;
      setScenes(data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching scenes:', err);
      setError('Failed to load scenes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddScene = async (e) => {
    e.preventDefault();
    
    if (!sceneName.trim()) {
      setError('Please enter a scene name');
      return;
    }

    try {
      // Calculate sequence (add to end)
      const maxSequence = scenes.length > 0 
        ? Math.max(...scenes.map(s => s.sequence || 0))
        : 0;

      const { data, error: insertError } = await supabase
        .from('scenes')
        .insert([
          {
            project_id: projectId,
            name: sceneName.trim(),
            script_text: sceneScript.trim(),
            sequence: maxSequence + 1
          }
        ])
        .select();

      if (insertError) throw insertError;

      // Add to local state
      setScenes([...scenes, data[0]]);
      setSceneName('');
      setSceneScript('');
      setError('');
    } catch (err) {
      console.error('Error adding scene:', err);
      setError('Failed to add scene');
    }
  };

  const handleDeleteScene = async (sceneId) => {
    try {
      const { error: deleteError } = await supabase
        .from('scenes')
        .delete()
        .eq('id', sceneId);

      if (deleteError) throw deleteError;

      setScenes(scenes.filter(s => s.id !== sceneId));
      setDeleteConfirm(null);
      setError('');
    } catch (err) {
      console.error('Error deleting scene:', err);
      setError('Failed to delete scene');
    }
  };

  const handleDragStart = (e, scene) => {
    setDraggedScene(scene);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetScene) => {
    e.preventDefault();
    
    if (!draggedScene || draggedScene.id === targetScene.id) {
      setDraggedScene(null);
      return;
    }

    try {
      // Create new array with reordered scenes
      const newScenes = [...scenes];
      const draggedIndex = newScenes.findIndex(s => s.id === draggedScene.id);
      const targetIndex = newScenes.findIndex(s => s.id === targetScene.id);

      // Reorder locally
      const [removed] = newScenes.splice(draggedIndex, 1);
      newScenes.splice(targetIndex, 0, removed);

      // Update sequences
      const updates = newScenes.map((scene, index) => ({
        id: scene.id,
        sequence: index + 1
      }));

      // Update in Supabase
      for (const update of updates) {
        await supabase
          .from('scenes')
          .update({ sequence: update.sequence })
          .eq('id', update.id);
      }

      setScenes(newScenes);
      setDraggedScene(null);
    } catch (err) {
      console.error('Error reordering scenes:', err);
      setError('Failed to reorder scenes');
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
      <AppHeader projectName={project?.name} />

      {/* Page Descriptor */}
      <PageDescriptor description="Create all scenes and paste your script. You will be able to split scenes into blocks afterwards." />

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
          fontSize: '14px'
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
        {/* Add Scene Form */}
        <form onSubmit={handleAddScene} style={{
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
            Add New Scene
          </h2>

          <div>
            <label style={{
              display: 'block',
              color: '#A68C2C',
              fontWeight: 600,
              marginBottom: '0.5rem',
              fontSize: '14px'
            }}>
              Scene Name
            </label>
            <input
              type="text"
              value={sceneName}
              onChange={(e) => setSceneName(e.target.value)}
              placeholder="e.g., You'll Be Back"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#3A1A1A',
                border: '2px solid #A68C2C',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              color: '#A68C2C',
              fontWeight: 600,
              marginBottom: '0.5rem',
              fontSize: '14px'
            }}>
              Script Text (Optional)
            </label>
            <textarea
              value={sceneScript}
              onChange={(e) => setSceneScript(e.target.value)}
              placeholder="Paste your script or lyrics here..."
              rows="6"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#3A1A1A',
                border: '2px solid #A68C2C',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '14px',
                boxSizing: 'border-box',
                resize: 'none'
              }}
            />
          </div>

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
            Add Scene
          </button>
        </form>

        {/* Scenes List */}
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
            Scenes ({scenes.length})
          </h2>

          {scenes.length === 0 ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#888888',
              fontSize: '14px'
            }}>
              No scenes added yet. Add one above!
            </div>
          ) : (
            scenes.map((scene) => (
              <div
                key={scene.id}
                draggable
                onDragStart={(e) => handleDragStart(e, scene)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, scene)}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  opacity: draggedScene?.id === scene.id ? 0.5 : 1,
                  transition: 'opacity 0.2s ease'
                }}
              >
                {/* Scene Rectangle - Expands to show script */}
                <div
                  draggable={false}
                  onClick={() => setExpandedScene(expandedScene === scene.id ? null : scene.id)}
                  style={{
                    flex: 1,
                    minHeight: '60px',
                    backgroundColor: '#5A2020',
                    border: '2px solid #A68C2C',
                    borderRadius: '4px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6B2C2C'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5A2020'}
                >
                  <div style={{
                    color: '#A68C2C',
                    fontWeight: 600,
                    fontSize: '14px',
                    marginBottom: expandedScene === scene.id ? '0.5rem' : 0
                  }}>
                    {scene.name}
                  </div>

                  {/* Expanded Script Text */}
                  {expandedScene === scene.id && scene.script_text && (
                    <div style={{
                      color: '#888888',
                      whiteSpace: 'pre-wrap',
                      fontSize: '12px',
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #A68C2C',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      {scene.script_text}
                    </div>
                  )}
                </div>

                {/* Delete X Button - Square 60×60, Fixed Position */}
                <button
                  onClick={() => setDeleteConfirm(scene.id)}
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
              Delete Scene?
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
                onClick={() => handleDeleteScene(deleteConfirm)}
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

      {/* Footer - Back & Logout */}
      <AppFooter backTo={`/project/${projectId}/details`} showLogout={true} />
    </div>
  );
}