import React from 'react'
import { useParams } from 'react-router-dom'
import { colors, spacing, typography } from '../designTokens'
import Card from '../components/common/Card'

const RehearsalNotesPage = () => {
  const { projectId } = useParams()

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ ...typography.h1, color: colors.textPrimary, marginBottom: spacing.lg }}>
          Rehearsal Notes
        </h1>

        <Card>
          <p style={{ ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md }}>
            Coming Soon
          </p>
          <p style={{ ...typography.body, color: colors.textMuted }}>
            Rehearsal Notes functionality is planned for Stage 2. In Stage 1 MVP, this appears in the sidebar but is not yet functional.
          </p>
        </Card>
      </div>
    )
  }

export default RehearsalNotesPage