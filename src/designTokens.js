// ============================================
// STAGE BLOCKS - DESIGN TOKENS
// Single Source of Truth for all design values
// ============================================

export const colors = {
  // PRIMARY COLORS
  background: '#F5F5F5',      // Pale gray - main app background
  white: '#FFFFFF',            // Card backgrounds
  black: '#333333',            // Primary text color

  // SIDEBAR
  sidebarBg: '#A0696B',        // Pale burgundy sidebar
  sidebarText: '#FFFFFF',      // White text on sidebar
  sidebarHover: '#916B7B',     // Slightly darker on hover

  // NEW BURGUNDY PALETTE (for SubHeader, cards, blocks)
  darkBurgundy: '#4A1A1A',     // Dark burgundy - For titles of cards/blocks, borders
  burgundy: '#5A2020',         // Burgundy - For sub/header link text
  veryDarkBurgundy: '#3A1A1A', // Very dark burgundy - (unused for now)
  lightBurgundy: '#6B2C2C',    // Light burgundy - (unused for now)

  // CARDS
  cardBg: '#FFFFFF',           // White card background
  cardBorder: '#8B5A5A',       // Burgundy border

  // TEXT
  textPrimary: '#333333',      // Main text color
  textMuted: '#888888',        // Muted/secondary text
  textDisabled: '#CCCCCC',     // Disabled text

  // BUTTONS & ACCENTS
  button: '#A68C2C',           // Gold button color
  buttonHover: '#9B7A25',      // Darker on hover
  buttonDelete: '#DC4B4B',     // Red for delete actions
  buttonDeleteHover: '#C43B3B', // Darker red on hover

  // STATUS/MESSAGES
  error: '#DC4B4B',            // Red for errors
  errorBg: '#FEF2F2',          // Light red background for errors
  success: '#3FA896',          // Teal for success
  successBg: '#F0F9F7',        // Light teal background
  warning: '#E89B5A',          // Orange for warnings
  warningBg: '#FEF7F2',        // Light orange background

  // CAST MEMBER COLORS (24-color palette)
  castColor1: '#DC4B4B', castColor2: '#E85C6C', castColor3: '#D6516B', castColor4: '#E97BA5',
  castColor5: '#F4A6C1', castColor6: '#E89B5A', castColor7: '#D4874A', castColor8: '#E8A652',
  castColor9: '#C89A4D', castColor10: '#D4A556', castColor11: '#4B8FDC', castColor12: '#5B7FCC',
  castColor13: '#6B6FBD', castColor14: '#7B6BAD', castColor15: '#8B5A9D', castColor16: '#3FA896',
  castColor17: '#4CB8A8', castColor18: '#56A886', castColor19: '#6BB878', castColor20: '#8BB88B',
  castColor21: '#5CA5D4', castColor22: '#9B6BA8', castColor23: '#C67C5C', castColor24: '#7A9D6D',
};

export const castColors = [
  colors.castColor1, colors.castColor2, colors.castColor3, colors.castColor4,
  colors.castColor5, colors.castColor6, colors.castColor7, colors.castColor8,
  colors.castColor9, colors.castColor10, colors.castColor11, colors.castColor12,
  colors.castColor13, colors.castColor14, colors.castColor15, colors.castColor16,
  colors.castColor17, colors.castColor18, colors.castColor19, colors.castColor20,
  colors.castColor21, colors.castColor22, colors.castColor23, colors.castColor24,
];

export const fonts = {
  primary: "'Cormorant Garamond', serif",  // Headers, main branding
  secondary: "'Kumbh Sans', sans-serif",   // Sidebar menus, subheaders, tabs
};

export const spacing = {
  xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem', xl: '3rem',
};

export const typography = {
  h1: { fontSize: '32px', fontWeight: 700, lineHeight: '1.2' },
  h2: { fontSize: '28px', fontWeight: 700, lineHeight: '1.3' },
  h3: { fontSize: '22px', fontWeight: 700, lineHeight: '1.4' },
  body: { fontSize: '16px', fontWeight: 400, lineHeight: '1.6' },
  small: { fontSize: '14px', fontWeight: 400, lineHeight: '1.5' },
  tiny: { fontSize: '12px', fontWeight: 400, lineHeight: '1.4' },
  buttonText: { fontSize: '14px', fontWeight: 600, lineHeight: '1.4' },
  chipText: { fontSize: '13px', fontWeight: 500, lineHeight: '1.4' },
};

export const borders = {
  card: '2px solid #8B5A5A',
  subtle: '1px solid #E0E0E0',
  radius: { card: '12px', pill: '20px', button: '8px' },
};

export const shadows = {
  none: 'none',
  subtle: '0 1px 2px rgba(0, 0, 0, 0.05)',
  card: '0 1px 3px rgba(0, 0, 0, 0.1)',
  hover: '0 2px 6px rgba(0, 0, 0, 0.15)',
};

export const components = {
  card: {
    width: '100%', maxWidth: '350px', minHeight: '140px',
    padding: spacing.lg, borderRadius: borders.radius.card,
    border: borders.card, backgroundColor: colors.cardBg,
    boxShadow: shadows.card,
  },
  errorMessage: {
    padding: spacing.md, backgroundColor: colors.errorBg,
    border: `1px solid ${colors.error}`, borderRadius: borders.radius.button,
    color: colors.error, fontSize: '14px',
  },
};

export const responsive = {
  mobile: '0px', tablet: '768px', desktop: '1024px', wide: '1440px',
};

export const crewRoles = [
  'Director', 'Assistant Director', 'Stage Manager', 'Costume Designer',
  'Lighting Technician', 'Sound Technician', 'Musician', 'Technician', 'Other',
];

export default { colors, castColors, fonts, spacing, typography, borders, shadows, components, responsive, crewRoles };