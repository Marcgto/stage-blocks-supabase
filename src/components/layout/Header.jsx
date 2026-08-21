import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { colors, spacing, typography, shadows, fonts } from '../../designTokens'
import { Menu, Search, Bell, User } from 'lucide-react'

const Header = ({
  mobileMenuOpen,
  onMenuToggle,
  isMobile,
  projectName = null,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Get breadcrumb path from URL
  const getBreadcrumbs = () => {
    const path = location.pathname
    
    // If at /projects (project selector), show project name + Projects
    if (path === '/projects') {
      const breadcrumbs = []
      if (projectName) {
        breadcrumbs.push({
          label: projectName,
          link: '/dashboard',
          isActive: false
        })
      }
      breadcrumbs.push({
        label: 'Projects',
        link: '/projects',
        isActive: true
      })
      return breadcrumbs
    }

    const breadcrumbs = []

    // Add project name as first breadcrumb (if project is loaded)
    if (projectName) {
      breadcrumbs.push({
        label: projectName,
        link: '/dashboard',
        isActive: false
      })
    }

    // Parse the path to determine section
    if (path === '/dashboard') {
      breadcrumbs.push({
        label: 'Dashboard',
        link: '/dashboard',
        isActive: true
      })
    } else if (path === '/project-settings') {
      breadcrumbs.push({
        label: 'Project Settings',
        link: '/project-settings',
        isActive: true
      })
    } else if (path === '/cast-crew') {
      breadcrumbs.push({
        label: 'Cast & Crew',
        link: '/cast-crew',
        isActive: true
      })
    } else if (path === '/characters') {
      breadcrumbs.push({
        label: 'Characters',
        link: '/characters',
        isActive: true
      })
    } else if (path.includes('/stage-directions')) {
      breadcrumbs.push({
        label: 'Stage Directions',
        link: '/stage-directions',
        isActive: false
      })
      
      if (path.includes('/blocks')) {
        breadcrumbs.push({
          label: 'Blocks',
          link: '/stage-directions/blocks',
          isActive: true
        })
      } else if (path.includes('/full-script')) {
        breadcrumbs.push({
          label: 'Full Script',
          link: '/stage-directions/full-script',
          isActive: true
        })
      }
    } else if (path.includes('/rehearsal-notes')) {
      breadcrumbs.push({
        label: 'Rehearsal Notes',
        link: '/rehearsal-notes',
        isActive: false
      })
      
      if (path.includes('/most-recent')) {
        breadcrumbs.push({
          label: 'Most Recent',
          link: '/rehearsal-notes/most-recent',
          isActive: true
        })
      } else if (path.includes('/calendar')) {
        breadcrumbs.push({
          label: 'Rehearsal Calendar',
          link: '/rehearsal-notes/calendar',
          isActive: true
        })
      } else if (path.includes('/by-scenes')) {
        breadcrumbs.push({
          label: 'Notes by Scenes',
          link: '/rehearsal-notes/by-scenes',
          isActive: true
        })
      }
    } else if (path.includes('/calendars')) {
      breadcrumbs.push({
        label: 'Calendars',
        link: '/calendars',
        isActive: false
      })
      
      if (path.includes('/rehearsal')) {
        breadcrumbs.push({
          label: 'Rehearsal Calendar',
          link: '/calendars/rehearsal',
          isActive: true
        })
      } else if (path.includes('/timeline')) {
        breadcrumbs.push({
          label: 'Production Timeline',
          link: '/calendars/timeline',
          isActive: true
        })
      } else if (path.includes('/events')) {
        breadcrumbs.push({
          label: 'Event Calendar',
          link: '/calendars/events',
          isActive: true
        })
      }
    } else if (path.includes('/communications')) {
      breadcrumbs.push({
        label: 'Communication & News',
        link: '/communications',
        isActive: false
      })
      
      if (path.includes('/pm')) {
        breadcrumbs.push({
          label: 'Communications from PM',
          link: '/communications/pm',
          isActive: true
        })
      } else if (path.includes('/group')) {
        breadcrumbs.push({
          label: 'Group Conversation',
          link: '/communications/group',
          isActive: true
        })
      } else if (path.includes('/news')) {
        breadcrumbs.push({
          label: 'News',
          link: '/communications/news',
          isActive: true
        })
      }
    } else if (path.includes('/show-cues')) {
      breadcrumbs.push({
        label: 'Show Cues',
        link: '/show-cues',
        isActive: false
      })
      
      if (path.includes('/sound')) {
        breadcrumbs.push({
          label: 'Sound',
          link: '/show-cues/sound',
          isActive: true
        })
      } else if (path.includes('/music')) {
        breadcrumbs.push({
          label: 'Music',
          link: '/show-cues/music',
          isActive: true
        })
      } else if (path.includes('/microphones')) {
        breadcrumbs.push({
          label: 'Microphones',
          link: '/show-cues/microphones',
          isActive: true
        })
      } else if (path.includes('/lighting')) {
        breadcrumbs.push({
          label: 'Lighting',
          link: '/show-cues/lighting',
          isActive: true
        })
      } else if (path.includes('/setup')) {
        breadcrumbs.push({
          label: 'Cue Setup',
          link: '/show-cues/setup',
          isActive: true
        })
      }
    } else if (path.includes('/equipment')) {
      breadcrumbs.push({
        label: 'Equipment',
        link: '/equipment',
        isActive: false
      })
      
      if (path.includes('/costume')) {
        breadcrumbs.push({
          label: 'Costume',
          link: '/equipment/costume',
          isActive: true
        })
      } else if (path.includes('/props')) {
        breadcrumbs.push({
          label: 'Stage Props',
          link: '/equipment/props',
          isActive: true
        })
      } else if (path.includes('/production')) {
        breadcrumbs.push({
          label: 'Production Equipment',
          link: '/equipment/production',
          isActive: true
        })
      } else if (path.includes('/list')) {
        breadcrumbs.push({
          label: 'Equipment List',
          link: '/equipment/list',
          isActive: true
        })
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <div
      style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: isMobile ? colors.headerBgMobile : colors.headerBgDesktop,
        borderBottom: `1px solid ${isMobile ? colors.headerBgMobile : colors.sidebarBg}`,
        paddingLeft: isMobile ? spacing.md : spacing.lg,
        paddingRight: isMobile ? spacing.sm : spacing.lg,
        flex: '0 0 60px',
      }}
    >
      {/* Mobile: Hamburger on left */}
      {isMobile && (
        <button
          onClick={onMenuToggle}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: colors.headerTextMobile,
            padding: '4px 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '18px',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <Menu size={24} color={colors.headerTextMobile} />
        </button>
      )}

      {/* Mobile: Project name (or app name if no project) */}
      {isMobile && (
        <span
          style={{
            color: colors.headerTextMobile,
            fontSize: '24px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {projectName || 'Stage Blocks'}
        </span>
      )}

      {/* Desktop: Breadcrumbs on left, or fallback to project name */}
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flex: 1, minWidth: 0 }}>
          {breadcrumbs.length > 0 ? (
            breadcrumbs.map((crumb, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: spacing.md, minWidth: 0 }}>
                {index > 0 && (
                  <span style={{
                    color: colors.textMuted,
                    fontSize: '18px',
                    fontWeight: 400,
                    flex: '0 0 auto',
                  }}>
                    →
                  </span>
                )}
                
                {crumb.link ? (
                  <button
                    onClick={() => navigate(crumb.link)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: crumb.isActive ? colors.breadcrumbActive : colors.breadcrumbInactive,
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: crumb.isActive ? 400 : 200,
                      lineHeight: '1.3',
                      transition: 'color 0.2s, font-weight 0.2s',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      flex: '0 1 auto',
                      padding: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (!crumb.isActive) {
                        e.target.style.color = colors.breadcrumbActive
                        e.target.style.fontWeight = '600'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!crumb.isActive) {
                        e.target.style.color = colors.breadcrumbInactive
                        e.target.style.fontWeight = '500'
                      }
                    }}
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span style={{
                    color: colors.breadcrumbActive,
                    fontSize: '18px',
                    fontWeight: 700,
                    lineHeight: '1.3',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: '0 1 auto',
                  }}>
                    {crumb.label}
                  </span>
                )}
              </div>
            ))
          ) : (
            // Fallback: show project name if no breadcrumbs (e.g., no project loaded)
            <span style={{
              color: colors.breadcrumbActive,
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '1.3',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: '0 1 auto',
            }}>
              {projectName || 'Stage Blocks'}
            </span>
          )}
        </div>
      )}

      {/* Right controls (search, notifications, profile) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : spacing.md, flex: '0 0 auto', marginLeft: isMobile ? 'auto' : spacing.lg }}>
        {/* Search icon */}
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isMobile ? colors.headerTextMobile : colors.sidebarBg,
            padding: isMobile ? '2px 4px' : '4px 8px',
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.currentTarget.style.opacity = '0.6'
            } else {
              e.currentTarget.style.opacity = '0.7'
            }
          }}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <Search size={18} color={isMobile ? colors.headerTextMobile : colors.sidebarBg} />
        </button>

        {/* Notifications icon */}
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isMobile ? colors.headerTextMobile : colors.sidebarBg,
            padding: isMobile ? '2px 4px' : '4px 8px',
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.currentTarget.style.opacity = '0.6'
            } else {
              e.currentTarget.style.opacity = '0.7'
            }
          }}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <Bell size={18} color={isMobile ? colors.headerTextMobile : colors.sidebarBg} />
        </button>

        {/* User profile icon */}
        <button
          style={{
            background: isMobile ? colors.headerButtonBgMobileTransparent : colors.headerButtonBgDesktop,
            border: 'none',
            cursor: 'pointer',
            color: isMobile ? colors.headerTextMobile : colors.sidebarBg,
            padding: isMobile ? '2px 4px' : '4px 8px',
            transition: 'background-color 0.2s, opacity 0.2s',
            borderRadius: '50%',
            width: isMobile ? '28px' : '32px',
            height: isMobile ? '28px' : '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            if (isMobile) {
              e.currentTarget.style.backgroundColor = colors.headerButtonBgMobileTransparentHover
            } else {
              e.currentTarget.style.backgroundColor = '#E8E8E8'
              e.currentTarget.style.opacity = '0.6'
            }
          }}
          onMouseLeave={(e) => {
            if (isMobile) {
              e.currentTarget.style.backgroundColor = colors.headerButtonBgMobileTransparent
            } else {
              e.currentTarget.style.backgroundColor = colors.headerButtonBgDesktop
              e.currentTarget.style.opacity = '1'
            }
          }}
        >
          <User size={18} color={isMobile ? colors.headerTextMobile : colors.sidebarBg} />
        </button>
      </div>
    </div>
  )
}

export default Header