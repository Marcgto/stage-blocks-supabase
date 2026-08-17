import React, { useState, useEffect } from 'react'
import { useAppContext } from '../components/common/PageWrapper'
import { colors, spacing, typography } from '../designTokens'
import Card from '../components/common/Card'
import { supabase } from '../lib/supabase'

const ProjectSettingsPage = ({ currentProject }) => {
  const { handleProjectSelect } = useAppContext()
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (currentProject) {
      setProjectName(currentProject.name)
      setProjectDescription(currentProject.description || '')
    }
  }, [currentProject])

  const handleSaveProjectDetails = async (e) => {
    e.preventDefault()
    if (!currentProject) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update({ name: projectName, description: projectDescription })
        .eq('id', currentProject.id)

      if (updateError) throw updateError

      // Update local state
      handleProjectSelect({ id: currentProject.id, name: projectName, description: projectDescription })
      setSuccess('Project details saved!')
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error saving project:', err)
      setError('Failed to save project details')
    } finally {
      setLoading(false)
    }
  }

  if (!currentProject) {
    return (
      <Card style={{ padding: spacing.lg }}>
        <p style={{ color: colors.textPrimary }}>No project loaded. Go to Projects to load one.</p>
      </Card>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: colors.textPrimary, marginBottom: spacing.lg }}>Project Settings</h1>

        {error && <Card style={{ padding: spacing.md, marginBottom: spacing.lg, backgroundColor: '#FEF2F2' }}><p style={{ color: colors.error, margin: 0 }}>❌ {error}</p></Card>}
        {success && <Card style={{ padding: spacing.md, marginBottom: spacing.lg, backgroundColor: '#F0F9F7' }}><p style={{ color: colors.success, margin: 0 }}>✓ {success}</p></Card>}

        <Card style={{ padding: spacing.lg }}>
          <form onSubmit={handleSaveProjectDetails}>
            <div style={{ marginBottom: spacing.lg }}>
              <label style={{ display: 'block', color: colors.textPrimary, marginBottom: spacing.sm, fontWeight: 'bold' }}>Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                style={{
                  width: '100%',
                  padding: spacing.sm,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '4px',
                  fontSize: typography.body,
                }}
              />
            </div>

            <div style={{ marginBottom: spacing.lg }}>
              <label style={{ display: 'block', color: colors.textPrimary, marginBottom: spacing.sm, fontWeight: 'bold' }}>Project Description</label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: spacing.sm,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '4px',
                  fontSize: typography.body,
                  minHeight: '120px',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: spacing.sm,
                backgroundColor: loading ? '#999' : colors.button,
                color: '#FFF',
                border: 'none',
                borderRadius: '4px',
                fontSize: typography.body,
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Saving...' : 'Save Project Details'}
            </button>
          </form>
        </Card>
      </div>
    )
  }

export default ProjectSettingsPage