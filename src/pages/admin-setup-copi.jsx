// ═════════════════════════════════════════════════════════
// ADMIN SETUP COPI — Settings > Set up (Copi AI) with four tabs:
// General · Documents · Education · Refine.
// All editing is client-side state; Refine/Verify buttons open a
// shared modal placeholder.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { AdminShell, YellowMark, CopiModal } from './admin-shell.jsx';
import { PageHeader } from './admin-ui.jsx';

const TABS = ['General', 'Documents', 'Education', 'Refine'];

// ═══════════════════════════════════
// Shared bits
// ═══════════════════════════════════
function RefineButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 12px',
        borderRadius: 8,
        background: 'transparent',
        border: '1.4px solid #7A2B1F',
        color: '#7A2B1F',
        fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        borderRadius: 999,
        background: '#2D5016',
        color: '#F5F0E8',
        border: 'none',
        fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        ...style
      }}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--copi-ink)',
      marginBottom: 8
    }}>
      {children}
    </div>
  );
}

function FoundCard({ label, sublabel, value, onChange, onAdjust, onRefine, multiline = true, listMode = false }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '180px 1fr auto',
      gap: 20,
      alignItems: 'flex-start',
      marginBottom: 24
    }}>
      <div>
        <div style={{
          fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--copi-ink)'
        }}>{label}</div>
        {sublabel && (
          <div style={{
            fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
            fontSize: 11,
            color: 'var(--copi-muted)',
            marginTop: 2
          }}>{sublabel}</div>
        )}
      </div>

      {listMode ? (
        <ol style={{
          background: '#F5F0E8',
          border: '1px solid var(--copi-line)',
          borderRadius: 12,
          padding: '14px 20px 14px 36px',
          margin: 0,
          minHeight: 110,
          fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
          fontSize: 13,
          color: 'var(--copi-ink)',
          lineHeight: 1.7
        }}>
          {value.map((row, i) => (
            <li key={i}>
              <input
                value={row}
                onChange={(e) => onChange(i, e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  color: 'inherit'
                }}
              />
            </li>
          ))}
        </ol>
      ) : multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            background: '#F5F0E8',
            border: '1px solid var(--copi-line)',
            borderRadius: 12,
            padding: '12px 16px',
            fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
            fontSize: 13,
            color: 'var(--copi-ink)',
            lineHeight: 1.6,
            outline: 'none',
            resize: 'vertical'
          }}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            background: '#F5F0E8',
            border: '1px solid var(--copi-line)',
            borderRadius: 12,
            padding: '10px 16px',
            fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
            fontSize: 13,
            color: 'var(--copi-ink)',
            outline: 'none'
          }}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <RefineButton onClick={onAdjust}>Adjust text</RefineButton>
        <RefineButton onClick={onRefine}>Help Copi Refine</RefineButton>
      </div>
    </div>
  );
}

