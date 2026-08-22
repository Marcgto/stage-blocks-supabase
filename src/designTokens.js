// ============================================
// STAGE BLOCKS - DESIGN TOKENS
// Single Source of Truth for all design values
// ============================================

export const buttons = {
  height: '40px',
  paddingVertical: '6px',
  paddingHorizontal: '16px',
  borderRadius: '4px',
  minWidth: '100px',
};

export const inputs = {
  small: {
    height: '40px',      // Single-line text input
    paddingVertical: '8px',
    paddingHorizontal: '12px',
  },
  medium: {
    height: '120px',     // Multi-line text input
    paddingVertical: '12px',
    paddingHorizontal: '12px',
  },
  large: {
    height: '500px',     // Expandable text area
    paddingVertical: '12px',
    paddingHorizontal: '12px',
    resize: 'vertical',  // Allow vertical expansion
  },
  borderRadius: '4px',
  // Colors
  bg: '#FFFFFF',
  text: '#333333',
  placeholder: '#999999',
  border: '#8B5A5A',
  borderFocus: '#A0696B',
};

export const cards = {
  minHeight: '100px',           // Hard minimum height for all cards
  minWidth: '100px',            // Hard minimum width for all cards
  gapBetween: '12px',           // Spacing between cards (reduced from 20px)
  padding: '16px',              // Inner padding of all cards (reduced from 32px/spacing.lg)
  
  // Content spacing inside cards
  content: {
    titleMarginBottom: '12px',  // Space between card title (h2/h3) and content
    elementGap: '12px',         // Space between form elements (input, button, etc.)
  },
  
  // Layout options - choose based on desired number of cards side-by-side
  layouts: {
    oneColumn: {
      display: 'grid',
      gridTemplateColumns: '1fr',  // 1 card per row (full width)
    },
    twoColumn: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',  // 1-2 cards, grows to fill
    },
    threeColumn: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',  // 2-3+ cards, grows to fill
    },
    fourColumn: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',  // 3-4+ cards, grows to fill
    },
  },
};

export const pages = {
  maxWidth: '1200px',
  paddingMobile: '12px',
  paddingDesktop: '32px',
  marginH: '0 auto',
  // Message card styles
  errorCardBg: '#FEF2F2',
  errorCardBorder: '2px solid',
  successCardBg: '#F0F9F7',
  successCardBorder: '2px solid',
  // Loading state
  loadingText: '16px',
};

export const modals = {
  labelColor: '#656565',
  labelFontSize: '14px',
  labelFontWeight: 600,
};

export const colors = {
  // PRIMARY COLORS
  background: '#e8e8e8',      // Pale gray - main app background
  white: '#FFFFFF',            // Card backgrounds
  black: '#333333',            // Primary text color

  // SIDEBAR
  sidebarBg: '#A0696B',        // Pale burgundy sidebar
  sidebarText: '#FFFFFF',      // White text on sidebar
  sidebarHover: '#916B7B',     // Slightly darker on hover

  // HEADER
  headerBgDesktop: '#F5F5F5',  // Desktop header background (same as app background)
  headerBgMobile: '#A0696B',   // Mobile header background (sidebar color)
  headerTextMobile: '#FFFFFF', // Mobile header text (white)
  headerButtonBgDesktop: '#F0F0F0', // Desktop profile button background
  headerButtonBgMobileTransparent: 'rgba(255, 255, 255, 0.2)', // Mobile button semi-transparent
  headerButtonBgMobileTransparentHover: 'rgba(255, 255, 255, 0.3)', // Mobile button hover

  // BREADCRUMBS
  breadcrumbActive: '#A0696B',   // Active breadcrumb (current page)
  breadcrumbInactive: '#888888', // Inactive breadcrumb (links)

  // SUBHEADER
  subheaderTextActive: '#A0696B',   // Active tab text (sidebar burgundy)
  subheaderTextInactive: '#656565', // Inactive tab text (muted gray)
  subheaderBorder: '#A0696B',       // Active tab underline (sidebar burgundy)

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
  button: '#A0696B',           // Gold button color
  buttonHover: '#9B7A25',      // Darker on hover
  buttonDelete: '#a1a1a1',     // Red for delete actions
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
  '#1D2433', '#242A3D', '#1B2A32', // Rich Neutrals
  '#7A1A22', '#8C1833', '#87164B', // Vibrant Reds & Pinks
  '#85361A', '#914324', '#7A4B19', // Vivid Oranges & Browns
  '#5B631C', '#6E5D1B',             // Vibrant Yellows & Olives
  '#235E34', '#19634B', '#135E66',  // Vivid Greens & Teals
  '#184175', '#1B376E', '#1D2D6B',  // Vibrant Blues
  '#4F2673', '#63226E', '#751F5B',  // Vivid Purples & Violets
];

export const projectColors = {
  slate: '#1D2433',
  indigoGray: '#242A3D',
  teal: '#1B2A32',
  crimson: '#7A1A22',
  burgundy: '#8C1833',
  magenta: '#87164B',
  orange: '#85361A',
  terracotta: '#914324',
  amber: '#7A4B19',
  citron: '#5B631C',
  olive: '#6E5D1B',
  kelly: '#235E34',
  emerald: '#19634B',
  tealVivid: '#135E66',
  navy: '#184175',
  sapphire: '#1B376E',
  cobalt: '#1D2D6B',
  violet: '#4F2673',
  amethyst: '#63226E',
  orchid: '#751F5B',
};

export const fonts = {
  primary: "'Kumbh Sans', sans-serif",           // Main font for everything (header, sidebar, menus, tabs, content, buttons)
  secondary: "'Cormorant Garamond', serif",      // Only for "Stage Blocks" branding text (sidebar logo area)
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

export default { colors, castColors, buttons, inputs, cards, pages, fonts, spacing, typography, borders, shadows, components, responsive, crewRoles };