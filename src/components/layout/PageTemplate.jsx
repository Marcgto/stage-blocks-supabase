import React, { useState, useEffect } from 'react'
import { pages, colors } from '../../designTokens'
import Card from '../common/Card'

const PageTemplate = ({
  children,
  title,
  errorMessage,
  successMessage,
  isLoading = false,
}) => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const padding = isMobile ? pages.paddingMobile : pages.paddingDesktop

  return (
    <div style={{ maxWidth: pages.maxWidth, margin: pages.marginH, padding }}>
      {/* Title */}
      {title && (
        <h1 style={{ color: colors.textPrimary, marginBottom: '24px', marginTop: 0 }}>
          {title}
        </h1>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Card style={{
          padding: '12px',
          marginBottom: '24px',
          backgroundColor: pages.errorCardBg,
          borderColor: colors.error,
        }}>
          <p style={{ color: colors.error, margin: 0 }}>{errorMessage}</p>
        </Card>
      )}

      {/* Success Message */}
      {successMessage && (
        <Card style={{
          padding: '12px',
          marginBottom: '24px',
          backgroundColor: pages.successCardBg,
          borderColor: colors.success,
        }}>
          <p style={{ color: colors.success, margin: 0 }}>{successMessage}</p>
        </Card>
      )}

      {/* Loading State */}
      {isLoading ? (
        <p style={{ color: colors.textMuted, fontSize: pages.loadingText }}>Loading...</p>
      ) : (
        /* Children Content */
        <div>
          {children}
        </div>
      )}
    </div>
  )
}

export default PageTemplate