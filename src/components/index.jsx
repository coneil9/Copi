// src/components/index.jsx
// Shared UI components built on THEME tokens.
// All new pages import from here.

import React from 'react';

function T()  { return window.THEME         || {}; }
function TY() { return window.TYPOGRAPHY    || {}; }
function SP() { return window.SPACING       || {}; }
function SH() { return window.SHADOW        || {}; }

// ── AppNav ────────────────────────────────────────────────
// Top navigation bar for logged-in app surfaces.
export function AppNav({ user, currentRoute, onNavigate }) {
  const th = T(), ty = TY(), sp = SP();
  if (!user) return null;

  const isOwnerAdmin = ['owner','admin'].includes(user.role);
  const isManager = user.role === 'manager';
  const isBarista = ['barista','host'].includes(user.role);

  const ownerLinks = [
    { label: 'Dashboard', route: 'dashboard' },
    { label: 'Team',      route: 'team' },
    { label: 'Curriculum',route: 'admin-curriculum' },
    { label: 'Analytics', route: 'analytics' },
    { label: 'Billing',   route: 'billing' },
    { label: 'Settings',  route: 'settings' },
  ];
  const managerLinks = [
    { label: 'Dashboard', route: 'manager-dashboard' },
    { label: 'Team',      route: 'manager-team' },
  ];
  const baristaLinks = [
    { label: 'Today',    route: 'today' },
    { label: 'Library',  route: 'barista-library' },
    { label: 'Profile',  route: 'barista-profile' },
  ];

  const links = isOwnerAdmin ? ownerLinks : isManager ? managerLinks : baristaLinks;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: th.bgCard, borderBottom: `1px solid ${th.line}`,
      boxShadow: '0 1px 4px rgba(31,27,20,0.06)',
    }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 0 }}>
        {/* Logo */}
        <span
          onClick={() => onNavigate(isOwnerAdmin ? 'dashboard' : isManager ? 'manager-dashboard' : 'today')}
          style={{ ...ty.displayItalic, fontSize: 22, color: th.accent, cursor: 'pointer', marginRight: 32, flexShrink: 0 }}
        >Copi.</span>

        {/* Links */}
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {links.map(({ label, route }) => (
            <button
              key={route}
              onClick={() => onNavigate(route)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '6px 12px', borderRadius: 8,
                ...ty.nav,
                color: currentRoute === route ? th.accent : th.muted,
                fontWeight: currentRoute === route ? 600 : 400,
                backgroundColor: currentRoute === route ? th.bgInset : 'transparent',
                transition: 'all 140ms',
              }}
            >{label}</button>
          ))}
        </div>

        {/* User pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ ...ty.bodySmall, color: th.muted }}>
            {user.name}
          </span>
          <button
            data-app-action="logout"
            style={{
              ...ty.label, padding: '5px 12px', borderRadius: RADIUS_PILL,
              background: th.bgInset, border: `1px solid ${th.line}`,
              color: th.muted, cursor: 'pointer',
            }}
          >Log out</button>
        </div>
      </div>
    </nav>
  );
}
const RADIUS_PILL = 999;

// ── AppShell ──────────────────────────────────────────────
// Wraps a logged-in page: AppNav + content area.
export function AppShell({ user, currentRoute, onNavigate, children }) {
  const th = T();
  return (
    <div style={{ minHeight: '100vh', background: th.bg }}>
      <AppNav user={user} currentRoute={currentRoute} onNavigate={onNavigate} />
      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '32px 24px' }}>
        {children}
      </main>
    </div>
  );
}

// ── PageHeader ────────────────────────────────────────────
export function PageHeader({ eyebrow, title, subtitle, action }) {
  const th = T(), ty = TY();
  return (
    <div style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <div>
        {eyebrow && <p style={{ ...ty.eyebrow, color: th.accent, marginBottom: 6 }}>{eyebrow}</p>}
        <h1 style={{ ...ty.h2, color: th.ink, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ ...ty.body, color: th.muted, marginTop: 6, margin: '6px 0 0' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────
export function Card({ children, style = {}, onClick, padded = true }) {
  const th = T(), sh = SH();
  return (
    <div
      onClick={onClick}
      style={{
        background: th.bgCard, borderRadius: th.card, border: `1px solid ${th.line}`,
        boxShadow: sh.card, padding: padded ? 24 : 0,
        cursor: onClick ? 'pointer' : undefined,
        transition: onClick ? 'box-shadow 140ms, transform 140ms' : undefined,
        ...style,
      }}
      onMouseEnter={onClick ? (e) => { e.currentTarget.style.boxShadow = sh.cardHover; } : undefined}
      onMouseLeave={onClick ? (e) => { e.currentTarget.style.boxShadow = sh.card; } : undefined}
    >
      {children}
    </div>
  );
}

// ── Button ────────────────────────────────────────────────
export function Btn({ children, variant = 'primary', size = 'md', onClick, disabled, style = {}, type = 'button', ...rest }) {
  const th = T(), ty = TY();
  const variants = {
    primary: { background: th.accent, color: th.onDark, border: 'none' },
    secondary: { background: 'transparent', color: th.ink, border: `1.5px solid ${th.line}` },
    ghost: { background: 'transparent', color: th.accent, border: 'none' },
    danger: { background: th.danger, color: '#fff', border: 'none' },
    dark: { background: th.bgDark, color: th.onDark, border: 'none' },
  };
  const sizes = {
    sm: { padding: '6px 14px', fontSize: 13 },
    md: { padding: '9px 20px', fontSize: 14 },
    lg: { padding: '12px 28px', fontSize: 16 },
  };
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...ty.button, ...v, ...s,
        borderRadius: th.pill, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, display: 'inline-flex', alignItems: 'center', gap: 6,
        transition: 'opacity 140ms, background 140ms',
        lineHeight: 1,
        ...style,
      }}
      {...rest}
    >{children}</button>
  );
}

// ── Tag / Badge ───────────────────────────────────────────
export function Tag({ children, color, style = {} }) {
  const th = T(), ty = TY();
  const bg   = color === 'green' ? `${th.accent}18` : color === 'gold' ? `${th.gold}22` : color === 'red' ? `${th.danger}18` : color === 'urgent' ? `${th.urgent}22` : th.bgInset;
  const text = color === 'green' ? th.accent : color === 'gold' ? th.gold : color === 'red' ? th.danger : color === 'urgent' ? th.urgent : th.muted;
  return (
    <span style={{ ...ty.label, background: bg, color: text, padding: '3px 10px', borderRadius: th.tag, display: 'inline-flex', alignItems: 'center', gap: 4, ...style }}>
      {children}
    </span>
  );
}

// ── FormField ─────────────────────────────────────────────
export function FormField({ label, error, hint, children, required }) {
  const th = T(), ty = TY();
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ ...ty.label, display: 'block', marginBottom: 6, color: th.ink }}>
          {label}{required && <span style={{ color: th.danger, marginLeft: 2 }}>*</span>}
        </label>
      )}
      {children}
      {error && <p style={{ ...ty.caption, color: th.danger, marginTop: 4, margin: '4px 0 0' }}>{error}</p>}
      {hint && !error && <p style={{ ...ty.caption, color: th.muted, marginTop: 4, margin: '4px 0 0' }}>{hint}</p>}
    </div>
  );
}

export function Input({ value, onChange, placeholder, type = 'text', disabled, style = {}, ...rest }) {
  const th = T(), ty = TY();
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: '100%', ...ty.body, padding: '9px 14px',
        background: th.bgCard, border: `1.5px solid ${th.line}`,
        borderRadius: th.input, color: th.ink, outline: 'none',
        transition: 'border-color 140ms',
        boxSizing: 'border-box',
        ...style,
      }}
      onFocus={(e) => { e.target.style.borderColor = th.accent; }}
      onBlur={(e) => { e.target.style.borderColor = th.line; }}
      {...rest}
    />
  );
}

export function Select({ value, onChange, children, style = {}, disabled }) {
  const th = T(), ty = TY();
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        width: '100%', ...ty.body, padding: '9px 14px',
        background: th.bgCard, border: `1.5px solid ${th.line}`,
        borderRadius: th.input, color: th.ink, outline: 'none',
        cursor: 'pointer', boxSizing: 'border-box',
        ...style,
      }}
    >{children}</select>
  );
}

export function Textarea({ value, onChange, placeholder, rows = 4, style = {} }) {
  const th = T(), ty = TY();
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', ...ty.body, padding: '9px 14px',
        background: th.bgCard, border: `1.5px solid ${th.line}`,
        borderRadius: th.input, color: th.ink, outline: 'none',
        resize: 'vertical', boxSizing: 'border-box',
        ...style,
      }}
      onFocus={(e) => { e.target.style.borderColor = th.accent; }}
      onBlur={(e) => { e.target.style.borderColor = th.line; }}
    />
  );
}

// ── Modal ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 520 }) {
  const th = T(), ty = TY(), sh = SH();
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(31,27,20,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: th.bgCard, borderRadius: th.card + 4, boxShadow: sh.modal, width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
        {/* Header */}
        {title && (
          <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${th.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ ...ty.h4, color: th.ink, margin: 0 }}>{title}</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: th.muted, fontSize: 20, lineHeight: 1, padding: '2px 6px', borderRadius: 6 }}>×</button>
          </div>
        )}
        {!title && (
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: th.muted, fontSize: 20, lineHeight: 1, zIndex: 1, padding: '2px 6px', borderRadius: 6 }}>×</button>
        )}
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

