// ═════════════════════════════════════════════════════════
// ADMIN LESSONS GRID — Preview of lesson modules cafe employees see.
// Card grid with topics list + three action chips per card.
// Empty card with a "+" lets the owner draft a new lesson module.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { AdminShell, CopiModal } from './admin-shell.jsx';

const DIFFICULTIES = ['Easy', 'Intermediate', 'Advanced'];

// Seed lesson modules — mirrors the wireframe cards plus a couple of
// realistic additions for a Vancouver third-wave shop.
const INITIAL_MODULES = [
  {
    id: 'mod-milano',
    title: 'Intro to Milano',
    topics: ['Our history', 'House values', 'Our mission'],
    assigned: 8,
    difficulties: ['Easy']
  },
  {
    id: 'mod-barista',
    title: 'Barista Intro',
    topics: ['How the machine works', 'Importance of water', 'How to extract'],
    assigned: 6,
    difficulties: ['Easy', 'Intermediate']
  },
  {
    id: 'mod-industry',
    title: 'Coffee Industry',
    topics: ['Origins', 'Coffee history', 'Processing methods'],
    assigned: 4,
    difficulties: ['Intermediate']
  },
  {
    id: 'mod-milk',
    title: 'Milk Science',
    topics: ['Stretch & texture', 'Latte art fundamentals', 'Plant milks at the bar'],
    assigned: 3,
    difficulties: ['Intermediate', 'Advanced']
  },
  {
    id: 'mod-sensory',
    title: 'Sensory & Cupping',
    topics: ['Tasting protocol', 'Reading the cup', 'Calibrating with your team'],
    assigned: 2,
    difficulties: ['Advanced']
  }
];

function ActionChip({ label, onClick, danger = false }) {
  const colors = danger
    ? { fg: '#7A2B1F', bg: 'transparent', border: '#7A2B1F' }
    : { fg: '#2D5016', bg: 'transparent', border: '#2D5016' };
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 12px',
        borderRadius: 8,
        background: colors.bg,
        border: `1.4px solid ${colors.border}`,
        color: colors.fg,
        fontFamily: '"Inter", sans-serif',
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

function ModuleCard({ module, onPreview, onAssign, onDifficulty }) {
  return (
    <article style={{
      background: '#FBF8F0',
      border: '1px solid var(--copi-line)',
      borderRadius: 14,
      padding: 22,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      minHeight: 240
    }}>
      <header>
        <h3 style={{
          fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 19,
          color: 'var(--copi-ink)',
          margin: '0 0 4px 0',
          letterSpacing: '-0.005em'
        }}>
          {module.title}
        </h3>
        <div style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: 11,
          color: 'var(--copi-muted)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase'
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
            fontFamily: '"Inter", sans-serif',
            fontSize: 13,
            color: 'var(--copi-ink)',
            display: 'flex',
            gap: 8
          }}>
            <span style={{ color: '#44704B', fontWeight: 600 }}>–</span>
            {t}
          </li>
        ))}
      </ul>

      <footer style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
        <ActionChip label="Preview + Refine"   onClick={onPreview} danger />
        <ActionChip label="Assign Employees"   onClick={onAssign} />
        <ActionChip label="Select Difficulties" onClick={onDifficulty} />
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
        border: '2px dashed var(--copi-line)',
        borderRadius: 14,
        minHeight: 240,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 10,
        color: 'var(--copi-muted)',
        fontFamily: '"Inter", sans-serif',
        fontSize: 14,
        fontWeight: 500,
        transition: 'background 160ms, border-color 160ms'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(68,112,75,0.06)';
        e.currentTarget.style.borderColor = '#2D5016';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = 'var(--copi-line)';
      }}
    >
      <span style={{
        fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif',
        fontWeight: 600,
        fontSize: 48,
        lineHeight: 1,
        color: '#2D5016'
      }}>+</span>
      Add a new lesson
    </button>
  );
}

