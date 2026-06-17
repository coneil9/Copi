import React from 'react';
import './admin-nav.jsx';

function AdminSettingsNew({ user = {} }) {
  const th = window.THEME      || {};
  const ty = window.TYPOGRAPHY || {};
  const sh = window.SHADOW     || {};
  const act = window.CopiActions || {};

  const store = window.CopiStore;
  const [, rerender] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => store.subscribe(rerender), []);

  const AdminNav = window.AdminNav;
  const cafe = store.getDefaultCafe ? store.getDefaultCafe() : null;
  const cafeId = cafe?.id;
  const locations = store.getLocations ? store.getLocations(cafeId) : [];

  const displayName = user?.name || cafe?.ownerName || 'Owner';
  const email       = user?.email || 'admin@milano.coffee';
  const cafeName    = cafe?.name || 'Milano';

  // Form state
  const [fullName, setFullName]         = React.useState(displayName);
  const [workEmail, setWorkEmail]       = React.useState(email);
  const [cafeNameVal, setCafeNameVal]   = React.useState(cafeName);
  const [timezone, setTimezone]         = React.useState('America/New_York');
  const [language, setLanguage]         = React.useState('en');
  const [saved, setSaved]               = React.useState(null); // null | 'profile' | 'cafe' | 'notifications' | 'security'
  const [toast, setToast]               = React.useState(null);

  const [notifications, setNotifications] = React.useState({
    signoff:   true,
    weekly:    true,
    joins:     true,
    milestones: true,
    product:   false,
  });

  const [currentPassword, setCurrentPassword]   = React.useState('');
  const [newPassword, setNewPassword]           = React.useState('');
  const [confirmPassword, setConfirmPassword]   = React.useState('');
  const [passwordError, setPasswordError]       = React.useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const handleSaveProfile = () => {
    showToast('Profile updated.');
    setSaved('profile');
    setTimeout(() => setSaved(null), 2000);
  };

  const handleSaveCafe = () => {
    if (cafe && store.updateCafe) {
      store.updateCafe(cafeId, { name: cafeNameVal });
    }
    showToast('Cafe settings saved.');
    setSaved('cafe');
    setTimeout(() => setSaved(null), 2000);
  };

  const handleSaveNotifications = () => {
    showToast('Notification preferences saved.');
    setSaved('notifications');
    setTimeout(() => setSaved(null), 2000);
  };

  const handleChangePassword = () => {
    setPasswordError('');
    if (!currentPassword) { setPasswordError('Enter your current password.'); return; }
    if (newPassword.length < 8) { setPasswordError('New password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return; }
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    showToast('Password updated successfully.');
  };

  const inputStyle = {
    fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 400,
    width: '100%', padding: '10px 14px',
    background: th.bgCard, color: th.ink,
    border: `1.5px solid ${th.line}`, borderRadius: th.input,
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 140ms',
  };

  const Toggle = ({ on, onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: 44, height: 24, flexShrink: 0,
        background: on ? th.accent : th.bgInset,
        border: `1.5px solid ${on ? th.accent : th.line}`,
        borderRadius: 999, position: 'relative',
        cursor: 'pointer', padding: 0,
        transition: 'all 160ms ease',
      }}
      aria-pressed={on}
    >
      <span style={{
        position: 'absolute', top: 3, bottom: 3,
        left: on ? 'calc(100% - 21px)' : 3, width: 16, height: 16,
        background: on ? th.onDark : th.muted,
        borderRadius: 999,
        transition: 'left 180ms cubic-bezier(.2,.7,.2,1)',
      }} />
    </button>
  );

  const Card = ({ children, style = {} }) => (
    <div style={{
      background: th.bgCard, borderRadius: th.card,
      border: `1px solid ${th.line}`, padding: '24px 28px',
      boxShadow: sh.card, ...style,
    }}>
      {children}
    </div>
  );

  const SectionHeader = ({ eyebrow, title }) => (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: th.accent, margin: '0 0 4px' }}>{eyebrow}</p>
      <h2 style={{ fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif', fontSize: 24, fontWeight: 400, color: th.ink, margin: 0 }}>{title}</h2>
    </div>
  );

  const FieldLabel = ({ children }) => (
    <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: th.muted, margin: '0 0 6px' }}>{children}</p>
  );

  const SaveButton = ({ section, onClick }) => (
    <button
      onClick={onClick}
      style={{
        fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500,
        padding: '9px 22px', borderRadius: 999,
        background: saved === section ? th.success || th.accent : th.accent,
        border: 'none', color: th.onDark, cursor: 'pointer',
        transition: 'background 200ms',
      }}
    >
      {saved === section ? '✓ Saved' : 'Save changes'}
    </button>
  );

  const notifRows = [
    { key: 'signoff',    label: 'Milestone sign-off requests',  desc: 'When a barista submits a task for manager approval.' },
    { key: 'weekly',     label: 'Weekly progress digest',       desc: 'Every Monday: lessons completed, certifications earned.' },
    { key: 'joins',      label: 'New staff joins',              desc: 'When someone accepts an invite and creates their account.' },
    { key: 'milestones', label: 'Milestone completions',        desc: 'When a manager approves an onboarding milestone.' },
    { key: 'product',    label: 'Copi product updates',         desc: 'Occasional notes on new features and improvements.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: th.bg, color: th.ink }}>
      {AdminNav && <AdminNav current="settings" user={user} cafe={cafe} />}

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 28px 80px' }}>
        {/* Page header */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: th.accent, margin: '0 0 4px' }}>Owner · Settings</p>
          <h1 style={{ fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif', fontSize: 38, fontWeight: 400, color: th.ink, margin: 0 }}>Account settings</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── Profile ── */}
          <Card>
            <SectionHeader eyebrow="Personal" title="Your profile" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <FieldLabel>Full name</FieldLabel>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} placeholder="Your full name" />
              </div>
              <div>
                <FieldLabel>Email address</FieldLabel>
                <input value={workEmail} onChange={(e) => setWorkEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" type="email" />
              </div>
              <div>
                <FieldLabel>Role</FieldLabel>
                <input value={user?.role || 'Owner'} readOnly style={{ ...inputStyle, opacity: 0.6, cursor: 'default' }} />
              </div>
              <div>
                <FieldLabel>Timezone</FieldLabel>
                <select value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="America/New_York">Eastern (ET)</option>
                  <option value="America/Chicago">Central (CT)</option>
                  <option value="America/Denver">Mountain (MT)</option>
                  <option value="America/Los_Angeles">Pacific (PT)</option>
                  <option value="America/Vancouver">Pacific · Vancouver</option>
                  <option value="America/Toronto">Eastern · Toronto</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SaveButton section="profile" onClick={handleSaveProfile} />
            </div>
          </Card>

          {/* ── Cafe settings ── */}
          <Card>
            <SectionHeader eyebrow="Workspace" title="Cafe settings" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <FieldLabel>Cafe name</FieldLabel>
                <input value={cafeNameVal} onChange={(e) => setCafeNameVal(e.target.value)} style={inputStyle} placeholder="Your cafe name" />
              </div>
              <div>
                <FieldLabel>Language</FieldLabel>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>

            {/* Locations list */}
            {locations.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <FieldLabel>Locations ({locations.length})</FieldLabel>
                <div style={{ borderRadius: th.card, border: `1px solid ${th.line}`, overflow: 'hidden' }}>
                  {locations.map((loc, i) => (
                    <div key={loc.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderBottom: i < locations.length - 1 ? `1px solid ${th.line}` : 'none',
                      background: th.bgCard,
                    }}>
                      <div>
                        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 500, color: th.ink, margin: 0 }}>{loc.name}</p>
                        {loc.address && <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: th.muted, margin: '2px 0 0' }}>{loc.address}</p>}
                      </div>
                      <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 600, color: th.accent, background: `${th.accent}14`, padding: '3px 10px', borderRadius: 999 }}>Active</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: th.muted, margin: '8px 0 0' }}>
                  To add or remove locations, contact <span style={{ color: th.accent }}>support@copi.app</span>.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SaveButton section="cafe" onClick={handleSaveCafe} />
            </div>
          </Card>

          {/* ── Notifications ── */}
          <Card>
            <SectionHeader eyebrow="Preferences" title="Email notifications" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: th.card, border: `1px solid ${th.line}`, overflow: 'hidden', marginBottom: 20 }}>
              {notifRows.map((row, i) => (
                <div key={row.key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', gap: 16,
                  background: th.bgCard,
                  borderBottom: i < notifRows.length - 1 ? `1px solid ${th.line}` : 'none',
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 500, color: th.ink, margin: 0 }}>{row.label}</p>
                    <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: th.muted, margin: '2px 0 0' }}>{row.desc}</p>
                  </div>
                  <Toggle
                    on={notifications[row.key]}
                    onClick={() => setNotifications((prev) => ({ ...prev, [row.key]: !prev[row.key] }))}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SaveButton section="notifications" onClick={handleSaveNotifications} />
            </div>
          </Card>

          {/* ── Security ── */}
          <Card>
            <SectionHeader eyebrow="Security" title="Change password" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420, marginBottom: 20 }}>
              <div>
                <FieldLabel>Current password</FieldLabel>
                <input
                  type="password" value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={inputStyle} placeholder="••••••••"
                />
              </div>
              <div>
                <FieldLabel>New password</FieldLabel>
                <input
                  type="password" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={inputStyle} placeholder="At least 8 characters"
                />
              </div>
              <div>
                <FieldLabel>Confirm new password</FieldLabel>
                <input
                  type="password" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle} placeholder="Repeat new password"
                />
              </div>
              {passwordError && (
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: th.danger, margin: 0 }}>{passwordError}</p>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button
                onClick={handleChangePassword}
                style={{
                  fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 500,
                  padding: '9px 22px', borderRadius: 999,
                  background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer',
                }}
              >
                Update password
              </button>
            </div>
          </Card>

          {/* ── Danger zone ── */}
          <Card style={{ borderColor: `${th.danger}44` }}>
            <SectionHeader eyebrow="Danger zone" title="Account actions" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: 10,
                background: `${th.danger}08`, border: `1px solid ${th.danger}22`,
              }}>
                <div>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 500, color: th.ink, margin: 0 }}>Export all data</p>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: th.muted, margin: '2px 0 0' }}>Download a CSV of all staff progress and onboarding records.</p>
                </div>
                <button
                  onClick={() => showToast('Data export started. You will receive an email shortly.')}
                  style={{
                    fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500,
                    padding: '7px 16px', borderRadius: 999, flexShrink: 0,
                    background: th.bgCard, border: `1px solid ${th.line}`,
                    color: th.ink, cursor: 'pointer',
                  }}
                >
                  Export
                </button>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: 10,
                background: `${th.danger}08`, border: `1px solid ${th.danger}22`,
              }}>
                <div>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 500, color: th.danger, margin: 0 }}>Cancel subscription</p>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: th.muted, margin: '2px 0 0' }}>Your account and all data will be deactivated at the end of the billing period.</p>
                </div>
                <button
                  onClick={() => act.navigate && act.navigate('billing')}
                  style={{
                    fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 500,
                    padding: '7px 16px', borderRadius: 999, flexShrink: 0,
                    background: `${th.danger}12`, border: `1px solid ${th.danger}44`,
                    color: th.danger, cursor: 'pointer',
                  }}
                >
                  Manage billing →
                </button>
              </div>
            </div>
          </Card>

        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, background: th.ink, color: th.onDark,
          padding: '12px 20px', borderRadius: 999,
          fontFamily: '"Inter", sans-serif', fontSize: 13,
          maxWidth: 400, boxShadow: sh.modal || sh.card,
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}

window.AdminSettingsNew = AdminSettingsNew;
