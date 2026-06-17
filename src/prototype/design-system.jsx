// ═════════════════════════════════════════════════════════
// DESIGN SYSTEM — Evolved palette blending almanac warmth
// with Figma cleanliness. One source of truth for all pages.
// ═════════════════════════════════════════════════════════

import React from 'react';

// ── Evolved THEME ────────────────────────────────────────
// Warmer than the old Figma (#F0EDE4) but cleaner than the
// almanac (#E8DDC2). Fredoka (display) + Inter (body) throughout.
export const THEME = {
  // Backgrounds
  bg:       '#EFE9DA',   // page background (warm parchment)
  bgCard:   '#FBF8F0',   // card / input backgrounds (warm off-white)
  bgInset:  '#E7E0CE',   // inset sections, sidebars, code blocks
  bgDark:   '#2E3B2F',   // dark hero/CTA sections (deep forest)

  // Text
  ink:      '#1F1B14',   // primary text
  muted:    '#6E675A',   // secondary / captions
  onDark:   '#EFE9DA',   // text on dark backgrounds

  // Accent
  accent:     '#44704B', // primary green (buttons, active)
  accentDeep: '#34503A', // hover / CTA bg

  // Semantic
  gold:    '#C49455',    // progress, certifications, gold accents
  urgent:  '#B4541F',    // product update deadlines within 48h
  danger:  '#7A2B1F',    // errors, destructive actions
  success: '#2E6B3E',    // success states

  // Structure
  line:    '#D5CDBA',    // borders, dividers, rule lines
  shadow:  '0 1px 4px rgba(31,27,20,0.07), 0 1px 2px rgba(31,27,20,0.04)',
  shadowMd:'0 4px 12px rgba(31,27,20,0.10), 0 2px 4px rgba(31,27,20,0.06)',

  // Radius
  pill:    999,
  card:    14,
  tag:     999,
  input:   10,
};

// Keep NEW_PALETTE pointing at THEME so all existing files using
// window.NEW_PALETTE pick up the new tokens automatically.
export const NEW_PALETTE = {
  bg:          THEME.bg,
  bgCard:      THEME.bgCard,
  bgCta:       THEME.bgDark,
  accent:      THEME.accent,
  accentHover: THEME.accentDeep,
  textPrimary: THEME.ink,
  textMuted:   THEME.muted,
  textOnDark:  THEME.onDark,
  tagBg:       THEME.bgInset,
  tagBorder:   THEME.line,
  progress:    THEME.gold,
  stepNum:     THEME.accent,
  // Legacy aliases
  fg:          THEME.ink,
  cream:       THEME.bgCard,
  sun:         THEME.gold,
  rule:        THEME.line,
  cherry:      THEME.danger,
};

// ── Typography ───────────────────────────────────────────
// Display: Fredoka (chunky rounded sans, weight 700) — used for h1/h2/h3/h4 and hero display text.
// Body: Inter — labels, paragraphs, captions.
export const TYPOGRAPHY = {
  display:      { fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif', fontWeight: 700, fontStyle: 'normal' },
  displayItalic:{ fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif', fontWeight: 700, fontStyle: 'normal' },

  h1: { fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif', fontSize: 56, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.01em' },
  h2: { fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif', fontSize: 42, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.005em' },
  h3: { fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif', fontSize: 28, fontWeight: 700, lineHeight: 1.25 },
  h4: { fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif', fontSize: 22, fontWeight: 600, lineHeight: 1.3 },

  body:      { fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: 16, fontWeight: 400, lineHeight: 1.6 },
  bodyLarge: { fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: 18, fontWeight: 400, lineHeight: 1.6 },
  bodySmall: { fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: 14, fontWeight: 400, lineHeight: 1.5 },

  eyebrow: { fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', lineHeight: 1.4 },
  button:  { fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 500, letterSpacing: '0.01em' },
  nav:     { fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 400 },
  label:   { fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500 },
  caption: { fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 400, lineHeight: 1.4 },
  mono:    { fontFamily: '"Inter", monospace', fontSize: 13, fontWeight: 400, lineHeight: 1.5 },
};

// ── Spacing / Layout ─────────────────────────────────────
export const SPACING = {
  maxContentWidth: 1100,
  containerPadding: 24,
  sectionPaddingY: 80,
  sectionPaddingX: 24,
  cardPadding: 24,
  cardGap: 16,
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64,
};

export const RADIUS = {
  pill: THEME.pill, card: THEME.card, badge: 6, tag: THEME.tag,
  progress: 999, input: THEME.input,
};

export const SHADOW = {
  card:      THEME.shadow,
  cardHover: THEME.shadowMd,
  nav:       '0 1px 4px rgba(31,27,20,0.08)',
  modal:     '0 20px 60px rgba(31,27,20,0.22)',
  none:      'none',
};

export function containerStyle(overrides = {}) {
  return { maxWidth: SPACING.maxContentWidth, margin: '0 auto', padding: `0 ${SPACING.containerPadding}px`, ...overrides };
}
export function sectionStyle(overrides = {}) {
  return { padding: `${SPACING.sectionPaddingY}px ${SPACING.sectionPaddingX}px`, ...overrides };
}

const DESIGN_SYSTEM = { palette: NEW_PALETTE, theme: THEME, typography: TYPOGRAPHY, spacing: SPACING, radius: RADIUS, shadow: SHADOW, containerStyle, sectionStyle };

export default DESIGN_SYSTEM;

// ── Window globals (used by App.jsx inline pages) ────────
window.DESIGN_SYSTEM = DESIGN_SYSTEM;
window.THEME         = THEME;
window.NEW_PALETTE   = NEW_PALETTE;
window.TYPOGRAPHY    = TYPOGRAPHY;
window.SPACING       = SPACING;
window.RADIUS        = RADIUS;
window.SHADOW        = SHADOW;
