import React from 'react'
import { colors, typography, spacing } from '../../designTokens'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const sizeStyles = {
    small: {
      fontSize: '12px',
      padding: `${spacing.xs} ${spacing.sm}`,
    },
    medium: {
      fontSize: '14px',
      padding: `${spacing.xs} ${spacing.md}`,
    },
    large: {
      fontSize: '16px',
      padding: `${spacing.sm} ${spacing.lg}`,
    },
  }

  const variantStyles = {
    primary: {
      backgroundColor: colors.button,
      color: colors.white,
      border: 'none',
    },
    secondary: {
      backgroundColor: colors.white,
      color: colors.button,
      border: `2px solid ${colors.button}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.button,
      border: 'none',
    },
  }

  const baseStyles = {
    fontWeight: typography.buttonText.fontWeight,
    lineHeight: typography.buttonText.lineHeight,
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease-in-out',
    border: 'none',
    outline: 'none',
    ...sizeStyles[size],
    ...variantStyles[variant],
  }

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e)
    }
  }

  return (
    <button
      type={type}
      style={baseStyles}
      onClick={handleClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
};

export default Button;
