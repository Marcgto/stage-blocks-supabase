import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { menuConfig } from '../../menuConfig'

// Create context
const NavigationContext = createContext()

// Provider component
export function NavigationProvider({ children }) {
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [expandedMenus, setExpandedMenus] = useState({})
  const location = useLocation()

  // Auto-detect active menu based on current URL path
  useEffect(() => {
    const currentPath = location.pathname
    
    // Find which menu section this path belongs to
    const activeMenu = menuConfig.find(menu => {
      // Check if it's a direct match (e.g., /dashboard or /profile)
      if (menu.path === currentPath) {
        return true
      }
      
      // Check if any submenu matches this path
      if (menu.submenu) {
        return menu.submenu.some(sub => 
          sub.path === currentPath || currentPath.startsWith(sub.path)
        )
      }
      
      return false
    })

    if (activeMenu) {
      setActiveMenuId(activeMenu.label)
      
      // Auto-expand the menu if it has submenus
      if (activeMenu.submenu && activeMenu.submenu.length > 0) {
        setExpandedMenus(prev => ({
          ...prev,
          [activeMenu.label]: true
        }))
      }
    } else {
      setActiveMenuId(null)
    }
  }, [location.pathname])

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }))
    setActiveMenuId(menuId)
  }

  const setActiveMenu = (menuId) => {
    setActiveMenuId(menuId)
  }

  const value = {
    activeMenuId,
    setActiveMenu,
    expandedMenus,
    toggleMenu,
  }

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

// Custom hook to use the context
export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}