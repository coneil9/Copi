import React from 'react';
import { supabase } from '../lib/supabaseClient.js';

function friendlyBootstrapError(err) {
  if (!err) return 'Something went wrong. Please try again.';
  const msg = (err.message || '').toLowerCase();
  if (msg.includes('not authenticated') || err.code === '42501') {
    return 'Your session expired. Please sign up again.';
  }
  if (msg.includes('duplicate') || err.code === '23505') {
    return 'A cafe with this name already exists for your account. Try a different name.';
  }
  if (msg.includes('fetch') || msg.includes('network')) {
    return 'Network error — check your connection and try again.';
  }
  return err.message || 'Cafe setup failed. Please try again.';
}

export function CafeSetupPage({ pendingUser, onComplete }) {
  const [cafeName, setCafeName]         = React.useState('');
  const [numLocations, setNumLocations] = React.useState(1);
  const [loading, setLoading]           = React.useState(false);
  const [error, setError]               = React.useState('');

  const th = window.THEME || {};
  const ty = window.TYPOGRAPHY || {};
  const sh = window.SHADOW || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!cafeName.trim()) return setError('Cafe name is required.');

    if (!supabase) {
      return setError('Supabase is not configured. Contact the Copi team.');
    }

    setLoading(true);
    try {
      // Bootstrap the cafe, first location, and owner user row atomically.
      // Additional locations (numLocations > 1) can be added from the
      // dashboard once the owner is signed in — the RPC only seeds one
      // so a signup that fails halfway can be safely retried.
      const { data, error: rpcErr } = await supabase.rpc('bootstrap_owner_cafe', {
        p_cafe_name: cafeName.trim(),
        p_owner_name: pendingUser?.name || '',
        p_first_location_name: numLocations === 1 ? 'Main' : 'Location 1',
      });
      if (rpcErr) {
        setLoading(false);
        return setError(friendlyBootstrapError(rpcErr));
      }

      // RPC returns a table (an array of one row).
      const row = Array.isArray(data) ? data[0] : data;
      if (!row?.cafe_id) {
        setLoading(false);
        return setError('Cafe setup returned no data. Please try again.');
      }

      setLoading(false);
      // Hand control back to the parent, which hydrates `user` from Supabase.
      onComplete({
        cafeId: row.cafe_id,
        locationId: row.location_id,
        cafeName: cafeName.trim(),
        numLocations,
        alreadyExisted: !!row.already_existed,
      });
    } catch (err) {
      setLoading(false);
      setError(friendlyBootstrapError(err));
    }
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
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ width: 8, height: 8, borderRadius: 99, background: n <= 2 ? th.accent : th.line }} />
            ))}
          </div>

          <h2 style={{ ...ty.h3, color: th.ink, margin: '0 0 6px', textAlign: 'center' }}>Tell us about your cafe</h2>
          <p style={{ ...ty.bodySmall, color: th.muted, textAlign: 'center', marginBottom: 28, marginTop: 0 }}>
            Hi {(pendingUser?.name || 'there').split(' ')[0]} 👋 This takes 30 seconds.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ ...ty.label, display: 'block', marginBottom: 6, color: th.ink }}>
                Cafe name <span style={{ color: th.danger }}>*</span>
              </label>
              <input
                value={cafeName} onChange={(e) => { setCafeName(e.target.value); if (error) setError(''); }}
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
              <p style={{ ...ty.caption, color: th.muted, marginTop: 6 }}>We'll create your first location now — you can add or rename more from the dashboard.</p>
            </div>

            {error && <p role="alert" style={{ ...ty.caption, color: th.danger, marginBottom: 12 }}>{error}</p>}

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