// ── ProgressBar ───────────────────────────────────────────
export function ProgressBar({ value, max = 100, color, style = {} }) {
  const th = T();
  const pct = Math.min(100, Math.round((value / max) * 100));
  const fill = color || th.gold;
  return (
    <div style={{ background: th.bgInset, borderRadius: 999, height: 7, overflow: 'hidden', ...style }}>
      <div style={{ width: `${pct}%`, height: '100%', background: fill, borderRadius: 999, transition: 'width 400ms ease' }} />
    </div>
  );
}

// ── LocationSwitcher ──────────────────────────────────────
export function LocationSwitcher({ locations, value, onChange }) {
  const th = T(), ty = TY();
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
      <button
        onClick={() => onChange(null)}
        style={{
          ...ty.label, padding: '6px 14px', borderRadius: 999,
          background: value === null ? th.accent : th.bgInset,
          color: value === null ? th.onDark : th.muted,
          border: 'none', cursor: 'pointer', transition: 'all 140ms',
        }}
      >All Locations</button>
      {locations.map((loc) => (
        <button
          key={loc.id}
          onClick={() => onChange(loc.id)}
          style={{
            ...ty.label, padding: '6px 14px', borderRadius: 999,
            background: value === loc.id ? th.accent : th.bgInset,
            color: value === loc.id ? th.onDark : th.muted,
            border: 'none', cursor: 'pointer', transition: 'all 140ms',
          }}
        >{loc.name}</button>
      ))}
    </div>
  );
}