function AdminLessonsGrid({ user = {} }) {
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const cafe  = store?.getDefaultCafe ? store.getDefaultCafe() : null;

  const [modules, setModules] = React.useState(INITIAL_MODULES);
  const [modal, setModal] = React.useState(null);
  const [difficultyPicker, setDifficultyPicker] = React.useState(null);

  const openModule = (m, kind) => {
    if (kind === 'preview') {
      setModal({
        title: `Refine "${m.title}"`,
        body: `Cupper will rebuild this module from your latest source docs and house standards. You'll get a draft to review — no changes go live until you publish.`,
        accent: '#7A2B1F'
      });
    } else if (kind === 'assign') {
      setModal({
        title: `Assign "${m.title}"`,
        body: `Pick teammates from your roster to enrol in this module. They'll see it on their phone right after you confirm.`,
        accent: '#2D5016'
      });
    } else if (kind === 'difficulty') {
      setDifficultyPicker(m.id);
    }
  };

  const toggleDifficulty = (id, level) => {
    setModules((prev) => prev.map((m) => {
      if (m.id !== id) return m;
      const has = m.difficulties.includes(level);
      return {
        ...m,
        difficulties: has
          ? m.difficulties.filter((x) => x !== level)
          : [...m.difficulties, level]
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
        topics: ['Add a topic…'],
        assigned: 0,
        difficulties: ['Easy']
      }
    ]);
  };

  return (
    <AdminShell current="lessons" user={user} cafe={cafe}>
      <h1 style={{
        fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif',
        fontWeight: 700,
        fontSize: 36,
        color: 'var(--copi-ink)',
        margin: '0 0 28px 0',
        letterSpacing: '-0.01em'
      }}>
        Let's preview what your employees will see.
      </h1>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 18
      }}>
        {modules.map((m) => (
          <ModuleCard
            key={m.id}
            module={m}
            onPreview={() => openModule(m, 'preview')}
            onAssign={() => openModule(m, 'assign')}
            onDifficulty={() => openModule(m, 'difficulty')}
          />
        ))}
        <EmptyCard onClick={addEmpty} />
      </section>

      <CopiModal
        title={modal?.title}
        body={modal?.body}
        accent={modal?.accent}
        onClose={() => setModal(null)}
      />

      {/* Inline difficulty picker — appears as its own simple modal */}
      {difficultyPicker && (() => {
        const m = modules.find((x) => x.id === difficultyPicker);
        if (!m) return null;
        return (
          <div
            onClick={() => setDifficultyPicker(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(31, 27, 20, 0.55)',
              display: 'grid', placeItems: 'center',
              padding: 24
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FBF8F0',
                borderRadius: 16,
                padding: 32,
                maxWidth: 420,
                width: '100%',
                border: '1px solid var(--copi-line)',
                boxShadow: '0 24px 64px rgba(31,27,20,0.24)'
              }}
            >
              <div style={{
                fontFamily: '"Fredoka", "Nunito", system-ui, sans-serif',
                fontWeight: 700,
                fontSize: 20,
                color: 'var(--copi-ink)',
                marginBottom: 6
              }}>
                Difficulty for "{m.title}"
              </div>
              <div style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: 13,
                color: 'var(--copi-muted)',
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
                      onClick={() => toggleDifficulty(m.id, d)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 999,
                        background: on ? '#2D5016' : '#FBF8F0',
                        color: on ? '#F5F0E8' : 'var(--copi-ink)',
                        border: on ? '1.5px solid #2D5016' : '1.5px solid var(--copi-line)',
                        fontFamily: '"Inter", sans-serif',
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
                  onClick={() => setDifficultyPicker(null)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 999,
                    background: '#2D5016',
                    color: '#F5F0E8',
                    border: 'none',
                    fontFamily: '"Inter", sans-serif',
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
  window.AdminLessonsGrid = AdminLessonsGrid;
}

export default AdminLessonsGrid;
