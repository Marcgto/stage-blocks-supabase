import React from 'react'
import { colors, spacing, borders, modals } from '../../designTokens'
import { X } from 'lucide-react'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: colors.white,
          borderRadius: borders.radius.card,
          border: borders.card,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          zIndex: 101,
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: spacing.lg,
            borderBottom: `1px solid ${colors.textMuted}`,
          }}
        >
          <h2 style={{ color: modals.labelColor, margin: 0, fontSize: '20px' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colors.textMuted,
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = colors.textPrimary}
            onMouseLeave={(e) => e.currentTarget.style.color = colors.textMuted}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: spacing.lg }}>
          {children}
        </div>
      </div>
    </>
  )
}

export default Modal