// ═════════════════════════════════════════════════════════
// CURRICULUM PAGE — Card grid of lesson modules with filter/sort bar.
// Matches the dashboard design system: Playpen Sans headings, Hanken
// Grotesk body, palette tokens only (no hardcoded hexes).
// ═════════════════════════════════════════════════════════

import React from 'react';
import { AdminShell, CopiModal } from './admin-shell.jsx';

const DIFFICULTIES = ['Easy', 'Intermediate', 'Advanced'];
const STATUSES     = ['All', 'Assigned', 'Unassigned'];

// Seed modules — realistic content for a Vancouver third-wave shop.
const INITIAL_MODULES = [
  {
    id: 'mod-milano',
    title: 'Intro to Milano',
    volume: 'VOL · I',
    level: 'Beginner',
    assigned: 8,
    difficulties: ['Easy'],
    topics: ['Our history', 'House values', 'Our mission']
  },
  {
    id: 'mod-barista',
    title: 'Barista Intro',
    volume: 'VOL · I',
    level: 'Beginner',
    assigned: 6,
    difficulties: ['Easy', 'Intermediate'],
    topics: ['How the machine works', 'Importance of water', 'How to extract']
  },
  {
    id: 'mod-industry',
    title: 'Coffee Industry',
    volume: 'VOL · II',
    level: 'Intermediate',
    assigned: 4,
    difficulties: ['Intermediate'],
    topics: ['Origins', 'Coffee history', 'Processing methods']
  },
  {
    id: 'mod-milk',
    title: 'Milk Science',
    volume: 'VOL · II',
    level: 'Intermediate',
    assigned: 3,
    difficulties: ['Intermediate', 'Advanced'],
    topics: ['Stretch & texture', 'Latte art fundamentals', 'Plant milks at the bar']
  },
  {
    id: 'mod-sensory',
    title: 'Sensory & Cupping',
    volume: 'VOL · III',
    level: 'Advanced',
    assigned: 2,
    difficulties: ['Advanced'],
    topics: ['Tasting protocol', 'Reading the cup', 'Calibrating with your team']
  },
  {
    id: 'mod-service',
    title: 'Service & Hospitality',
    volume: 'VOL · I',
    level: 'Beginner',
    assigned: 7,
    difficulties: ['Easy'],
    topics: ['Greeting + reading the room', 'Suggestive selling', 'Handling complaints']
  }
];

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 999,
        background: active ? 'var(--glade-green-deep)' : 'var(--alabaster)',
        color: active ? 'var(--white)' : 'var(--graphite)',
        border: active ? '1.5px solid var(--glade-green-deep)' : '1.5px solid var(--heathered-gray)',
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer'
      }}
    >
      {label}
    </button>
  );
}

function ActionButton({ label, onClick, variant = 'solid' }) {
  if (variant === 'outline') {
    return (
      <button
        onClick={onClick}
        style={{
          padding: '7px 12px',
          borderRadius: 8,
          background: 'transparent',
          border: '1.4px solid var(--glade-green-deep)',
          color: 'var(--glade-green-deep)',
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        {label}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 12px',
        borderRadius: 8,
        background: 'var(--glade-green-deep)',
        border: '1.4px solid var(--glade-green-deep)',
        color: 'var(--white)',
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }}
    >
      {label}
    </button>
  );
}

function ModuleCard({ module, onAction }) {
  return (
    <article style={{
      background: 'var(--alabaster)',
      border: '1px solid var(--heathered-gray)',
      borderRadius: 14,
      padding: 22,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      minHeight: 270
    }}>
      <header>
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 8,
          flexWrap: 'wrap'
        }}>
          <span style={{
            padding: '3px 10px',
            borderRadius: 6,
            background: 'var(--pearl-bush)',
            color: 'var(--roman-coffee)',
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em'
          }}>{module.volume}</span>
          <span style={{
            padding: '3px 10px',
            borderRadius: 6,
            background: 'rgba(111, 139, 95, 0.18)',
            color: 'var(--glade-green-deep)',
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.06em'
          }}>{module.level.toUpperCase()}</span>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 19,
          color: 'var(--graphite)',
          margin: '0 0 4px 0',
          letterSpacing: '-0.005em'
        }}>
          {module.title}
        </h3>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          color: 'var(--roman-coffee)',
          letterSpacing: '0.04em'
        }}>
          {module.assigned} assigned · {module.difficulties.join(' / ')}
        </div>
      </header>

      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flex: 1
      }}>
        {module.topics.map((t, i) => (
          <li key={i} style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--graphite)',
            display: 'flex',
            gap: 8
          }}>
            <span style={{ color: 'var(--glade-green)', fontWeight: 700 }}>–</span>
            {t}
          </li>
        ))}
      </ul>

      <footer style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <ActionButton label="Preview + Refine"   onClick={() => onAction(module, 'preview')} variant="outline" />
        <ActionButton label="Assign Employees"   onClick={() => onAction(module, 'assign')} />
        <ActionButton label="Select Difficulties" onClick={() => onAction(module, 'difficulty')} variant="outline" />
      </footer>
    </article>
  );
}

function EmptyCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: '2px dashed var(--heathered-gray)',
        borderRadius: 14,
        minHeight: 270,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 10,
        color: 'var(--roman-coffee)',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 500,
        transition: 'background 160ms, border-color 160ms'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(111, 139, 95, 0.08)';
        e.currentTarget.style.borderColor = 'var(--glade-green-deep)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = 'var(--heathered-gray)';
      }}
    >
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 48,
        lineHeight: 1,
        color: 'var(--glade-green-deep)'
      }}>+</span>
      Add a new module
    </button>
  );
}

