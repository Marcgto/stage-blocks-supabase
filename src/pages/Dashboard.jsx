import React from 'react'
import { useProject } from '../components/common/PageWrapper'
import { colors, spacing, typography } from '../designTokens'
import Card from '../components/common/Card'

const Dashboard = () => {
  const { currentProject } = useProject()

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {!currentProject ? (
          <Card style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
            <p style={{ color: colors.textPrimary, fontSize: typography.body, margin: 0, marginBottom: spacing.sm }}>⚠️ No project loaded</p>
            <p style={{ color: colors.textMuted, fontSize: typography.small, margin: 0 }}>Click "Projects" in sidebar to load a project.</p>
          </Card>
        ) : (
          <>
            <h1 style={{ fontSize: typography.h1, color: colors.textPrimary, marginTop: 0, marginBottom: spacing.md }}>{currentProject.name}</h1>
            <Card style={{ padding: spacing.lg }}><p style={{ color: colors.textMuted, margin: 0 }}>{currentProject.description || 'No description'}</p></Card>
          </>
        )}
      </div>
    )
  }

export default Dashboard