// ═════════════════════════════════════════════════════════
// ADMIN SHELL — Persistent dashboard layout: 176px deep-olive
// sidebar on the left, top bar (search + bell + avatar) on the
// right, and a scrollable main content area. Every dashboard
// page renders inside <AdminShell>; the page itself only owns
// the content area.
// ═════════════════════════════════════════════════════════

import React from 'react';

// ── Icons ────────────────────────────────────────────────
function Icon({ name, size = 18, stroke = 'currentColor', fill = 'none' }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill, stroke, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':
      return (<svg {...common}><path d="M3 11.5L12 4l9 7.5" /><path d="M5 10v10h14V10" /></svg>);
    case 'team':
      return (<svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></svg>);
    case 'curriculum':
      return (<svg {...common}><rect x="4" y="4" width="7" height="7" rx="1.4" /><rect x="13" y="4" width="7" height="7" rx="1.4" /><rect x="4" y="13" width="7" height="7" rx="1.4" /><rect x="13" y="13" width="7" height="7" rx="1.4" /></svg>);
    case 'analytics':
      return (<svg {...common}><path d="M3 14 L7 9 L11 13 L15 7 L21 14" /><circle cx="7" cy="9" r="1.2" /><circle cx="11" cy="13" r="1.2" /><circle cx="15" cy="7" r="1.2" /></svg>);
    case 'billing':
      return (<svg {...common}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><path d="M7 15h3" /></svg>);
    case 'settings':
      return (<svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>);
    case 'search':
      return (<svg {...common}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>);
    case 'bell':
      return (<svg {...common}><path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16z" /><path d="M10 21a2 2 0 0 0 4 0" /></svg>);
    case 'power':
      return (<svg {...common}><path d="M12 3v9" /><path d="M5.5 8a8 8 0 1 0 13 0" /></svg>);
    default:
      return null;
  }
}

// ── Cafe avatar (round, Alabaster, italic cafe name) ────
function CafeAvatar({ name }) {
  const cleaned = (name || 'milano').toLowerCase();
  // Split into two lines if a single word — looks like the mockup ("milano / coffee")
  const parts = cleaned.split(' ');
  const top = parts[0];
  const bottom = parts[1] || 'coffee';
  return (
    <div style={{
      width: 80, height: 80, borderRadius: '50%',
      background: 'var(--alabaster)',
      display: 'grid', placeItems: 'center',
      margin: '0 auto',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.18)'
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontWeight: 700,
        fontSize: 15,
        color: 'var(--glade-green-deep)',
        textAlign: 'center',
        lineHeight: 1.05
      }}>
        {top}<br/>{bottom}
      </div>
    </div>
  );
}

// ── Sidebar nav item ─────────────────────────────────────
function NavItem({ item, isActive, onClick }) {
  const [hover, setHover] = React.useState(false);
  const bg = isActive ? 'var(--sidebar-bg-pill)' : (hover ? 'rgba(245, 237, 220, 0.08)' : 'transparent');
  const fg = isActive ? 'var(--graphite)' : 'var(--alabaster)';
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="dash-nav-item"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '9px 14px',
        borderRadius: 8,
        background: bg,
        border: 'none',
        color: fg,
        fontFamily: 'var(--font-body)',
        fontWeight: isActive ? 600 : 500,
        fontSize: 13.5,
        cursor: 'pointer',
        textAlign: 'left'
      }}
    >
      <Icon name={item.icon} size={16} stroke={fg} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge != null && (
        <span style={{
          minWidth: 18,
          height: 18,
          padding: '0 6px',
          borderRadius: 9,
          background: isActive ? 'var(--glade-green-deep)' : 'rgba(245, 237, 220, 0.16)',
          color: isActive ? 'var(--alabaster)' : 'var(--alabaster)',
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          fontWeight: 700,
          display: 'grid',
          placeItems: 'center'
        }}>
          {item.badge}
        </span>
      )}
    </button>
  );
}

