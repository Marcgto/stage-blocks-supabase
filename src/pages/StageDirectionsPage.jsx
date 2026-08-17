import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { colors, spacing, typography } from '../designTokens'
import Card from '../components/common/Card'

const StageDirectionsPage = () => {
  const { projectId } = useParams()
  const [activeTab, setActiveTab] = useState('blocks')

  const tabs = [
    { id: 'blocks', label: 'Blocks' },
    { id: 'script', label: 'Full Script' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'blocks':
        return (
          <div>
            <h2 style={{ ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md }}>
              Stage Directions - Blocks
            </h2>
            <Card>
              <p style={{ ...typography.body, color: colors.textMuted }}>
                Detailed stage movement and blocking information will appear here. (Coming in Stage 2)
              </p>
            </Card>
          </div>
        )
      case 'script':
        return (
          <div>
            <h2 style={{ ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md }}>
              Full Script
            </h2>
            <Card>
              <p style={{ ...typography.body, color: colors.textMuted }}>
                Your full script will be displayed here. (Coming in Stage 2)
              </p>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ ...typography.h1, color: colors.textPrimary, marginBottom: spacing.lg }}>
          Stage Directions
        </h1>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: spacing.md,
            marginBottom: spacing.lg,
            borderBottom: `2px solid ${colors.cardBorder}`,
            flexWrap: 'wrap',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                backgroundColor: activeTab === tab.id ? colors.button : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : colors.textPrimary,
                border: 'none',
                borderBottom: activeTab === tab.id ? `3px solid ${colors.button}` : 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = colors.background
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    )
}

export default StageDirectionsPage