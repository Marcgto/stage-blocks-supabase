import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import SubHeader from './SubHeader'
import { NavigationProvider } from '../common/NavigationContext'
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
    <NavigationProvider>
      <div style={{ display: 'flex', height: '100vh', backgroundColor: colors.background, overflow: 'hidden' }}>
        {/* SIDEBAR - Full height on left */}
        {isDesktop && <Sidebar items={menuConfig} />}

        {/* Mobile Sidebar Overlay */}
        {isMobile && mobileMenuOpen && (
          <>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '290px', height: '100vh', backgroundColor: colors.sidebarBg, color: colors.sidebarText, overflowY: 'auto', zIndex: 50, boxShadow: '2px 0 6px rgba(0, 0, 0, 0.2)' }}>
              <Sidebar items={menuConfig} onMenuItemClick={() => setMobileMenuOpen(false)} />
            </div>
            <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'fixed', top: 0, left: '290px', right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 40 }} />
          </>
        )}

        {/* RIGHT SIDE: Header, SubHeader, Content stacked vertically */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header - 60px */}
          <Header mobileMenuOpen={mobileMenuOpen} onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} isMobile={isMobile} projectName={currentProject?.name} />

          {/* SubHeader - 50px */}
          <SubHeader />

          {/* Content - flex: 1 (fills remaining space) */}
          <div style={{ flex: 1, overflowY: 'auto', backgroundColor: colors.background, padding: isMobile ? '12px' : spacing.lg }}>
            <Outlet />
          </div>
        </div>
      </div>
    </NavigationProvider>
  )
}

export default DashboardLayout