function AdminCurriculumPage({ user = {} }) {
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const cafe  = store?.getDefaultCafe ? store.getDefaultCafe() : null;

  const [modules, setModules] = React.useState(INITIAL_MODULES);
  const [status,  setStatus]  = React.useState('All');
  const [diffs,   setDiffs]   = React.useState(['Easy', 'Intermediate', 'Advanced']);
  const [sort,    setSort]    = React.useState('default');
  const [modal,   setModal]   = React.useState(null);
  const [diffPick, setDiffPick] = React.useState(null);

  const toggleDiff = (d) => {
    setDiffs((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  };

  const visible = React.useMemo(() => {
    let list = modules.filter((m) => {
      if (status === 'Assigned'   && m.assigned <= 0) return false;
      if (status === 'Unassigned' && m.assigned > 0)  return false;
      if (!m.difficulties.some((d) => diffs.includes(d))) return false;
      return true;
    });
    if (sort === 'assigned') list = [...list].sort((a, b) => b.assigned - a.assigned);
    if (sort === 'alpha')    list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [modules, status, diffs, sort]);

  const handleAction = (m, kind) => {
    if (kind === 'preview') {
      setModal({
        title: `Refine "${m.title}"`,
        body: `Cupper will rebuild this module from your latest source docs and house standards. You'll get a draft to review — no changes go live until you publish.`,
        accent: 'var(--danger)'
      });
    } else if (kind === 'assign') {
      setModal({
        title: `Assign "${m.title}"`,
        body: `Pick teammates from your roster to enrol in this module. They'll see it on their phone right after you confirm.`,
        accent: 'var(--glade-green-deep)'
      });
    } else if (kind === 'difficulty') {
      setDiffPick(m.id);
    }
  };

  const setModuleDifficulties = (id, level) => {
    setModules((prev) => prev.map((m) => {
      if (m.id !== id) return m;
      const has = m.difficulties.includes(level);
      return {
        ...m,
        difficulties: has ? m.difficulties.filter((x) => x !== level) : [...m.difficulties, level]
      };
    }));
  };

  const addEmpty = () => {
    const n = modules.length + 1;
    setModules([
      ...modules,
      {
        id: `mod-new-${n}`,
        title: 'Untitled module',
        volume: 'VOL · I',
        level: 'Beginner',
        assigned: 0,
        difficulties: ['Easy'],
        topics: ['Add a topic…']
      }
    ]);
  };

  return (
    <AdminShell current="curriculum" user={user} cafe={cafe}>
      {/* Eyebrow + title */}
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--glade-green-deep)',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        marginBottom: 10
      }}>
        OWNER · CURRICULUM
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 48,
        color: 'var(--graphite)',
        margin: '0 0 28px 0',
        letterSpacing: '-0.01em'
      }}>
        Curriculum
      </h1>

      {/* Filter / sort bar */}
      <div style={{
        background: 'var(--alabaster)',
        border: '1px solid var(--heathered-gray)',
        borderRadius: 14,
        padding: '14px 18px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--roman-coffee)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>Status</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {STATUSES.map((s) => (
              <FilterChip key={s} label={s} active={status === s} onClick={() => setStatus(s)} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--roman-coffee)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>Difficulty</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {DIFFICULTIES.map((d) => (
              <FilterChip key={d} label={d} active={diffs.includes(d)} onClick={() => toggleDiff(d)} />
            ))}
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--roman-coffee)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--heathered-gray)',
              borderRadius: 8,
              padding: '6px 12px',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--graphite)'
            }}
          >
            <option value="default">Default</option>
            <option value="alpha">A → Z</option>
            <option value="assigned">Most assigned</option>
          </select>
        </div>
      </div>

      {/* Card grid */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 18
      }}>
        {visible.map((m) => (
          <ModuleCard key={m.id} module={m} onAction={handleAction} />
        ))}
        <EmptyCard onClick={addEmpty} />
      </section>

      <CopiModal
        title={modal?.title}
        body={modal?.body}
        accent={modal?.accent}
        onClose={() => setModal(null)}
      />

      {/* Difficulty picker */}
      {diffPick && (() => {
        const m = modules.find((x) => x.id === diffPick);
        if (!m) return null;
        return (
          <div
            onClick={() => setDiffPick(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(31, 26, 20, 0.55)',
              display: 'grid', placeItems: 'center',
              padding: 24
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--alabaster)',
                borderRadius: 16,
                padding: 32,
                maxWidth: 420,
                width: '100%',
                border: '1px solid var(--heathered-gray)',
                boxShadow: '0 24px 64px rgba(31, 26, 20, 0.28)'
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 20,
                color: 'var(--graphite)',
                marginBottom: 6
              }}>
                Difficulty for "{m.title}"
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--roman-coffee)',
                marginBottom: 20
              }}>
                Pick the levels this module will be served at.
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                {DIFFICULTIES.map((d) => {
                  const on = m.difficulties.includes(d);
                  return (
                    <button
                      key={d}
                      onClick={() => setModuleDifficulties(m.id, d)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 999,
                        background: on ? 'var(--glade-green-deep)' : 'var(--white)',
                        color: on ? 'var(--white)' : 'var(--graphite)',
                        border: on ? '1.5px solid var(--glade-green-deep)' : '1.5px solid var(--heathered-gray)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setDiffPick(null)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 999,
                    background: 'var(--glade-green-deep)',
                    color: 'var(--white)',
                    border: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </AdminShell>
  );
}

if (typeof window !== 'undefined') {
  // Renamed to avoid colliding with the legacy inline AdminCurriculumPage in App.jsx.
  window.AdminCurriculumPageNew = AdminCurriculumPage;
}

export default AdminCurriculumPage;
