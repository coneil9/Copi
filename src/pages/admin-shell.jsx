// ═════════════════════════════════════════════════════════
// ADMIN SHELL — Left-sidebar layout used by all admin screens.
// Sidebar uses Glade Green; the active top-level item renders as a
// dark-green pill with a Ripe Lemon icon + border and bold white label
// (matches the Settings reference). Active sub-nav items are Ripe Lemon.
// All colours come from CSS custom properties defined in styles.css.
// ═════════════════════════════════════════════════════════

import React from 'react';

// Inline icon set used in the sidebar.
function Icon({ name, size = 18, stroke = 'currentColor' }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':
      return (<svg {...common}><path d="M3 11.5L12 4l9 7.5" /><path d="M5 10v10h14V10" /></svg>);
    case 'team':
      return (<svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></svg>);
    case 'curriculum':
      return (<svg {...common}><path d="M4 5h7v14H4z" /><path d="M13 5h7v14h-7z" /><path d="M4 9h7" /><path d="M13 9h7" /></svg>);
    case 'analytics':
      return (<svg {...common}><path d="M4 19V5" /><path d="M4 19h16" /><path d="M7 15l4-5 3 3 5-7" /><path d="M18 6h2v2" /></svg>);
    case 'billing':
      return (<svg {...common}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><path d="M7 15h3" /></svg>);
    case 'settings':
      return (<svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>);
    default:
      return null;
  }
}

// Cafe avatar — Alabaster circle with the cafe name in handwritten italic.
function CafeAvatar({ name }) {
  return (
    <div style={{
      width: 88, height: 88, borderRadius: '50%',
      background: 'var(--alabaster)',
      border: '2px solid rgba(245, 237, 220, 0.18)',
      display: 'grid', placeItems: 'center',
      margin: '0 auto',
      boxShadow: '0 4px 14px rgba(31, 26, 20, 0.25)'
    }}>
      <span style={{
        fontFamily: '"Playpen Sans", "Yrsa", serif',
        fontStyle: 'italic',
        fontWeight: 700,
        fontSize: 20,
        color: 'var(--glade-green-deep)',
        letterSpacing: '0.01em'
      }}>
        {name.toLowerCase()}
      </span>
    </div>
  );
}

// ═══════════════════════════════════
// AdminShell
//   current: route key for the active top-level nav item
//   subnav:  [{ label, route, active }]
// ═══════════════════════════════════

