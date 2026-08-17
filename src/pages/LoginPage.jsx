import React, { useState } from 'react'
import { colors, typography, spacing, components } from '../designTokens'
import Button from '../components/common/Button'
import { supabase } from '../lib/supabase'

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Google login clicked')

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/projects`
        }
      })

      if (error) throw error
    } catch (err) {
      console.error('Login error:', err)
      setError('Failed to login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
      }}
    >
      <div
        style={{
          backgroundColor: colors.cardBg,
          padding: spacing.xl,
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '90%',
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: '48px',
            textAlign: 'center',
            marginBottom: spacing.lg,
          }}
        >
          🎭
        </div>

        {/* Title */}
        <h1
          style={{
            ...typography.h1,
            textAlign: 'center',
            color: colors.textPrimary,
            marginBottom: spacing.md,
          }}
        >
          Stage Blocks
        </h1>

        {/* Subtitle */}
        <p
          style={{
            ...typography.body,
            textAlign: 'center',
            color: colors.textMuted,
            marginBottom: spacing.lg,
          }}
        >
          Theater rehearsal coordination made simple
        </p>

        {/* Error Message - Using designTokens */}
        {error && (
          <div style={{ ...components.errorMessage, marginBottom: spacing.md }}>
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <Button
          variant="primary"
          size="large"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            marginBottom: spacing.md,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Signing in...' : '🔐 Sign in with Google'}
        </Button>

        {/* Footer */}
        <p
          style={{
            ...typography.small,
            textAlign: 'center',
            color: colors.textMuted,
            marginTop: spacing.lg,
          }}
        >
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}

export default LoginPage
