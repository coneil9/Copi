// ═════════════════════════════════════════════════════════
// ADMIN SHELL — Layout used by all wireframe admin screens.
// Left sidebar (forest green) with cafe avatar + nav items,
// top "Copi" header strip, and a right content area.
// ═════════════════════════════════════════════════════════

import React from 'react';

// Forest sidebar colours (slightly deeper than the THEME forest so it
// reads as a chrome surface rather than a content section).
const SIDEBAR_BG       = '#2D5016';
const SIDEBAR_BG_DEEP  = '#23410F';
const SIDEBAR_TEXT     = '#F5F0E8';
const SIDEBAR_DIM      = 'rgba(245, 240, 232, 0.62)';
const SIDEBAR_ACTIVE   = '#F4C542';   // yellow highlight for the current item
const SIDEBAR_DIVIDER  = 'rgba(245, 240, 232, 0.16)';

// Small icon set used by the sidebar items.
function Icon({ name, size = 18, stroke = SIDEBAR_TEXT }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':
      return (<svg {...common}><path d="M3 11.5L12 4l9 7.5" /><path d="M5 10v10h14V10" /></svg>);
    case 'team':
      return (<svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></svg>);
    case 'lessons':
      return (<svg {...common}><rect x="3" y="5" width="8" height="14" rx="1.5" /><rect x="13" y="5" width="8" height="14" rx="1.5" /></svg>);
    case 'analytics':
      return (<svg {...common}><path d="M4 19V5" /><path d="M4 19h16" /><path d="M7 15l4-5 3 3 5-7" /><path d="M18 6h2v2" /></svg>);
    case 'settings':
      return (<svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>);
    default:
      return null;
  }
}

// Cafe avatar — circular with the cafe name in italic.
function CafeAvatar({ name }) {
  return (
    <div style={{
      width: 88, height: 88, borderRadius: '50%',
      background: '#F5F0E8',
      border: `2px solid ${SIDEBAR_DIVIDER}`,
      display: 'grid', placeItems: 'center',
      margin: '0 auto'
    }}>
      <span style={{
        fontFamily: '"Yrsa", "Unna", Georgia, serif',
        fontStyle: 'italic',
        fontSize: 22,
        color: '#23410F',
        letterSpacing: '0.01em'
      }}>
        {name.toLowerCase()}
      </span>
    </div>
  );
}

// ═══════════════════════════════════
// AdminShell — sidebar + content layout
// Props:
//   current: route key for the active top-level nav item
//   subnav: optional array [{ label, route, active }]
//   user, cafe: from caller
//   children: main content
// ═══════════════════════════════════