export function AdminShell({ current = 'home', subnav = null, user = {}, cafe = null, children }) {
  const act = window.CopiActions || {};
  const cafeName = cafe?.name || user?.cafe || 'Milano';

  const navItems = [
    { key: 'home',       label: 'Home',       icon: 'home',       route: 'admin-home' },
    { key: 'team',       label: 'Team',       icon: 'team',       route: 'admin-team' },
    { key: 'curriculum', label: 'Curriculum', icon: 'curriculum', route: 'admin-curriculum-page' },
    { key: 'analytics',  label: 'Analytics',  icon: 'analytics',  route: 'analytics' },
    { key: 'billing',    label: 'Billing',    icon: 'billing',    route: 'admin-billing-page' },
    { key: 'settings',   label: 'Settings',   icon: 'settings',   route: 'admin-setup-copi' },
  ];

  const navigate = (route) => {
    if (route && act.navigate) act.navigate(route);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--pearl-bush)',
      color: 'var(--graphite)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top "Copi" header strip */}
      <header style={{
        height: 64,
        background: 'var(--alabaster)',
        borderBottom: '1px solid var(--heathered-gray)',
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
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 26,
            color: 'var(--glade-green-deep)',
            cursor: 'pointer',
            letterSpacing: '-0.01em'
          }}
        >
          Copi
        </span>
        <span style={{
          marginLeft: 12,
          padding: '4px 10px',
          borderRadius: 999,
          background: 'var(--pearl-bush)',
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--graphite)',
          letterSpacing: '0.04em'
        }}>
          {cafeName} Coffee
        </span>
        <div style={{ flex: 1 }} />
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--graphite)'
        }}>
          {user?.name || 'Brian Turko'}
        </span>
      </header>

      {/* Sidebar + content */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <aside style={{
          width: 248,
          background: 'var(--glade-green-deep)',
          color: 'var(--alabaster)',
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
                      borderRadius: 12,
                      background: isActive ? 'rgba(0, 0, 0, 0.22)' : 'transparent',
                      border: isActive ? '1.5px solid var(--ripe-lemon)' : '1.5px solid transparent',
                      color: 'var(--white)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: isActive ? 800 : 500,
                      fontSize: 15,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 160ms, border-color 160ms',
                      letterSpacing: isActive ? '0.005em' : 0
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Icon
                      name={item.icon}
                      size={18}
                      stroke={isActive ? 'var(--ripe-lemon)' : 'var(--alabaster)'}
                    />
                    <span>{item.label}</span>
                  </button>

                  {/* Sub-nav under the active top-level item */}
                  {isActive && subnav && (
                    <div style={{
                      marginTop: 6,
                      marginLeft: 18,
                      paddingLeft: 14,
                      borderLeft: '1px solid rgba(245, 237, 220, 0.22)',
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
                            color: sub.active ? 'var(--ripe-lemon)' : 'rgba(245, 237, 220, 0.72)',
                            fontFamily: 'var(--font-body)',
                            fontSize: 13,
                            fontWeight: sub.active ? 700 : 500,
                            cursor: sub.route ? 'pointer' : 'default',
                            textAlign: 'left',
                            opacity: sub.route ? 1 : 0.85
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
              border: '1px solid rgba(245, 237, 220, 0.22)',
              color: 'rgba(245, 237, 220, 0.72)',
              padding: '8px 12px',
              borderRadius: 999,
              fontFamily: 'var(--font-body)',
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
          padding: '40px 48px 64px',
          overflowX: 'hidden'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// Yellow highlight under a key word.
export function YellowMark({ children }) {
  return (
    <span style={{
      position: 'relative',
      display: 'inline-block',
      whiteSpace: 'nowrap',
      padding: '0 6px'
    }}>
      <span style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--ripe-lemon)',
        borderRadius: 4,
        transform: 'rotate(-1.5deg)',
        zIndex: 0
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </span>
  );
}

// Shared modal — used by Refine / Verify across pages.
export function CopiModal({ title, body, onClose, accent = 'var(--danger)' }) {
  if (!title && !body) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(31, 26, 20, 0.55)',
        display: 'grid', placeItems: 'center',
        padding: 24
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--alabaster)',
          borderRadius: 16,
          padding: 32,
          maxWidth: 480,
          width: '100%',
          border: '1px solid var(--heathered-gray)',
          boxShadow: '0 24px 64px rgba(31, 26, 20, 0.28)'
        }}
      >
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 22,
          color: 'var(--graphite)',
          marginBottom: 12
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--roman-coffee)',
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
              fontFamily: 'var(--font-body)',
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

// Cupper mini — compact <img> of the official Cupper Ai.png asset.
// Sized so the previous SVG footprint is preserved (the old SVG had a
// 120 × 170 viewbox; the new PNG is 944 × 1108 with a transparent
// background, so we keep height = size × (170/120) for parity).
export function CupperMini({ size = 64 }) {
  const height = Math.round(size * (170 / 120));
  return (
    <img
      src="/assets/cupper-ai.png"
      alt="Cupper"
      width={size}
      height={height}
      style={{
        display: 'block',
        background: 'transparent',
        objectFit: 'contain'
      }}
    />
  );
}

if (typeof window !== 'undefined') {
  window.AdminShell = AdminShell;
  window.YellowMark = YellowMark;
  window.CopiModal = CopiModal;
  window.CupperMini = CupperMini;
}

export default AdminShell;
