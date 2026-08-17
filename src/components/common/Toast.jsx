import React, { useState, useEffect } from 'react'
import { colors, spacing, typography } from '../../designTokens'
import Button from './Button'

const Toast = ({
  message = '✅ Success!',
  countdown = 3,
  onGoToDashboard = () => {},
  onJoinAnother = () => {},
  onClose = () => {},
}) => {
  const [timeLeft, setTimeLeft] = useState(countdown)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      onGoToDashboard()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, onGoToDashboard])

  const handleJoinAnother = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      onJoinAnother()
    }, 300)
  }

  const handleGoToDashboard = () => {
    setIsClosing(true)
    setTimeout(() => {
      onGoToDashboard()
    }, 300)
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: spacing.lg,
        right: spacing.lg,
        maxWidth: '400px',
        padding: spacing.md,
        backgroundColor: '#E8F5E9',
        border: `2px solid #4CAF50`,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        opacity: isClosing ? 0 : 1,
        transform: isClosing ? 'translateY(20px)' : 'translateY(0)',
        transition: 'all 0.3s ease-out',
      }}
    >
      <p
        style={{
          ...typography.body,
          color: colors.textPrimary,
          margin: '0 0 12px 0',
          fontWeight: 600,
        }}
      >
        {message}
      </p>

      <p
        style={{
          ...typography.small,
          color: colors.textMuted,
          margin: '0 0 12px 0',
        }}
      >
        Auto-redirecting in <strong>{timeLeft}s</strong>...
      </p>

      <div
        style={{
          display: 'flex',
          gap: spacing.sm,
          flexWrap: 'wrap',
        }}
      >
        <Button
          onClick={handleGoToDashboard}
          variant="primary"
          size="medium"
          style={{ flex: 1, minWidth: '150px' }}
        >
          Go to Dashboard →
        </Button>

        <Button
          onClick={handleJoinAnother}
          variant="secondary"
          size="medium"
          style={{ flex: 1, minWidth: '150px' }}
        >
          Join Another
        </Button>
      </div>
    </div>
  )
};

export default Toast;
