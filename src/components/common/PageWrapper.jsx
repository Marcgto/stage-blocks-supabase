import React, { useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export const AppContext = React.createContext(null)

// Hook - use anywhere in app
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    return { 
      user: null, 
      currentProject: null, 
      loading: false,
      handleProjectSelect: () => {},
      handleLogout: () => {},
    }
  }
  return context
}

// Backward compat - old hook name
export const useProject = () => {
  const { currentProject } = useAppContext()
  return { currentProject }
}

// Provider - wrap Router with this
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [currentProject, setCurrentProject] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      if (session?.user) await fetchLastProject(session.user.id)
      setLoading(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      if (session?.user) await fetchLastProject(session.user.id)
      else setCurrentProject(null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const fetchLastProject = async (userId) => {
    try {
      const { data, error } = await supabase.from('user_preferences').select('last_project_id').eq('user_id', userId)
      if (error || !data || data.length === 0) return

      const { data: project } = await supabase.from('projects').select('id, name, description').eq('id', data[0].last_project_id).single()
      if (project) setCurrentProject({ id: project.id, name: project.name, description: project.description })
    } catch (err) {
      console.error('Error fetching last project:', err)
    }
  }

  const saveLastProject = async (projectId) => {
    if (!user || !projectId) return
    try {
      await supabase.from('user_preferences').upsert({ user_id: user.id, last_project_id: projectId })
    } catch (err) {
      console.error('Error saving last project:', err)
    }
  }

  const handleProjectSelect = async (project) => {
    setCurrentProject(project)
    if (project?.id) await saveLastProject(project.id)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setCurrentProject(null)
  }

  const value = {
    user,
    currentProject,
    loading,
    handleProjectSelect,
    handleLogout,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// HOC - wrap pages to get currentProject prop
export const withProject = (Component) => {
  return (props) => {
    const { currentProject } = useAppContext()
    return <Component {...props} currentProject={currentProject} />
  }
}

// HOC - wrap pages to get user + currentProject props
export const withAuth = (Component) => {
  return (props) => {
    const { user, currentProject, loading } = useAppContext()
    return <Component {...props} user={user} currentProject={currentProject} loading={loading} />
  }
}
