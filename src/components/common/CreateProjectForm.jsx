import React, { useState } from 'react'
import { colors, cards, spacing, modals, castColors } from '../../designTokens'
import Input from './Input'
import Button from './Button'
import { supabase } from '../../lib/supabase'

const CreateProjectForm = ({ onSuccess, onCancel, editingProject = null }) => {
  const [projectName, setProjectName] = useState(editingProject?.name || '')
  const [projectDescription, setProjectDescription] = useState(editingProject?.description || '')
  const [projectPicture, setProjectPicture] = useState(null)
  const [projectColor, setProjectColor] = useState(editingProject?.color || castColors[0])
  const [showColorDropdown, setShowColorDropdown] = useState(false)
  const [removePicture, setRemovePicture] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Industry standard: 500KB for project pictures, 1200x800px optimal size
  const MAX_PICTURE_SIZE = 500 * 1024 // 500KB
  const MAX_PICTURE_PIXELS = '1200x800'
  const isEditing = !!editingProject
  const hasPicture = projectPicture || (editingProject?.picture_url && !removePicture)

  const handlePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > MAX_PICTURE_SIZE) {
        setError(`Picture must be smaller than 500KB (${file.size} bytes)`)
        return
      }
      setProjectPicture(file)
      setError('')
    }
  }

  const handleColorSelect = (color) => {
    setProjectColor(color)
    setShowColorDropdown(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!projectName.trim()) {
      setError('Project name is required')
      return
    }

    try {
      setLoading(true)
      setError('')
      const { data: { user } } = await supabase.auth.getUser()
      
      let pictureUrl = editingProject?.picture_url || null

      // Upload picture to Supabase Storage if new picture provided
      if (projectPicture) {
        const fileExt = projectPicture.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `projects/${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('project-pictures')
          .upload(filePath, projectPicture)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('project-pictures')
          .getPublicUrl(filePath)

        pictureUrl = publicUrl
      }

      if (isEditing) {
        // Update existing project
        const { data, error: updateError } = await supabase
          .from('projects')
          .update({
            name: projectName,
            description: projectDescription,
            picture_url: removePicture ? null : pictureUrl,
            color: projectColor,
          })
          .eq('id', editingProject.id)
          .select()

        if (updateError) throw updateError
        onSuccess && onSuccess(data[0])
      } else {
        // Create new project
        const { data, error: createError } = await supabase
          .from('projects')
          .insert([{
            name: projectName,
            description: projectDescription,
            picture_url: pictureUrl,
            color: projectColor,
            user_id: user.id,
            created_by: user.id,
          }])
          .select()

        if (createError) throw createError
        onSuccess && onSuccess(data[0])
      }
    } catch (err) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} project`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: cards.content.elementGap }}>
      {error && (
        <div style={{
          padding: spacing.md,
          backgroundColor: colors.errorBg,
          borderRadius: '4px',
          border: `1px solid ${colors.error}`,
          color: colors.error,
        }}>
          {error}
        </div>
      )}

      <div>
        <label style={{
          display: 'block',
          color: modals.labelColor,
          marginBottom: spacing.xs,
          fontSize: modals.labelFontSize,
          fontWeight: modals.labelFontWeight,
        }}>
          Project Name
        </label>
        <Input
          size="small"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label style={{
          display: 'block',
          color: modals.labelColor,
          marginBottom: spacing.xs,
          fontSize: modals.labelFontSize,
          fontWeight: modals.labelFontWeight,
        }}>
          Description (optional)
        </label>
        <Input
          size="medium"
          placeholder="Enter project description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label style={{
          display: 'block',
          color: modals.labelColor,
          marginBottom: spacing.xs,
          fontSize: modals.labelFontSize,
          fontWeight: modals.labelFontWeight,
        }}>
          Picture (optional, max 500KB - {MAX_PICTURE_PIXELS})
        </label>
        
        {/* Picture Preview - Clickable */}
        {hasPicture && (
          <div style={{ marginBottom: spacing.sm }}>
            <img
              src={projectPicture ? URL.createObjectURL(projectPicture) : editingProject?.picture_url}
              alt="Project preview"
              onClick={() => document.getElementById('picture-input').click()}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '4px',
                objectFit: 'cover',
                border: `2px solid ${colors.textMuted}`,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            />
            <p style={{ color: colors.textMuted, fontSize: '12px', marginTop: spacing.xs, margin: 0 }}>
              Click to change
            </p>
          </div>
        )}
        
        {/* File Input - Hidden, referenced by ID */}
        <input
          id="picture-input"
          type="file"
          accept="image/*"
          onChange={handlePictureChange}
          disabled={loading}
          style={{
            display: hasPicture ? 'none' : 'block',
            padding: spacing.xs,
            fontSize: '14px',
          }}
        />
        
        {/* File name confirmation */}
        {projectPicture && (
          <p style={{ color: colors.success, fontSize: '12px', marginTop: spacing.xs, margin: 0 }}>
            ✓ {projectPicture.name}
          </p>
        )}
      </div>

      <div>
        <label style={{
          display: 'block',
          color: modals.labelColor,
          marginBottom: spacing.xs,
          fontSize: modals.labelFontSize,
          fontWeight: modals.labelFontWeight,
        }}>
          Color (optional)
        </label>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowColorDropdown(!showColorDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              padding: `${spacing.xs} ${spacing.sm}`,
              backgroundColor: colors.white,
              border: `1px solid ${colors.textMuted}`,
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.textPrimary}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.textMuted}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: projectColor,
                borderRadius: '50%',
                border: `2px solid ${colors.textMuted}`,
              }}
            />
            <span style={{ fontSize: '14px', color: colors.textPrimary }}>
              {projectColor}
            </span>
          </button>

          {showColorDropdown && (
            <>
              <div
                onClick={() => setShowColorDropdown(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 99,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: spacing.xs,
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.textMuted}`,
                  borderRadius: '4px',
                  padding: spacing.sm,
                  zIndex: 100,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: spacing.xs,
                  minWidth: '200px',
                }}
              >
                {castColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: color,
                      border: projectColor === color ? `2px solid ${colors.textPrimary}` : '1px solid #DDD',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    title={color}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: cards.content.elementGap, justifyContent: 'space-between', marginTop: spacing.md }}>
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        
        <div style={{ display: 'flex', gap: cards.content.elementGap }}>
          {hasPicture && (
            <Button
              variant="secondary"
              onClick={() => {
                setProjectPicture(null)
                setRemovePicture(true)
              }}
              disabled={loading}
            >
              Remove Picture
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Project' : 'Create Project')}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default CreateProjectForm