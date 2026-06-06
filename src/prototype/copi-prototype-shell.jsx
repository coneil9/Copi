// ═════════════════════════════════════════════════════════
// COPI PROTOTYPE SHELL
// Wires up landing page + about/pricing/curriculum into a
// real navigable app, plus an interactive trial signup flow.
//
// Uses event delegation against the rendered page tree so the
// underlying page components stay untouched.
// ═════════════════════════════════════════════════════════

// Admin credentials — these always route to the roaster dashboard.
const PROTO_ADMIN = {
  email: 'admin@milano.coffee',
  password: 'copi2026',
  name: 'Brian Turko',
  cafe: 'Milano',
  role: 'Roaster · Admin',
};

// Barista credentials — route to the barista "Today" view.
// Maps to a real member of the canonical roster (copi-store.jsx)
// so assignments and progress line up across admin + barista.
const PROTO_BARISTA = {
  email: 'lili@milano.coffee',
  password: 'copi2026',
  name: 'Lili Turko',
  cafe: 'Milano',
  role: 'Barista',
};

const PROTO_PALETTE = {
  bg:     '#E8DDC2',
  fg:     '#1A1410',
  accent: '#3F5A3A',
  cream:  '#F4EBD2',
  sun:    '#C68A3D',
};

// Match the trio inside the page nav. We intercept clicks on these by
// reading textContent. Order matches the source page nav.
const NAV_LABELS = ['Curriculum', 'Pricing', 'About'];

