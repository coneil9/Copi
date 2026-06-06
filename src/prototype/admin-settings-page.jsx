// ═════════════════════════════════════════════════════════
// ADMIN SETTINGS PAGE — simple account settings for the roaster
// Profile, password, notifications, workspace — kept deliberately
// light. Matches the dashboard nav + almanac section styling.
// ═════════════════════════════════════════════════════════

function AdminSettingsPage({ user = {} }) {
  const p = {
    bg: '#E8DDC2',
    fg: '#1A1410',
    accent: '#3F5A3A',
    cream: '#F4EBD2',
    sun: '#C68A3D',
    cherry: '#7A2B1F',
  };
  const display = { fontFamily: 'Unna' };
  const sub     = { fontFamily: 'Yrsa' };
  const sans    = { fontFamily: 'Lato' };
  const lbl     = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };

  const name = user.name || 'Brian Turko';
  const cafe = user.cafe || 'Milano';
  const role = user.role || 'Roaster · Admin';
  const email = user.email || 'admin@milano.coffee';

  // ── Local form state ───────────────────────────────────────
  const [fullName, setFullName] = React.useState(name);
  const [workEmail, setWorkEmail] = React.useState(email);
  const [cafeName, setCafeName] = React.useState(cafe);
  const [saved, setSaved] = React.useState(false);

  const [notes, setNotes] = React.useState({
    signoff: true,
    weekly: true,
    joins: true,
    product: false,
  });

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  // ── Initials monogram ──────────────────────────────────────
  const Mono = ({ name: n, size = 26, bg = p.accent, color = p.cream }) => {
    const initials = n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: bg, color,
        border: `1px solid ${p.fg}`,
        display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.36, fontWeight: 700, letterSpacing: '0.04em',
        flex: '0 0 auto',
      }}>{initials}</div>
    );
  };

  // ── Reusable bits ──────────────────────────────────────────
  const inputStyle = {
    ...sans, fontSize: 16, fontWeight: 400,
    width: '100%', padding: '12px 14px',
    background: p.bg, color: p.fg,
    border: `1.5px solid ${p.fg}`, borderRadius: 0,
    outline: 'none',
  };

  const Field = ({ label, children }) => (
    <label style={{ display: 'block' }}>
      <div style={{ ...lbl, marginBottom: 8 }}>{label}</div>
      {children}
    </label>
  );

  const Input = (props) => <input {...props} style={inputStyle} />;

  // Square almanac-style toggle
  const Toggle = ({ on, onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: 52, height: 28, flex: '0 0 auto',
        background: on ? p.accent : 'transparent',
        border: `1.5px solid ${p.fg}`,
        position: 'relative', cursor: 'pointer', padding: 0,
        transition: 'background 160ms ease',
      }}
      aria-pressed={on}
    >
      <span style={{
        position: 'absolute', top: 2, bottom: 2,
        left: on ? 26 : 2, width: 20,
        background: on ? p.cream : p.fg,
        transition: 'left 180ms cubic-bezier(.2,.7,.2,1), background 160ms ease',
      }} />
    </button>
  );

  // Section row — left label column, right content
  const Section = ({ kicker, title, desc, children, first }) => (
    <div style={{
      display: 'grid', gridTemplateColumns: '320px 1fr', gap: 56,
      padding: '48px 48px',
      borderTop: first ? 'none' : `1px dashed ${p.fg}30`,
    }}>
      <div>
        <div style={{ ...lbl, color: p.accent, marginBottom: 14 }}>{kicker}</div>
        <h2 style={{ ...display, fontSize: 38, lineHeight: 1.0, letterSpacing: '-0.02em', fontWeight: 400, margin: 0 }}>
          {title}
        </h2>
        {desc && (
          <p style={{ ...sub, fontSize: 17, lineHeight: 1.4, opacity: 0.7, marginTop: 12, fontWeight: 400, maxWidth: 240 }}>
            {desc}
          </p>
        )}
      </div>
      <div style={{ maxWidth: 640 }}>{children}</div>
    </div>
  );

  const noteRows = [
    { key: 'signoff', label: 'Sign-off requests', desc: 'When a barista submits a drill for your review.' },
    { key: 'weekly',  label: 'Weekly summary',    desc: 'A Monday digest of what your team learned.' },
    { key: 'joins',   label: 'New barista joins', desc: 'When someone accepts an invite to the workspace.' },
    { key: 'product', label: 'Product updates',   desc: 'Occasional notes on new Copi features.' },
  ];

  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg, position: 'relative' }}>

      {/* ── TOP NAV (matches dashboard) ─────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'center',
        padding: '20px 48px', borderBottom: `1.5px solid ${p.fg}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ ...display, fontStyle: 'italic', fontSize: 44, lineHeight: 1 }}>Copi</span>
          <span style={{ ...lbl, opacity: 0.55, paddingLeft: 14, borderLeft: `1px solid ${p.fg}40`, alignSelf: 'center' }}>
            FOR ROASTERIES · {cafe.toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', ...sans, fontSize: 13 }}>
          {[
            { l: 'Dashboard',  active: false },
            { l: 'Team',       active: false },
            { l: 'Curriculum', active: false },
            { l: 'Analytics',  active: false },
            { l: 'Settings',   active: true  },
          ].map((x) => (
            <a key={x.l} data-app-nav={x.l} style={{
              opacity: x.active ? 1 : 0.7,
              fontWeight: x.active ? 700 : 400,
              borderBottom: x.active ? `1.5px solid ${p.fg}` : 'none',
              paddingBottom: 2, cursor: 'pointer',
            }}>{x.l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button data-app-action="notifications" style={{ position: 'relative', padding: 4, background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="1.8">
              <path d="M6 8a6 6 0 1 1 12 0c0 4 2 5 2 7H4c0-2 2-3 2-7Z" />
              <path d="M10 19a2 2 0 0 0 4 0" />
            </svg>
            <span style={{
              position: 'absolute', top: 2, right: 2,
              width: 7, height: 7, borderRadius: 99, background: p.cherry,
              border: `1.5px solid ${p.bg}`,
            }} />
          </button>
          <button data-app-action="invite" style={{
            ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'transparent', color: p.fg,
            padding: '10px 14px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
          }}>
            + Invite barista
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px 4px 4px', border: `1.5px solid ${p.fg}`, cursor: 'pointer' }}>
            <Mono name={name} size={28} />
            <div style={{ ...sans, fontSize: 12, lineHeight: 1.2 }}>
              <div style={{ fontWeight: 700 }}>{name}</div>
              <div style={{ opacity: 0.6, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PAGE HEADING ────────────────────────────────────────── */}
      <div style={{ padding: '64px 48px 40px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>◆ ACCOUNT · SETTINGS</div>
        <h1 style={{ ...display, fontSize: 92, lineHeight: 0.95, letterSpacing: '-0.035em', fontWeight: 400, margin: 0 }}>
          Settings.
        </h1>
        <p style={{ ...sub, fontSize: 22, lineHeight: 1.4, opacity: 0.75, marginTop: 16, fontWeight: 400, maxWidth: 560 }}>
          Your account, your sign-in, and what Copi emails you about.
        </p>
      </div>

      {/* ── SECTIONS ────────────────────────────────────────────── */}

      {/* Profile */}
      <Section first kicker="◆ PROFILE" title="Who you are." desc="Shown to your team across the workspace.">
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
          <Mono name={fullName} size={64} />
          <div>
            <button style={{
              ...sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'transparent', color: p.fg,
              padding: '10px 16px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
            }}>Change photo</button>
            <div style={{ ...sans, fontSize: 12, opacity: 0.55, marginTop: 8 }}>JPG or PNG · up to 2MB</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Field label="FULL NAME">
            <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Field>
          <Field label="ROLE">
            <div style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed', display: 'flex', alignItems: 'center' }}>
              {role}
            </div>
          </Field>
        </div>
      </Section>

      {/* Sign-in */}
      <Section kicker="◆ SIGN-IN" title="Email & password." desc="Used to log in and to send you alerts.">
        <div style={{ display: 'grid', gap: 20 }}>
          <Field label="WORK EMAIL">
            <Input type="email" value={workEmail} onChange={(e) => setWorkEmail(e.target.value)} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Field label="NEW PASSWORD">
              <Input type="password" placeholder="••••••••" />
            </Field>
            <Field label="CONFIRM PASSWORD">
              <Input type="password" placeholder="••••••••" />
            </Field>
          </div>
          <div style={{ ...sans, fontSize: 12, opacity: 0.55 }}>
            Leave password fields blank to keep your current one.
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section kicker="◆ NOTIFICATIONS" title="What we email you." desc="Turn off anything you don't want landing in your inbox.">
        <div style={{ border: `1.5px solid ${p.fg}` }}>
          {noteRows.map((row, i) => (
            <div key={row.key} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
              padding: '20px 22px',
              borderBottom: i < noteRows.length - 1 ? `1px dashed ${p.fg}30` : 'none',
              background: i % 2 ? 'transparent' : `${p.cream}80`,
            }}>
              <div>
                <div style={{ ...sub, fontSize: 19, fontWeight: 500, lineHeight: 1.1 }}>{row.label}</div>
                <div style={{ ...sans, fontSize: 13, opacity: 0.6, marginTop: 4 }}>{row.desc}</div>
              </div>
              <Toggle on={notes[row.key]} onClick={() => setNotes({ ...notes, [row.key]: !notes[row.key] })} />
            </div>
          ))}
        </div>
      </Section>

      {/* Workspace */}
      <Section kicker="◆ WORKSPACE" title="Your café." desc="The name baristas see on their app.">
        <Field label="CAFÉ OR ROASTERY NAME">
          <Input type="text" value={cafeName} onChange={(e) => setCafeName(e.target.value)} />
        </Field>
      </Section>

      {/* ── SAVE BAR ────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        padding: '28px 48px', borderTop: `1.5px solid ${p.fg}`, background: p.cream,
        position: 'sticky', bottom: 0,
      }}>
        <button
          data-app-action="logout"
          style={{
            ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
            background: 'transparent', color: p.cherry,
            padding: '12px 18px', border: `1.5px solid ${p.cherry}`, cursor: 'pointer',
          }}
        >
          Sign out
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {saved && (
            <span style={{ ...lbl, color: p.accent }}>◆ Saved</span>
          )}
          <button
            onClick={flashSaved}
            style={{
              ...sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              background: p.accent, color: p.cream,
              padding: '14px 28px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
            }}
          >
            Save changes
          </button>
        </div>
      </div>

    </div>
  );
}

Object.assign(window, { AdminSettingsPage });
