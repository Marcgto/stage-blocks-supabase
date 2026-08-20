import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { colors, spacing, fonts } from '../../designTokens'
import { useNavigation } from '../common/NavigationContext'
import { sidebarConfig } from '../../sidebarConfig'
import * as LucideIcons from 'lucide-react'

// Sidebar-specific font definitions
const SIDEBAR_FONT = fonts.primary
const MAIN_MENU_FONT_SIZE = '16px'
const MAIN_MENU_FONT_WEIGHT = 100
const SUBMENU_FONT_SIZE = '16px'
const SUBMENU_FONT_WEIGHT = 100

// Helper function to get Lucide icon by name
const getIcon = (iconName) => {
  if (!iconName) return null
  const IconComponent = LucideIcons[iconName]
  return IconComponent || null
}

const Sidebar = ({ items = [], onMenuItemClick = () => {} }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [expandedMenu, setExpandedMenu] = useState(null)
  const { setActiveMenu } = useNavigation()

  // Determine which menu should be expanded based on current path
  const getMenuForPath = (pathname) => {
    for (const item of items) {
      if (item.submenu) {
        // Check if path matches this menu section
        const menuKeyword = item.label.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')
        if (pathname.includes(menuKeyword.split('-')[0])) {
          return item.label
        }
      }
    }
    return null
  }

  // Auto-open menu section based on URL
  React.useEffect(() => {
    const menuForPath = getMenuForPath(location.pathname)
    if (menuForPath && menuForPath !== expandedMenu) {
      setExpandedMenu(menuForPath)
    }
  }, [location.pathname])

  const toggleExpanded = (label) => {
    if (expandedMenu === label) {
      setExpandedMenu(null)
      return
    }
    setExpandedMenu(label)
  }

  const handleMenuItemClick = (item) => {
    if (item.submenu && item.submenu.length > 0) {
      // Items WITH submenus: toggle expand/collapse
      toggleExpanded(item.label)
    } else if (item.path) {
      // Items WITHOUT submenus (like Dashboard, Settings): navigate directly
      navigate(item.path)
    }
  }

  const handleSubmenuClick = (subitem) => {
    navigate(subitem.path)
    setActiveMenu(subitem.label) // Only set active menu when navigating to submenu
    onMenuItemClick() // Close mobile menu on navigation
  }

  const isMenuActive = (item) => {
    if (!item.submenu) return false
    const menuKeyword = item.label.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')
    return location.pathname.includes(menuKeyword.split('-')[0])
  }

  const isSubmenuActive = (subitem) => {
    return location.pathname === subitem.path || location.pathname.includes(subitem.path.split('/').pop())
  }

  const isExpanded = (label) => expandedMenu === label

  return (
    <div
      style={{
        width: '290px',
        backgroundColor: colors.sidebarBg,
        color: colors.sidebarText,
        padding: `${spacing.md} ${spacing.sm}`,
        height: '100vh',
        overflowY: 'auto',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo and Stage Blocks Title - Top of Sidebar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
          marginBottom: spacing.sm,
          paddingBottom: spacing.sm,
        }}
      >
        <span style={{ fontSize: '28px', fontWeight: 600 }}>🎭</span>
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: colors.sidebarText,
            margin: 0,
            fontSize: '26px',
            fontWeight: 600,
            lineHeight: '1.3',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Stage Blocks
        </span>
      </div>

      {/* Navigation Menus */}
      <nav style={{ flex: 1, listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item) => {
          const hasSubmenu = item.submenu && item.submenu.length > 0
          const itemExpanded = isExpanded(item.label)
          const menuIsActive = isMenuActive(item)

          return (
            <div key={item.label}>
              {/* Main Menu Item */}
              <div
                onClick={() => handleMenuItemClick(item)}
                style={{
                  padding: `${spacing.sm} ${spacing.sm}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: MAIN_MENU_FONT_SIZE,
                  fontWeight: MAIN_MENU_FONT_WEIGHT,
                  fontFamily: SIDEBAR_FONT,
                  lineHeight: '1.5',
                  transition: 'background-color 0.2s, box-shadow 0.2s',
                  backgroundColor: menuIsActive ? 'rgba(0, 0, 0, 0.15)' : 'transparent',
                  boxShadow: menuIsActive ? 'inset 0 1px 3px rgba(0, 0, 0, 0.2)' : 'none',
                  borderRadius: '4px',
                  marginBottom: '0.25rem',
                }}
                onMouseEnter={(e) => {
                  if (!menuIsActive && hasSubmenu) {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = menuIsActive ? 'rgba(0, 0, 0, 0.15)' : 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  {(() => {
                    const IconComponent = getIcon(sidebarConfig[item.label])
                    return IconComponent ? <IconComponent size={18} color={colors.sidebarText} /> : null
                  })()}
                  <span style={{ fontFamily: SIDEBAR_FONT, fontSize: MAIN_MENU_FONT_SIZE, fontWeight: MAIN_MENU_FONT_WEIGHT }}>{item.label}</span>
                </div>

                {/* Collapsible Arrow */}
                {hasSubmenu && (
                  <span
                    style={{
                      fontSize: '12px',
                      transition: 'transform 0.3s ease',
                      transform: itemExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      display: 'inline-block',
                    }}
                  >
                    ▶
                  </span>
                )}
              </div>

              {/* Submenu Items - Animated Open/Close */}
              {hasSubmenu && (
                <div
                  style={{
                    overflow: 'hidden',
                    maxHeight: itemExpanded ? '500px' : '0px',
                    opacity: itemExpanded ? 1 : 0,
                    transition: itemExpanded 
                      ? 'max-height 0.7s ease, opacity 0.3s ease'
                      : 'max-height 0.3s linear, opacity 1s linear',
                    paddingLeft: '1.5rem',
                    marginBottom: '0.5rem',
                    position: 'relative',
                    zIndex: itemExpanded ? 10 : 1,
                  }}
                >
                  {item.submenu.map((subitem) => {
                    const subIsActive = isSubmenuActive(subitem)

                    return (
                      <div
                        key={subitem.label}
                        onClick={() => handleSubmenuClick(subitem)}
                        style={{
                          padding: `${spacing.xs} ${spacing.xs}`,
                          cursor: 'pointer',
                          fontSize: SUBMENU_FONT_SIZE,
                          fontWeight: SUBMENU_FONT_WEIGHT,
                          fontFamily: SIDEBAR_FONT,
                          lineHeight: '1.5',
                          transition: 'background-color 0.2s, box-shadow 0.2s',
                          marginBottom: '0.25rem',
                          borderRadius: '4px',
                          backgroundColor: subIsActive ? 'rgba(0, 0, 0, 0.15)' : 'transparent',
                          boxShadow: subIsActive ? 'inset 0 1px 3px rgba(0, 0, 0, 0.2)' : 'none',
                        }}
                        onMouseEnter={(e) => {
                          if (!subIsActive) {
                            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = subIsActive ? 'rgba(0, 0, 0, 0.15)' : 'transparent'
                        }}
                      >
                        <span style={{ fontFamily: SIDEBAR_FONT, fontSize: SUBMENU_FONT_SIZE, fontWeight: SUBMENU_FONT_WEIGHT }}>{subitem.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar