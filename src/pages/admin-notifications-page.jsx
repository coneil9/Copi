// ═════════════════════════════════════════════════════════
// NOTIFICATIONS SETTINGS PAGE — Toggle which events email the owner.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { AdminShell } from './admin-shell.jsx';

const PREFS = [
  { key: 'newEmployee',  title: 'New employee joined',     description: 'Whenever someone accepts your invite and finishes account setup.' },
  { key: 'lessonDone',   title: 'Lesson completed',        description: 'A summary every time a teammate finishes a lesson or final test.' },
  { key: 'atRisk',       title: 'Team member at risk',     description: 'Alert when a barista drops below 35% completion or stops engaging for a week.' },
  { key: 'weeklyDigest', title: 'Weekly digest email',     description: 'A Monday-morning roll-up with progress, gaps, and what to do this week.' }
];

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-pressed={on}
      style={{
        width: 46,
        height: 26,
        borderRadius: 999,
        background: on ? 'var(--glade-green-deep)' : 'var(--heathered-gray)',
        border: 'none',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 160ms'
      }}
    >
      <span style={{
        position: 'absolute',
        top: 3,
        left: on ? 22 : 3,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: 'var(--white)',
        boxShadow: '0 1px 3px rgba(31, 26, 20, 0.2)',
        transition: 'left 160ms'
      }} />
    </button>
  );
}

function AdminNotificationsPage({ user = {} }) {
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const cafe  = store?.getDefaultCafe ? store.getDefaultCafe() : null;

  const [prefs, setPrefs] = React.useState({
    newEmployee:  true,
    lessonDone:   false,
    atRisk:       true,
    weeklyDigest: true
  });
  const [confirmation, setConfirmation] = React.useState(null);

  const subnav = [
    { label: 'Profile',          route: 'admin-profile-page',       active: false },
    { label: 'Set up (Copi AI)', route: 'admin-setup-copi',         active: false },
    { label: 'Notifications',    route: 'admin-notifications-page', active: true  }
  ];

  const togglePref = (key, value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setConfirmation(`${PREFS.find(p => p.key === key).title} ${value ? 'on' : 'off'}.`);
    setTimeout(() => setConfirmation(null), 1800);
  };

  return (
    <AdminShell current="settings" subnav={subnav} user={user} cafe={cafe}>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--glade-green-deep)',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        marginBottom: 10
      }}>
        OWNER · NOTIFICATIONS
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 48,
        color: 'var(--graphite)',
        margin: '0 0 12px 0',
        letterSpacing: '-0.01em'
      }}>
        Notifications
      </h1>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        color: 'var(--roman-coffee)',
        margin: '0 0 28px 0',
        maxWidth: 600
      }}>
        Pick which events Copi should email you about. Daily-bar noise stays
        off by default — only the things you actually need to act on.
      </p>

      <section style={{
        background: 'var(--alabaster)',
        border: '1px solid var(--heathered-gray)',
        borderRadius: 14,
        overflow: 'hidden',
        maxWidth: 760
      }}>
        {PREFS.map((p, i) => (
          <div
            key={p.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              gap: 24,
              borderBottom: i === PREFS.length - 1 ? 'none' : '1px solid rgba(181, 163, 139, 0.4)'
            }}
          >
            <div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--graphite)',
                marginBottom: 4
              }}>
                {p.title}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--roman-coffee)',
                lineHeight: 1.5
              }}>
                {p.description}
              </div>
            </div>
            <Toggle on={prefs[p.key]} onChange={(v) => togglePref(p.key, v)} />
          </div>
        ))}
      </section>

      {confirmation && (
        <div style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--glade-green-deep)',
          color: 'var(--alabaster)',
          padding: '10px 18px',
          borderRadius: 999,
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 500,
          boxShadow: '0 8px 24px rgba(31, 26, 20, 0.24)',
          zIndex: 300
        }}>
          {confirmation}
        </div>
      )}
    </AdminShell>
  );
}

if (typeof window !== 'undefined') {
  window.AdminNotificationsPage = AdminNotificationsPage;
}

export default AdminNotificationsPage;
