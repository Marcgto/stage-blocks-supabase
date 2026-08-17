import React, { useState } from 'react'
import { colors, typography, spacing, borders } from '../../designTokens'

const Chip = ({
  label,
  backgroundColor = colors.castColor1,
  onDelete,
  onEdit,
  isDraggable = false,
  onDragEnd,
  onClick,
  variant = 'normal',
  className = '',
  ...props
}) => {
  const [isHovering, setIsHovering] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(label)
  const [isDragging, setIsDragging] = useState(false)

  // Auto-calculate text color for contrast
  const getTextColor = (bgColor) => {
    const hex = bgColor.replace('#', '')
    const rgb = parseInt(hex, 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? colors.textPrimary : colors.white
  }

  const textColor = getTextColor(backgroundColor)

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: `${spacing.xs} ${spacing.sm}`,
    minHeight: '30px',
    backgroundColor: backgroundColor,
    color: textColor,
    borderRadius: borders.radius.pill,
    fontSize: typography.chipText.fontSize,
    fontWeight: typography.chipText.fontWeight,
    whiteSpace: 'nowrap',
    cursor: isDraggable ? 'grab' : 'default',
    transition: 'all 0.2s ease-in-out',
    userSelect: 'none',
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete "${label}"?`)) {
      onDelete && onDelete()
    }
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleSaveEdit = (e) => {
    e.stopPropagation()
    setIsEditing(false)
    if (editValue !== label && onEdit) {
      onEdit(editValue)
    }
  }

  const handleDragStart = (e) => {
    if (!isDraggable) return
    setIsDragging(true)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = (e) => {
    setIsDragging(false)
    onDragEnd && onDragEnd(e)
  }

  // Render edit mode
  if (isEditing) {
    return (
      <div
        style={{
          display: 'inline-flex',
          gap: '0.25rem',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveEdit(e)
            if (e.key === 'Escape') setIsEditing(false)
          }}
          autoFocus
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            border: `1px solid ${backgroundColor}`,
            fontSize: typography.chipText.fontSize,
            minWidth: '100px',
          }}
        />
      </div>
    )
  }

  // Render normal mode
  return (
    <div
      style={{
        ...baseStyles,
        opacity: isDragging ? 0.7 : 1,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={className}
      {...props}
    >
      {isDraggable && isHovering && (
        <span
          style={{
            cursor: 'grab',
            fontSize: '12px',
            opacity: 0.7,
          }}
          title="Drag to reorder"
        >
          ⋮⋮
        </span>
      )}

      <span style={{ flex: 1 }}>{label}</span>

      {isHovering && (
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
          }}
        >
          {onEdit && (
            <button
              onClick={handleEdit}
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 4px',
                cursor: 'pointer',
                fontSize: '12px',
                color: textColor,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)'
              }}
              title="Edit note"
            >
              ✎
            </button>
          )}

          {onDelete && (
            <button
              onClick={handleDelete}
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 4px',
                cursor: 'pointer',
                fontSize: '12px',
                color: textColor,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)'
              }}
              title="Delete note"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  )
};

export default Chip;
