import React from 'react'
import { useAppContext } from '../components/common/PageWrapper'
import { colors, cards } from '../designTokens'
import PageTemplate from '../components/layout/PageTemplate'
import Card from '../components/common/Card'

const Dashboard = () => {
  const { currentProject, loading } = useAppContext()

  return (
    <PageTemplate
      title={currentProject?.name || 'Dashboard'}
      isLoading={loading}
    >
      {currentProject && !loading && (
        <div style={{ ...cards.layouts.oneColumn, gap: cards.gapBetween }}>
          {/* Card 1: Project Description */}
          <Card>
            <p style={{ color: colors.textMuted, margin: 0 }}>
              {currentProject.description || 'No description added yet.'}
            </p>
          </Card>
        </div>
      )}
    </PageTemplate>
  )
}

export default Dashboard