export function AdminShell({ current = 'home', subnav = null, user = {}, cafe = null, children }) {
  const act = window.CopiActions || {};
  const cafeName = cafe?.name || user?.cafe || 'Milano';

  const navItems = [
    { key: 'home',      label: 'Home',      icon: 'home',      route: 'admin-home' },
    { key: 'team',      label: 'Team',      icon: 'team',      route: 'admin-team' },
    { key: 'lessons',   label: 'Lessons',   icon: 'lessons',   route: 'admin-lessons-grid' },
    { key: 'analytics', label: 'Analytics', icon: 'analytics', route: 'analytics' },
    { key: 'settings',  label: 'Settings',  icon: 'settings',  route: 'admin-setup-copi' },
  ];

  const navigate = (route) => {
    if (act.navigate) act.navigate(route);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--copi-cream)',
      color: 'var(--copi-ink)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top "Copi" header strip */}
      <header style={{
        height: 64,
        background: '#FBF8F0',
        borderBottom: `1px solid var(--copi-line)`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <span
          onClick={() => navigate('admin-home')}
          style={{
            fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif',
            fontWeight: 600,
            fontSize: 28,
            color: SIDEBAR_BG,
            cursor: 'pointer',
            letterSpacing: '-0.01em'
          }}
        >
          Copi
        </span>
        <div style={{ flex: 1 }} />
        <span style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: 13,
          color: 'var(--copi-muted)'
        }}>
          {user?.name || 'Brian Turko'}
        </span>
      </header>

      {/* Sidebar + content */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <aside style={{
          width: 248,
          background: SIDEBAR_BG,
          color: SIDEBAR_TEXT,
          padding: '32px 18px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          flexShrink: 0
        }}>
          <CafeAvatar name={cafeName} />

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {navItems.map((item) => {
              const isActive = item.key === current;
              return (
                <div key={item.key}>
                  <button
                    onClick={() => navigate(item.route)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '11px 14px',
                      borderRadius: 10,
                      background: isActive ? SIDEBAR_BG_DEEP : 'transparent',
                      border: isActive ? `1.5px solid ${SIDEBAR_ACTIVE}` : '1.5px solid transparent',
                      color: SIDEBAR_TEXT,
                      fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: 15,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 160ms, border-color 160ms'
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(245, 240, 232, 0.08)'; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Icon name={item.icon} size={18} stroke={isActive ? SIDEBAR_ACTIVE : SIDEBAR_TEXT} />
                    <span>{item.label}</span>
                  </button>

                  {/* Sub-nav under the active top-level item */}
                  {isActive && subnav && (
                    <div style={{
                      marginTop: 4,
                      marginLeft: 18,
                      paddingLeft: 14,
                      borderLeft: `1px solid ${SIDEBAR_DIVIDER}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2
                    }}>
                      {subnav.map((sub) => (
                        <button
                          key={sub.label}
                          onClick={() => sub.route && navigate(sub.route)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '6px 8px',
                            borderRadius: 6,
                            color: sub.active ? SIDEBAR_ACTIVE : SIDEBAR_DIM,
                            fontFamily: '"Inter", sans-serif',
                            fontSize: 13,
                            fontWeight: sub.active ? 600 : 400,
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          – {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div style={{ flex: 1 }} />

          <button
            data-app-action="logout"
            style={{
              background: 'transparent',
              border: `1px solid ${SIDEBAR_DIVIDER}`,
              color: SIDEBAR_DIM,
              padding: '8px 12px',
              borderRadius: 999,
              fontFamily: '"Inter", sans-serif',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '0.04em'
            }}
          >
            Log out
          </button>
        </aside>

        <main style={{
          flex: 1,
          padding: '36px 48px 64px',
          overflowX: 'hidden'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// Yellow highlight under a key word, mirrors the landing-page Highlight
// but reuses the inline-svg pattern so we don't pull animations into shell.
export function YellowMark({ children }) {
  return (
    <span style={{
      position: 'relative',
      display: 'inline-block',
      whiteSpace: 'nowrap',
      padding: '0 4px'
    }}>
      <span style={{
        position: 'absolute',
        inset: 0,
        background: '#F2D03B',
        borderRadius: 4,
        transform: 'rotate(-1.5deg)',
        zIndex: 0
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </span>
  );
}

// Simple shared modal — used by Refine/Verify buttons across screens.
export function CopiModal({ title, body, onClose, accent = '#7A2B1F' }) {
  if (!title && !body) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(31, 27, 20, 0.55)',
        display: 'grid', placeItems: 'center',
        padding: 24
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FBF8F0',
          borderRadius: 16,
          padding: 32,
          maxWidth: 480,
          width: '100%',
          border: `1px solid var(--copi-line)`,
          boxShadow: '0 24px 64px rgba(31,27,20,0.24)'
        }}
      >
        <div style={{
          fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 22,
          color: 'var(--copi-ink)',
          marginBottom: 12
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: 14,
          color: 'var(--copi-muted)',
          lineHeight: 1.6,
          marginBottom: 24
        }}>
          {body}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: 999,
              background: 'transparent',
              border: `1.5px solid ${accent}`,
              color: accent,
              fontFamily: '"Inter", sans-serif',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

// Cupper mini — a compact SVG version of Cupper for inline use next to the
// AI chat prompt. Matches the green-cup / beige-lid / squiggle look from
// the landing-page mascot.
export function CupperMini({ size = 64 }) {
  const cupColor = '#6F8E5A';
  const lidColor = '#D9CBAE';
  const lidShade = '#C3B496';
  const limbColor = '#1C1A17';
  return (
    <svg viewBox="0 0 120 150" width={size} height={size * (150 / 120)} aria-hidden="true">
      {/* steam */}
      <path
        d="M 65 22 C 75 14 55 8 65 0"
        stroke={limbColor}
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* lid */}
      <ellipse cx="60" cy="32" rx="32" ry="6" fill={lidShade} />
      <path
        d="M 28 32 Q 28 22 60 22 Q 92 22 92 32 Q 92 40 60 40 Q 28 40 28 32 Z"
        fill={lidColor}
      />
      {/* cup body */}
      <path
        d="M 32 36 L 36 116 Q 36 122 42 122 L 78 122 Q 84 122 84 116 L 88 36 Z"
        fill={cupColor}
      />
      {/* sleeve */}
      <path d="M 36 92 L 84 92 L 83 102 L 37 102 Z" fill={lidColor} />
      {/* face */}
      <circle cx="50" cy="64" r="2.6" fill={limbColor} />
      <circle cx="70" cy="64" r="2.6" fill={limbColor} />
      <path d="M 52 76 Q 60 82 68 76" stroke={limbColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* arms */}
      <path d="M 34 64 Q 24 72 22 86" stroke={limbColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="21" cy="88" r="2" fill={limbColor} />
      <path d="M 86 64 Q 96 64 102 56" stroke={limbColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="103" cy="55" r="2" fill={limbColor} />
    </svg>
  );
}

// Window exports for App.jsx route resolver
if (typeof window !== 'undefined') {
  window.AdminShell = AdminShell;
  window.YellowMark = YellowMark;
  window.CopiModal = CopiModal;
  window.CupperMini = CupperMini;
}

export default AdminShell;
