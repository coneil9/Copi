// ═════════════════════════════════════════════════════════
// FOOTER NEW — Updated footer with new design system
// Logo + tagline left, nav links right, copyright below
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, containerStyle, sectionStyle } from './design-system.jsx';

function FooterNew({ theme = {} }) {
  const p = { ...NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...TYPOGRAPHY, ...(theme.typography || {}) };

  // Navigation function (uses window.CopiActions if available)
  const navigate = (route) => {
    if (window.CopiActions && window.CopiActions.navigate) {
      window.CopiActions.navigate(route);
    }
  };

  const footerContainerStyle = {
    ...sectionStyle({ paddingTop: 60, paddingBottom: 40 }),
    background: p.bg,
    borderTop: `1px solid ${p.tagBorder}`
  };

  const footerInnerStyle = {
    ...containerStyle()
  };

  const topRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingBottom: 32,
    borderBottom: `1px solid ${p.tagBorder}`
  };

  const logoSectionStyle = {
    maxWidth: 300
  };

  const logoStyle = {
    ...t.display,
    fontSize: 24,
    fontStyle: 'italic',
    color: p.textPrimary,
    marginBottom: 8
  };

  const taglineStyle = {
    ...t.bodySmall,
    color: p.textMuted,
    margin: 0
  };

  const navLinksContainerStyle = {
    display: 'flex',
    gap: 32,
    listStyle: 'none',
    margin: 0,
    padding: 0
  };

  const linkStyle = {
    ...t.nav,
    color: p.textPrimary,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s ease'
  };

  const copyrightStyle = {
    ...t.caption,
    color: p.textMuted,
    textAlign: 'center',
    margin: 0
  };

  const [hoveredLink, setHoveredLink] = React.useState(null);

  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer style={footerContainerStyle}>
      <div style={footerInnerStyle}>
        {/* Top row - Logo + Nav */}
        <div style={topRowStyle}>
          {/* Logo + tagline */}
          <div style={logoSectionStyle}>
            <div style={logoStyle}>Copi.</div>
            <p style={taglineStyle}>
              Cafe onboarding and coffee education.
            </p>
          </div>

          {/* Nav links */}
          <nav>
            <ul style={navLinksContainerStyle}>
              <li>
                <a
                  onClick={scrollToHowItWorks}
                  style={{
                    ...linkStyle,
                    color: hoveredLink === 'how' ? p.accent : p.textPrimary
                  }}
                  onMouseEnter={() => setHoveredLink('how')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  onClick={() => navigate('curriculum')}
                  style={{
                    ...linkStyle,
                    color: hoveredLink === 'curriculum' ? p.accent : p.textPrimary
                  }}
                  onMouseEnter={() => setHoveredLink('curriculum')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  Curriculum
                </a>
              </li>
              <li>
                <a
                  onClick={() => navigate('pricing')}
                  style={{
                    ...linkStyle,
                    color: hoveredLink === 'pricing' ? p.accent : p.textPrimary
                  }}
                  onMouseEnter={() => setHoveredLink('pricing')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  onClick={() => navigate('about')}
                  style={{
                    ...linkStyle,
                    color: hoveredLink === 'about' ? p.accent : p.textPrimary
                  }}
                  onMouseEnter={() => setHoveredLink('about')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@copi.com"
                  style={{
                    ...linkStyle,
                    color: hoveredLink === 'contact' ? p.accent : p.textPrimary
                  }}
                  onMouseEnter={() => setHoveredLink('contact')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Copyright */}
        <p style={copyrightStyle}>
          © 2026 Copi. Made for independent cafes.
        </p>
      </div>
    </footer>
  );
}

// Export to window
window.FooterNew = FooterNew;

export default FooterNew;
