import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useNavigation } from '../common/NavigationContext'
import { menuConfig } from '../../menuConfig'
import { colors, fonts, spacing } from '../../designTokens'

export default function SubHeader() {
  const { activeMenuId } = useNavigation()
  const location = useLocation()
  const navigate = useNavigate()

  // Find the active menu in menuConfig by label (since menuConfig uses label, not id)
  const activeMenu = menuConfig.find(menu => menu.label === activeMenuId)

  // Always render subheader with minimal adaptive padding
  return (
    <div
      style={{
        backgroundColor: colors.background,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: spacing.lg,
        paddingRight: spacing.lg,
        paddingTop: '0.25rem',
        paddingBottom: '0.25rem',
      }}
    >
      {/* Only render tabs if menu has submenus */}
      {activeMenu && activeMenu.submenu && activeMenu.submenu.length > 0 && (
        <div style={{ display: 'flex', gap: spacing.lg, alignItems: 'center' }}>
          {activeMenu.submenu.map((submenu) => {
            const currentPath = location.pathname
            const isActive = currentPath === submenu.path || currentPath.startsWith(submenu.path)

            return (
              <button
                key={submenu.label}
                onClick={() => navigate(submenu.path)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: `${spacing.sm} 0`,
                  fontSize: '15px',
                  fontFamily: fonts.primary,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? colors.sidebarBg : colors.textMuted,
                  cursor: 'pointer',
                  borderBottom: isActive ? `2px solid ${colors.sidebarBg}` : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  marginBottom: '-1px',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.color = colors.sidebarBg
                    e.target.style.borderBottom = `2px solid ${colors.sidebarBg}`
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.color = colors.textMuted
                    e.target.style.borderBottom = '2px solid transparent'
                  }
                }}
              >
                {submenu.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}