// ═══════════════════════════════════
// General tab
// ═══════════════════════════════════
function GeneralTab({ openModal }) {
  const [domain,   setDomain]   = React.useState('milano.coffee');
  const [about,    setAbout]    = React.useState(
    'Milano is a two-location Italian-style espresso bar in Vancouver. We opened on Main Street in 2017 and added our Kits storefront in 2022. We pour single-origin espresso, milk drinks made with house-stretched whole milk, and a small batch-brew rotation.'
  );
  const [values, setValues] = React.useState(
    'We hire for warmth before skill. Every drink leaves the bar at the same quality as the one before it, even on a Saturday rush. We name growers when we can, and we taste through the menu together every Monday.'
  );
  const [products, setProducts] = React.useState([
    "Brian's Summertime — washed Ethiopia Yirgacheffe, jasmine + apricot",
    'Butter — Brazil Daterra, milk-chocolate forward, espresso staple',
    'Cognac — natural Colombia La Esperanza, brandy + dark fruit'
  ]);

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '180px 1fr',
        gap: 20,
        alignItems: 'center',
        marginBottom: 32
      }}>
        <SectionLabel>Company domain</SectionLabel>
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 360,
            background: '#F5F0E8',
            border: '1px solid var(--copi-line)',
            borderRadius: 12,
            padding: '10px 16px',
            fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
            fontSize: 13,
            color: 'var(--copi-ink)',
            outline: 'none'
          }}
        />
      </div>

      <h3 style={{
        fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif',
        fontWeight: 600,
        fontSize: 20,
        color: 'var(--copi-ink)',
        margin: '0 0 16px 0'
      }}>
        What Copi found:
      </h3>

      <FoundCard
        label="About Milano"
        sublabel="+ history"
        value={about}
        onChange={setAbout}
        onAdjust={() => openModal({ title: 'Adjust About Milano', body: 'Edit inline above — your changes save as you type.' })}
        onRefine={() => openModal({ title: 'Help Copi Refine', body: 'Cupper will re-read your handbook and source docs to update this section. Drafts come back to you for review.' })}
      />

      <FoundCard
        label="Milano's value + goals"
        value={values}
        onChange={setValues}
        onAdjust={() => openModal({ title: 'Adjust values + goals', body: 'Edit inline above — your changes save as you type.' })}
        onRefine={() => openModal({ title: 'Help Copi Refine', body: 'Cupper will re-extract values and goals from your latest brand docs.' })}
      />

      <FoundCard
        label="Milano's products"
        sublabel="+ descriptions"
        listMode
        value={products}
        onChange={(i, v) => setProducts((prev) => prev.map((p, idx) => idx === i ? v : p))}
        onAdjust={() => openModal({ title: 'Adjust products', body: 'Edit each line inline — drag to reorder coming soon.' })}
        onRefine={() => openModal({ title: 'Help Copi Refine', body: 'Cupper will scan your menu and roastery PDFs and refresh tasting notes.' })}
      />
    </div>
  );
}

// ═══════════════════════════════════
// Documents tab
// ═══════════════════════════════════
function DocSlot({ title, sublabel, onAdjust, onRefine }) {
  const [hasFile, setHasFile] = React.useState(false);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '180px 1fr auto',
      gap: 20,
      alignItems: 'center',
      marginBottom: 22
    }}>
      <div>
        <div style={{
          fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--copi-ink)'
        }}>{title}</div>
        {sublabel && (
          <div style={{
            fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
            fontSize: 11,
            color: 'var(--copi-muted)',
            marginTop: 2
          }}>{sublabel}</div>
        )}
      </div>

      <label style={{
        background: hasFile ? 'rgba(68,112,75,0.10)' : '#F5F0E8',
        border: `1.5px dashed ${hasFile ? '#2D5016' : 'var(--copi-line)'}`,
        borderRadius: 12,
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
        color: hasFile ? '#2D5016' : 'var(--copi-muted)',
        fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
        fontSize: 13
      }}>
        <input
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => setHasFile(e.target.files && e.target.files.length > 0)}
        />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V8" />
          <path d="M8 12l4-4 4 4" />
          <path d="M4 19h16" />
        </svg>
        {hasFile ? 'File uploaded · click to replace' : 'Drop a file or click to upload'}
      </label>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <RefineButton onClick={onAdjust}>Adjust text</RefineButton>
        <RefineButton onClick={onRefine}>Help Copi Refine</RefineButton>
      </div>
    </div>
  );
}

function DocumentsTab({ openModal }) {
  return (
    <div>
      <h3 style={{
        fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif',
        fontWeight: 600,
        fontSize: 22,
        color: 'var(--copi-ink)',
        margin: '0 0 20px 0'
      }}>
        Let's get everything off paper.
      </h3>

      <DocSlot
        title="Intro docs"
        sublabel="policies + handbook"
        onAdjust={() => openModal({ title: 'Adjust intro docs', body: 'Edit the extracted text Cupper pulled from this upload.' })}
        onRefine={() => openModal({ title: 'Help Copi Refine', body: 'Cupper will re-summarise the handbook and propose updates.' })}
      />
      <DocSlot
        title="Cafe operations"
        sublabel="open / close, safety, SOPs"
        onAdjust={() => openModal({ title: 'Adjust operations', body: 'Edit the SOPs Copi found in your uploads.' })}
        onRefine={() => openModal({ title: 'Help Copi Refine', body: 'Cupper will check for missing or outdated steps.' })}
      />
      <DocSlot
        title="Recipes + additional"
        sublabel="house menu, dial-ins, garnishes"
        onAdjust={() => openModal({ title: 'Adjust recipes', body: 'Edit the recipe cards Cupper drafted from your menu uploads.' })}
        onRefine={() => openModal({ title: 'Help Copi Refine', body: 'Cupper will reconcile dial-ins with current bean rotation.' })}
      />
    </div>
  );
}

