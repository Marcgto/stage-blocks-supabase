import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useProject } from '../common/PageWrapper'
import { colors, spacing } from '../../designTokens'
import { menuConfig } from '../../menuConfig'

const DashboardLayout = () => {
  const { currentProject } = useProject()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth >= 1024) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth < 1024
  const isDesktop = windowWidth >= 1024

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: colors.background, overflow: 'hidden' }}>
      <Header mobileMenuOpen={mobileMenuOpen} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} isMobile={isMobile} projectName={currentProject?.name} />

      <div style={{ display: 'flex', flex: 1, marginTop: '60px', overflow: 'hidden' }}>
        {isDesktop && <Sidebar items={menuConfig} />}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          {isMobile && mobileMenuOpen && (
            <>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '260px', backgroundColor: colors.sidebarBg, color: colors.sidebarText, maxHeight: '100%', overflowY: 'auto', zIndex: 50, boxShadow: '2px 0 6px rgba(0, 0, 0, 0.2)' }}>
                <Sidebar items={menuConfig} />
              </div>
              <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', top: 0, left: '260px', right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 40 }} />
            </>
          )}

          <div style={{ flex: 1, overflowY: 'auto', backgroundColor: colors.background, padding: spacing.lg }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout