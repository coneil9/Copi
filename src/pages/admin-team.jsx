// ═════════════════════════════════════════════════════════
// ADMIN TEAM — Roster and Add Teammate, two sub-views.
// Restyled to use the shared admin-ui components so it matches
// the rest of the dashboard visual system.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { AdminShell } from './admin-shell.jsx';
import {
  PageHeader, Card, Avatar, ProgressBar, StatusChip,
  PrimaryButton, SecondaryButton
} from './admin-ui.jsx';

const SEED_ROSTER = [
  { id: 'r-lili',   name: 'Lili Turko',     position: 'Manager',       email: 'lili@milano.coffee',   onboarding: 100, education: 95,  status: 'Strong' },
  { id: 'r-linda',  name: 'Linda Marchetti', position: 'Owner / Admin', email: 'linda@milano.coffee', onboarding: 100, education: 100, status: 'Strong' },
  { id: 'r-roman',  name: 'Roman Nguyen',   position: 'Barista',       email: 'roman@milano.coffee',  onboarding: 25,  education: 5,   status: 'At risk' },
  { id: 'r-carter', name: 'Carter Wong',    position: 'Lead Barista',  email: 'carter@milano.coffee', onboarding: 95,  education: 25,  status: 'On track' },
  { id: 'r-owen',   name: 'Owen Park',      position: 'Barista',       email: 'owen@milano.coffee',   onboarding: 35,  education: 4,   status: 'At risk' },
  { id: 'r-juno',   name: 'Juno Tremblay',  position: 'Host',          email: 'juno@milano.coffee',   onboarding: 60,  education: 18,  status: 'Onboarding' },
  { id: 'r-sofia',  name: 'Sofia Almeida',  position: 'Barista',       email: 'sofia@milano.coffee',  onboarding: 80,  education: 42,  status: 'On track' },
  { id: 'r-marco',  name: 'Marco Chen',     position: 'Barista',       email: 'marco@milano.coffee',  onboarding: 100, education: 88,  status: 'Ahead' }
];

const DIFFICULTIES = ['Easy', 'Intermediate', 'Advanced'];

// ── Roster view ──────────────────────────────────────────
function RosterView() {
  const [selected, setSelected] = React.useState(() => new Set());
  const [filter, setFilter] = React.useState('All roles');
  const [toast, setToast] = React.useState(null);

  const filters = ['All roles', 'Manager', 'Lead Barista', 'Barista', 'Host'];
  const filteredRoster = filter === 'All roles'
    ? SEED_ROSTER
    : SEED_ROSTER.filter((r) => r.position.includes(filter));

  const toggleAll = () => {
    if (selected.size === filteredRoster.length) setSelected(new Set());
    else setSelected(new Set(filteredRoster.map((r) => r.id)));
  };
  const toggleOne = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };
  const bulkAction = (label) => {
    if (selected.size === 0) setToast('Pick at least one teammate first.');
    else setToast(`${label} queued for ${selected.size} teammate${selected.size === 1 ? '' : 's'}.`);
    setTimeout(() => setToast(null), 2400);
  };

  return (
    <>
      <PageHeader
        eyebrow="OWNER · TEAM"
        title="Here are your employees"
        subtitle="Watch onboarding and education progress at a glance, and run bulk actions from one place."
        actions={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--pearl-bush)',
              borderRadius: 999,
              padding: '8px 16px',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--graphite)'
            }}
          >
            {filters.map((f) => <option key={f}>{f}</option>)}
          </select>
        }
      />

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px minmax(0, 1.4fr) 1fr 1.2fr 1fr 1fr',
          gap: 16,
          padding: '14px 24px',
          background: 'var(--alabaster)',
          borderBottom: '1px solid var(--pearl-bush)',
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--heathered-gray)'
        }}>
          <input
            type="checkbox"
            checked={selected.size === filteredRoster.length && filteredRoster.length > 0}
            onChange={toggleAll}
            aria-label="Select all"
          />
          <span>Teammate</span>
          <span>Email</span>
          <span>Status</span>
          <span>Onboarding</span>
          <span style={{ textAlign: 'right' }}>Education</span>
        </div>

        {filteredRoster.map((r, i) => {
          const checked = selected.has(r.id);
          return (
            <div
              key={r.id}
              className="dash-stagger-item dash-row-hover"
              style={{
                display: 'grid',
                gridTemplateColumns: '40px minmax(0, 1.4fr) 1fr 1.2fr 1fr 1fr',
                gap: 16,
                alignItems: 'center',
                padding: '14px 24px',
                borderBottom: i === filteredRoster.length - 1 ? 'none' : '1px solid var(--pearl-bush)',
                background: checked ? 'rgba(111, 139, 95, 0.08)' : 'transparent',
                '--dash-delay': `${i * 50 + 60}ms`
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleOne(r.id)}
                aria-label={`Select ${r.name}`}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <Avatar name={r.name} size={32} />
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--graphite)'
                  }}>{r.name}</div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'var(--heathered-gray)'
                  }}>{r.position}</div>
                </div>
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--roman-coffee)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {r.email}
              </div>
              <div>
                <StatusChip label={r.status} delay={i * 50 + 220} />
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--graphite)',
                  marginBottom: 6,
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {r.onboarding}%
                </div>
                <ProgressBar pct={r.onboarding} delay={i * 50 + 260} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--graphite)',
                  marginBottom: 6,
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {r.education}%
                </div>
                <ProgressBar pct={r.education} delay={i * 50 + 300} />
              </div>
            </div>
          );
        })}
      </Card>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <SecondaryButton onClick={() => bulkAction('Analyze stats')}>Analyze stats</SecondaryButton>
        <SecondaryButton onClick={() => bulkAction('Assign lessons')}>Assign lessons</SecondaryButton>
        <SecondaryButton onClick={() => bulkAction('Send reminder')}>Send reminder</SecondaryButton>
      </div>

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--glade-green-deep)',
          color: 'var(--alabaster)',
          padding: '10px 18px',
          borderRadius: 999,
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 500,
          boxShadow: '0 8px 24px rgba(31, 26, 20, 0.24)',
          zIndex: 300
        }}>
          {toast}
        </div>
      )}
    </>
  );
}

// ── Add teammate view ────────────────────────────────────
function AddTeammateView() {
  const [name, setName] = React.useState('');
  const [position, setPosition] = React.useState('Barista');
  const [email, setEmail] = React.useState('');
  const [picked, setPicked] = React.useState(['Easy', 'Intermediate']);
  const [context, setContext] = React.useState('');
  const [confirmation, setConfirmation] = React.useState(null);

  const togglePick = (d) => {
    setPicked((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  };
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setConfirmation({ kind: 'error', text: 'Name and email are required.' });
      return;
    }
    setConfirmation({
      kind: 'ok',
      text: `Invite sent to ${email.trim()} with ${picked.length} difficulty level${picked.length === 1 ? '' : 's'} assigned.`
    });
    setName(''); setEmail(''); setContext('');
  };

  return (
    <>
      <PageHeader
        eyebrow="OWNER · ADD TEAMMATE"
        title="Let's grow your team"
        subtitle="Send an invite and Copi will tailor a starting curriculum to the level you choose."
      />

      <form onSubmit={submit}>
        <Card style={{ maxWidth: 760 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Field label="Employee first + last name">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Carter Wong" style={inputStyle} />
            </Field>
            <Field label="Employee position">
              <select value={position} onChange={(e) => setPosition(e.target.value)} style={inputStyle}>
                <option>Barista</option>
                <option>Lead Barista</option>
                <option>Host</option>
                <option>Manager</option>
              </select>
            </Field>
            <Field label="Beginning assigned difficulty">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {DIFFICULTIES.map((d) => {
                  const on = picked.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => togglePick(d)}
                      className="dash-btn"
                      style={{
                        padding: '8px 14px',
                        borderRadius: 999,
                        background: on ? 'var(--glade-green-deep)' : 'var(--alabaster)',
                        color: on ? 'var(--white)' : 'var(--graphite)',
                        border: on ? '1.5px solid var(--glade-green-deep)' : '1.5px solid var(--pearl-bush)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      {d}
                      {on && <span style={{ opacity: 0.85 }}>×</span>}
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="Employee email">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@milano.coffee" style={inputStyle} />
            </Field>
            <Field label="What should Copi know about this employee?">
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={5}
                placeholder="e.g. has worked at a third-wave shop for two years, comfortable on bar but new to pour-over."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </Field>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <PrimaryButton type="submit">+ Send invite</PrimaryButton>
          </div>

          {confirmation && (
            <div style={{
              marginTop: 20,
              padding: '12px 16px',
              borderRadius: 10,
              background: confirmation.kind === 'ok' ? 'rgba(111, 139, 95, 0.12)' : 'rgba(156, 61, 39, 0.10)',
              color: confirmation.kind === 'ok' ? 'var(--glade-green-deep)' : 'var(--danger)',
              fontFamily: 'var(--font-body)',
              fontSize: 13
            }}>
              {confirmation.text}
            </div>
          )}
        </Card>
      </form>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label style={{
      display: 'grid',
      gridTemplateColumns: '220px 1fr',
      alignItems: 'flex-start',
      gap: 20
    }}>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--graphite)',
        paddingTop: 10
      }}>
        {label}
      </span>
      <div>{children}</div>
    </label>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid var(--pearl-bush)',
  background: 'var(--alabaster)',
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  color: 'var(--graphite)',
  outline: 'none'
};

// ── Combined page ────────────────────────────────────────
function AdminTeam({ user = {}, view = 'roster' }) {
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const cafe  = store?.getDefaultCafe ? store.getDefaultCafe() : null;

  const subnav = [
    { label: 'Roster',        route: 'admin-team',     active: view === 'roster' },
    { label: 'Add teammate',  route: 'admin-team-add', active: view === 'add' }
  ];

  return (
    <AdminShell current="team" subnav={subnav} user={user} cafe={cafe}>
      {view === 'add' ? <AddTeammateView /> : <RosterView />}
    </AdminShell>
  );
}

if (typeof window !== 'undefined') {
  window.AdminTeam = AdminTeam;
}

export default AdminTeam;