// ── AdminShell ───────────────────────────────────────────
export function AdminShell({
  current = 'home',
  subnav = null,
  user = {},
  cafe = null,
  children,
  // Override the curriculum badge from the page if needed.
  curriculumBadge = 3
}) {
  const act = window.CopiActions || {};
  const cafeName = cafe?.name || user?.cafe || 'Milano';
  const userName = user?.name || 'Brian Turko';
  const initials = userName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const navItems = [
    { key: 'home',       label: 'Home',       icon: 'home',       route: 'admin-home' },
    { key: 'team',       label: 'Team',       icon: 'team',       route: 'admin-team' },
    { key: 'curriculum', label: 'Curriculum', icon: 'curriculum', route: 'admin-curriculum-page', badge: curriculumBadge },
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
      display: 'flex',
      background: 'var(--pearl-bush)',
      color: 'var(--graphite)'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 200,
        background: 'var(--sidebar-bg)',
        color: 'var(--alabaster)',
        display: 'flex',
        flexDirection: 'column',
        padding: '22px 14px 18px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        flexShrink: 0
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate('admin-home')}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 26,
            color: 'var(--alabaster)',
            cursor: 'pointer',
            paddingLeft: 4,
            marginBottom: 22,
            letterSpacing: '-0.02em'
          }}
        >
          Copi
        </div>

        {/* Cafe avatar */}
        <CafeAvatar name={cafeName} />
        <div style={{
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'rgba(245, 237, 220, 0.72)',
          marginTop: 10,
          marginBottom: 18
        }}>
          {cafeName} Coffee Co.
        </div>

        {/* Primary nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => (
            <div key={item.key}>
              <NavItem
                item={item}
                isActive={item.key === current}
                onClick={() => navigate(item.route)}
              />
              {/* Sub-nav under the active item (only Settings uses this today) */}
              {item.key === current && subnav && (
                <div style={{
                  marginTop: 6,
                  marginLeft: 14,
                  paddingLeft: 14,
                  borderLeft: '1px solid rgba(245, 237, 220, 0.22)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  marginBottom: 4
                }}>
                  {subnav.map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => sub.route && navigate(sub.route)}
                      className="dash-nav-item"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '5px 8px',
                        borderRadius: 6,
                        color: sub.active ? 'var(--ripe-lemon)' : 'rgba(245, 237, 220, 0.72)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 12.5,
                        fontWeight: sub.active ? 700 : 500,
                        cursor: sub.route ? 'pointer' : 'default',
                        textAlign: 'left'
                      }}
                    >
                      – {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Owner profile + power button at bottom */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 8px',
          borderRadius: 12,
          background: 'rgba(0, 0, 0, 0.22)'
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--glade-green)',
            color: 'var(--alabaster)',
            display: 'grid', placeItems: 'center',
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 700,
            flexShrink: 0
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--alabaster)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {userName}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              color: 'rgba(245, 237, 220, 0.7)',
              letterSpacing: '0.04em'
            }}>
              Owner
            </div>
          </div>
          <button
            data-app-action="logout"
            title="Log out"
            className="dash-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(245, 237, 220, 0.7)',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 6,
              display: 'grid',
              placeItems: 'center'
            }}
          >
            <Icon name="power" size={16} stroke="currentColor" />
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '18px 36px',
          position: 'sticky',
          top: 0,
          background: 'var(--pearl-bush)',
          zIndex: 40
        }}>
          {/* Search */}
          <div style={{
            flex: 1,
            maxWidth: 420,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 16px',
            background: 'var(--white)',
            border: '1px solid var(--pearl-bush)',
            borderRadius: 999,
            boxShadow: '0 1px 2px rgba(31, 26, 20, 0.04)'
          }}>
            <Icon name="search" size={15} stroke="var(--heathered-gray)" />
            <input
              placeholder="Search team, lessons, tracks…"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--graphite)'
              }}
            />
          </div>

          <div style={{ flex: 1 }} />

          {/* Bell */}
          <button
            type="button"
            className="dash-btn"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              borderRadius: 999,
              color: 'var(--graphite)',
              position: 'relative'
            }}
          >
            <Icon name="bell" size={18} stroke="currentColor" />
            <span style={{
              position: 'absolute',
              top: 6, right: 6,
              width: 8, height: 8,
              background: 'var(--ripe-lemon)',
              borderRadius: '50%',
              border: '2px solid var(--pearl-bush)'
            }} />
          </button>

          {/* User chip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '4px 12px 4px 4px',
            borderRadius: 999,
            background: 'var(--white)',
            border: '1px solid var(--pearl-bush)'
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'var(--glade-green-deep)',
              color: 'var(--alabaster)',
              display: 'grid', placeItems: 'center',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 700
            }}>
              {initials}
            </div>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--graphite)'
            }}>
              {userName}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main
          key={current /* re-keys on route change so the dash-page fade-in re-runs */}
          className="dash-page"
          style={{
            flex: 1,
            padding: '8px 36px 48px',
            overflowX: 'hidden'
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

// ── Yellow highlight + modal kept from previous shell ────
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
          background: 'var(--white)',
          borderRadius: 16,
          padding: 32,
          maxWidth: 480,
          width: '100%',
          border: '1px solid var(--pearl-bush)',
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
            className="dash-btn"
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

// Cupper mini — compact <img> for inline use (used by older pages).
export function CupperMini({ size = 64 }) {
  const height = Math.round(size * (1108 / 944));
  return (
    <img
      src="/assets/cupper-ai.png"
      alt="Cupper"
      width={size}
      height={height}
      style={{ display: 'block', background: 'transparent', objectFit: 'contain' }}
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
