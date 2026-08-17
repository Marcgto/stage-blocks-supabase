import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { colors, spacing, typography, components } from '../designTokens'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { supabase } from '../lib/supabase'

const ProjectSetupPage = () => {
  const { projectId } = useParams()
  const [activeTab, setActiveTab] = useState('details')
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  // ===== DETAILS TAB STATE =====
  const [characterCount, setCharacterCount] = useState(0)
  const [memberCount, setMemberCount] = useState(0)

  // ===== CAST & CREW TAB STATE =====
  const [members, setMembers] = useState([])
  const [memberName, setMemberName] = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [memberError, setMemberError] = useState('')
  const [deleteConfirmMember, setDeleteConfirmMember] = useState(null)

  // ===== CHARACTERS TAB STATE =====
  const [characters, setCharacters] = useState([])
  const [charactersList, setCharactersList] = useState([])
  const [characterName, setCharacterName] = useState('')
  const [characterError, setCharacterError] = useState('')
  const [deleteConfirmCharacter, setDeleteConfirmCharacter] = useState(null)
  const [hasEnsemble, setHasEnsemble] = useState(false)
  const [hoveredChip, setHoveredChip] = useState(null)

  // ===== SCRIPT TAB STATE =====
  const [scenes, setScenes] = useState([])
  const [sceneName, setSceneName] = useState('')
  const [sceneScript, setSceneScript] = useState('')
  const [sceneError, setSceneError] = useState('')
  const [deleteConfirmScene, setDeleteConfirmScene] = useState(null)
  const [expandedScene, setExpandedScene] = useState(null)
  const [draggedScene, setDraggedScene] = useState(null)

  useEffect(() => {
    loadProject()
    loadCounts()
    if (activeTab === 'cast') fetchMembers()
    if (activeTab === 'characters') {
      fetchCharacters()
      fetchMembers()
    }
    if (activeTab === 'script') fetchScenes()
  }, [projectId, activeTab])

  // ===== DETAILS TAB FUNCTIONS =====
  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (!error) {
        setProject(data)
      }
    } catch (err) {
      console.error('Error loading project:', err)
    }
    setLoading(false)
  }

  const loadCounts = async () => {
    try {
      const { count: charCount } = await supabase
        .from('characters')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)

      const { count: memberCountResult } = await supabase
        .from('project_members')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)

      if (charCount !== null) setCharacterCount(charCount)
      if (memberCountResult !== null) setMemberCount(memberCountResult)
    } catch (err) {
      console.error('Error loading counts:', err)
    }
  }

  // ===== CAST & CREW TAB FUNCTIONS =====
  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('project_members')
        .select('*')
        .eq('project_id', projectId)
        .order('sequence', { ascending: true })

      if (!error) {
        setMembers(data || [])
        setMemberError('')
      }
    } catch (err) {
      console.error('Error fetching members:', err)
      setMemberError('Failed to load members')
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()

    if (!memberName.trim() || !memberEmail.trim()) {
      setMemberError('Please enter both name and email')
      return
    }

    try {
      const maxSequence = members.length > 0 ? Math.max(...members.map(m => m.sequence || 0)) : 0

      const { data, error } = await supabase
        .from('project_members')
        .insert([
          {
            project_id: projectId,
            name: memberName.trim(),
            email: memberEmail.trim(),
            sequence: maxSequence + 1
          }
        ])
        .select()

      if (!error) {
        setMembers([...members, data[0]])
        setMemberName('')
        setMemberEmail('')
        setMemberError('')
        loadCounts()
      }
    } catch (err) {
      console.error('Error adding member:', err)
      setMemberError('Failed to add member')
    }
  }

  const handleDeleteMember = async (memberId) => {
    try {
      await supabase.from('project_members').delete().eq('id', memberId)
      setMembers(members.filter(m => m.id !== memberId))
      setDeleteConfirmMember(null)
      setMemberError('')
      loadCounts()
    } catch (err) {
      console.error('Error deleting member:', err)
      setMemberError('Failed to delete member')
    }
  }

  // ===== CHARACTERS TAB FUNCTIONS =====
  const fetchCharacters = async () => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*, assigned_member:project_members(id, name)')
        .eq('project_id', projectId)
        .order('sequence', { ascending: true })

      if (!error) {
        setCharactersList(data || [])
        const ensembleExists = data?.some(c => c.name.toLowerCase() === 'ensemble')
        setHasEnsemble(ensembleExists)
        setCharacterError('')
      }
    } catch (err) {
      console.error('Error fetching characters:', err)
      setCharacterError('Failed to load characters')
    }
  }

  const handleAddCharacter = async (e) => {
    e.preventDefault()

    if (!characterName.trim()) {
      setCharacterError('Please enter a character name')
      return
    }

    try {
      const maxSequence = charactersList.length > 0 ? Math.max(...charactersList.map(c => c.sequence || 0)) : 0

      const { data, error } = await supabase
        .from('characters')
        .insert([
          {
            project_id: projectId,
            name: characterName.trim(),
            sequence: maxSequence + 1
          }
        ])
        .select()

      if (!error) {
        setCharactersList([...charactersList, data[0]])
        setCharacterName('')
        setCharacterError('')
        loadCounts()
      }
    } catch (err) {
      console.error('Error adding character:', err)
      setCharacterError('Failed to add character')
    }
  }

  const handleAddEnsemble = async () => {
    try {
      const maxSequence = charactersList.length > 0 ? Math.max(...charactersList.map(c => c.sequence || 0)) : 0

      const { data, error } = await supabase
        .from('characters')
        .insert([
          {
            project_id: projectId,
            name: 'Ensemble',
            sequence: maxSequence + 1
          }
        ])
        .select()

      if (!error) {
        setCharactersList([...charactersList, data[0]])
        setHasEnsemble(true)
        setCharacterError('')
      }
    } catch (err) {
      console.error('Error adding ensemble:', err)
      setCharacterError('Failed to add ensemble')
    }
  }

  const handleDeleteCharacter = async (characterId) => {
    try {
      await supabase.from('characters').delete().eq('id', characterId)

      const updatedCharacters = charactersList.filter(c => c.id !== characterId)
      setCharactersList(updatedCharacters)

      const ensembleStillExists = updatedCharacters.some(c => c.name.toLowerCase() === 'ensemble')
      setHasEnsemble(ensembleStillExists)

      setDeleteConfirmCharacter(null)
      setCharacterError('')
    } catch (err) {
      console.error('Error deleting character:', err)
      setCharacterError('Failed to delete character')
    }
  }

  const handleAssignMember = async (characterId, memberId) => {
    try {
      await supabase.from('characters').update({ assigned_member_id: memberId }).eq('id', characterId)

      const updatedCharacters = charactersList.map(c =>
        c.id === characterId ? { ...c, assigned_member_id: memberId, assigned_member: members.find(m => m.id === memberId) } : c
      )
      setCharactersList(updatedCharacters)
      setCharacterError('')
    } catch (err) {
      console.error('Error assigning member:', err)
      setCharacterError('Failed to assign member')
    }
  }

  const handleUnassignMember = async (characterId) => {
    try {
      await supabase.from('characters').update({ assigned_member_id: null }).eq('id', characterId)

      const updatedCharacters = charactersList.map(c =>
        c.id === characterId ? { ...c, assigned_member_id: null, assigned_member: null } : c
      )
      setCharactersList(updatedCharacters)
      setCharacterError('')
    } catch (err) {
      console.error('Error unassigning member:', err)
      setCharacterError('Failed to unassign member')
    }
  }

  // ===== SCRIPT TAB FUNCTIONS =====
  const fetchScenes = async () => {
    try {
      const { data, error } = await supabase
        .from('scenes')
        .select('*')
        .eq('project_id', projectId)
        .order('sequence', { ascending: true })

      if (!error) {
        setScenes(data || [])
        setSceneError('')
      }
    } catch (err) {
      console.error('Error fetching scenes:', err)
      setSceneError('Failed to load scenes')
    }
  }

  const handleAddScene = async (e) => {
    e.preventDefault()

    if (!sceneName.trim()) {
      setSceneError('Please enter a scene name')
      return
    }

    try {
      const maxSequence = scenes.length > 0 ? Math.max(...scenes.map(s => s.sequence || 0)) : 0

      const { data, error } = await supabase
        .from('scenes')
        .insert([
          {
            project_id: projectId,
            name: sceneName.trim(),
            script_text: sceneScript.trim(),
            sequence: maxSequence + 1
          }
        ])
        .select()

      if (!error) {
        setScenes([...scenes, data[0]])
        setSceneName('')
        setSceneScript('')
        setSceneError('')
      }
    } catch (err) {
      console.error('Error adding scene:', err)
      setSceneError('Failed to add scene')
    }
  }

  const handleDeleteScene = async (sceneId) => {
    try {
      await supabase.from('scenes').delete().eq('id', sceneId)

      setScenes(scenes.filter(s => s.id !== sceneId))
      setDeleteConfirmScene(null)
      setSceneError('')
    } catch (err) {
      console.error('Error deleting scene:', err)
      setSceneError('Failed to delete scene')
    }
  }

  const handleDragStart = (e, scene) => {
    setDraggedScene(scene)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, targetScene) => {
    e.preventDefault()

    if (!draggedScene || draggedScene.id === targetScene.id) {
      setDraggedScene(null)
      return
    }

    try {
      const newScenes = [...scenes]
      const draggedIndex = newScenes.findIndex(s => s.id === draggedScene.id)
      const targetIndex = newScenes.findIndex(s => s.id === targetScene.id)

      const [removed] = newScenes.splice(draggedIndex, 1)
      newScenes.splice(targetIndex, 0, removed)

      const updates = newScenes.map((scene, index) => ({
        id: scene.id,
        sequence: index + 1
      }))

      for (const update of updates) {
        await supabase.from('scenes').update({ sequence: update.sequence }).eq('id', update.id)
      }

      setScenes(newScenes)
      setDraggedScene(null)
    } catch (err) {
      console.error('Error reordering scenes:', err)
      setSceneError('Failed to reorder scenes')
    }
  }

  // ===== RENDER TAB CONTENT - ALL STYLING FIXED =====
  const renderTabContent = () => {
    switch (activeTab) {
      // ===== DETAILS TAB =====
      case 'details':
        return (
          <div>
            <Card style={{ marginBottom: spacing.lg }}>
              <h2 style={{ ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md }}>
                Project: {project?.name}
              </h2>
              <div style={{ marginBottom: spacing.lg }}>
                <p style={{ ...typography.small, color: colors.textMuted, marginBottom: spacing.xs }}>Description:</p>
                <p style={{ ...typography.body, color: colors.textPrimary }}>
                  {project?.description || 'No description'}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                <div>
                  <p style={{ ...typography.small, color: colors.textMuted, marginBottom: spacing.xs }}>Cast Members:</p>
                  <p style={{ ...typography.h2, color: colors.button }}>{memberCount}</p>
                </div>
                <div>
                  <p style={{ ...typography.small, color: colors.textMuted, marginBottom: spacing.xs }}>Characters:</p>
                  <p style={{ ...typography.h2, color: colors.button }}>{characterCount}</p>
                </div>
              </div>
            </Card>
          </div>
        )

      // ===== CAST & CREW TAB =====
      case 'cast':
        return (
          <div>
            {memberError && <div style={{ ...components.errorMessage, marginBottom: spacing.lg }}>{memberError}</div>}

            <Card style={{ marginBottom: spacing.lg }}>
              <h2 style={{ ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md }}>Add Cast/Crew Member</h2>
              <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                <div>
                  <label style={{ ...typography.small, color: colors.textPrimary, display: 'block', marginBottom: spacing.xs }}>Name</label>
                  <input
                    type="text"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="Actor name"
                    style={{
                      width: '100%',
                      padding: spacing.sm,
                      border: `1px solid ${colors.cardBorder}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      color: colors.textPrimary,
                      backgroundColor: colors.background
                    }}
                  />
                </div>
                <div>
                  <label style={{ ...typography.small, color: colors.textPrimary, display: 'block', marginBottom: spacing.xs }}>Email</label>
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="email@example.com"
                    style={{
                      width: '100%',
                      padding: spacing.sm,
                      border: `1px solid ${colors.cardBorder}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      color: colors.textPrimary,
                      backgroundColor: colors.background
                    }}
                  />
                </div>
                <Button type="submit" variant="primary" style={{ width: '100%' }}>Add Member</Button>
              </form>
            </Card>

            <Card>
              <h3 style={{ ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md }}>
                Members ({members.length})
              </h3>
              {members.length === 0 ? (
                <p style={{ ...typography.body, color: colors.textMuted, textAlign: 'center', padding: spacing.lg }}>
                  No members added yet
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                  {members.map((member) => (
                    <div
                      key={member.id}
                      style={{
                        padding: spacing.md,
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: '4px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: colors.background
                      }}
                    >
                      <div>
                        <p style={{ ...typography.body, color: colors.textPrimary, margin: 0, marginBottom: spacing.xs }}>{member.name}</p>
                        <p style={{ ...typography.small, color: colors.textMuted, margin: 0 }}>{member.email}</p>
                      </div>
                      <Button
                        variant="danger"
                        onClick={() => setDeleteConfirmMember(member.id)}
                        style={{ padding: '0.5rem 1rem', fontSize: '12px' }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {deleteConfirmMember && (
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: spacing.md }}>
                <Card>
                  <h3 style={{ ...typography.h2, margin: '0 0 1rem 0', color: colors.textPrimary }}>Remove Member?</h3>
                  <p style={{ ...typography.body, color: colors.textMuted, marginBottom: spacing.lg }}>This action cannot be undone.</p>
                  <div style={{ display: 'flex', gap: spacing.md }}>
                    <Button variant="secondary" onClick={() => setDeleteConfirmMember(null)} style={{ flex: 1 }}>Cancel</Button>
                    <Button variant="danger" onClick={() => handleDeleteMember(deleteConfirmMember)} style={{ flex: 1 }}>Remove</Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )

      // ===== CHARACTERS TAB =====
      case 'characters':
        return (
          <div>
            {characterError && <div style={{ ...components.errorMessage, marginBottom: spacing.lg }}>{characterError}</div>}

            <Card style={{ marginBottom: spacing.lg }}>
              <h2 style={{ ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md }}>Add Character</h2>
              <form onSubmit={handleAddCharacter} style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                <div>
                  <label style={{ ...typography.small, color: colors.textPrimary, display: 'block', marginBottom: spacing.xs }}>Character Name</label>
                  <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="e.g., Hamlet"
                    style={{
                      width: '100%',
                      padding: spacing.sm,
                      border: `1px solid ${colors.cardBorder}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      color: colors.textPrimary,
                      backgroundColor: colors.background
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: spacing.md }}>
                  <Button type="submit" variant="primary" style={{ flex: 1 }}>Add Character</Button>
                  {!hasEnsemble && (
                    <Button type="button" variant="secondary" onClick={handleAddEnsemble} style={{ flex: 1 }}>
                      Add Ensemble
                    </Button>
                  )}
                </div>
              </form>
            </Card>

            <Card>
              <h3 style={{ ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md }}>
                Characters ({charactersList.length})
              </h3>
              {charactersList.length === 0 ? (
                <p style={{ ...typography.body, color: colors.textMuted, textAlign: 'center', padding: spacing.lg }}>
                  No characters added yet
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                  {charactersList.map((character) => (
                    <div
                      key={character.id}
                      style={{
                        padding: spacing.md,
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: '4px',
                        backgroundColor: colors.background
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                        <h4 style={{ ...typography.body, color: colors.textPrimary, margin: 0, fontWeight: 600 }}>{character.name}</h4>
                        <Button
                          variant="danger"
                          onClick={() => setDeleteConfirmCharacter(character.id)}
                          style={{ padding: '0.5rem 1rem', fontSize: '12px' }}
                        >
                          Delete
                        </Button>
                      </div>
                      {members.length > 0 && (
                        <div>
                          <label style={{ ...typography.small, color: colors.textMuted, display: 'block', marginBottom: spacing.xs }}>Assign to:</label>
                          <select
                            value={character.assigned_member_id || ''}
                            onChange={(e) => handleAssignMember(character.id, e.target.value || null)}
                            style={{
                              width: '100%',
                              padding: spacing.sm,
                              border: `1px solid ${colors.cardBorder}`,
                              borderRadius: '4px',
                              fontSize: '14px',
                              color: colors.textPrimary,
                              backgroundColor: colors.background
                            }}
                          >
                            <option value="">Unassigned</option>
                            {members.map((member) => (
                              <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {deleteConfirmCharacter && (
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: spacing.md }}>
                <Card>
                  <h3 style={{ ...typography.h2, margin: '0 0 1rem 0', color: colors.textPrimary }}>Delete Character?</h3>
                  <p style={{ ...typography.body, color: colors.textMuted, marginBottom: spacing.lg }}>This action cannot be undone.</p>
                  <div style={{ display: 'flex', gap: spacing.md }}>
                    <Button variant="secondary" onClick={() => setDeleteConfirmCharacter(null)} style={{ flex: 1 }}>Cancel</Button>
                    <Button variant="danger" onClick={() => handleDeleteCharacter(deleteConfirmCharacter)} style={{ flex: 1 }}>Delete</Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )

      // ===== SCRIPT TAB =====
      case 'script':
        return (
          <div>
            {sceneError && <div style={{ ...components.errorMessage, marginBottom: spacing.lg }}>{sceneError}</div>}

            <Card style={{ marginBottom: spacing.lg }}>
              <h2 style={{ ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md }}>Add Scene</h2>
              <form onSubmit={handleAddScene} style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                <div>
                  <label style={{ ...typography.small, color: colors.textPrimary, display: 'block', marginBottom: spacing.xs }}>Scene Name</label>
                  <input
                    type="text"
                    value={sceneName}
                    onChange={(e) => setSceneName(e.target.value)}
                    placeholder="e.g., Act 1, Scene 1"
                    style={{
                      width: '100%',
                      padding: spacing.sm,
                      border: `1px solid ${colors.cardBorder}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      color: colors.textPrimary,
                      backgroundColor: colors.background
                    }}
                  />
                </div>
                <div>
                  <label style={{ ...typography.small, color: colors.textPrimary, display: 'block', marginBottom: spacing.xs }}>Script (optional)</label>
                  <textarea
                    value={sceneScript}
                    onChange={(e) => setSceneScript(e.target.value)}
                    placeholder="Scene script text..."
                    rows="4"
                    style={{
                      width: '100%',
                      padding: spacing.sm,
                      border: `1px solid ${colors.cardBorder}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      color: colors.textPrimary,
                      backgroundColor: colors.background,
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <Button type="submit" variant="primary" style={{ width: '100%' }}>Add Scene</Button>
              </form>
            </Card>

            <Card>
              <h3 style={{ ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md }}>
                Scenes ({scenes.length})
              </h3>
              {scenes.length === 0 ? (
                <p style={{ ...typography.body, color: colors.textMuted, textAlign: 'center', padding: spacing.lg }}>
                  No scenes added yet. Add one above!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                  {scenes.map((scene) => (
                    <div
                      key={scene.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, scene)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, scene)}
                      style={{
                        display: 'flex',
                        gap: spacing.md,
                        alignItems: 'flex-start',
                        opacity: draggedScene?.id === scene.id ? 0.5 : 1,
                        transition: 'opacity 0.2s ease'
                      }}
                    >
                      <div
                        draggable={false}
                        onClick={() => setExpandedScene(expandedScene === scene.id ? null : scene.id)}
                        style={{
                          flex: 1,
                          minHeight: '60px',
                          backgroundColor: colors.cardBg,
                          border: `2px solid ${colors.cardBorder}`,
                          borderRadius: '4px',
                          padding: spacing.md,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.background)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.cardBg)}
                      >
                        <div style={{ color: colors.button, fontWeight: 600, fontSize: '14px', marginBottom: expandedScene === scene.id ? spacing.md : 0 }}>
                          {scene.name}
                        </div>

                        {expandedScene === scene.id && scene.script_text && (
                          <div
                            style={{
                              color: colors.textMuted,
                              whiteSpace: 'pre-wrap',
                              fontSize: '12px',
                              marginTop: spacing.md,
                              paddingTop: spacing.md,
                              borderTop: `1px solid ${colors.cardBorder}`,
                              maxHeight: '200px',
                              overflowY: 'auto'
                            }}
                          >
                            {scene.script_text}
                          </div>
                        )}
                      </div>

                      <Button
                        variant="danger"
                        onClick={() => setDeleteConfirmScene(scene.id)}
                        style={{
                          padding: spacing.md,
                          minWidth: '60px',
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {deleteConfirmScene && (
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: spacing.md }}>
                <Card>
                  <h3 style={{ ...typography.h2, margin: '0 0 1rem 0', color: colors.textPrimary }}>Delete Scene?</h3>
                  <p style={{ ...typography.body, color: colors.textMuted, marginBottom: spacing.lg }}>This action cannot be undone.</p>
                  <div style={{ display: 'flex', gap: spacing.md }}>
                    <Button variant="secondary" onClick={() => setDeleteConfirmScene(null)} style={{ flex: 1 }}>Cancel</Button>
                    <Button variant="danger" onClick={() => handleDeleteScene(deleteConfirmScene)} style={{ flex: 1 }}>Delete</Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const tabs = [
    { id: 'details', label: 'Project Details' },
    { id: 'cast', label: 'Cast & Crew' },
    { id: 'characters', label: 'Characters' },
    { id: 'script', label: 'Script' },
  ]

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ ...typography.h1, color: colors.textPrimary, marginBottom: spacing.lg }}>Project Setup</h1>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: spacing.md,
            marginBottom: spacing.lg,
            borderBottom: `2px solid ${colors.cardBorder}`,
            flexWrap: 'wrap'
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                backgroundColor: activeTab === tab.id ? colors.button : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : colors.textPrimary,
                border: 'none',
                borderBottom: activeTab === tab.id ? `3px solid ${colors.button}` : 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s',
                paddingBottom: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = colors.background
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ marginTop: spacing.lg }}>{renderTabContent()}</div>
      </div>
    )
  }

export default ProjectSetupPage