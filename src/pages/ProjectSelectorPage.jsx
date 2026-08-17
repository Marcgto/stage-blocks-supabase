import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, spacing, typography } from '../designTokens'
import Card from '../components/common/Card'
import { supabase } from '../lib/supabase'

const ProjectSelectorPage = ({ currentProject, onProjectSelect, userId }) => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [newProjectName, setNewProjectName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) navigate('/login')

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)

      if (fetchError) throw fetchError
      setProjects(data || [])
    } catch (err) {
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!newProjectName.trim()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error: createError } = await supabase
        .from('projects')
        .insert([{ name: newProjectName, user_id: user.id, created_by: user.id }])
        .select()

      if (createError) throw createError
      setNewProjectName('')
      await fetchProjects()
    } catch (err) {
      setError('Failed to create project')
    }
  }

  const handleSelectProject = (projectId, projectName) => {
    onProjectSelect({ id: projectId, name: projectName })
    navigate('/dashboard')
  }

  const handleDeleteProject = async (projectId) => {
    try {
      const { error: deleteError } = await supabase.from('projects').delete().eq('id', projectId)
      if (deleteError) throw deleteError
      await fetchProjects()
    } catch (err) {
      setError('Failed to delete project')
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: colors.textPrimary, marginBottom: spacing.lg }}>Projects</h1>

        {error && <Card style={{ padding: spacing.md, marginBottom: spacing.lg, backgroundColor: '#FEF2F2', borderColor: colors.error }}><p style={{ color: colors.error, margin: 0 }}>{error}</p></Card>}

        {currentProject && <Card style={{ padding: spacing.md, marginBottom: spacing.lg, backgroundColor: '#F0F9F7', borderColor: colors.success }}><p style={{ color: colors.success, margin: 0 }}>✓ Loaded: {currentProject.name}</p></Card>}

        <Card style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
          <h2 style={{ color: colors.textPrimary, marginTop: 0 }}>Create Project</h2>
          <form onSubmit={handleCreateProject}>
            <input type="text" placeholder="Project Name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} style={{ width: '100%', padding: spacing.sm, marginBottom: spacing.md, border: `1px solid ${colors.cardBorder}`, borderRadius: '4px' }} />
            <button type="submit" style={{ width: '100%', padding: spacing.sm, backgroundColor: colors.button, color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Create</button>
          </form>
        </Card>

        <div>
          {projects.map(p => (
            <Card key={p.id} style={{ padding: spacing.lg, marginBottom: spacing.md }}>
              <h3 style={{ color: colors.textPrimary, margin: 0, marginBottom: spacing.xs }}>{p.name}</h3>
              <p style={{ color: colors.textMuted, margin: 0, marginBottom: spacing.md }}>{p.description || 'No description'}</p>
              <div style={{ display: 'flex', gap: spacing.sm }}>
                <button onClick={() => handleSelectProject(p.id, p.name)} style={{ flex: 1, padding: spacing.sm, backgroundColor: colors.button, color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Load</button>
                <button onClick={() => handleDeleteProject(p.id)} style={{ padding: spacing.sm, backgroundColor: '#999', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

export default ProjectSelectorPage