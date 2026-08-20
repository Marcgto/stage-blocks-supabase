import React from 'react'
import { colors, spacing, borders, cards } from '../../designTokens'

const Card = ({
  children,
  onClick,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div
      style={{
        minHeight: cards.minHeight,
        backgroundColor: colors.cardBg,
        border: borders.card,
        borderRadius: borders.radius.card,
        padding: spacing.lg,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        boxShadow: borders.subtle,
        ...style,
      }}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
};

export default Card;