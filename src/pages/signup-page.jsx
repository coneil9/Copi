import React from 'react';
import { supabase } from '../lib/supabaseClient.js';

// Maps Supabase auth error codes/messages to user-friendly copy.
// Falls back to the raw message if we don't recognize it.
function friendlySignupError(err) {
  if (!err) return 'Something went wrong. Please try again.';
  const msg = (err.message || '').toLowerCase();
  const code = err.code || err.status;
  if (msg.includes('already registered') || msg.includes('user already exists') || code === 'user_already_exists') {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (msg.includes('weak password') || msg.includes('password') && msg.includes('short')) {
    return 'Password is too weak — try at least 8 characters with a number.';
  }
  if (msg.includes('email address') && msg.includes('invalid')) {
    return 'That email address looks invalid. Try a different one.';
  }
  if (msg.includes('rate limit')) {
    return 'Too many signups from this network. Wait a minute and try again.';
  }
  if (msg.includes('fetch') || msg.includes('network')) {
    return 'Network error — check your connection and try again.';
  }
  return err.message || 'Signup failed. Please try again.';
}

export function SignupPage({ onSignup, onLogin }) {
  const [name, setName]         = React.useState('');
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError]       = React.useState('');
  const [loading, setLoading]   = React.useState(false);
  // 'form' | 'confirm-email' — the latter shows only when Supabase Auth
  // has "Confirm email" enabled, so signUp returns no session.
  const [phase, setPhase]       = React.useState('form');

  const th = window.THEME || {};
  const ty = window.TYPOGRAPHY || {};
  const sh = window.SHADOW || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim())       return setError('Please enter your name.');
    if (!email.includes('@')) return setError('Please enter a valid email.');
    if (password.length < 6)  return setError('Password must be at least 6 characters.');

    const trimmedEmail = email.toLowerCase().trim();
    const trimmedName  = name.trim();
    setLoading(true);

    if (!supabase) {
      setLoading(false);
      return setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.');
    }

    try {
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: { data: { name: trimmedName } },
      });
      if (signUpErr) {
        setLoading(false);
        return setError(friendlySignupError(signUpErr));
      }

      // If Supabase Auth has "Confirm email" ON, signUp succeeds but no
      // session is issued until the user clicks the email link. Show the
      // confirm-email screen so the demo doesn't silently freeze.
      if (!data?.session) {
        setLoading(false);
        return setPhase('confirm-email');
      }

      // Session live — hand off to cafe-setup. The parent (App.jsx)
      // will call the bootstrap RPC once the cafe form submits.
      setLoading(false);
      onSignup({ name: trimmedName, email: trimmedEmail });
    } catch (err) {
      setLoading(false);
      setError(friendlySignupError(err));
    }
  };

  const handleGoogle = async () => {
    setError('');
    if (!supabase) return setError('Supabase is not configured.');
    setLoading(true);
    try {
      const { error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      // On success Supabase redirects the browser; we won't get here.
      if (oauthErr) {
        setLoading(false);
        if ((oauthErr.message || '').toLowerCase().includes('provider is not enabled')) {
          setError('Google sign-in isn\'t configured yet. Use email + password below.');
        } else {
          setError(friendlySignupError(oauthErr));
        }
      }
    } catch (err) {
      setLoading(false);
      setError(friendlySignupError(err));
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: th.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ ...ty.displayItalic, fontSize: 32, color: th.accent }}>Copi.</span>
          <p style={{ ...ty.body, color: th.muted, marginTop: 4 }}>Cafe training, done right.</p>
        </div>

        <div style={{ background: th.bgCard, borderRadius: th.card + 4, padding: 32, boxShadow: sh.card, border: `1px solid ${th.line}` }}>
          {phase === 'confirm-email' ? (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ ...ty.h3, color: th.ink, margin: '0 0 12px' }}>Check your email</h2>
              <p style={{ ...ty.body, color: th.muted, margin: '0 0 20px' }}>
                We sent a confirmation link to <strong style={{ color: th.ink }}>{email}</strong>. Click it to activate your account, then come back and sign in.
              </p>
              <button
                onClick={onLogin}
                style={{ padding: '10px 20px', background: th.accent, color: th.onDark, border: 'none', borderRadius: th.pill, ...ty.button, cursor: 'pointer' }}
              >Go to sign in →</button>
              <p style={{ ...ty.caption, color: th.muted, marginTop: 20 }}>
                Didn't get an email? Check spam, or ask the Copi team to disable email confirmation for demo mode.
              </p>
            </div>
          ) : (
          <>
          <h2 style={{ ...ty.h3, color: th.ink, margin: '0 0 24px', textAlign: 'center' }}>Create your account</h2>

          {/* Google SSO */}
          <button
            onClick={handleGoogle} disabled={loading}
            style={{
              width: '100%', padding: '10px 16px', borderRadius: th.input,
              background: th.bgInset, border: `1.5px solid ${th.line}`,
              ...ty.button, color: th.ink, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              opacity: loading ? 0.7 : 1,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.638-.057-1.252-.164-1.84H9v3.48h4.844a4.14 4.14 0 01-1.796 2.716v2.26h2.908C16.658 14.252 17.64 11.92 17.64 9.2z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.26c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.036-3.712H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.704A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.704V4.964H.957A9 9 0 000 9c0 1.452.348 2.827.957 4.036l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.576c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.964L3.964 7.296C4.672 5.168 6.656 3.576 9 3.576z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: th.line }} />
            <span style={{ ...ty.caption, color: th.muted }}>or</span>
            <div style={{ flex: 1, height: 1, background: th.line }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ ...ty.label, display: 'block', marginBottom: 5, color: th.ink }}>Your name</label>
              <input
                value={name} onChange={(e) => { setName(e.target.value); if (error) setError(''); }}
                placeholder="e.g. Sarah Chen"
                style={{ width: '100%', ...ty.body, padding: '9px 14px', background: th.bgCard, border: `1.5px solid ${th.line}`, borderRadius: th.input, color: th.ink, outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = th.accent; }}
                onBlur={(e) => { e.target.style.borderColor = th.line; }}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ ...ty.label, display: 'block', marginBottom: 5, color: th.ink }}>Email address</label>
              <input
                type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                placeholder="you@yourcafe.com"
                style={{ width: '100%', ...ty.body, padding: '9px 14px', background: th.bgCard, border: `1.5px solid ${th.line}`, borderRadius: th.input, color: th.ink, outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = th.accent; }}
                onBlur={(e) => { e.target.style.borderColor = th.line; }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ ...ty.label, display: 'block', marginBottom: 5, color: th.ink }}>Password</label>
              <input
                type="password" value={password} onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                placeholder="At least 6 characters"
                style={{ width: '100%', ...ty.body, padding: '9px 14px', background: th.bgCard, border: `1.5px solid ${th.line}`, borderRadius: th.input, color: th.ink, outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = th.accent; }}
                onBlur={(e) => { e.target.style.borderColor = th.line; }}
              />
            </div>

            {error && <p role="alert" style={{ ...ty.caption, color: th.danger, marginBottom: 12, marginTop: -8 }}>{error}</p>}

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '11px', background: th.accent, color: th.onDark, border: 'none', borderRadius: th.pill, ...ty.button, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >{loading ? 'Creating account…' : 'Create account'}</button>
          </form>

          <p style={{ ...ty.caption, color: th.muted, textAlign: 'center', marginTop: 20 }}>
            Already have an account?{' '}
            <button onClick={onLogin} style={{ background: 'none', border: 'none', color: th.accent, cursor: 'pointer', ...ty.caption, fontWeight: 500 }}>Log in</button>
          </p>
          </>
          )}
        </div>
      </div>
    </div>
  );
}

window.SignupPage = SignupPage;
