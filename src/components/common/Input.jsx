import React, { useState } from 'react'
import { colors, inputs } from '../../designTokens'

const Input = ({
  size = 'small',
  placeholder = '',
  value = '',
  onChange,
  disabled = false,
  className = '',
  type = 'text',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  
  const sizeConfig = inputs[size] || inputs.small
  
  const baseStyles = {
    display: 'block',
    width: '100%',
    height: sizeConfig.height,
    padding: `${sizeConfig.paddingVertical} ${sizeConfig.paddingHorizontal}`,
    borderRadius: inputs.borderRadius,
    fontSize: '16px',
    fontFamily: 'inherit',
    backgroundColor: inputs.bg,
    color: inputs.text,
    border: `1px solid ${isFocused ? inputs.borderFocus : inputs.border}`,
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'text',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease-in-out',
    boxSizing: 'border-box',
    ...(size === 'large' && { resize: sizeConfig.resize }),
  }
  
  // Generate unique ID for placeholder styling
  const uniqueId = `input-${Math.random().toString(36).substr(2, 9)}`
  
  // Use textarea for medium and large, input for small
  const isTextarea = size === 'medium' || size === 'large'
  
  const Component = isTextarea ? 'textarea' : 'input'
  
  return (
    <>
      <style>{`
        .${uniqueId}::placeholder {
          color: ${inputs.placeholder};
          opacity: 1;
        }
        .${uniqueId}::-webkit-input-placeholder {
          color: ${inputs.placeholder};
        }
        .${uniqueId}:-moz-placeholder {
          color: ${inputs.placeholder};
        }
        .${uniqueId}::-moz-placeholder {
          color: ${inputs.placeholder};
        }
      `}</style>
      <Component
        type={isTextarea ? undefined : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${className} ${uniqueId}`}
        style={{ ...baseStyles, ...props.style }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </>
  )
}

export default Input
