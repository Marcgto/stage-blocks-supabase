import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, spacing, typography } from '../designTokens'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { supabase } from '../lib/supabase'

const ProfileSettingsPage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (err) {
      console.error('Error loading user:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: colors.textMuted }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ ...typography.h1, color: colors.textPrimary, marginBottom: spacing.lg }}>
          Profile Settings
        </h1>

        <Card>
          <h2 style={{ ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md }}>
            Account Information
          </h2>
          <div style={{ marginBottom: spacing.lg }}>
            <p style={{ ...typography.small, color: colors.textMuted }}>Email:</p>
            <p style={{ ...typography.body, color: colors.textPrimary }}>{user?.email || 'N/A'}</p>
          </div>
          <Button
            variant="danger"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Card>
      </div>
    )
  }

export default ProfileSettingsPage