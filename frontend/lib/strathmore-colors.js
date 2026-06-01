// Strathmore University Official Branding Colors and Styling System
// Used throughout StrathMart marketplace

export const STRATHMORE_COLORS = {
  // Primary Color: Deep Navy Blue - Used for headers, navigation, verification badges
  primary: '#003366',
  primaryHover: '#002244',
  primaryLight: '#004C99',
  
  // Action/CTA Color: Gold/Tulip Tree - Used for "Buy Now", "Chat with Seller", primary CTAs
  action: '#E4B43A',
  actionHover: '#D4A126',
  actionLight: '#F4D48A',
  
  // Accent/Alert Color: Thunderbird Red - Used for prices, discount badges, alerts
  accent: '#B5121B',
  accentHover: '#950D16',
  accentLight: '#E84C55',
  
  // Background Colors
  bgLight: '#FFFFFF',      // Main background (white)
  bgGrey: '#F8F9FA',       // Secondary background (light grey)
  bgDark: '#2D3748',       // Dark background (if needed)
  
  // Text Colors
  textPrimary: '#003366',  // Primary text
  textSecondary: '#4A5568', // Secondary text
  textLight: '#718096',    // Light text
  textWhite: '#FFFFFF',    // White text
  
  // Status Colors
  success: '#10B981',      // Success/positive
  warning: '#F59E0B',      // Warning
  error: '#EF4444',        // Error
  info: '#3B82F6'          // Information
};

export const TAILWIND_CONFIG = {
  // Reusable Tailwind utility classes
  button: {
    primary: 'px-4 py-2 bg-[#003366] text-white rounded-lg font-semibold hover:bg-[#002244] transition',
    action: 'px-4 py-2 bg-[#E4B43A] text-white rounded-lg font-semibold hover:bg-[#D4A126] transition',
    secondary: 'px-4 py-2 bg-gray-200 text-[#003366] rounded-lg font-semibold hover:bg-gray-300 transition',
    outline: 'px-4 py-2 border-2 border-[#003366] text-[#003366] rounded-lg font-semibold hover:bg-[#003366] hover:text-white transition'
  },
  
  input: {
    base: 'w-full px-4 py-3 border-2 border-[#003366] rounded-lg focus:outline-none focus:border-[#E4B43A] transition bg-[#F8F9FA]'
  },
  
  card: {
    base: 'rounded-lg shadow-md bg-white border border-gray-100 hover:shadow-lg transition',
    elevated: 'rounded-lg shadow-lg bg-white border border-gray-100'
  },
  
  navbar: {
    base: 'bg-[#003366] text-white shadow-md sticky top-0 z-50'
  }
};

// Typography constants
export const TYPOGRAPHY = {
  hero: 'text-5xl md:text-6xl font-bold',
  heading1: 'text-4xl font-bold',
  heading2: 'text-3xl font-bold',
  heading3: 'text-2xl font-bold',
  subheading: 'text-xl font-semibold',
  body: 'text-base',
  small: 'text-sm'
};

// Spacing constants (in rem)
export const SPACING = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
  '2xl': '4rem'
};

// Component Style Helpers
export const getButtonStyle = (variant = 'primary') => {
  const styles = {
    primary: {
      backgroundColor: STRATHMORE_COLORS.primary,
      color: STRATHMORE_COLORS.textWhite,
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    action: {
      backgroundColor: STRATHMORE_COLORS.action,
      color: STRATHMORE_COLORS.textWhite,
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    accent: {
      backgroundColor: STRATHMORE_COLORS.accent,
      color: STRATHMORE_COLORS.textWhite,
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }
  };
  return styles[variant] || styles.primary;
};

export const getPriceStyle = () => {
  return {
    color: STRATHMORE_COLORS.accent,
    fontSize: '1.5rem',
    fontWeight: 'bold'
  };
};

export const getCardStyle = () => {
  return {
    backgroundColor: STRATHMORE_COLORS.bgLight,
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 51, 102, 0.1)',
    border: '1px solid #e2e8f0',
    padding: '16px',
    transition: 'all 0.3s ease'
  };
};

export const getHeaderStyle = () => {
  return {
    backgroundColor: STRATHMORE_COLORS.primary,
    color: STRATHMORE_COLORS.textWhite,
    padding: '20px 0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  };
};
