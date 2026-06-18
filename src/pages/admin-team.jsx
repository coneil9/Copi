// ═════════════════════════════════════════════════════════
// ADMIN TEAM — Roster and Add Teammate, two sub-views.
// Sub-view is chosen by the `view` prop ('roster' | 'add') so
// the same module can serve both routes 'admin-team' and
// 'admin-team-add' without duplicating the shell logic.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { AdminShell } from './admin-shell.jsx';

// Realistic Vancouver-cafe roster — covers the spread of roles and
// onboarding/education progress shown in the wireframe.
const SEED_ROSTER = [
  { id: 'r-lili',   name: 'Lili Turko',     position: 'Manager',       email: 'lili@milano.coffee',     onboarding: 100, education: 95 },
  { id: 'r-linda',  name: 'Linda Marchetti', position: 'Owner / Admin', email: 'linda@milano.coffee',   onboarding: 100, education: 100 },
  { id: 'r-roman',  name: 'Roman Nguyen',   position: 'Barista',       email: 'roman@milano.coffee',    onboarding: 25,  education: 5 },
  { id: 'r-carter', name: 'Carter Wong',    position: 'Lead Barista',  email: 'carter@milano.coffee',   onboarding: 95,  education: 25 },
  { id: 'r-owen',   name: 'Owen Park',      position: 'Barista',       email: 'owen@milano.coffee',     onboarding: 35,  education: 4 },
  { id: 'r-juno',   name: 'Juno Tremblay',  position: 'Host',          email: 'juno@milano.coffee',     onboarding: 60,  education: 18 },
  { id: 'r-sofia',  name: 'Sofia Almeida',  position: 'Barista',       email: 'sofia@milano.coffee',    onboarding: 80,  education: 42 },
  { id: 'r-marco',  name: 'Marco Chen',     position: 'Barista',       email: 'marco@milano.coffee',    onboarding: 100, education: 88 },
];

// Tiny pill-shaped progress meter used in the table cells.
function PercentPill({ value }) {
  const tone =
    value >= 80 ? { bg: 'rgba(68,112,75,0.16)',  fg: '#2D5016' }
    : value >= 40 ? { bg: 'rgba(196,148,85,0.18)', fg: '#8A5E26' }
    : { bg: 'rgba(122,43,31,0.14)', fg: '#7A2B1F' };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '4px 10px',
      borderRadius: 999,
      background: tone.bg,
      color: tone.fg,
      fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
      fontSize: 12,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums'
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: tone.fg
      }} />
      {value}%
    </span>
  );
}

// ═══════════════════════════════════
// Roster view
// ═══════════════════════════════════
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
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const bulkAction = (label) => {
    if (selected.size === 0) {
      setToast('Pick at least one teammate first.');
    } else {
      setToast(`${label} queued for ${selected.size} teammate${selected.size === 1 ? '' : 's'}.`);
    }
    setTimeout(() => setToast(null), 2400);
  };

  return (
    <>
      <h1 style={{
        fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif',
        fontWeight: 700,
        fontSize: 36,
        color: 'var(--copi-ink)',
        margin: '0 0 28px 0'
      }}>
        Here are your employees.
      </h1>

      <div style={{
        background: '#FBF8F0',
        border: '1px solid var(--copi-line)',
        borderRadius: 14,
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
            fontSize: 13
          }}>
            <thead>
              <tr style={{ background: '#F5F0E8' }}>
                <th style={th}>
                  <input
                    type="checkbox"
                    checked={selected.size === filteredRoster.length && filteredRoster.length > 0}
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                <th style={th}>Name</th>
                <th style={th}>Position</th>
                <th style={th}>Email</th>
                <th style={{ ...th, textAlign: 'center' }}>Onboarding</th>
                <th style={{ ...th, textAlign: 'center' }}>Education</th>
                <th style={{ ...th, textAlign: 'right' }}>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                      background: '#FBF8F0',
                      border: '1px solid var(--copi-line)',
                      borderRadius: 8,
                      padding: '5px 10px',
                      fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
                      fontSize: 12,
                      color: 'var(--copi-ink)'
                    }}
                  >
                    {filters.map((f) => <option key={f}>{f}</option>)}
                  </select>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRoster.map((r, i) => {
                const checked = selected.has(r.id);
                return (
                  <tr key={r.id} style={{
                    borderTop: '1px solid var(--copi-line)',
                    background: checked ? 'rgba(68,112,75,0.06)' : (i % 2 === 0 ? '#FBF8F0' : '#F8F2E2')
                  }}>
                    <td style={td}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOne(r.id)}
                        aria-label={`Select ${r.name}`}
                      />
                    </td>
                    <td style={{ ...td, fontWeight: 600, color: 'var(--copi-ink)' }}>{r.name}</td>
                    <td style={td}>{r.position}</td>
                    <td style={{ ...td, color: 'var(--copi-muted)' }}>{r.email}</td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      <PercentPill value={r.onboarding} />
                    </td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      <PercentPill value={r.education} />
                    </td>
                    <td style={{ ...td, textAlign: 'right', color: 'var(--copi-muted)' }}>—</td>
                  </tr>
                );
              })}
              {/* Empty rows so the table reads like the wireframe sketch */}
              {Array.from({ length: Math.max(0, 10 - filteredRoster.length) }).map((_, i) => (
                <tr key={`empty-${i}`} style={{ borderTop: '1px solid var(--copi-line)' }}>
                  <td style={td}>&nbsp;</td>
                  <td style={td} colSpan={6}>&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk action buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <SecondaryButton onClick={() => bulkAction('Analyze stats')}>Analyze Stats</SecondaryButton>
        <SecondaryButton onClick={() => bulkAction('Assign lessons')}>Assign Lessons</SecondaryButton>
        <SecondaryButton onClick={() => bulkAction('Send reminder')}>Send Reminder</SecondaryButton>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#2D5016',
          color: '#F5F0E8',
          padding: '10px 18px',
          borderRadius: 999,
          fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
          fontSize: 13,
          fontWeight: 500,
          boxShadow: '0 8px 24px rgba(31,27,20,0.24)',
          zIndex: 300
        }}>
          {toast}
        </div>
      )}
    </>
  );
}