// ═══════════════════════════════════
// Education tab
// ═══════════════════════════════════
function ChipPick({ items, picked, onToggle }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {items.map((it) => {
        const on = picked.includes(it);
        return (
          <button
            key={it}
            onClick={() => onToggle(it)}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              background: on ? '#2D5016' : '#FBF8F0',
              color: on ? '#F5F0E8' : 'var(--copi-ink)',
              border: on ? '1.5px solid #2D5016' : '1.5px solid var(--copi-line)',
              fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {it}
          </button>
        );
      })}
    </div>
  );
}

function EducationTab({ openModal }) {
  const [topics, setTopics] = React.useState(['Barista Knowledge']);
  const [levels, setLevels] = React.useState(['Beginner', 'Intermediate']);
  const [preview, setPreview] = React.useState(null);

  const toggle = (set, value, setter) =>
    setter(set.includes(value) ? set.filter((x) => x !== value) : [...set, value]);

  const start = () => {
    setPreview(
      `Based on ${topics.join(' + ')} at ${levels.join(' / ')}: Cupper will draft modules covering bar setup, dial-in protocol, milk stretch, and a small origin track. Total est. ${topics.length * levels.length * 4} lessons.`
    );
  };

  return (
    <div>
      <h3 style={{
        fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif',
        fontWeight: 600,
        fontSize: 22,
        color: 'var(--copi-ink)',
        margin: '0 0 20px 0'
      }}>
        Let's choose how to supplement your team with education.
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 28 }}>
        <div>
          <SectionLabel>What would you like to train?</SectionLabel>
          <div style={{
            fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
            fontSize: 12,
            color: 'var(--copi-muted)',
            marginBottom: 10
          }}>
            Select all that apply.
          </div>
          <ChipPick
            items={['Barista Knowledge', 'Coffee Knowledge']}
            picked={topics}
            onToggle={(v) => toggle(topics, v, setTopics)}
          />
        </div>

        <div>
          <SectionLabel>What levels would you offer?</SectionLabel>
          <div style={{
            fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
            fontSize: 12,
            color: 'var(--copi-muted)',
            marginBottom: 10
          }}>
            Select all that apply.
          </div>
          <ChipPick
            items={['Beginner', 'Intermediate', 'Advanced']}
            picked={levels}
            onToggle={(v) => toggle(levels, v, setLevels)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <SectionLabel>Let Copi discover you</SectionLabel>
          <PrimaryButton onClick={start}>Start</PrimaryButton>
        </div>
      </div>

      <div>
        <SectionLabel>What you'll teach</SectionLabel>
        <div style={{
          background: '#F5F0E8',
          border: '1px solid var(--copi-line)',
          borderRadius: 12,
          padding: 20,
          minHeight: 140,
          fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
          fontSize: 13,
          color: preview ? 'var(--copi-ink)' : 'var(--copi-muted)',
          lineHeight: 1.7
        }}>
          {preview || 'Pick your topics and levels above, then press Start — Cupper will preview the lesson plan here.'}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════
// Refine tab
// ═══════════════════════════════════
const VERIFY_ITEMS = [
  { key: 'company',     label: 'Company context',     summary: 'Cupper will review your About, values, and product list against your latest uploaded docs.' },
  { key: 'onboarding',  label: 'Onboarding info',     summary: 'Cupper will walk the new-hire path top to bottom and flag any steps without a source.' },
  { key: 'product',     label: 'Product training',    summary: 'Cupper will check that each menu item has tasting notes, recipe, and a dial-in.' },
  { key: 'coffee',      label: 'Coffee training',     summary: 'Cupper will verify origin, processing, and brewing modules are wired to your house standards.' },
  { key: 'tests',       label: 'Sample tests',        summary: 'Cupper will spot-check generated quizzes and flag any that read off-brand.' }
];

function RefineTab({ openModal }) {
  const [verified, setVerified] = React.useState({});

  const verify = (item) => {
    openModal({
      title: `Verify ${item.label.toLowerCase()}`,
      body: item.summary
    });
    setVerified((prev) => ({ ...prev, [item.key]: true }));
  };

  return (
    <div>
      <h3 style={{
        fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif',
        fontWeight: 600,
        fontSize: 22,
        color: 'var(--copi-ink)',
        margin: '0 0 20px 0'
      }}>
        Let Copi make sure it's right.
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 560 }}>
        {VERIFY_ITEMS.map((item) => (
          <div
            key={item.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              background: '#FBF8F0',
              border: '1px solid var(--copi-line)',
              borderRadius: 12,
              gap: 16
            }}
          >
            <div>
              <div style={{
                fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--copi-ink)'
              }}>
                {item.label}
              </div>
              <div style={{
                fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
                fontSize: 12,
                color: 'var(--copi-muted)',
                marginTop: 2
              }}>
                {verified[item.key] ? 'Verified just now' : 'Not verified yet'}
              </div>
            </div>
            <button
              onClick={() => verify(item)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: verified[item.key] ? 'rgba(68,112,75,0.10)' : 'transparent',
                border: verified[item.key] ? '1.4px solid #2D5016' : '1.4px solid #7A2B1F',
                color: verified[item.key] ? '#2D5016' : '#7A2B1F',
                fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {verified[item.key] ? '✓ Verified' : 'Verify'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════
// Page
// ═══════════════════════════════════
function AdminSetupCopi({ user = {}, tab: initialTab = 'General' }) {
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const cafe  = store?.getDefaultCafe ? store.getDefaultCafe() : null;

  const [tab, setTab] = React.useState(TABS.includes(initialTab) ? initialTab : 'General');
  const [modal, setModal] = React.useState(null);

  const subnav = [
    { label: 'Profile',          route: 'admin-profile-page',       active: false },
    { label: 'Set up (Copi AI)', route: 'admin-setup-copi',         active: true  },
    { label: 'Notifications',    route: 'admin-notifications-page', active: false }
  ];

  return (
    <AdminShell current="settings" subnav={subnav} user={user} cafe={cafe}>
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--roman-coffee)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          marginBottom: 10
        }}>
          OWNER · SETTINGS
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 40,
          color: 'var(--graphite)',
          margin: 0,
          letterSpacing: '-0.01em',
          lineHeight: 1.1
        }}>
          Set up and refine with <YellowMark>Copi AI</YellowMark>
        </h1>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex',
        gap: 6,
        marginBottom: 32,
        borderBottom: '1px solid var(--copi-line)'
      }}>
        {TABS.map((label) => {
          const active = tab === label;
          return (
            <button
              key={label}
              onClick={() => setTab(label)}
              style={{
                padding: '10px 18px',
                background: active ? '#F4C542' : 'transparent',
                border: 'none',
                borderRadius: '10px 10px 0 0',
                color: 'var(--copi-ink)',
                fontFamily: '"Hanken Grotesk", "Inter", sans-serif',
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                marginBottom: -1,
                borderBottom: active ? '1px solid #F4C542' : '1px solid transparent'
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {tab === 'General'    && <GeneralTab    openModal={setModal} />}
      {tab === 'Documents'  && <DocumentsTab  openModal={setModal} />}
      {tab === 'Education'  && <EducationTab  openModal={setModal} />}
      {tab === 'Refine'     && <RefineTab     openModal={setModal} />}

      <CopiModal
        title={modal?.title}
        body={modal?.body}
        accent="#7A2B1F"
        onClose={() => setModal(null)}
      />
    </AdminShell>
  );
}

if (typeof window !== 'undefined') {
  window.AdminSetupCopi = AdminSetupCopi;
}

export default AdminSetupCopi;
