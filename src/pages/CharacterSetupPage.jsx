import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AppHeader from '../components/AppHeader';
import PageDescriptor from '../components/PageDescriptor';
import AppFooter from '../components/AppFooter';

export default function CharacterSetupPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [members, setMembers] = useState([]);
  const [characterName, setCharacterName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [hasEnsemble, setHasEnsemble] = useState(false);

  useEffect(() => {
    loadProject();
    fetchCharacters();
    fetchMembers();
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

  const fetchCharacters = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('characters')
        .select('*')
        .eq('project_id', projectId)
        .order('sequence', { ascending: true });

      if (fetchError) throw fetchError;
      setCharacters(data || []);
      
      // Check if ensemble exists
      const ensembleExists = data?.some(c => c.name.toLowerCase() === 'ensemble');
      setHasEnsemble(ensembleExists);
      setError('');
    } catch (err) {
      console.error('Error fetching characters:', err);
      setError('Failed to load characters');
    }
  };

  const fetchMembers = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('project_members')
        .select('*')
        .eq('project_id', projectId)
        .order('sequence', { ascending: true });

      if (fetchError) throw fetchError;
      setMembers(data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const handleAddCharacter = async (e) => {
    e.preventDefault();
    
    if (!characterName.trim()) {
      setError('Please enter a character name');
      return;
    }

    try {
      // Calculate sequence (add to end)
      const maxSequence = characters.length > 0 
        ? Math.max(...characters.map(c => c.sequence || 0))
        : 0;

      const { data, error: insertError } = await supabase
        .from('characters')
        .insert([
          {
            project_id: projectId,
            name: characterName.trim(),
            sequence: maxSequence + 1
          }
        ])
        .select();

      if (insertError) throw insertError;

      setCharacters([...characters, data[0]]);
      setCharacterName('');
      setError('');
    } catch (err) {
      console.error('Error adding character:', err);
      setError('Failed to add character');
    }
  };

  const handleAddEnsemble = async () => {
    try {
      const maxSequence = characters.length > 0 
        ? Math.max(...characters.map(c => c.sequence || 0))
        : 0;

      const { data, error: insertError } = await supabase
        .from('characters')
        .insert([
          {
            project_id: projectId,
            name: 'Ensemble',
            sequence: maxSequence + 1
          }
        ])
        .select();

      if (insertError) throw insertError;

      setCharacters([...characters, data[0]]);
      setHasEnsemble(true);
      setError('');
    } catch (err) {
      console.error('Error adding ensemble:', err);
      setError('Failed to add ensemble');
    }
  };

  const handleDeleteCharacter = async (characterId) => {
    try {
      const charToDelete = characters.find(c => c.id === characterId);
      
      const { error: deleteError } = await supabase
        .from('characters')
        .delete()
        .eq('id', characterId);

      if (deleteError) throw deleteError;

      const updatedCharacters = characters.filter(c => c.id !== characterId);
      setCharacters(updatedCharacters);
      
      // Update ensemble flag
      const ensembleStillExists = updatedCharacters.some(c => c.name.toLowerCase() === 'ensemble');
      setHasEnsemble(ensembleStillExists);
      
      setDeleteConfirm(null);
      setError('');
    } catch (err) {
      console.error('Error deleting character:', err);
      setError('Failed to delete character');
    }
  };

  const handleAssignMember = async (characterId, memberId) => {
    try {
      // For now, just log - this will be enhanced later for actual assignment logic
      console.log(`Assigning member ${memberId} to character ${characterId}`);
    } catch (err) {
      console.error('Error assigning member:', err);
      setError('Failed to assign member');
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
      <PageDescriptor description="Create all the named characters" />

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
        {/* Add Character Form */}
        <form onSubmit={handleAddCharacter} style={{
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
            Add New Character
          </h2>

          <div>
            <label style={{
              display: 'block',
              color: '#A68C2C',
              fontWeight: 600,
              marginBottom: '0.5rem',
              fontSize: '14px'
            }}>
              Character Name
            </label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="e.g., John Smith"
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
            Add Character
          </button>
        </form>

        {/* Add Ensemble Button - Only show if ensemble doesn't exist */}
        {!hasEnsemble && (
          <button
            onClick={handleAddEnsemble}
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
            + Add Ensemble
          </button>
        )}

        {/* Characters List */}
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
            Characters ({characters.length})
          </h2>

          {characters.length === 0 ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#888888',
              fontSize: '14px'
            }}>
              No characters added yet. Add one above!
            </div>
          ) : (
            characters
              .sort((a, b) => {
                // Ensemble always first
                const aIsEnsemble = a.name.toLowerCase() === 'ensemble';
                const bIsEnsemble = b.name.toLowerCase() === 'ensemble';
                if (aIsEnsemble) return -1;
                if (bIsEnsemble) return 1;
                return 0;
              })
              .map((character) => (
              <div
                key={character.id}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center'
                }}
              >
                {/* Character Rectangle - 70px tall */}
                <div
                  style={{
                    flex: 1,
                    height: '70px',
                    backgroundColor: '#5A2020',
                    border: '2px solid #A68C2C',
                    borderRadius: '4px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{
                    color: '#A68C2C',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}>
                    {character.name}
                  </div>

                  {/* Member Dropdown - NOT shown for Ensemble */}
                  {character.name.toLowerCase() !== 'ensemble' && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAssignMember(character.id, e.target.value);
                        }
                      }}
                      defaultValue=""
                      style={{
                        padding: '0.25rem',
                        backgroundColor: '#3A1A1A',
                        border: '1px solid #A68C2C',
                        borderRadius: '2px',
                        color: '#888888',
                        fontSize: '12px',
                        cursor: 'pointer',
                        marginTop: '-2px'
                      }}
                    >
                      <option value="">Assign member...</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Delete X Button - Square 70×70 */}
                <button
                  onClick={() => setDeleteConfirm(character.id)}
                  style={{
                    width: '70px',
                    height: '70px',
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
              Delete Character?
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
                onClick={() => handleDeleteCharacter(deleteConfirm)}
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