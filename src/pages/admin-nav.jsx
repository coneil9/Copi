// Shared admin nav used by all owner/admin pages.
// Matches the THEME design system exactly.
import React from 'react';

export function AdminNav({ current, user, cafe }) {
  const th  = window.THEME      || {};
  const ty  = window.TYPOGRAPHY || {};
  const act = window.CopiActions || {};

  const cafeName = cafe?.name || user?.cafe || 'Milano';
  const displayName = user?.name || 'Owner';

  const links = [
    { label: 'Dashboard',  route: 'dashboard' },
    { label: 'Team',       route: 'team' },
    { label: 'Curriculum', route: 'admin-curriculum' },
    { label: 'Analytics',  route: 'analytics' },
    { label: 'Billing',    route: 'billing' },
    { label: 'Settings',   route: 'settings' },
  ];

  const Mono = ({ name: n, size = 34 }) => {
    const initials = (n || 'O').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', background: th.accent, color: th.onDark, display: 'grid', placeItems: 'center', fontFamily: '"Inter", sans-serif', fontSize: size * 0.37, fontWeight: 700, flexShrink: 0 }}>
        {initials}
      </div>
    );
  };

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: th.bgCard, borderBottom: `1px solid ${th.line}`, boxShadow: `0 1px 4px rgba(31,27,20,0.06)` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', height: 58, gap: 0 }}>
        {/* Logo + cafe */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 36, flexShrink: 0 }}>
          <span onClick={() => act.navigate && act.navigate('dashboard')}
            style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontStyle: 'italic', fontSize: 24, color: th.accent, cursor: 'pointer', lineHeight: 1 }}>
            Copi.
          </span>
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 500, color: th.muted, background: th.bgInset, padding: '2px 8px', borderRadius: 999 }}>
            {cafeName}
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 2, flex: 1 }}>
          {links.map(({ label, route }) => {
            const active = current === route;
            return (
              <button
                key={route}
                onClick={() => act.navigate && act.navigate(route)}
                style={{
                  background: active ? th.bgInset : 'none',
                  border: 'none', cursor: 'pointer',
                  padding: '6px 13px', borderRadius: 8,
                  fontFamily: '"Inter", sans-serif', fontSize: 13.5,
                  color: active ? th.accent : th.muted,
                  fontWeight: active ? 600 : 400,
                  transition: 'all 140ms',
                }}
              >{label}</button>
            );
          })}
        </div>

        {/* Right: user + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: th.muted }}>{displayName}</span>
          <button
            data-app-action="logout"
            style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500, padding: '5px 13px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.muted, cursor: 'pointer' }}>
            Log out
          </button>
          <Mono name={displayName} size={34} />
        </div>
      </div>
    </nav>
  );
}

window.AdminNav = AdminNav;
