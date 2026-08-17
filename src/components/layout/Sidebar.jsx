import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { colors, typography, spacing } from '../../designTokens'

const Sidebar = ({ items = [] }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [expandedMenu, setExpandedMenu] = useState(null)

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
      toggleExpanded(item.label)
    }
  }

  const handleSubmenuClick = (subitem) => {
    navigate(subitem.path)
    // Menu stays open - we DON'T toggle or close it
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
        width: '260px',
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
                  cursor: hasSubmenu ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  ...typography.sidebarMenu,
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
                <span>{item.label}</span>

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
                          ...typography.sidebarSubmenu,
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
                        {subitem.label}
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