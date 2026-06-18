// ═════════════════════════════════════════════════════════
// PROFILE SETTINGS PAGE — Owner can update name, email, cafe name, role.
// Restyled to match the new design system: Playpen Sans headings,
// Hanken Grotesk body, palette tokens only.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { AdminShell } from './admin-shell.jsx';

const ROLES = ['Owner', 'Admin', 'Manager'];

function Field({ label, hint, children }) {
  return (
    <label style={{
      display: 'grid',
      gridTemplateColumns: '200px 1fr',
      alignItems: 'flex-start',
      gap: 20
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--graphite)',
          paddingTop: 10
        }}>{label}</div>
        {hint && (
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: 'var(--roman-coffee)',
            marginTop: 2
          }}>{hint}</div>
        )}
      </div>
      <div>{children}</div>
    </label>
  );
}

const inputStyle = {
  width: '100%',
  maxWidth: 460,
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid var(--heathered-gray)',
  background: 'var(--white)',
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  color: 'var(--graphite)',
  outline: 'none'
};

function AdminProfilePage({ user = {} }) {
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const cafe  = store?.getDefaultCafe ? store.getDefaultCafe() : null;

  const [name,     setName]     = React.useState(user?.name || 'Brian Turko');
  const [email,    setEmail]    = React.useState(user?.email || 'brian@milano.coffee');
  const [cafeName, setCafeName] = React.useState(cafe?.name || 'Milano');
  const [role,     setRole]     = React.useState('Owner');
  const [confirmation, setConfirmation] = React.useState(null);

  const subnav = [
    { label: 'Profile',          route: 'admin-profile-page',       active: true  },
    { label: 'Set up (Copi AI)', route: 'admin-setup-copi',         active: false },
    { label: 'Notifications',    route: 'admin-notifications-page', active: false }
  ];

  const save = (e) => {
    e.preventDefault();
    setConfirmation('Profile saved.');
    setTimeout(() => setConfirmation(null), 2400);
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
        OWNER · PROFILE
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 48,
        color: 'var(--graphite)',
        margin: '0 0 28px 0',
        letterSpacing: '-0.01em'
      }}>
        Your profile
      </h1>

      <form
        onSubmit={save}
        style={{
          background: 'var(--alabaster)',
          border: '1px solid var(--heathered-gray)',
          borderRadius: 14,
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          maxWidth: 760
        }}
      >
        <Field label="Name" hint="Shown across the dashboard">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </Field>

        <Field label="Email" hint="Used for login + invite replies">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </Field>

        <Field label="Cafe name" hint="Shown on the sidebar avatar">
          <input
            value={cafeName}
            onChange={(e) => setCafeName(e.target.value)}
            style={inputStyle}
          />
        </Field>

        <Field label="Role" hint="Controls what you can edit in Copi">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ ...inputStyle, maxWidth: 280 }}
          >
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>

        <div style={{
          paddingTop: 8,
          borderTop: '1px dashed var(--heathered-gray)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          justifyContent: 'flex-end'
        }}>
          {confirmation && (
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--glade-green-deep)',
              fontWeight: 600
            }}>
              ✓ {confirmation}
            </span>
          )}
          <button
            type="submit"
            style={{
              padding: '11px 22px',
              borderRadius: 999,
              background: 'var(--glade-green-deep)',
              color: 'var(--white)',
              border: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Save changes
          </button>
        </div>
      </form>
    </AdminShell>
  );
}

if (typeof window !== 'undefined') {
  window.AdminProfilePage = AdminProfilePage;
}

export default AdminProfilePage;
