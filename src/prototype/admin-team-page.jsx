// ═════════════════════════════════════════════════════════
// ADMIN TEAM PAGE — Manage your team, invite new teammates
// Updated with new design system: Warm cream · Forest green
// ═════════════════════════════════════════════════════════

function AdminTeamPage({ user = {} }) {
  // Import new design system from window
  const NEW_PAL = window.NEW_PALETTE || {};

  const p = {
    bg: NEW_PAL.bg || '#F0EDE4',           // Warm cream
    fg: NEW_PAL.textPrimary || '#1C1C1A', // Dark text
    accent: NEW_PAL.accent || '#4A7C59',  // Forest green
    cream: NEW_PAL.bgCard || '#FFFFFF',   // Card white
    sun: NEW_PAL.progress || '#C8A96E',   // Gold
    cherry: '#7A2B1F',                     // Error red
  };
  const display = { fontFamily: '"DM Serif Display", Georgia, serif' };
  const sub     = { fontFamily: '"Inter", sans-serif' };
  const sans    = { fontFamily: '"Inter", sans-serif' };
  const lbl     = { fontFamily: '"Inter", sans-serif', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 11 };
  const mono    = { fontFamily: '"Inter", sans-serif', fontVariantNumeric: 'tabular-nums' };

  const name = user.name || 'Brian Turko';
  const cafe = user.cafe || 'Milano';
  const role = user.role || 'Roaster · Admin';

  // ── Starter team — canonical roster from the store ────────
  const SEED_TEAM = (window.CopiStore ? window.CopiStore.teamSnapshot() : []).map((t) => ({
    name: t.name, email: t.email, role: t.role, cert: t.cert, joined: t.joined,
  }));

  const [team, setTeam]   = React.useState(SEED_TEAM);
  const [open, setOpen]   = React.useState(false);
  const [form, setForm]   = React.useState({ name: '', email: '', role: 'Barista' });
  const [sent, setSent]   = React.useState(null); // {name, email} after successful send

  // Initials monogram
  const Mono = ({ name: n, size = 32, bg = p.accent, color = p.cream }) => {
    const initials = n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: bg, color,
        border: `1px solid ${p.fg}`,
        display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.36, fontWeight: 700,
        letterSpacing: '0.04em', flex: '0 0 auto',
      }}>{initials}</div>
    );
  };

  // ── Form validation
  const valid =
    form.name.trim().length > 1 &&
    /.+@.+\..+/.test(form.email.trim()) &&
    !team.some(t => t.email.toLowerCase() === form.email.trim().toLowerCase());

  // ── Send invite — adds to roster + opens user's mail client with a prefilled draft
  const sendInvite = () => {
    if (!valid) return;
    const cleanName  = form.name.trim();
    const cleanEmail = form.email.trim();
    const newMate = {
      name: cleanName, email: cleanEmail,
      role: form.role, cert: '—',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      pending: true,
    };
    setTeam([...team, newMate]);

    // Compose the invite email (mailto:) — opens the admin's mail client
    const subject = encodeURIComponent(`Welcome to ${cafe} on Copi`);
    const body = encodeURIComponent(
      `Hi ${cleanName.split(' ')[0]},\n\n` +
      `${name} has invited you to join ${cafe}'s coffee training on Copi.\n\n` +
      `Set up your account and start your first lesson here:\n` +
      `https://copi.coffee/join?cafe=${encodeURIComponent(cafe)}&email=${encodeURIComponent(cleanEmail)}\n\n` +
      `Looking forward to having you on the bar.\n\n` +
      `— ${name}\n${cafe}`
    );
    window.location.href = `mailto:${cleanEmail}?subject=${subject}&body=${body}`;

    setSent({ name: cleanName, email: cleanEmail });
    setForm({ name: '', email: '', role: 'Barista' });
    setTimeout(() => { setOpen(false); setSent(null); }, 2400);
  };

  // ── Reusable input style
  const inputStyle = {
    width: '100%',
    background: p.bg,
    border: `1.5px solid ${p.fg}`,
    padding: '14px 16px',
    ...sub, fontSize: 18, color: p.fg,
    outline: 'none',
    boxSizing: 'border-box',
  };

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
            { l: 'Team',       active: true  },
            { l: 'Curriculum', active: false },
            { l: 'Analytics',  active: false },
            { l: 'Settings',   active: false },
          ].map(x => (
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
          <button
            onClick={() => setOpen(true)}
            style={{
              ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
              background: 'transparent', color: p.fg,
              padding: '10px 14px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
            }}
          >
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

      {/* ── HEADING ─────────────────────────────────────────────── */}
      <div style={{ padding: '64px 48px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>◆ YOUR TEAM</div>
            <h1 style={{
              ...display, fontSize: 92, lineHeight: 0.95, letterSpacing: '-0.035em', fontWeight: 400, margin: 0,
            }}>
              The <em style={{ fontStyle: 'italic', color: p.accent }}>{team.length} people</em><br />
              behind the bar.
            </h1>
          </div>
          <button
            onClick={() => setOpen(true)}
            style={{
              ...sans, fontSize: 14, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
              background: p.fg, color: p.cream,
              padding: '18px 26px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            + Add teammate
          </button>
        </div>
      </div>

      {/* ── TEAM TABLE ──────────────────────────────────────────── */}
      <div style={{ padding: '0 48px 64px' }}>
        <div style={{ border: `1.5px solid ${p.fg}`, background: p.cream }}>

          {/* header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 1.4fr) 1fr 1fr 0.9fr 36px',
            gap: 16, padding: '14px 24px',
            borderBottom: `1.5px solid ${p.fg}`,
            ...lbl, opacity: 0.7, fontSize: 9,
          }}>
            <span>NAME</span>
            <span>EMAIL</span>
            <span>ROLE</span>
            <span>CERT</span>
            <span></span>
          </div>

          {team.map((t, i) => (
            <div key={t.email} style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(260px, 1.4fr) 1fr 1fr 0.9fr 36px',
              gap: 16, padding: '20px 24px',
              alignItems: 'center',
              borderBottom: i < team.length - 1 ? `1px dashed ${p.fg}25` : 'none',
              background: t.pending ? `${p.sun}12` : 'transparent',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Mono name={t.name} size={38} bg={t.pending ? p.sun : p.accent} color={t.pending ? p.fg : p.cream} />
                <div>
                  <div style={{ ...sub, fontSize: 19, fontWeight: 500, lineHeight: 1.15 }}>{t.name}</div>
                  <div style={{ ...lbl, opacity: 0.55, fontSize: 8.5, marginTop: 4 }}>
                    JOINED {t.joined.toUpperCase()}
                  </div>
                </div>
              </div>
              <div style={{ ...sans, fontSize: 13, opacity: 0.85, wordBreak: 'break-all' }}>{t.email}</div>
              <div style={{ ...sub, fontSize: 16 }}>{t.role}</div>
              <div>
                {t.pending ? (
                  <span style={{ ...lbl, fontSize: 9, color: p.sun, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 99, background: p.sun }} />
                    INVITE SENT
                  </span>
                ) : t.cert === '—' ? (
                  <span style={{ ...lbl, fontSize: 9, opacity: 0.45 }}>NOT YET</span>
                ) : (
                  <span style={{ ...lbl, fontSize: 9, color: p.accent }}>◆ {t.cert.toUpperCase()}</span>
                )}
              </div>
              <button
                onClick={() => window.CopiActions && window.CopiActions.openBarista(t.email)}
                aria-label={`Open ${t.name}'s profile`}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  ...sans, fontSize: 16, opacity: 0.5,
                  padding: 6,
                }}
              >→</button>
            </div>
          ))}
        </div>
      </div>

      {/* ── ADD TEAMMATE MODAL ─────────────────────────────────── */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); setSent(null); } }}
          style={{
            position: 'fixed', inset: 0, zIndex: 90,
            background: 'rgba(20, 16, 12, 0.55)',
            display: 'grid', placeItems: 'center',
            padding: 24,
          }}
        >
          <div style={{
            background: p.cream, border: `1.5px solid ${p.fg}`,
            width: '100%', maxWidth: 520,
            padding: '40px 44px 36px',
            position: 'relative',
          }}>
            {/* close */}
            <button
              onClick={() => { setOpen(false); setSent(null); }}
              aria-label="Close"
              style={{
                position: 'absolute', top: 14, right: 16,
                background: 'transparent', border: 'none', cursor: 'pointer',
                ...sans, fontSize: 18, opacity: 0.6, padding: 6,
              }}
            >✕</button>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '20px 8px' }}>
                <div style={{ ...lbl, color: p.accent, marginBottom: 14 }}>◆ INVITE SENT</div>
                <h2 style={{
                  ...display, fontSize: 48, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: 0,
                }}>
                  Off to <em style={{ fontStyle: 'italic', color: p.accent }}>{sent.name.split(' ')[0]}.</em>
                </h2>
                <p style={{ ...sub, fontSize: 17, lineHeight: 1.45, opacity: 0.75, marginTop: 18, fontWeight: 400 }}>
                  We opened your mail client with a draft to{' '}
                  <strong style={{ fontWeight: 600 }}>{sent.email}</strong>. They'll get a setup link once you hit send.
                </p>
              </div>
            ) : (
              <>
                <div style={{ ...lbl, color: p.accent, marginBottom: 12 }}>◆ ADD A TEAMMATE</div>
                <h2 style={{
                  ...display, fontSize: 44, lineHeight: 0.98, letterSpacing: '-0.025em', fontWeight: 400, margin: 0,
                }}>
                  Who's joining<br />
                  <em style={{ fontStyle: 'italic', color: p.accent }}>the bar?</em>
                </h2>

                <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <label style={{ display: 'block' }}>
                    <div style={{ ...lbl, marginBottom: 8 }}>FULL NAME</div>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Devi Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={inputStyle}
                    />
                  </label>

                  <label style={{ display: 'block' }}>
                    <div style={{ ...lbl, marginBottom: 8 }}>EMAIL</div>
                    <input
                      type="email"
                      placeholder="devi@milano.coffee"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={inputStyle}
                    />
                    {form.email && !/.+@.+\..+/.test(form.email.trim()) && (
                      <div style={{ ...lbl, color: p.cherry, fontSize: 9, marginTop: 6 }}>
                        ◆ DOESN'T LOOK LIKE AN EMAIL
                      </div>
                    )}
                    {form.email && team.some(t => t.email.toLowerCase() === form.email.trim().toLowerCase()) && (
                      <div style={{ ...lbl, color: p.cherry, fontSize: 9, marginTop: 6 }}>
                        ◆ ALREADY ON YOUR TEAM
                      </div>
                    )}
                  </label>

                  <label style={{ display: 'block' }}>
                    <div style={{ ...lbl, marginBottom: 8 }}>ROLE</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {['Barista', 'Lead barista', 'New hire'].map(r => (
                        <button
                          key={r}
                          onClick={() => setForm({ ...form, role: r })}
                          style={{
                            ...sub, fontSize: 15,
                            padding: '10px 14px',
                            background: form.role === r ? p.fg : 'transparent',
                            color: form.role === r ? p.cream : p.fg,
                            border: `1px solid ${p.fg}`,
                            cursor: 'pointer',
                          }}
                        >{r}</button>
                      ))}
                    </div>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
                  <button
                    onClick={() => { setOpen(false); setForm({ name: '', email: '', role: 'Barista' }); }}
                    style={{
                      flex: '0 0 auto',
                      ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                      background: 'transparent', color: p.fg,
                      padding: '14px 18px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
                    }}
                  >Cancel</button>
                  <button
                    onClick={sendInvite}
                    disabled={!valid}
                    style={{
                      flex: 1,
                      ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                      background: valid ? p.fg : `${p.fg}45`,
                      color: p.cream,
                      padding: '14px 18px', border: `1.5px solid ${valid ? p.fg : `${p.fg}45`}`,
                      cursor: valid ? 'pointer' : 'not-allowed',
                    }}
                  >Send invite →</button>
                </div>

                <div style={{ ...lbl, opacity: 0.45, fontSize: 8.5, marginTop: 18, textAlign: 'center' }}>
                  WE'LL OPEN YOUR MAIL CLIENT WITH A DRAFT YOU CAN REVIEW BEFORE SENDING
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { AdminTeamPage });
