// ═════════════════════════════════════════════════════════
// PRICING PAGE — Redesigned to match new Figma aesthetic
// Clean, modern three-tier pricing with warm cream background
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle, RADIUS, SHADOW } from './design-system.jsx';
import NavNew from './nav-new.jsx';
import FooterNew from './footer-new.jsx';
import { Button, Eyebrow } from './ui-components.jsx';

function PricingPage({ theme = {} }) {
  const p = { ...NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...TYPOGRAPHY, ...(theme.typography || {}) };

  const tiers = [
    {
      name: 'Trial',
      tagline: 'Trying Copi for FREE',
      price: '0',
      period: '30 days free',
      description: '1 manager · unlimited baristas',
      features: [
        'Full Foundations track (12 entries)',
        'First two espresso drills',
        'Bring your own menu',
        'Email support, 1 business day',
        'No card required'
      ],
      cta: 'Start free trial',
      featured: false
    },
    {
      name: 'Studio',
      tagline: 'For independent cafés',
      price: '25',
      period: 'per month',
      description: '2–5 baristas',
      features: [
        'Entire 50-entry almanac',
        'Calibrated rubrics + manager sign-off',
        'Menu and recipe import',
        'Certification tracking',
        'Priority editor support'
      ],
      cta: 'Start with Studio',
      featured: true
    },
    {
      name: 'Roastery',
      tagline: 'For multi-bar operations',
      price: '50',
      period: 'per month',
      description: '5+ baristas · multi-location',
      features: [
        'Everything in Studio',
        'Multi-location dashboards',
        'Custom tracks + your own drills',
        'API access + roster sync',
        'Dedicated onboarding editor'
      ],
      cta: 'Start with Roastery',
      featured: false
    }
  ];

  const pageStyle = {
    minHeight: '100vh',
    background: p.bg
  };

  const headerSectionStyle = {
    ...sectionStyle({ paddingTop: 80, paddingBottom: 64 }),
    background: p.bg,
    textAlign: 'center'
  };

  const headerInnerStyle = {
    ...containerStyle(),
    maxWidth: 700
  };

  const headlineStyle = {
    ...t.h1,
    color: p.textPrimary,
    margin: '0 0 20px 0',
    fontSize: 64
  };

  const subheadStyle = {
    ...t.bodyLarge,
    color: p.textMuted,
    margin: 0,
    lineHeight: 1.6
  };

  const pricingContainerStyle = {
    ...sectionStyle(),
    background: p.bg
  };

  const pricingInnerStyle = {
    ...containerStyle(),
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24
  };

  const tierCardStyle = (featured) => ({
    background: featured ? p.accent : p.bgCard,
    color: featured ? p.textOnDark : p.textPrimary,
    borderRadius: RADIUS.card,
    border: `1px solid ${featured ? p.accent : p.tagBorder}`,
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxShadow: featured ? SHADOW.cardHover : SHADOW.card,
    transform: featured ? 'scale(1.05)' : 'scale(1)',
    zIndex: featured ? 2 : 1
  });

  const featuredBadgeStyle = {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: 'translateX(-50%)',
    background: p.progress,
    color: p.textPrimary,
    padding: '6px 14px',
    borderRadius: RADIUS.pill,
    ...t.label,
    fontSize: 10
  };

  const tierNameStyle = (featured) => ({
    ...t.eyebrow,
    color: featured ? p.textOnDark : p.textMuted,
    opacity: featured ? 0.9 : 1,
    marginBottom: 12
  });

  const tierTaglineStyle = (featured) => ({
    ...t.h3,
    fontSize: 28,
    fontStyle: 'italic',
    color: featured ? p.textOnDark : p.textPrimary,
    margin: '0 0 24px 0',
    lineHeight: 1.2
  });

  const priceContainerStyle = {
    marginBottom: 16,
    paddingBottom: 20,
    borderBottom: `1px solid ${p.tagBorder}`
  };

  const priceStyle = {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4
  };

  const dollarStyle = (featured) => ({
    ...t.display,
    fontSize: 32,
    color: featured ? p.textOnDark : p.textPrimary,
    opacity: 0.7
  });

  const amountStyle = (featured) => ({
    ...t.display,
    fontSize: 72,
    lineHeight: 1,
    color: featured ? p.textOnDark : p.textPrimary
  });

  const periodStyle = (featured) => ({
    ...t.bodySmall,
    color: featured ? p.textOnDark : p.textMuted,
    opacity: featured ? 0.8 : 1,
    marginLeft: 8
  });

  const descriptionStyle = (featured) => ({
    ...t.bodySmall,
    color: featured ? p.textOnDark : p.textMuted,
    opacity: featured ? 0.9 : 1,
    marginBottom: 24
  });

  const featureListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 32px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    flex: 1
  };

  const featureItemStyle = (featured) => ({
    ...t.bodySmall,
    color: featured ? p.textOnDark : p.textPrimary,
    opacity: featured ? 0.95 : 1,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10
  });

  const checkmarkStyle = (featured) => ({
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: featured ? p.progress : p.accent,
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    flexShrink: 0,
    marginTop: 2
  });

  return (
    <div style={pageStyle}>
      <NavNew theme={{ palette: p, typography: t }} />

      {/* Header */}
      <section style={headerSectionStyle}>
        <div style={headerInnerStyle}>
          <Eyebrow style={{ marginBottom: 16 }}>PRICING</Eyebrow>

          <h1 style={headlineStyle}>
            Honest pricing, by the month.
          </h1>

          <p style={subheadStyle}>
            Start with a free 30-day trial. No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section style={pricingContainerStyle}>
        <div style={pricingInnerStyle}>
          {tiers.map((tier, i) => (
            <div key={i} style={tierCardStyle(tier.featured)}>
              {tier.featured && (
                <div style={featuredBadgeStyle}>MOST POPULAR</div>
              )}

              <div style={tierNameStyle(tier.featured)}>{tier.name}</div>

              <h2 style={tierTaglineStyle(tier.featured)}>{tier.tagline}</h2>

              <div style={priceContainerStyle}>
                <div style={priceStyle}>
                  <span style={dollarStyle(tier.featured)}>$</span>
                  <span style={amountStyle(tier.featured)}>{tier.price}</span>
                  <span style={periodStyle(tier.featured)}>{tier.period}</span>
                </div>
              </div>

              <div style={descriptionStyle(tier.featured)}>{tier.description}</div>

              <ul style={featureListStyle}>
                {tier.features.map((feature, j) => (
                  <li key={j} style={featureItemStyle(tier.featured)}>
                    <div style={checkmarkStyle(tier.featured)}>✓</div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.featured ? 'cta' : 'primary'}
                style={{
                  width: '100%',
                  background: tier.featured ? '#FFFFFF' : p.accent,
                  color: tier.featured ? p.accent : '#FFFFFF'
                }}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <FooterNew theme={{ palette: p, typography: t }} />
    </div>
  );
}

Object.assign(window, { PricingPage });
