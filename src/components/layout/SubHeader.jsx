import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useNavigation } from '../common/NavigationContext'
import { menuConfig } from '../../menuConfig'
import { colors, fonts, spacing } from '../../designTokens'

export default function SubHeader() {
  const { activeMenuId } = useNavigation()
  const location = useLocation()
  const navigate = useNavigate()
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth < 1024

  // Find the active menu in menuConfig by label (since menuConfig uses label, not id)
  const activeMenu = menuConfig.find(menu => menu.label === activeMenuId)

  // Always render subheader with minimal adaptive padding
  return (
    <div
      style={{
        backgroundColor: colors.background,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: isMobile ? spacing.sm : spacing.lg,
        paddingRight: spacing.lg,
        paddingTop: '0.25rem',
        paddingBottom: '0.25rem',
      }}
    >
      {/* Render tabs - either submenus if available, or just the menu name */}
      {activeMenu && (
        <div style={{ display: 'flex', gap: isMobile ? spacing.md : spacing.lg, alignItems: 'center' }}>
          {activeMenu.submenu && activeMenu.submenu.length > 0 ? (
            // Show submenus if they exist
            activeMenu.submenu.map((submenu) => {
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
                    color: isActive ? colors.subheaderTextActive : colors.subheaderTextInactive,
                    cursor: 'pointer',
                    borderBottom: isActive ? `2px solid ${colors.subheaderBorder}` : '2px solid transparent',
                    transition: 'all 0.2s ease',
                    marginBottom: '-1px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.color = colors.subheaderTextActive
                      e.target.style.borderBottom = `2px solid ${colors.subheaderBorder}`
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.color = colors.subheaderTextInactive
                      e.target.style.borderBottom = '2px solid transparent'
                    }
                  }}
                >
                  {submenu.label}
                </button>
              )
            })
          ) : (
            // Show just the menu name if no submenus
            <span
              style={{
                padding: `${spacing.sm} 0`,
                fontSize: '15px',
                fontFamily: fonts.primary,
                fontWeight: 400,
                color: colors.subheaderTextActive,
                borderBottom: `2px solid ${colors.subheaderBorder}`,
              }}
            >
              {activeMenu.label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}