// ═════════════════════════════════════════════════════════
// DESIGN SYSTEM — New color palette, typography, and spacing
// Based on Figma design specifications for Copi marketing site
// ═════════════════════════════════════════════════════════

import React from 'react';

// ═══════════════════════════════════
// COLOR PALETTE
// ═══════════════════════════════════

export const NEW_PALETTE = {
  // Backgrounds
  bg: '#F0EDE4',           // Warm parchment cream - page background
  bgCard: '#FFFFFF',       // Pure white - card and input backgrounds
  bgCta: '#3D5A3E',        // Deep forest green - CTA section background

  // Accents
  accent: '#4A7C59',       // Mid forest green - primary button, active states
  accentHover: '#3D5A3E',  // Button hover state

  // Text
  textPrimary: '#1C1C1A',  // Headings and body text
  textMuted: '#6B6860',    // Subtext, captions, labels
  textOnDark: '#F0EDE4',   // Text on green CTA backgrounds

  // UI Elements
  tagBg: '#E8E4D8',        // Pill/tag backgrounds
  tagBorder: '#D0CBBF',    // Pill/tag borders
  progress: '#C8A96E',     // Progress bar fill - warm caramel gold
  stepNum: '#4A7C59',      // Numbered step indicators

  // Legacy (for backward compatibility with existing components)
  fg: '#1C1C1A',           // Alias for textPrimary
  cream: '#F0EDE4',        // Alias for bg
  sun: '#C8A96E',          // Alias for progress
  rule: '#D0CBBF',         // Alias for tagBorder
  cherry: '#7A2B1F'        // Keep for error states
};

// ═══════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════

export const TYPOGRAPHY = {
  // Display / Headings — DM Serif Display
  display: {
    fontFamily: '"DM Serif Display", Georgia, serif',
    fontWeight: 400,
    fontStyle: 'normal'
  },

  displayItalic: {
    fontFamily: '"DM Serif Display", Georgia, serif',
    fontWeight: 400,
    fontStyle: 'italic'
  },

  // Headings scale
  h1: {
    fontFamily: '"DM Serif Display", Georgia, serif',
    fontSize: 56,
    fontWeight: 400,
    lineHeight: 1.1,
    letterSpacing: '-0.02em'
  },

  h2: {
    fontFamily: '"DM Serif Display", Georgia, serif',
    fontSize: 42,
    fontWeight: 400,
    lineHeight: 1.2,
    letterSpacing: '-0.01em'
  },

  h3: {
    fontFamily: '"DM Serif Display", Georgia, serif',
    fontSize: 32,
    fontWeight: 400,
    lineHeight: 1.3
  },

  // Body / UI — Inter
  body: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.6
  },

  bodyLarge: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 1.6
  },

  bodySmall: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5
  },

  // Eyebrow labels — uppercase, tracked
  eyebrow: {
    fontFamily: '"Inter", sans-serif',
    fontSize: 11,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    lineHeight: 1.4
  },

  // Buttons and nav
  button: {
    fontFamily: '"Inter", sans-serif',
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '0.01em'
  },

  nav: {
    fontFamily: '"Inter", sans-serif',
    fontSize: 14,
    fontWeight: 400
  },

  // Labels and tags
  label: {
    fontFamily: '"Inter", sans-serif',
    fontSize: 12,
    fontWeight: 500
  },

  caption: {
    fontFamily: '"Inter", sans-serif',
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1.4
  }
};

// ═══════════════════════════════════
// SPACING & LAYOUT
// ═══════════════════════════════════

export const SPACING = {
  // Container
  maxContentWidth: 1100,
  containerPadding: 24,

  // Sections
  sectionPaddingY: 80,
  sectionPaddingX: 24,

  // Cards
  cardPadding: 24,
  cardGap: 16,

  // Common spacing scale
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64
};

// ═══════════════════════════════════
// BORDER RADIUS
// ═══════════════════════════════════

export const RADIUS = {
  pill: 999,      // Buttons, inputs (fully rounded)
  card: 12,       // Cards
  badge: 6,       // Step number badges
  tag: 999,       // Tags/pill labels (fully rounded)
  progress: 999   // Progress bars (fully rounded)
};

// ═══════════════════════════════════
// SHADOW
// ═══════════════════════════════════

export const SHADOW = {
  card: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
  cardHover: '0 4px 6px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.06)',
  nav: '0 1px 4px rgba(0, 0, 0, 0.08)',
  none: 'none'
};

// ═══════════════════════════════════
// HELPER: Container style
// ═══════════════════════════════════

export function containerStyle(overrides = {}) {
  return {
    maxWidth: SPACING.maxContentWidth,
    margin: '0 auto',
    padding: `0 ${SPACING.containerPadding}px`,
    ...overrides
  };
}

// ═══════════════════════════════════
// HELPER: Section style
// ═══════════════════════════════════

export function sectionStyle(overrides = {}) {
  return {
    padding: `${SPACING.sectionPaddingY}px ${SPACING.sectionPaddingX}px`,
    ...overrides
  };
}

// ═══════════════════════════════════
// EXPORT DEFAULT (combined theme object)
// ═══════════════════════════════════

const DESIGN_SYSTEM = {
  palette: NEW_PALETTE,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  radius: RADIUS,
  shadow: SHADOW,
  containerStyle,
  sectionStyle
};

export default DESIGN_SYSTEM;

// Export to window for global access
window.DESIGN_SYSTEM = DESIGN_SYSTEM;
window.NEW_PALETTE = NEW_PALETTE;
window.TYPOGRAPHY = TYPOGRAPHY;
window.SPACING = SPACING;
window.RADIUS = RADIUS;
window.SHADOW = SHADOW;
