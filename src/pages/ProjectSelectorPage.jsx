import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, cards, spacing } from '../designTokens'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import PageTemplate from '../components/layout/PageTemplate'
import Modal from '../components/common/Modal'
import CreateProjectForm from '../components/common/CreateProjectForm'
import { supabase } from '../lib/supabase'
import { Image } from 'lucide-react'

const ProjectSelectorPage = ({ currentProject, onProjectSelect, userId }) => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [deleteConfirmStep, setDeleteConfirmStep] = useState(null) // null, 'name-input', 'final-confirm'
  const [deleteProjectId, setDeleteProjectId] = useState(null)
  const [deleteNameInput, setDeleteNameInput] = useState('')

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

  const handleCreateSuccess = async (newProject) => {
    setIsCreateModalOpen(false)
    await fetchProjects()
  }

  const handleEditClick = (project) => {
    setEditingProject(project)
    setIsEditModalOpen(true)
  }

  const handleEditSuccess = async (updatedProject) => {
    setIsEditModalOpen(false)
    setEditingProject(null)
    await fetchProjects()
  }

  const handleSelectProject = (projectId, projectName) => {
    onProjectSelect({ id: projectId, name: projectName })
    navigate('/dashboard')
  }

  const handleDeleteClick = (projectId) => {
    setDeleteProjectId(projectId)
    setDeleteConfirmStep('name-input')
    setDeleteNameInput('')
  }

  const handleDeleteNameConfirm = (projectName) => {
    if (deleteNameInput === projectName) {
      setDeleteConfirmStep('final-confirm')
    } else {
      setError('Project name does not match. Please try again.')
      setDeleteNameInput('')
    }
  }

  const handleDeleteProject = async () => {
    try {
      setLoading(true)
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', deleteProjectId)

      if (deleteError) throw deleteError
      
      setDeleteConfirmStep(null)
      setDeleteProjectId(null)
      setDeleteNameInput('')
      await fetchProjects()
    } catch (err) {
      setError('Failed to delete project')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <PageTemplate isLoading={true} />

  return (
    <PageTemplate 
      errorMessage={error}
    >
      {/* Create Project Button - Above all cards */}
      <div style={{ marginBottom: cards.gapBetween }}>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create Project
        </Button>
      </div>

      {/* Modal for creating project */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
      >
        <CreateProjectForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Project List Cards */}

      <div>
        {projects.map(p => (
          <Card key={p.id} style={{ padding: cards.padding, marginBottom: cards.gapBetween }}>
            <div style={{ display: 'flex', gap: cards.content.elementGap, alignItems: 'flex-start' }}>
              {/* Picture only - 90x90 square */}
              <div style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
                {p.picture_url ? (
                  <img
                    src={p.picture_url}
                    alt={p.name}
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '4px',
                      objectFit: 'cover',
                      border: `2px solid ${colors.textMuted}`,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '4px',
                      backgroundColor: colors.textMuted,
                      border: `2px solid ${colors.textMuted}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.white,
                    }}
                  >
                    <Image size={44} />
                  </div>
                )}
              </div>

              {/* Project info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ marginBottom: cards.content.titleMarginBottom }}>
                  <div
                    style={{
                      backgroundColor: p.color || colors.textMuted,
                      color: colors.white,
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: '16px',
                      display: 'inline-block',
                      fontSize: '16px',
                      fontWeight: 600,
                      minWidth: '90px',
                      textAlign: 'center',
                    }}
                  >
                    {p.name}
                  </div>
                </div>
                <p style={{ color: colors.textMuted, margin: 0, marginBottom: cards.content.elementGap }}>{p.description || 'No description'}</p>
                <div style={{ display: 'flex', gap: cards.content.elementGap }}>
                  <Button onClick={() => handleSelectProject(p.id, p.name)}>Load</Button>
                  <Button variant="secondary" onClick={() => handleEditClick(p)}>Modify</Button>
                  <Button variant="secondary" onClick={() => handleDeleteClick(p.id)}>Delete</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingProject(null)
        }}
        title="Modify Project"
      >
        <CreateProjectForm
          editingProject={editingProject}
          onSuccess={handleEditSuccess}
          onCancel={() => {
            setIsEditModalOpen(false)
            setEditingProject(null)
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal - Step 1: Enter Project Name */}
      <Modal
        isOpen={deleteConfirmStep === 'name-input'}
        onClose={() => {
          setDeleteConfirmStep(null)
          setDeleteProjectId(null)
          setDeleteNameInput('')
        }}
        title="Confirm Project Deletion"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: cards.content.elementGap }}>
          <p style={{ color: colors.textMuted, margin: 0 }}>
            Type the project name exactly to confirm deletion:
          </p>
          <p style={{ color: colors.textPrimary, margin: 0, fontWeight: 600 }}>
            {projects.find(p => p.id === deleteProjectId)?.name}
          </p>
          <Input
            size="small"
            placeholder="Enter project name"
            value={deleteNameInput}
            onChange={(e) => setDeleteNameInput(e.target.value)}
            disabled={loading}
          />
          <div style={{ display: 'flex', gap: cards.content.elementGap, justifyContent: 'flex-end' }}>
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteConfirmStep(null)
                setDeleteProjectId(null)
                setDeleteNameInput('')
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteNameConfirm(projects.find(p => p.id === deleteProjectId)?.name)}
              disabled={loading || !deleteNameInput}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal - Step 2: Final Confirmation */}
      <Modal
        isOpen={deleteConfirmStep === 'final-confirm'}
        onClose={() => {
          setDeleteConfirmStep(null)
          setDeleteProjectId(null)
          setDeleteNameInput('')
        }}
        title="Final Confirmation"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: cards.content.elementGap }}>
          <p style={{ color: colors.textPrimary, margin: 0, fontWeight: 600 }}>
            Are you sure you want to permanently delete this project?
          </p>
          <p style={{ color: colors.error, margin: 0 }}>
            This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: cards.content.elementGap, justifyContent: 'flex-end' }}>
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteConfirmStep(null)
                setDeleteProjectId(null)
                setDeleteNameInput('')
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteProject}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Project'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageTemplate>
  )
}

export default ProjectSelectorPage