// ── DataTable ─────────────────────────────────────────────
export function DataTable({ columns, rows, onRowClick, emptyText = 'No data yet.' }) {
  const th = T(), ty = TY();
  return (
    <div style={{ borderRadius: th.card, border: `1px solid ${th.line}`, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: columns.map((c) => c.width || '1fr').join(' '), background: th.bgInset, borderBottom: `1px solid ${th.line}`, padding: '0 4px' }}>
        {columns.map((col) => (
          <div key={col.key} style={{ ...ty.eyebrow, color: th.muted, padding: '10px 12px' }}>{col.label}</div>
        ))}
      </div>
      {/* Rows */}
      {rows.length === 0 ? (
        <div style={{ ...ty.body, color: th.muted, padding: '28px 16px', textAlign: 'center' }}>{emptyText}</div>
      ) : rows.map((row, i) => (
        <div
          key={row.id || i}
          onClick={() => onRowClick && onRowClick(row)}
          style={{
            display: 'grid', gridTemplateColumns: columns.map((c) => c.width || '1fr').join(' '),
            borderBottom: i < rows.length - 1 ? `1px solid ${th.line}` : 'none',
            background: th.bgCard, padding: '0 4px',
            cursor: onRowClick ? 'pointer' : undefined,
            transition: onRowClick ? 'background 120ms' : undefined,
          }}
          onMouseEnter={onRowClick ? (e) => { e.currentTarget.style.background = th.bg; } : undefined}
          onMouseLeave={onRowClick ? (e) => { e.currentTarget.style.background = th.bgCard; } : undefined}
        >
          {columns.map((col) => (
            <div key={col.key} style={{ padding: '12px 12px', display: 'flex', alignItems: 'center' }}>
              {col.render ? col.render(row[col.key], row) : <span style={{ ...ty.bodySmall, color: th.ink }}>{row[col.key]}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────
export function EmptyState({ icon = '☕', title, description, action }) {
  const th = T(), ty = TY();
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: th.muted }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <h3 style={{ ...ty.h4, color: th.ink, margin: '0 0 8px' }}>{title}</h3>
      {description && <p style={{ ...ty.body, color: th.muted, maxWidth: 360, margin: '0 auto 20px' }}>{description}</p>}
      {action}
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────
export function Toast({ message, type = 'success', onClose }) {
  const th = T(), ty = TY();
  React.useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  const bg = type === 'error' ? th.danger : type === 'warning' ? th.urgent : th.accent;
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, background: bg, color: '#fff',
      padding: '12px 20px', borderRadius: th.pill, boxShadow: th.shadowMd,
      ...ty.button, maxWidth: 400, display: 'flex', gap: 10, alignItems: 'center',
      animation: 'fadeInUp 200ms ease',
    }}>
      <span>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1, opacity: 0.8, padding: 0 }}>×</button>
    </div>
  );
}

// ── useToast hook ─────────────────────────────────────────
export function useToast() {
  const [toast, setToast] = React.useState(null);
  const show = React.useCallback((message, type = 'success') => setToast({ message, type }), []);
  const hide = React.useCallback(() => setToast(null), []);
  const ToastEl = toast ? <Toast message={toast.message} type={toast.type} onClose={hide} /> : null;
  return { show, ToastEl };
}

// ── StatCard ──────────────────────────────────────────────
export function StatCard({ label, value, sub, color }) {
  const th = T(), ty = TY(), sh = SH();
  const c = color || th.accent;
  return (
    <Card style={{ padding: '20px 22px' }}>
      <p style={{ ...ty.eyebrow, color: th.muted, marginBottom: 6 }}>{label}</p>
      <p style={{ ...ty.h2, color: c, margin: '0 0 4px', fontSize: 36 }}>{value}</p>
      {sub && <p style={{ ...ty.caption, color: th.muted }}>{sub}</p>}
    </Card>
  );
}

// ── Divider ───────────────────────────────────────────────
export function Divider({ style = {} }) {
  return <div style={{ borderTop: `1px solid ${(T()).line}`, margin: '20px 0', ...style }} />;
}

// ── Spinner ───────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      border: `2px solid ${(T()).line}`, borderTopColor: (T()).accent,
      borderRadius: '50%', animation: 'spin 600ms linear infinite',
    }} />
  );
}
