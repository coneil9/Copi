import React from 'react';
import { parseStaffCsv, buildTemplateCsv, downloadCsv } from '../lib/csv-utils.js';

function StaffPage({ user }) {
  const store = window.CopiStore;
  const [, rerender] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => store.subscribe(rerender), []);

  const th = window.THEME || {}, ty = window.TYPOGRAPHY || {}, sh = window.SHADOW || {};

  const cafe = store.getDefaultCafe() || {};
  const cafeId = cafe.id;
  const locations = store.getLocations(cafeId);
  const [filterLoc, setFilterLoc] = React.useState(null);

  const allUsers = store.getUsers(cafeId, filterLoc);
  const staff = allUsers.filter((u) => u.id !== user?.id && u.status !== 'inactive');

  // Modal states
  const [addModal, setAddModal]       = React.useState(false);
  const [csvModal, setCsvModal]       = React.useState(false);
  const [inviteModal, setInviteModal] = React.useState(null); // userId
  const [deactModal, setDeactModal]   = React.useState(null); // userId
  const [toast, setToast]             = React.useState(null);

  // Add form
  const [addName, setAddName]         = React.useState('');
  const [addEmail, setAddEmail]       = React.useState('');
  const [addRole, setAddRole]         = React.useState('barista');
  const [addLoc, setAddLoc]           = React.useState(locations[0]?.id || '');
  const [addErr, setAddErr]           = React.useState('');

  // CSV
  const [csvText, setCsvText]         = React.useState('');
  const [csvErrors, setCsvErrors]     = React.useState([]);
  const [csvPreview, setCsvPreview]   = React.useState([]);
  const fileInputRef = React.useRef();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const baseUrl = window.location.origin + window.location.pathname;

  // ── Add single staff ──────────────────────────────────────
  const handleAdd = (e) => {
    e.preventDefault();
    setAddErr('');
    if (!addName.trim()) return setAddErr('Name is required.');
    if (!addEmail.includes('@')) return setAddErr('Valid email required.');
    if (!addLoc) return setAddErr('Location is required.');
    const existing = store.getUserByEmail(addEmail);
    if (existing) return setAddErr('A user with this email already exists.');

    const newUser = store.createUser({ cafeId, locationId: addLoc, name: addName.trim(), email: addEmail.toLowerCase().trim(), role: addRole });
    const token = store.createInvite(newUser.id, cafeId);
    setAddModal(false); setAddName(''); setAddEmail(''); setAddRole('barista');
    showToast(`Invite sent to ${addEmail}. Link: ${baseUrl}#/invite/${token}`);
  };

  // ── CSV upload ────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      setCsvText(text);
      const locationsByName = {};
      locations.forEach((l) => { locationsByName[l.name.toLowerCase()] = l.id; });
      const { rows, errors } = parseStaffCsv(text, locationsByName);
      setCsvErrors(errors);
      setCsvPreview(rows);
    };
    reader.readAsText(file);
  };

  const handleCsvImport = () => {
    if (csvErrors.length > 0) return;
    // Atomic: check for existing emails first
    const existingEmails = [];
    csvPreview.forEach((row) => {
      if (store.getUserByEmail(row.email)) existingEmails.push(row.email);
    });
    if (existingEmails.length) {
      setCsvErrors(existingEmails.map((e) => ({ row: 0, message: `Email already exists: ${e}` })));
      return;
    }
    const tokens = [];
    csvPreview.forEach((row) => {
      const newUser = store.createUser({ cafeId, locationId: row.locationId, name: row.name, email: row.email, role: row.role });
      const token = store.createInvite(newUser.id, cafeId);
      tokens.push({ email: row.email, token });
    });
    setCsvModal(false); setCsvText(''); setCsvErrors([]); setCsvPreview([]);
    showToast(`${tokens.length} staff added. Invites generated.`);
  };

  // ── Resend invite ──────────────────────────────────────────
  const handleResend = (userId) => {
    const token = store.resendInvite(userId);
    setInviteModal(null);
    showToast(`New invite link: ${baseUrl}#/invite/${token}`);
  };

  const roleColor = (role) => role === 'owner' || role === 'admin' ? 'green' : role === 'manager' ? 'gold' : 'default';

  return (
    <div style={{ minHeight: '100vh', background: th.bg }}>
      {/* Nav */}
      <div style={{ background: th.bgCard, borderBottom: `1px solid ${th.line}`, padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 0 }}>
        <span onClick={() => window.CopiActions?.navigate('dashboard')} style={{ ...ty.displayItalic, fontSize: 22, color: th.accent, cursor: 'pointer', marginRight: 32 }}>Copi.</span>
        {['Dashboard','Team','Curriculum','Analytics','Billing','Settings'].map((label) => (
          <button key={label} onClick={() => window.CopiActions?.navigate(label.toLowerCase() === 'dashboard' ? 'dashboard' : label.toLowerCase())}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, ...ty.nav, color: label === 'Team' ? th.accent : th.muted, fontWeight: label === 'Team' ? 600 : 400, backgroundColor: label === 'Team' ? th.bgInset : 'transparent' }}>
            {label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button data-app-action="logout" style={{ ...ty.label, padding: '5px 12px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.muted, cursor: 'pointer' }}>Log out</button>
      </div>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ ...ty.eyebrow, color: th.accent, marginBottom: 4 }}>Owner · Team</p>
            <h1 style={{ ...ty.h2, color: th.ink, margin: 0 }}>Your team</h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setCsvModal(true)} style={{ ...ty.button, padding: '9px 18px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.ink, cursor: 'pointer' }}>
              ↑ Import CSV
            </button>
            <button onClick={() => setAddModal(true)} style={{ ...ty.button, padding: '9px 18px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>
              + Add staff
            </button>
          </div>
        </div>

        {/* Location filter */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
          {[{id: null, name: 'All Locations'}, ...locations].map((loc) => (
            <button key={loc.id || 'all'} onClick={() => setFilterLoc(loc.id)}
              style={{ ...ty.label, padding: '5px 14px', borderRadius: 999, background: filterLoc === loc.id ? th.accent : th.bgInset, color: filterLoc === loc.id ? th.onDark : th.muted, border: 'none', cursor: 'pointer', transition: 'all 140ms' }}>
              {loc.name}
            </button>
          ))}
        </div>

        {/* Staff table */}
        <div style={{ borderRadius: th.card, border: `1px solid ${th.line}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 120px 140px 120px 100px', background: th.bgInset, borderBottom: `1px solid ${th.line}`, padding: '0 4px' }}>
            {['Name','Email','Role','Location','Status',''].map((h) => (
              <div key={h} style={{ ...ty.eyebrow, color: th.muted, padding: '10px 12px' }}>{h}</div>
            ))}
          </div>
          {staff.length === 0 ? (
            <div style={{ ...ty.body, color: th.muted, padding: '32px 16px', textAlign: 'center', background: th.bgCard }}>
              No staff yet. Add someone to get started.
            </div>
          ) : staff.map((u, i) => {
            const loc = locations.find((l) => l.id === u.locationId);
            const pending = store.getPendingInvitesForUser(u.id);
            const isPending = u.status === 'invited';
            return (
              <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 120px 140px 120px 100px', background: th.bgCard, borderBottom: i < staff.length - 1 ? `1px solid ${th.line}` : 'none', padding: '0 4px', alignItems: 'center' }}>
                <div style={{ padding: '12px' }}>
                  <p style={{ ...ty.bodySmall, color: th.ink, margin: 0, fontWeight: 500 }}>{u.name}</p>
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{ ...ty.caption, color: th.muted, margin: 0 }}>{u.email}</p>
                </div>
                <div style={{ padding: '12px' }}>
                  <RoleBadge role={u.role} th={th} ty={ty} />
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{ ...ty.caption, color: th.muted, margin: 0 }}>{loc?.name || (u.locationId ? '—' : 'All locations')}</p>
                </div>
                <div style={{ padding: '12px' }}>
                  {isPending
                    ? <span style={{ ...ty.label, background: `${th.urgent}18`, color: th.urgent, padding: '3px 10px', borderRadius: 999 }}>Pending invite</span>
                    : <span style={{ ...ty.label, background: `${th.accent}15`, color: th.accent, padding: '3px 10px', borderRadius: 999 }}>Active</span>
                  }
                </div>
                <div style={{ padding: '8px 12px', display: 'flex', gap: 6 }}>
                  {isPending && (
                    <button onClick={() => setInviteModal(u.id)} style={{ ...ty.caption, padding: '4px 10px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.muted, cursor: 'pointer' }}>Resend</button>
                  )}
                  <button onClick={() => setDeactModal(u.id)} style={{ ...ty.caption, padding: '4px 10px', borderRadius: 999, background: 'transparent', border: `1px solid ${th.line}`, color: th.muted, cursor: 'pointer' }}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add staff modal */}
      {addModal && (
        <ModalOverlay onClose={() => { setAddModal(false); setAddErr(''); }} title="Add staff member" th={th} ty={ty} sh={sh}>
          <form onSubmit={handleAdd}>
            <FieldGroup label="Full name" required th={th} ty={ty}>
              <StyledInput value={addName} onChange={(e) => setAddName(e.target.value)} placeholder="e.g. Maya Okonkwo" th={th} ty={ty} />
            </FieldGroup>
            <FieldGroup label="Email address" required th={th} ty={ty}>
              <StyledInput type="email" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} placeholder="maya@yourcafe.com" th={th} ty={ty} />
            </FieldGroup>
            <FieldGroup label="Role" th={th} ty={ty}>
              <StyledSelect value={addRole} onChange={(e) => setAddRole(e.target.value)} th={th} ty={ty}>
                <option value="barista">Barista</option>
                <option value="host">Host</option>
                <option value="manager">Manager</option>
              </StyledSelect>
            </FieldGroup>
            <FieldGroup label="Location" required th={th} ty={ty}>
              <StyledSelect value={addLoc} onChange={(e) => setAddLoc(e.target.value)} th={th} ty={ty}>
                {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </StyledSelect>
            </FieldGroup>
            {addErr && <p style={{ ...ty.caption, color: th.danger, marginBottom: 10 }}>{addErr}</p>}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" onClick={() => setAddModal(false)} style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.ink, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>Add & send invite</button>
            </div>
          </form>
        </ModalOverlay>
      )}

      {/* CSV upload modal */}
      {csvModal && (
        <ModalOverlay onClose={() => { setCsvModal(false); setCsvText(''); setCsvErrors([]); setCsvPreview([]); }} title="Import staff via CSV" th={th} ty={ty} sh={sh} width={640}>
          <p style={{ ...ty.bodySmall, color: th.muted, marginBottom: 16 }}>
            Upload a CSV with columns: <strong>name, email, role, location</strong>. All rows must be valid before anyone is added.
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button onClick={() => downloadCsv(buildTemplateCsv())}
              style={{ ...ty.button, padding: '8px 16px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.ink, cursor: 'pointer' }}>
              ↓ Download template
            </button>
            <button onClick={() => fileInputRef.current?.click()}
              style={{ ...ty.button, padding: '8px 16px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>
              Choose file
            </button>
            <input ref={fileInputRef} type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={handleFileChange} />
          </div>

          {csvPreview.length > 0 && (
            <>
              <p style={{ ...ty.label, color: th.ink, marginBottom: 8 }}>{csvPreview.length} row{csvPreview.length !== 1 ? 's' : ''} found</p>
              <div style={{ borderRadius: 10, border: `1px solid ${th.line}`, overflow: 'auto', maxHeight: 220, marginBottom: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: th.bgInset }}>
                      {['Name','Email','Role','Location'].map((h) => <th key={h} style={{ ...ty.eyebrow, color: th.muted, padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {csvPreview.map((row, i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${th.line}`, background: th.bgCard }}>
                        <td style={{ ...ty.caption, padding: '8px 12px', color: th.ink }}>{row.name}</td>
                        <td style={{ ...ty.caption, padding: '8px 12px', color: th.muted }}>{row.email}</td>
                        <td style={{ ...ty.caption, padding: '8px 12px', color: th.muted }}>{row.role}</td>
                        <td style={{ ...ty.caption, padding: '8px 12px', color: th.muted }}>{row.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {csvErrors.length > 0 && (
            <div style={{ background: `${th.danger}10`, border: `1px solid ${th.danger}44`, borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
              <p style={{ ...ty.label, color: th.danger, marginBottom: 6 }}>Fix these errors before importing:</p>
              {csvErrors.map((err, i) => (
                <p key={i} style={{ ...ty.caption, color: th.danger, margin: '2px 0' }}>• {err.message}</p>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => { setCsvModal(false); setCsvText(''); setCsvErrors([]); setCsvPreview([]); }}
              style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.ink, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleCsvImport} disabled={csvPreview.length === 0 || csvErrors.length > 0}
              style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: csvPreview.length === 0 || csvErrors.length > 0 ? 'not-allowed' : 'pointer', opacity: csvPreview.length === 0 || csvErrors.length > 0 ? 0.5 : 1 }}>
              Import {csvPreview.length > 0 ? `${csvPreview.length} staff` : ''}
            </button>
          </div>
        </ModalOverlay>
      )}

      {/* Resend invite confirm */}
      {inviteModal && (
        <ModalOverlay onClose={() => setInviteModal(null)} title="Resend invite?" th={th} ty={ty} sh={sh} width={420}>
          <p style={{ ...ty.body, color: th.muted, marginBottom: 20 }}>
            This will invalidate the old link and generate a new 72-hour invite.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => setInviteModal(null)} style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.ink, cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => handleResend(inviteModal)} style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>Send new invite</button>
          </div>
        </ModalOverlay>
      )}

      {/* Deactivate confirm */}
      {deactModal && (
        <ModalOverlay onClose={() => setDeactModal(null)} title="Remove staff member?" th={th} ty={ty} sh={sh} width={420}>
          <p style={{ ...ty.body, color: th.muted, marginBottom: 20 }}>
            They will lose access immediately. Their progress history is preserved.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => setDeactModal(null)} style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.ink, cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => { store.deactivateUser(deactModal); setDeactModal(null); showToast('Staff member removed.'); }}
              style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.danger, border: 'none', color: '#fff', cursor: 'pointer' }}>Remove</button>
          </div>
        </ModalOverlay>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: th.ink, color: th.onDark, padding: '12px 20px', borderRadius: 999, ...ty.bodySmall, maxWidth: 500, boxShadow: sh.modal }}>
          {toast}
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────
function RoleBadge({ role, th, ty }) {
  const colors = { owner: [th.accent, '#fff'], admin: [th.accent, '#fff'], manager: [th.gold, '#fff'], barista: [th.bgInset, th.muted], host: [th.bgInset, th.muted] };
  const [bg, color] = colors[role] || [th.bgInset, th.muted];
  return <span style={{ ...ty.label, background: bg + (bg.length === 7 ? '22' : ''), color, padding: '3px 10px', borderRadius: 999 }}>{role}</span>;
}

function ModalOverlay({ onClose, title, children, th, ty, sh, width = 520 }) {
  React.useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(31,27,20,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: th.bgCard, borderRadius: 18, boxShadow: sh.modal, width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${th.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ ...ty.h4, color: th.ink, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: th.muted, fontSize: 22, lineHeight: 1, padding: '2px 6px' }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function FieldGroup({ label, required, children, th, ty }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ ...ty.label, display: 'block', marginBottom: 5, color: th.ink }}>{label}{required && <span style={{ color: th.danger, marginLeft: 2 }}>*</span>}</label>
      {children}
    </div>
  );
}

function StyledInput({ th, ty, ...props }) {
  return <input {...props} style={{ width: '100%', ...ty.body, padding: '9px 14px', background: th.bgCard, border: `1.5px solid ${th.line}`, borderRadius: th.input || 10, color: th.ink, outline: 'none', boxSizing: 'border-box' }} onFocus={(e) => { e.target.style.borderColor = th.accent; }} onBlur={(e) => { e.target.style.borderColor = th.line; }} />;
}

function StyledSelect({ th, ty, children, ...props }) {
  return <select {...props} style={{ width: '100%', ...ty.body, padding: '9px 14px', background: th.bgCard, border: `1.5px solid ${th.line}`, borderRadius: th.input || 10, color: th.ink, outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>{children}</select>;
}

window.StaffPage = StaffPage;
