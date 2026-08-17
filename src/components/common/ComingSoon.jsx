import React from 'react'
import { colors, spacing, typography } from '../../designTokens'
import Card from '../common/Card'

const ComingSoon = ({ title, description, activeItem }) => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ ...typography.h1, color: colors.textPrimary, marginBottom: spacing.lg }}>
        {title}
      </h1>

      <Card>
        <div style={{ textAlign: 'center', padding: spacing.xl }}>
          <h2 style={{ ...typography.h2, color: colors.button, marginBottom: spacing.md }}>
            🚀 Coming Soon
          </h2>
          <p style={{ ...typography.body, color: colors.textMuted, marginBottom: spacing.md }}>
            {description || 'This feature is currently in development and will be available in a future update.'}
          </p>
          <p style={{ ...typography.small, color: colors.textMuted, fontStyle: 'italic' }}>
            Thank you for your patience as we build amazing features for Stage Blocks!
          </p>
        </div>
      </Card>
    </div>
  )
}

export default ComingSoon