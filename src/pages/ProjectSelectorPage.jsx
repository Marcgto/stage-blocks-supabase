import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, spacing, typography, buttons } from '../designTokens'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import PageTemplate from '../components/layout/PageTemplate'
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

  if (loading) return <PageTemplate isLoading={true} />

  return (
    <PageTemplate 
      title="Projects"
      errorMessage={error}
      successMessage={currentProject ? `✓ Loaded: ${currentProject.name}` : null}
    >
      <Card style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
        <h2 style={{ color: colors.textPrimary, marginTop: 0 }}>Create Project</h2>
        <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, alignItems: 'flex-start' }}>
          <Input size="small" placeholder="Project Name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} />
          <button type="submit" style={{ height: buttons.height, padding: `${buttons.paddingVertical} ${buttons.paddingHorizontal}`, backgroundColor: colors.button, color: '#FFF', border: 'none', borderRadius: buttons.borderRadius, cursor: 'pointer', boxSizing: 'border-box' }} onMouseEnter={(e) => e.target.style.backgroundColor = colors.buttonHover} onMouseLeave={(e) => e.target.style.backgroundColor = colors.button}>Create</button>
        </form>
      </Card>

      <div>
        {projects.map(p => (
          <Card key={p.id} style={{ padding: spacing.lg, marginBottom: spacing.md }}>
            <h3 style={{ color: colors.textPrimary, margin: 0, marginBottom: spacing.xs }}>{p.name}</h3>
            <p style={{ color: colors.textMuted, margin: 0, marginBottom: spacing.md }}>{p.description || 'No description'}</p>
            <div style={{ display: 'flex', gap: spacing.sm }}>
              <button onClick={() => handleSelectProject(p.id, p.name)} style={{ height: buttons.height, padding: `${buttons.paddingVertical} ${buttons.paddingHorizontal}`, backgroundColor: colors.button, color: '#FFF', border: 'none', borderRadius: buttons.borderRadius, cursor: 'pointer', boxSizing: 'border-box' }} onMouseEnter={(e) => e.target.style.backgroundColor = colors.buttonHover} onMouseLeave={(e) => e.target.style.backgroundColor = colors.button}>Load</button>
              <button onClick={() => handleDeleteProject(p.id)} style={{ height: buttons.height, padding: `${buttons.paddingVertical} ${buttons.paddingHorizontal}`, backgroundColor: colors.buttonDelete, color: '#FFF', border: 'none', borderRadius: buttons.borderRadius, cursor: 'pointer', boxSizing: 'border-box' }} onMouseEnter={(e) => e.target.style.backgroundColor = colors.buttonDeleteHover} onMouseLeave={(e) => e.target.style.backgroundColor = colors.buttonDelete}>Delete</button>
            </div>
          </Card>
        ))}
      </div>
    </PageTemplate>
  )
  }

export default ProjectSelectorPage