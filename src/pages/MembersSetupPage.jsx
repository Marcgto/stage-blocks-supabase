import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AppHeader from '../components/AppHeader';
import PageDescriptor from '../components/PageDescriptor';
import AppFooter from '../components/AppFooter';

export default function MembersSetupPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadProject();
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

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('project_members')
        .select('*')
        .eq('project_id', projectId)
        .order('sequence', { ascending: true });

      if (fetchError) throw fetchError;
      setMembers(data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    
    if (!memberName.trim() || !memberEmail.trim()) {
      setError('Please enter both name and email');
      return;
    }

    try {
      // Calculate sequence (add to end)
      const maxSequence = members.length > 0 
        ? Math.max(...members.map(m => m.sequence || 0))
        : 0;

      const { data, error: insertError } = await supabase
        .from('project_members')
        .insert([
          {
            project_id: projectId,
            name: memberName.trim(),
            email: memberEmail.trim(),
            sequence: maxSequence + 1
          }
        ])
        .select();

      if (insertError) throw insertError;

      // Add to local state
      setMembers([...members, data[0]]);
      setMemberName('');
      setMemberEmail('');
      setError('');
    } catch (err) {
      console.error('Error adding member:', err);
      setError('Failed to add member');
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      const { error: deleteError } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId);

      if (deleteError) throw deleteError;

      setMembers(members.filter(m => m.id !== memberId));
      setDeleteConfirm(null);
      setError('');
    } catch (err) {
      console.error('Error deleting member:', err);
      setError('Failed to delete member');
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
      <PageDescriptor description="Add all the project members and send invites." />

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
        {/* Add Member Form */}
        <form onSubmit={handleAddMember} style={{
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
            Add New Member
          </h2>

          <div>
            <label style={{
              display: 'block',
              color: '#A68C2C',
              fontWeight: 600,
              marginBottom: '0.5rem',
              fontSize: '14px'
            }}>
              Member Name
            </label>
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="e.g., Sarah Jones"
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
              Email Address
            </label>
            <input
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="e.g., sarah@example.com"
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
            Add Member
          </button>
        </form>

        {/* Members List */}
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
            Members ({members.length})
          </h2>

          {members.length === 0 ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#888888',
              fontSize: '14px'
            }}>
              No members added yet. Add one above!
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center'
                }}
              >
                {/* Member Rectangle - 60px tall */}
                <div
                  style={{
                    flex: 1,
                    height: '60px',
                    backgroundColor: '#5A2020',
                    border: '2px solid #A68C2C',
                    borderRadius: '4px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{
                    color: '#A68C2C',
                    fontWeight: 600,
                    fontSize: '14px',
                    marginBottom: '0.25rem'
                  }}>
                    {member.name}
                  </div>
                  <div style={{
                    color: '#888888',
                    fontSize: '12px'
                  }}>
                    {member.email}
                  </div>
                </div>

                {/* Delete X Button - Square 60×60 */}
                <button
                  onClick={() => setDeleteConfirm(member.id)}
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
              Delete Member?
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
                onClick={() => handleDeleteMember(deleteConfirm)}
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