// ────────────────────────────────────────────────────────────
// Trial signup — three-step modal
// ────────────────────────────────────────────────────────────
function TrialModal({ open, onClose }) {
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState({
    cafe: '', email: '', seats: 8, role: 'owner',
  });
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setStep(0);
      setClosing(false);
      setForm({ cafe: '', email: '', seats: 8, role: 'owner' });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open && !closing) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 220);
  };

  const p = PROTO_PALETTE;
  const display = { fontFamily: 'Unna' };
  const sub = { fontFamily: 'Yrsa' };
  const sans = { fontFamily: 'Lato' };
  const lbl = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };

  const valid = {
    0: form.cafe.trim().length > 1 && /.+@.+\..+/.test(form.email),
    1: form.seats >= 1 && !!form.role,
    2: true,
  }[step];

  const next = () => {
    if (!valid) return;
    if (step < 2) setStep(step + 1);
    else handleClose();
  };
  const back = () => { if (step > 0) setStep(step - 1); };

  const StepDot = ({ i }) => (
    <div style={{
      width: i === step ? 28 : 8, height: 8, borderRadius: 99,
      background: i <= step ? p.accent : `${p.fg}30`,
      transition: 'all 240ms cubic-bezier(.2,.7,.2,1)',
    }} />
  );

  const inputStyle = {
    ...sans, fontSize: 18, fontWeight: 400,
    width: '100%', padding: '14px 16px',
    background: p.bg, color: p.fg,
    border: `1.5px solid ${p.fg}`, borderRadius: 0,
    outline: 'none',
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(26,20,16,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'grid', placeItems: 'center',
        padding: 24,
        opacity: closing ? 0 : 1,
        transition: 'opacity 220ms ease',
      }}
    >
      <div style={{
        width: 'min(680px, 100%)',
        background: p.cream,
        border: `1.5px solid ${p.fg}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
        position: 'relative',
        transform: closing ? 'translateY(8px) scale(0.98)' : 'translateY(0) scale(1)',
        opacity: closing ? 0 : 1,
        transition: 'transform 220ms cubic-bezier(.2,.7,.2,1), opacity 220ms ease',
      }}>
        {/* Top metadata bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 24px', borderBottom: `1px solid ${p.fg}30`,
          ...lbl, opacity: 0.7,
        }}>
          <span>◆ COPI · TRIAL · STEP {step + 1} OF 3</span>
          <button
            onClick={handleClose}
            style={{ ...lbl, opacity: 0.7, color: p.fg, padding: 4, cursor: 'pointer' }}
            aria-label="Close"
          >
            ESC ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '48px 48px 36px', minHeight: 420 }}>
          {step === 0 && (
            <div>
              <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>I. YOUR CAFÉ</div>
              <h2 style={{ ...display, fontSize: 56, lineHeight: 0.96, letterSpacing: '-0.025em', marginBottom: 14 }}>
                Tell us where you <em style={{ fontStyle: 'italic', color: p.accent }}>pour.</em>
              </h2>
              <p style={{ ...sub, fontSize: 20, lineHeight: 1.4, opacity: 0.78, marginBottom: 36, fontWeight: 400 }}>
                Copi reads your menu and current offerings on day one — no setup, no spreadsheets.
              </p>

              <label style={{ display: 'block', marginBottom: 22 }}>
                <div style={{ ...lbl, marginBottom: 8 }}>CAFÉ OR ROASTERY NAME</div>
                <input
                  autoFocus
                  type="text"
                  placeholder="Milano"
                  value={form.cafe}
                  onChange={(e) => setForm({ ...form, cafe: e.target.value })}
                  style={inputStyle}
                />
              </label>
              <label style={{ display: 'block' }}>
                <div style={{ ...lbl, marginBottom: 8 }}>WORK EMAIL</div>
                <input
                  type="email"
                  placeholder="you@cafe.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                />
              </label>
            </div>
          )}

          {step === 1 && (
            <div>
              <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>II. YOUR TEAM</div>
              <h2 style={{ ...display, fontSize: 56, lineHeight: 0.96, letterSpacing: '-0.025em', marginBottom: 14 }}>
                How many <em style={{ fontStyle: 'italic', color: p.accent }}>people</em><br />pour with you?
              </h2>
              <p style={{ ...sub, fontSize: 20, lineHeight: 1.4, opacity: 0.78, marginBottom: 36, fontWeight: 400 }}>
                Used only to scope the trial. You can change it any time later.
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                <div style={{ ...display, fontStyle: 'italic', fontSize: 96, lineHeight: 1, color: p.accent, fontWeight: 400 }}>
                  {form.seats}
                </div>
                <div style={{ ...lbl, opacity: 0.6 }}>BARISTAS · INCL. MANAGERS</div>
              </div>
              <input
                type="range" min={1} max={40} step={1}
                value={form.seats}
                onChange={(e) => setForm({ ...form, seats: parseInt(e.target.value, 10) })}
                style={{ width: '100%', accentColor: p.accent, marginBottom: 36 }}
              />

              <div style={{ ...lbl, marginBottom: 12 }}>WHAT'S YOUR ROLE?</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: `1.5px solid ${p.fg}` }}>
                {[
                  { v: 'owner', l: 'Owner' },
                  { v: 'manager', l: 'Manager' },
                  { v: 'lead', l: 'Lead barista' },
                ].map((opt, i) => {
                  const active = form.role === opt.v;
                  return (
                    <button
                      key={opt.v}
                      onClick={() => setForm({ ...form, role: opt.v })}
                      style={{
                        padding: '14px 12px',
                        background: active ? p.accent : 'transparent',
                        color: active ? p.cream : p.fg,
                        borderRight: i < 2 ? `1.5px solid ${active ? p.accent : p.fg}` : 'none',
                        ...sans, fontSize: 13, fontWeight: 600,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'background 160ms ease, color 160ms ease',
                      }}
                    >
                      {opt.l}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center', paddingTop: 12 }}>
              <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>◆ TRIAL · CONFIRMED</div>
              <h2 style={{ ...display, fontSize: 72, lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: 18 }}>
                Welcome to <em style={{ fontStyle: 'italic', color: p.accent }}>Copi.</em>
              </h2>
              <p style={{ ...sub, fontSize: 22, lineHeight: 1.4, opacity: 0.82, marginBottom: 32, fontWeight: 400, maxWidth: 460, marginInline: 'auto' }}>
                We sent a setup link to <strong>{form.email || 'you'}</strong>. Your <strong>{form.cafe || 'café'}</strong> workspace is being built right now.
              </p>

              <div style={{
                display: 'inline-grid', gridTemplateColumns: 'auto auto', gap: '14px 32px',
                padding: '24px 36px', background: p.bg,
                border: `1.5px solid ${p.fg}`, textAlign: 'left',
                marginBottom: 28,
              }}>
                <div style={{ ...lbl, opacity: 0.65 }}>CAFÉ</div>
                <div style={{ ...sub, fontSize: 18 }}>{form.cafe || '—'}</div>
                <div style={{ ...lbl, opacity: 0.65 }}>SEATS</div>
                <div style={{ ...sub, fontSize: 18 }}>{form.seats} baristas</div>
                <div style={{ ...lbl, opacity: 0.65 }}>TRIAL</div>
                <div style={{ ...sub, fontSize: 18 }}>30 days · no card</div>
              </div>

              <div style={{ ...lbl, opacity: 0.55, marginTop: 4 }}>
                ── DAY ONE · BEGINS NOW ──
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderTop: `1px solid ${p.fg}30`, gap: 16,
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <StepDot i={0} /><StepDot i={1} /><StepDot i={2} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {step > 0 && step < 2 && (
              <button
                onClick={back}
                style={{
                  padding: '12px 20px', background: 'transparent',
                  border: `1.5px solid ${p.fg}`,
                  ...sans, fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: 'pointer', color: p.fg,
                }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={next}
              disabled={!valid}
              style={{
                padding: '12px 22px', background: valid ? p.accent : `${p.fg}40`,
                color: p.cream, border: 'none',
                ...sans, fontSize: 12, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: valid ? 'pointer' : 'not-allowed',
                transition: 'background 160ms ease',
              }}
            >
              {step === 0 && 'Continue →'}
              {step === 1 && 'Start my trial →'}
              {step === 2 && 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Login — single-screen modal
// ────────────────────────────────────────────────────────────
function LoginModal({ open, onClose, onSwitchToTrial, onAuth }) {
  const [closing, setClosing] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setClosing(false); setEmail(''); setPassword(''); setSubmitting(false); setDone(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open && !closing) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 220);
  };

  const p = PROTO_PALETTE;
  const display = { fontFamily: 'Unna' };
  const sub = { fontFamily: 'Yrsa' };
  const sans = { fontFamily: 'Lato' };
  const lbl = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };

  const valid = /.+@.+\..+/.test(email) && password.length >= 4;

  const submit = (e) => {
    e && e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      // Hand off to dashboard after a beat
      setTimeout(() => {
        if (onAuth) onAuth({ email, password });
      }, 700);
    }, 700);
  };

  const inputStyle = {
    ...sans, fontSize: 18, fontWeight: 400,
    width: '100%', padding: '14px 16px',
    background: p.bg, color: p.fg,
    border: `1.5px solid ${p.fg}`, borderRadius: 0,
    outline: 'none',
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(26,20,16,0.55)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'grid', placeItems: 'center', padding: 24,
        opacity: closing ? 0 : 1, transition: 'opacity 220ms ease',
      }}
    >
      <div style={{
        width: 'min(520px, 100%)', background: p.cream,
        border: `1.5px solid ${p.fg}`, boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
        transform: closing ? 'translateY(8px) scale(0.98)' : 'translateY(0) scale(1)',
        opacity: closing ? 0 : 1,
        transition: 'transform 220ms cubic-bezier(.2,.7,.2,1), opacity 220ms ease',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 24px', borderBottom: `1px solid ${p.fg}30`, ...lbl, opacity: 0.7,
        }}>
          <span>◆ COPI · LOG IN</span>
          <button onClick={handleClose} style={{ ...lbl, opacity: 0.7, color: p.fg, padding: 4, cursor: 'pointer' }}>
            ESC ✕
          </button>
        </div>

        <div style={{ padding: '40px 40px 28px' }}>
          {!done ? (
            <form onSubmit={submit}>
              <div style={{ ...lbl, color: p.accent, marginBottom: 16 }}>WELCOME BACK</div>
              {/* Demo credentials hint */}
              <div style={{
                marginBottom: 18,
                display: 'grid', gap: 6,
              }}>
                {[
                  { l: 'ADMIN',   email: PROTO_ADMIN.email,   pw: PROTO_ADMIN.password   },
                  { l: 'BARISTA', email: PROTO_BARISTA.email, pw: PROTO_BARISTA.password },
                ].map((row, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setEmail(row.email); setPassword(row.pw); }}
                    style={{
                      ...lbl, fontSize: 9, opacity: 0.75,
                      padding: '8px 10px', textAlign: 'left',
                      background: p.bg, border: `1px dashed ${p.fg}40`,
                      display: 'flex', justifyContent: 'space-between', gap: 12,
                      cursor: 'pointer',
                    }}
                  >
                    <span>◆ DEMO · {row.l}</span>
                    <span style={{ ...sans, textTransform: 'none', letterSpacing: 0, fontSize: 11, opacity: 0.9 }}>
                      {row.email} · {row.pw}
                    </span>
                  </button>
                ))}
              </div>
              <h2 style={{ ...display, fontSize: 52, lineHeight: 0.96, letterSpacing: '-0.025em', marginBottom: 12 }}>
                Sign <em style={{ fontStyle: 'italic', color: p.accent }}>in.</em>
              </h2>
              <p style={{ ...sub, fontSize: 18, lineHeight: 1.4, opacity: 0.78, marginBottom: 30, fontWeight: 400 }}>
                Pick up where your team left off.
              </p>

              <label style={{ display: 'block', marginBottom: 18 }}>
                <div style={{ ...lbl, marginBottom: 8 }}>WORK EMAIL</div>
                <input
                  autoFocus type="email" placeholder="you@cafe.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </label>
              <label style={{ display: 'block', marginBottom: 8 }}>
                <div style={{ ...lbl, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>PASSWORD</span>
                  <a style={{ opacity: 0.55, cursor: 'pointer' }}>FORGOT?</a>
                </div>
                <input
                  type="password" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                />
              </label>

              <button
                type="submit"
                disabled={!valid || submitting}
                style={{
                  width: '100%', marginTop: 22,
                  padding: '14px 22px',
                  background: valid ? p.accent : `${p.fg}40`,
                  color: p.cream, border: 'none',
                  ...sans, fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: valid ? 'pointer' : 'not-allowed',
                  transition: 'background 160ms ease',
                }}
              >
                {submitting ? 'Signing in…' : 'Sign in →'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
              <div style={{ ...lbl, color: p.accent, marginBottom: 16 }}>◆ SIGNED IN</div>
              <h2 style={{ ...display, fontSize: 56, lineHeight: 0.96, letterSpacing: '-0.025em', marginBottom: 14 }}>
                Welcome <em style={{ fontStyle: 'italic', color: p.accent }}>back.</em>
              </h2>
              <p style={{ ...sub, fontSize: 18, lineHeight: 1.4, opacity: 0.78, marginBottom: 4, fontWeight: 400 }}>
                Loading your workspace…
              </p>
              <div style={{ ...lbl, opacity: 0.5, marginTop: 24 }}>── {email} ──</div>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', borderTop: `1px solid ${p.fg}30`, ...lbl, opacity: 0.75,
        }}>
          <span>NEW TO COPI?</span>
          <button
            onClick={() => { handleClose(); setTimeout(onSwitchToTrial, 260); }}
            style={{ ...lbl, color: p.accent, cursor: 'pointer' }}
          >
            START A FREE TRIAL →
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Volume detail — slide-in side sheet
// ────────────────────────────────────────────────────────────
function VolumeModal({ open, volume, onClose, onTrial }) {
  const [closing, setClosing] = React.useState(false);
  const [enrolled, setEnrolled] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setClosing(false); setEnrolled(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, volume]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open && !closing) return null;
  if (!volume) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 260);
  };

  const p = PROTO_PALETTE;
  const display = { fontFamily: 'Unna' };
  const sub = { fontFamily: 'Yrsa' };
  const sans = { fontFamily: 'Lato' };
  const lbl = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(26,20,16,0.55)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'grid', placeItems: 'center', padding: 24,
        opacity: closing ? 0 : 1,
        transition: 'opacity 220ms ease',
      }}
    >
      <aside style={{
        width: 'min(720px, 100%)',
        maxHeight: 'calc(100vh - 48px)',
        background: p.cream,
        border: `1.5px solid ${p.fg}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        transform: closing ? 'translateY(8px) scale(0.98)' : 'translateY(0) scale(1)',
        opacity: closing ? 0 : 1,
        transition: 'transform 220ms cubic-bezier(.2,.7,.2,1), opacity 220ms ease',
      }}>
        {/* Top metadata bar */}
        <div style={{
          flex: '0 0 auto', background: p.cream,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 28px', borderBottom: `1px solid ${p.fg}30`,
          ...lbl, opacity: 0.85,
        }}>
          <span>◆ COPI · {volume.vol}</span>
          <button onClick={handleClose} style={{ ...lbl, color: p.fg, cursor: 'pointer' }}>
            ESC ✕
          </button>
        </div>

        {/* Scroll body */}
        <div style={{ flex: '1 1 auto', overflowY: 'auto' }}>

        {/* Header — big numeral + title */}
        <div style={{
          padding: '40px 36px 32px',
          borderBottom: `1.5px solid ${p.fg}`,
          display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 28, alignItems: 'end',
          background: p.bg,
        }}>
          <div style={{
            ...display, fontStyle: 'italic', fontSize: 168, lineHeight: 0.78,
            letterSpacing: '-0.04em', color: p.accent, fontWeight: 400,
          }}>
            {volume.num}
          </div>
          <div style={{ paddingBottom: 8 }}>
            <div style={{ ...lbl, color: p.accent, marginBottom: 10 }}>{volume.vol}</div>
            <h2 style={{
              ...display, fontSize: 56, lineHeight: 0.96, letterSpacing: '-0.025em', fontWeight: 400, margin: 0,
            }}>
              {volume.name}.
            </h2>
            <div style={{ ...sub, fontStyle: 'italic', fontSize: 22, opacity: 0.78, marginTop: 8, fontWeight: 400 }}>
              {volume.tag}
            </div>
          </div>
        </div>

        {/* Blurb + meta grid */}
        <div style={{ padding: '32px 36px', borderBottom: `1px solid ${p.fg}30` }}>
          <p style={{
            ...sub, fontSize: 20, lineHeight: 1.45, opacity: 0.88, fontWeight: 400,
            marginBottom: 28,
          }}>
            {volume.blurb}
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            border: `1.5px solid ${p.fg}`,
          }}>
            {[
              ['Entries',       String(volume.meta.entries)],
              ['Time on bar',   volume.meta.time],
              ['Certification', volume.meta.cert],
              ['Sample',        'First 2 free'],
            ].map((row, i) => (
              <div key={i} style={{
                padding: '14px 14px',
                borderRight: i < 3 ? `1px solid ${p.fg}30` : 'none',
              }}>
                <div style={{ ...lbl, opacity: 0.6, marginBottom: 6 }}>{row[0]}</div>
                <div style={{ ...sub, fontSize: 18, fontWeight: 500 }}>{row[1]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Table of contents */}
        <div style={{ padding: '32px 36px 28px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 14,
          }}>
            <div style={{ ...lbl, color: p.accent }}>◆ TABLE OF CONTENTS</div>
            <div style={{ ...lbl, opacity: 0.55 }}>{volume.lessons.length} ENTRIES</div>
          </div>

          <ol style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: `1px solid ${p.fg}30` }}>
            {volume.lessons.map(([n, name], i) => {
              const free = i < 2;
              return (
                <li key={i} style={{
                  display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 16,
                  alignItems: 'baseline',
                  padding: '14px 0',
                  borderBottom: `1px dashed ${p.fg}25`,
                }}>
                  <span style={{
                    ...sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                    opacity: 0.5, fontVariantNumeric: 'tabular-nums', minWidth: 22,
                  }}>{n}</span>
                  <span style={{ ...sub, fontSize: 18, fontWeight: 400 }}>{name}</span>
                  {free && (
                    <span style={{
                      ...lbl, fontSize: 9, color: p.accent,
                      border: `1px solid ${p.accent}`, padding: '2px 6px',
                    }}>FREE PREVIEW</span>
                  )}
                  <span style={{ ...sans, fontSize: 12, opacity: 0.5, fontVariantNumeric: 'tabular-nums' }}>
                    {Math.floor(8 + (i * 1.7) % 9)}m
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
        </div>

        {/* Footer CTAs */}
        <div style={{
          flex: '0 0 auto', background: p.cream,
          padding: '20px 28px', borderTop: `1.5px solid ${p.fg}`,
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          {enrolled ? (
            <div style={{
              flex: 1, padding: '14px 18px',
              background: p.bg, border: `1.5px solid ${p.accent}`,
              ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: p.accent, textAlign: 'center',
            }}>
              ◆ ADDED TO YOUR SHELF · CHECK YOUR EMAIL
            </div>
          ) : (
            <React.Fragment>
              <button
                onClick={() => setEnrolled(true)}
                style={{
                  flex: 1, background: p.accent, color: p.cream,
                  padding: '14px 18px', border: 'none',
                  ...sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Preview the first 2 entries →
              </button>
              <button
                onClick={() => { handleClose(); setTimeout(onTrial, 280); }}
                style={{
                  background: 'transparent', color: p.fg,
                  padding: '14px 18px', border: `1.5px solid ${p.fg}`,
                  ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Start trial
              </button>
            </React.Fragment>
          )}
        </div>
      </aside>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Route → page
// ────────────────────────────────────────────────────────────
function PageFor({ route, user }) {
  if (route === 'dashboard') return <RoasterDashboard user={user || {}} />;
  if (route === 'team')      return <AdminTeamPage user={user || {}} />;
  if (route === 'admin-curriculum') return <AdminCurriculumPage user={user || {}} />;
  if (route === 'settings')  return <AdminSettingsPage user={user || {}} />;
  if (route === 'analytics') return <AdminAnalyticsPage user={user || {}} />;
  if (route === 'today')     return <BaristaDashboard user={user || {}} />;
  if (route === 'barista-library') return <BaristaLibrary user={user || {}} />;
  if (route === 'barista-profile') return <BaristaProfile user={user || {}} />;
  if (route === 'curriculum') return <CurriculumPage />;
  if (route === 'pricing')    return <PricingPage />;
  if (route === 'about')      return <AboutPage />;
  return <BrandingTemplate3 />;
}

// ────────────────────────────────────────────────────────────
// Floating route indicator — shows current page + lets you tab back to home
// ────────────────────────────────────────────────────────────
function RouteBadge({ route, onHome }) {
  const labelFor = {
    home: 'HOME · LANDING',
    curriculum: 'CURRICULUM',
    pricing: 'PRICING',
    about: 'ABOUT',
    dashboard: 'WORKSPACE · ADMIN',
    team: 'TEAM · ADMIN',
    'admin-curriculum': 'CURRICULUM · ADMIN',
    settings: 'SETTINGS · ADMIN',
    analytics: 'ANALYTICS · ADMIN',
    today: 'TODAY · BARISTA',
    'barista-library': 'LIBRARY · BARISTA',
    'barista-profile': 'PROFILE · BARISTA',
  };
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    setShow(true);
    const t = setTimeout(() => setShow(false), 2400);
    return () => clearTimeout(t);
  }, [route]);
  return (
    <div style={{
      position: 'fixed', left: 20, bottom: 20, zIndex: 8000,
      display: 'flex', gap: 8, alignItems: 'center',
      padding: '10px 14px',
      background: 'rgba(26,20,16,0.86)', color: PROTO_PALETTE.cream,
      fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.18em',
      textTransform: 'uppercase', fontSize: 10,
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      transform: show ? 'translateY(0)' : 'translateY(8px)',
      opacity: show ? 1 : 0.35,
      transition: 'all 320ms cubic-bezier(.2,.7,.2,1)',
      pointerEvents: 'auto',
      cursor: route === 'home' ? 'default' : 'pointer',
    }}
    onClick={() => route !== 'home' && onHome()}
    onMouseEnter={() => setShow(true)}
    onMouseLeave={() => setShow(false)}
    >
      <span style={{ width: 6, height: 6, borderRadius: 99, background: PROTO_PALETTE.sun }} />
      {labelFor[route]}
      {route !== 'home' && <span style={{ opacity: 0.6, marginLeft: 8 }}>← HOME</span>}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// The shell
// ────────────────────────────────────────────────────────────
function CopiPrototype() {
  const [route, setRoute] = React.useState(() => {
    return localStorage.getItem('copi.route') || 'home';
  });
  const [trial, setTrial] = React.useState(false);
  const [login, setLogin] = React.useState(false);
  const [volumeIdx, setVolumeIdx] = React.useState(null);
  const [lessonTarget, setLessonTarget] = React.useState(null);
  const [assignVolId, setAssignVolId] = React.useState(null);
  const [detailEmail, setDetailEmail] = React.useState(null);
  const [fading, setFading] = React.useState(false);
  const [user, setUser] = React.useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('copi.user') || 'null');
      if (!raw) return null;
      // Migration: refresh stale cached users from before the Brian Turko / Milano rename.
      // We detect by old café name and re-map to the matching new identity.
      if (raw.cafe === 'Mortar Coffee' || (raw.email || '').endsWith('@mortar.coffee')) {
        if (raw.kind === 'admin') return { ...PROTO_ADMIN, kind: 'admin' };
        if (raw.kind === 'barista') return { ...PROTO_BARISTA, kind: 'barista' };
      }
      return raw;
    } catch (_e) { return null; }
  });

  React.useEffect(() => {
    if (user) localStorage.setItem('copi.user', JSON.stringify(user));
    else localStorage.removeItem('copi.user');
  }, [user]);

  const handleAuth = ({ email, password }) => {
    const e = email.trim().toLowerCase();
    let u;
    let nextRoute;
    if (e === PROTO_ADMIN.email && password === PROTO_ADMIN.password) {
      u = { ...PROTO_ADMIN, email, kind: 'admin' };
      nextRoute = 'dashboard';
    } else if (e === PROTO_BARISTA.email && password === PROTO_BARISTA.password) {
      u = { ...PROTO_BARISTA, email, kind: 'barista' };
      nextRoute = 'today';
    } else {
      u = { name: 'Guest', cafe: 'Your café', role: 'Barista', email, kind: 'barista' };
      nextRoute = 'today';
    }
    setUser(u);
    setLogin(false);
    setFading(true);
    setTimeout(() => {
      setRoute(nextRoute);
      window.scrollTo(0, 0);
      requestAnimationFrame(() => setFading(false));
    }, 180);
  };

  const handleLogout = () => {
    setUser(null);
    setFading(true);
    setTimeout(() => {
      setRoute('home');
      window.scrollTo(0, 0);
      requestAnimationFrame(() => setFading(false));
    }, 180);
  };

  React.useEffect(() => {
    localStorage.setItem('copi.route', route);
  }, [route]);

  const navigate = (next) => {
    if (next === route) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setFading(true);
    setTimeout(() => {
      setRoute(next);
      window.scrollTo(0, 0);
      requestAnimationFrame(() => setFading(false));
    }, 180);
  };

  // ─────────────────────────────────────────────────────────
  // Click delegation: read text content of clicked link/button
  // and translate into navigation or actions.
  // ─────────────────────────────────────────────────────────
  // Expose a small imperative API the page components call directly.
  React.useEffect(() => {
    window.CopiActions = {
      openLesson: (volId, lessonId) => setLessonTarget({ kind: 'lesson', volId, lessonId }),
      openFinal:  (volId) => setLessonTarget({ kind: 'final', volId }),
      openAssign: (volId) => setAssignVolId(volId),
      openBarista: (email) => setDetailEmail(email),
      navigate,
    };
  });

  const onPageClick = (e) => {
    // Logo wordmark — italic span "Copi" in the top-left nav slot.
    const span = e.target.closest('span');
    if (span && span.textContent.trim() === 'Copi') {
      const cs = window.getComputedStyle(span);
      const fontSize = parseFloat(cs.fontSize);
      // Big italic "Copi" in nav is 44px; footer copies are smaller / different weight
      if (fontSize >= 30 && cs.fontStyle === 'italic') {
        const nearestNav = span.closest('div');
        if (nearestNav) {
          e.preventDefault();
          navigate('home');
          return;
        }
      }
    }

    const target = e.target.closest('a, button');
    if (!target) return;

    // Ignore controls inside our own overlay UI
    if (target.closest('[data-proto-ui]')) return;

    // ── Volume "Read the volume" buttons (curriculum cards) ──
    const volIdxAttr = target.getAttribute('data-volume-idx');
    if (volIdxAttr !== null) {
      e.preventDefault();
      setVolumeIdx(parseInt(volIdxAttr, 10));
      return;
    }

    // ── In-app actions (dashboard) ───────────────────────────
    const appAction = target.getAttribute('data-app-action') || target.closest('[data-app-action]')?.getAttribute('data-app-action');
    if (appAction === 'logout') {
      e.preventDefault();
      handleLogout();
      return;
    }
    if (appAction === 'invite') {
      e.preventDefault();
      navigate('team');
      return;
    }

    const raw = (target.textContent || '').trim();
    const text = raw.replace(/\s+/g, ' ');

    // ── Nav primary links ────────────────────────────
    if (text === 'Home')              { e.preventDefault(); navigate('home');       return; }
    if (text === 'Team')              { e.preventDefault(); navigate('team');       return; }
    if (text === 'Dashboard')         { e.preventDefault(); navigate('dashboard');  return; }
    if (text === 'Curriculum')        {
      e.preventDefault();
      // Admin users in the workspace land on the operational curriculum view;
      // guests / baristas / unauthenticated visitors get the marketing page.
      const inAdminSurface = user && user.kind === 'admin' && ['dashboard', 'team', 'admin-curriculum'].includes(route);
      navigate(inAdminSurface ? 'admin-curriculum' : 'curriculum');
      return;
    }
    if (text === 'Pricing')           { e.preventDefault(); navigate('pricing');    return; }
    if (text === 'About')             { e.preventDefault(); navigate('about');      return; }
    if (text === 'Settings')          { e.preventDefault(); navigate('settings');   return; }
    if (text === 'Analytics')         { e.preventDefault(); navigate('analytics');  return; }
    if (text === 'Today')             { e.preventDefault(); navigate('today');      return; }
    if (text === 'Profile')           { e.preventDefault(); navigate('barista-profile'); return; }
    if (text === 'Library')           {
      e.preventDefault();
      // Barista nav → the barista library. Admins no longer have a Library tab
      // (it became Analytics), but keep this as a safe fallback.
      navigate(user && user.kind === 'admin' ? 'analytics' : 'barista-library');
      return;
    }

    // ── CTAs ─────────────────────────────────────────
    if (/start free trial/i.test(text)) {
      e.preventDefault();
      setTrial(true);
      return;
    }
    if (/^log in$/i.test(text)) {
      e.preventDefault();
      setLogin(true);
      return;
    }
    if (/^see the curriculum/i.test(text)) {
      e.preventDefault();
      navigate('curriculum');
      return;
    }
    if (/^preview a volume/i.test(text)) {
      e.preventDefault();
      navigate('curriculum');
      return;
    }
    if (/^the editors/i.test(text)) {
      e.preventDefault();
      navigate('about');
      return;
    }
    if (/^history of coffee/i.test(text) || /^processing methods/i.test(text) || /^barista knowledge/i.test(text)) {
      e.preventDefault();
      navigate('curriculum');
      return;
    }

    // Default: swallow link clicks so href="" / empty anchors don't reload
    if (target.tagName === 'A') e.preventDefault();
  };

  return (
    <div
      onClickCapture={onPageClick}
      style={{
        minHeight: '100vh', position: 'relative',
        background: PROTO_PALETTE.bg,
      }}
    >
      <div
        key={route}
        style={{
          opacity: fading ? 0 : 1,
          transform: fading ? 'translateY(6px)' : 'translateY(0)',
          transition: 'opacity 180ms ease, transform 240ms cubic-bezier(.2,.7,.2,1)',
        }}
      >
        <PageFor route={route} user={user} />
      </div>

      <div data-proto-ui>
        <RouteBadge route={route} onHome={() => navigate('home')} />
        <TrialModal open={trial} onClose={() => setTrial(false)} />
        <LoginModal
          open={login}
          onClose={() => setLogin(false)}
          onSwitchToTrial={() => setTrial(true)}
          onAuth={handleAuth}
        />
        <VolumeModal
          open={volumeIdx !== null}
          volume={volumeIdx !== null ? (window.COPI_VOLUMES || [])[volumeIdx] : null}
          onClose={() => setVolumeIdx(null)}
          onTrial={() => setTrial(true)}
        />
        <LessonPlayer
          open={!!lessonTarget}
          email={(user && user.email) || 'lili@milano.coffee'}
          target={lessonTarget}
          onClose={() => setLessonTarget(null)}
        />
        <AssignModal
          open={!!assignVolId}
          volId={assignVolId}
          onClose={() => setAssignVolId(null)}
        />
        <BaristaDetailModal
          open={!!detailEmail}
          email={detailEmail}
          onClose={() => setDetailEmail(null)}
        />
      </div>
    </div>
  );
}

Object.assign(window, { CopiPrototype, TrialModal, LoginModal, VolumeModal, RouteBadge, PROTO_PALETTE });
