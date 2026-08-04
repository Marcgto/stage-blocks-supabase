import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function CharacterSetupPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [savingCharacter, setSavingCharacter] = useState(false);

  useEffect(() => {
    loadProjectAndCharacters();
  }, [projectId]);

  const loadProjectAndCharacters = async () => {
    // Load project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (!projectError) {
      setProject(projectData);
    }

    // Load characters
    const { data: charactersData, error: charactersError } = await supabase
      .from('characters')
      .select('*')
      .eq('project_id', projectId)
      .order('sequence', { ascending: true });

    if (!charactersError) {
      setCharacters(charactersData || []);
    }

    setLoading(false);
  };

  const handleAddCharacter = async () => {
    if (!newCharacterName.trim()) return;

    setSavingCharacter(true);
    const { data, error } = await supabase
      .from('characters')
      .insert([{
        project_id: projectId,
        name: newCharacterName,
        sequence: characters.length
      }])
      .select();

    if (!error && data) {
      setCharacters([...characters, data[0]]);
      setNewCharacterName('');
    }
    setSavingCharacter(false);
  };

  const handleDeleteCharacter = async (characterId) => {
    if (confirm('Are you sure you want to delete this character?')) {
      await supabase.from('characters').delete().eq('id', characterId);
      setCharacters(characters.filter(c => c.id !== characterId));
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
        marginBottom: '2rem',
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
          Characters
        </p>
      </header>

      {/* Main content */}
      <main style={{
        flex: 1,
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
        marginBottom: '2rem'
      }}>
        {/* Add Character Form */}
        <div style={{
          backgroundColor: '#5A2020',
          border: '2px solid #A68C2C',
          borderRadius: '4px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <label style={{
            display: 'block',
            color: '#A68C2C',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '0.5rem'
          }}>
            Character Name
          </label>
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <input
              type="text"
              placeholder="Enter character name..."
              value={newCharacterName}
              onChange={(e) => setNewCharacterName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCharacter()}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #A68C2C',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                color: '#333',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={handleAddCharacter}
              disabled={savingCharacter}
              className="btn-theater"
              style={{
                padding: '0.75rem 1.5rem',
                minWidth: '120px'
              }}
            >
              {savingCharacter ? 'Adding...' : '+ Add Character'}
            </button>
          </div>
        </div>

        {/* Characters List */}
        <div>
          <h2 style={{
            fontSize: '16px',
            color: '#A68C2C',
            fontWeight: 600,
            marginBottom: '1rem',
            margin: 0
          }}>
            Characters
          </h2>

          {characters.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#A68C2C',
              opacity: 0.7
            }}>
              <p>No characters yet. Add your first character above!</p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {characters.map((character) => (
                <div
                  key={character.id}
                  style={{
                    backgroundColor: '#5A2020',
                    border: '2px solid #A68C2C',
                    borderRadius: '4px',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '60px'
                  }}
                >
                  <div>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#A68C2C',
                      margin: 0
                    }}>
                      {character.name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteCharacter(character.id)}
                    style={{
                      backgroundColor: '#3A1010',
                      border: '2px solid #666666',
                      borderRadius: '4px',
                      color: '#888888',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '14px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#4A1515'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3A1010'}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Back Button */}
      <footer style={{
        display: 'flex',
        justifyContent: 'flex-start'
      }}>
        <button
          onClick={() => navigate(`/project/${projectId}/details`)}
          className="btn-theater"
          style={{
            padding: '0.75rem 1.5rem'
          }}
        >
          ← Back to Project Details
        </button>
      </footer>
    </div>
  );
}