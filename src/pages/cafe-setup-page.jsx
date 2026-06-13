import React from 'react';

export function CafeSetupPage({ pendingUser, onComplete }) {
  const [cafeName, setCafeName]     = React.useState('');
  const [numLocations, setNumLocations] = React.useState(1);
  const [loading, setLoading]       = React.useState(false);
  const [error, setError]           = React.useState('');

  const th = window.THEME || {};
  const ty = window.TYPOGRAPHY || {};
  const sh = window.SHADOW || {};
  const store = window.CopiStore;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cafeName.trim()) return setError('Cafe name is required.');
    setLoading(true);

    setTimeout(() => {
      const { uid } = window.__copiDbHelpers || {};
      const cafeId = (uid ? uid() : Math.random().toString(36).slice(2)) + 'c';
      const now = Date.now();

      // Create cafe record
      const db = store.raw();
      db.cafes[cafeId] = {
        id: cafeId, name: cafeName.trim(), createdAt: now,
        plan: 'flat', subscription: { status: 'trial', seats: 1, renewsAt: now + 1000 * 60 * 60 * 24 * 30 },
        setupComplete: false,
      };

      // Create default locations
      const locationIds = [];
      for (let i = 0; i < numLocations; i++) {
        const locId = `loc-${cafeId}-${i}`;
        db.locations[locId] = { id: locId, cafeId, name: numLocations === 1 ? 'Main' : `Location ${i + 1}` };
        locationIds.push(locId);
      }

      // Create owner user
      const ownerId = `usr-${cafeId}-owner`;
      db.users[ownerId] = {
        id: ownerId, cafeId, locationId: null,
        name: pendingUser.name, email: pendingUser.email,
        password: pendingUser.password || 'sso', role: 'owner',
        status: 'active', joinedAt: now,
      };

      // Persist
      const { saveDb } = window.__copiDbHelpers || {};
      if (saveDb) saveDb(db); else { try { localStorage.setItem('copi.db.v4', JSON.stringify(db)); } catch(_) {} }

      setLoading(false);
      onComplete({ ...db.users[ownerId], cafeId, locationIds });
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', background: th.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ ...ty.displayItalic, fontSize: 32, color: th.accent }}>Copi.</span>
          <p style={{ ...ty.body, color: th.muted, marginTop: 4 }}>Let's set up your cafe.</p>
        </div>

        <div style={{ background: th.bgCard, borderRadius: th.card + 4, padding: 32, boxShadow: sh.card, border: `1px solid ${th.line}` }}>
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
            {[1, 2].map((n) => (
              <div key={n} style={{ width: 8, height: 8, borderRadius: 99, background: n === 2 ? th.accent : th.line }} />
            ))}
          </div>

          <h2 style={{ ...ty.h3, color: th.ink, margin: '0 0 6px', textAlign: 'center' }}>Tell us about your cafe</h2>
          <p style={{ ...ty.bodySmall, color: th.muted, textAlign: 'center', marginBottom: 28, marginTop: 0 }}>
            Hi {pendingUser.name.split(' ')[0]} 👋 This takes 30 seconds.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ ...ty.label, display: 'block', marginBottom: 6, color: th.ink }}>
                Cafe name <span style={{ color: th.danger }}>*</span>
              </label>
              <input
                value={cafeName} onChange={(e) => setCafeName(e.target.value)}
                placeholder="e.g. Ember & Oak Coffee"
                style={{ width: '100%', ...ty.body, padding: '9px 14px', background: th.bgCard, border: `1.5px solid ${th.line}`, borderRadius: th.input, color: th.ink, outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = th.accent; }}
                onBlur={(e) => { e.target.style.borderColor = th.line; }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ ...ty.label, display: 'block', marginBottom: 10, color: th.ink }}>
                How many locations?
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n} type="button"
                    onClick={() => setNumLocations(n)}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: th.input,
                      background: numLocations === n ? th.accent : th.bgInset,
                      color: numLocations === n ? th.onDark : th.muted,
                      border: numLocations === n ? 'none' : `1.5px solid ${th.line}`,
                      ...ty.label, cursor: 'pointer', transition: 'all 140ms',
                    }}
                  >{n}{n === 4 ? '+' : ''}</button>
                ))}
              </div>
              <p style={{ ...ty.caption, color: th.muted, marginTop: 6 }}>You can add or rename locations later.</p>
            </div>

            {error && <p style={{ ...ty.caption, color: th.danger, marginBottom: 12 }}>{error}</p>}

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '11px', background: th.accent, color: th.onDark, border: 'none', borderRadius: th.pill, ...ty.button, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >{loading ? 'Setting up your cafe…' : 'Go to my dashboard →'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

window.CafeSetupPage = CafeSetupPage;