const th = {
  textAlign: 'left',
  padding: '12px 16px',
  fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--copi-muted)'
};

const td = {
  padding: '12px 16px',
  fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
  fontSize: 13,
  color: 'var(--copi-ink)',
  verticalAlign: 'middle'
};

function SecondaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#FBF8F0',
        border: '1.5px solid #2D5016',
        color: '#2D5016',
        padding: '10px 18px',
        borderRadius: 999,
        fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
}

// ═══════════════════════════════════
// Add Teammate view
// ═══════════════════════════════════
const DIFFICULTIES = ['Easy', 'Intermediate', 'Advanced'];

function AddTeammateView() {
  const [name, setName] = React.useState('');
  const [position, setPosition] = React.useState('Barista');
  const [email, setEmail] = React.useState('');
  const [picked, setPicked] = React.useState(['Easy', 'Intermediate']);
  const [context, setContext] = React.useState('');
  const [confirmation, setConfirmation] = React.useState(null);

  const togglePick = (d) => {
    setPicked((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
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
    <form onSubmit={submit} style={{ maxWidth: 720 }}>
      <h1 style={{
        fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif',
        fontWeight: 700,
        fontSize: 36,
        color: 'var(--copi-ink)',
        margin: '0 0 32px 0'
      }}>
        Let's grow your team!
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Field label="Employee first + last name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Carter Wong"
            style={inputStyle}
          />
        </Field>

        <Field label="Employee position">
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            style={inputStyle}
          >
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
                  style={{
                    padding: '8px 14px',
                    borderRadius: 999,
                    background: on ? '#2D5016' : '#FBF8F0',
                    color: on ? '#F5F0E8' : 'var(--copi-ink)',
                    border: on ? '1.5px solid #2D5016' : '1.5px solid var(--copi-line)',
                    fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
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
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@milano.coffee"
            style={inputStyle}
          />
        </Field>

        <Field label="What should Copi know about this employee?">
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={5}
            placeholder="e.g. has worked at a third-wave shop for two years, comfortable on bar but new to pour-over."
            style={{ ...inputStyle, resize: 'vertical', fontFamily: '"Hanken Grotesk", "Inter", sans-serif' }}
          />
        </Field>
      </div>

      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#2D5016',
            color: '#F5F0E8',
            padding: '12px 24px',
            borderRadius: 999,
            border: 'none',
            cursor: 'pointer',
            fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          + Send invite
        </button>
      </div>

      {confirmation && (
        <div style={{
          marginTop: 20,
          padding: '12px 16px',
          borderRadius: 10,
          background: confirmation.kind === 'ok' ? 'rgba(68,112,75,0.10)' : 'rgba(122,43,31,0.10)',
          color: confirmation.kind === 'ok' ? '#2D5016' : '#7A2B1F',
          fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
          fontSize: 13
        }}>
          {confirmation.text}
        </div>
      )}
    </form>
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
        fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--copi-ink)',
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
  border: '1px solid var(--copi-line)',
  background: '#F5F0E8',
  fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
  fontSize: 14,
  color: 'var(--copi-ink)',
  outline: 'none'
};

// ═══════════════════════════════════
// Combined page (chooses sub-view)
// ═══════════════════════════════════
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
