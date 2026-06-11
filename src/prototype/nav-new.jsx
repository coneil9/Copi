// ═════════════════════════════════════════════════════════
// NAV NEW — Sticky navigation with new design system
// Logo left, links right, CTA button, sticky on scroll with shadow
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, SHADOW, containerStyle } from './design-system.jsx';

function NavNew({ theme = {} }) {
  const p = { ...NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...TYPOGRAPHY, ...(theme.typography || {}) };

  // Sticky scroll state
  const [isSticky, setIsSticky] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation function (uses window.CopiActions if available)
  const navigate = (route) => {
    if (window.CopiActions && window.CopiActions.navigate) {
      window.CopiActions.navigate(route);
    }
  };

  // Open trial modal
  const openWaitlist = () => {
    if (window.CopiActions && window.CopiActions.openTrial) {
      window.CopiActions.openTrial();
    }
  };

  // Open login modal
  const openLogin = () => {
    if (window.CopiActions && window.CopiActions.openLogin) {
      window.CopiActions.openLogin();
    }
  };

  const navStyle = {
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: p.bg,
    boxShadow: isSticky ? SHADOW.nav : 'none',
    transition: 'box-shadow 0.2s ease',
    borderBottom: isSticky ? 'none' : `1px solid ${p.tagBorder}`
  };

  const navInnerStyle = {
    ...containerStyle(),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    paddingTop: 0,
    paddingBottom: 0
  };

  const logoStyle = {
    ...t.display,
    fontSize: 24,
    fontStyle: 'italic',
    color: p.textPrimary,
    textDecoration: 'none',
    cursor: 'pointer'
  };

  const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
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

  const ctaButtonStyle = {
    ...t.button,
    padding: '10px 22px',
    borderRadius: 999,
    background: p.accent,
    color: '#FFFFFF',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const [hoveredLink, setHoveredLink] = React.useState(null);
  const [ctaHovered, setCtaHovered] = React.useState(false);

  return (
    <nav style={navStyle}>
      <div style={navInnerStyle}>
        {/* Logo */}
        <a
          onClick={() => navigate('home')}
          style={logoStyle}
        >
          Copi.
        </a>

        {/* Nav links + CTA */}
        <ul style={navLinksStyle}>
          <li>
            <a
              onClick={() => {
                const section = document.getElementById('how-it-works');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Not on home page — navigate home then scroll
                  if (window.CopiActions && window.CopiActions.navigate) {
                    window.CopiActions.navigate('home');
                    setTimeout(() => {
                      const s = document.getElementById('how-it-works');
                      if (s) s.scrollIntoView({ behavior: 'smooth' });
                    }, 400);
                  }
                }
              }}
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
              onClick={openLogin}
              style={{
                ...linkStyle,
                color: hoveredLink === 'login' ? p.accent : p.textPrimary
              }}
              onMouseEnter={() => setHoveredLink('login')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Log in
            </a>
          </li>
          <li>
            <button
              onClick={openWaitlist}
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              style={{
                ...ctaButtonStyle,
                background: ctaHovered ? p.accentHover : p.accent
              }}
            >
              Join the waitlist
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

// Export to window
window.NavNew = NavNew;

export default NavNew;
