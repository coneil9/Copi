import React from 'react';

export function InviteAcceptPage({ token, onAccepted, onExpired }) {
  const store = window.CopiStore;
  const inv = store ? store.getInvite(token) : null;
  const [password, setPassword]   = React.useState('');
  const [confirm, setConfirm]     = React.useState('');
  const [error, setError]         = React.useState('');
  const [loading, setLoading]     = React.useState(false);
  const [done, setDone]           = React.useState(false);

  const th = window.THEME || {};
  const ty = window.TYPOGRAPHY || {};
  const sh = window.SHADOW || {};

  // Validate invite
  if (!inv) {
    return (
      <div style={{ minHeight: '100vh', background: th.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 400, textAlign: 'center' }}>
          <span style={{ ...ty.displayItalic, fontSize: 28, color: th.accent }}>Copi.</span>
          <h2 style={{ ...ty.h3, color: th.ink, margin: '20px 0 10px' }}>Link not found</h2>
          <p style={{ ...ty.body, color: th.muted }}>This invite link is invalid. Ask your manager to resend it.</p>
        </div>
      </div>
    );
  }

  const expired = !inv.usedAt && Date.now() > inv.expiresAt;
  const used = !!inv.usedAt;

  if (expired || used) {
    return (
      <div style={{ minHeight: '100vh', background: th.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 400, textAlign: 'center' }}>
          <span style={{ ...ty.displayItalic, fontSize: 28, color: th.accent }}>Copi.</span>
          <h2 style={{ ...ty.h3, color: th.ink, margin: '20px 0 10px' }}>{used ? 'Already used' : 'Link expired'}</h2>
          <p style={{ ...ty.body, color: th.muted }}>{used ? 'This link has already been used. Log in or ask your manager to resend.' : 'This link expired after 72 hours. Ask your manager to send a new one.'}</p>
          <button onClick={onExpired} style={{ marginTop: 20, padding: '10px 24px', background: th.accent, color: th.onDark, border: 'none', borderRadius: th.pill, ...ty.button, cursor: 'pointer' }}>Back to login</button>
        </div>
      </div>
    );
  }

  const user = store.getUserById(inv.userId);
  const cafe = user ? store.getCafe(user.cafeId) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setLoading(true);
    setTimeout(() => {
      const result = store.consumeInvite(token, password);
      setLoading(false);
      if (result.error) { setError('Something went wrong. Please try again.'); return; }
      setDone(true);
      setTimeout(() => onAccepted(result.user), 1200);
    }, 500);
  };

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: th.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 400, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>☕</div>
          <h2 style={{ ...ty.h3, color: th.ink }}>You're in.</h2>
          <p style={{ ...ty.body, color: th.muted }}>Taking you to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: th.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ ...ty.displayItalic, fontSize: 32, color: th.accent }}>Copi.</span>
        </div>
        <div style={{ background: th.bgCard, borderRadius: th.card + 4, padding: 32, boxShadow: sh.card, border: `1px solid ${th.line}` }}>
          <h2 style={{ ...ty.h3, color: th.ink, margin: '0 0 6px', textAlign: 'center' }}>You've been invited</h2>
          <p style={{ ...ty.bodySmall, color: th.muted, textAlign: 'center', margin: '0 0 24px' }}>
            {cafe ? `${cafe.name} ` : ''}{user ? `— ${user.name}, ${user.role}` : ''}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ ...ty.label, display: 'block', marginBottom: 6, color: th.ink }}>Email</label>
              <div style={{ ...ty.body, padding: '9px 14px', background: th.bgInset, borderRadius: th.input, color: th.muted, border: `1.5px solid ${th.line}` }}>
                {user?.email || '—'}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ ...ty.label, display: 'block', marginBottom: 6, color: th.ink }}>Create a password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                style={{ width: '100%', ...ty.body, padding: '9px 14px', background: th.bgCard, border: `1.5px solid ${th.line}`, borderRadius: th.input, color: th.ink, outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = th.accent; }}
                onBlur={(e) => { e.target.style.borderColor = th.line; }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ ...ty.label, display: 'block', marginBottom: 6, color: th.ink }}>Confirm password</label>
              <input
                type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="Same password again"
                style={{ width: '100%', ...ty.body, padding: '9px 14px', background: th.bgCard, border: `1.5px solid ${th.line}`, borderRadius: th.input, color: th.ink, outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = th.accent; }}
                onBlur={(e) => { e.target.style.borderColor = th.line; }}
              />
            </div>

            {error && <p style={{ ...ty.caption, color: th.danger, marginBottom: 12 }}>{error}</p>}

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '11px', background: th.accent, color: th.onDark, border: 'none', borderRadius: th.pill, ...ty.button, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >{loading ? 'Setting up…' : 'Set password and enter Copi →'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

window.InviteAcceptPage = InviteAcceptPage;
