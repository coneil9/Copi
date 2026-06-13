import React from 'react';
import { simulateUpload } from '../lib/ai-service.js';

function AiReviewPage({ user }) {
  const store = window.CopiStore;
  const [, rerender] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => store.subscribe(rerender), []);

  const th = window.THEME || {}, ty = window.TYPOGRAPHY || {}, sh = window.SHADOW || {};

  const cafe = store.getDefaultCafe() || {};
  const cafeId = cafe.id;
  const latestJob = store.getLatestAiJob(cafeId);

  const [phase, setPhase] = React.useState(latestJob?.status || 'upload'); // 'upload'|'processing'|'ready'|'edit'
  const [files, setFiles]     = React.useState([]);
  const [dragging, setDragging] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [editId, setEditId]   = React.useState(null);
  const [editTitle, setEditTitle] = React.useState('');
  const [editDesc, setEditDesc]  = React.useState('');
  const [addModal, setAddModal]  = React.useState(false);
  const [newTitle, setNewTitle]  = React.useState('');
  const [newDesc, setNewDesc]    = React.useState('');
  const [newRole, setNewRole]    = React.useState('barista');
  const [toast, setToast]        = React.useState(null);
  const fileRef = React.useRef();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // Load state from latest job
  React.useEffect(() => {
    if (latestJob) setPhase(latestJob.status === 'published' ? 'published' : latestJob.status);
  }, [latestJob?.status]);

  const milestones = latestJob?.output?.milestoneIds
    ? latestJob.output.milestoneIds.map((id) => store.raw().milestones[id]).filter(Boolean)
    : store.getMilestones(cafeId);

  const suggested  = milestones.filter((m) => m.status === 'suggested');
  const approved   = milestones.filter((m) => m.status === 'approved');
  const dismissed  = milestones.filter((m) => m.status === 'dismissed');
  const gaps       = latestJob?.output?.gaps || [];

  // ── File handling ──────────────────────────────────────────
  const readFile = (file) => new Promise((res) => {
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => res({ name: file.name, text: e.target.result });
      reader.readAsText(file);
    } else {
      // PDF / unknown — extract filename as hint
      res({ name: file.name, text: `[Document: ${file.name}]` });
    }
  });

  const handleFiles = async (rawFiles) => {
    const read = await Promise.all(Array.from(rawFiles).map(readFile));
    setFiles((prev) => [...prev, ...read]);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleProcess = async () => {
    if (!files.length) return;
    setProcessing(true);
    setPhase('processing');
    try {
      await simulateUpload(cafeId, files, (status) => setPhase(status));
    } finally {
      setProcessing(false);
    }
  };

  const handleApprove = (id) => { store.approveMilestone(id); showToast('Milestone approved.'); };
  const handleDismiss = (id) => { store.dismissMilestone(id); };

  const handleEditSave = () => {
    store.updateMilestone(editId, { title: editTitle, desc: editDesc });
    setEditId(null); showToast('Saved.');
  };

  const handleAddMilestone = () => {
    if (!newTitle.trim()) return;
    store.createMilestone(cafeId, { role: newRole, title: newTitle.trim(), desc: newDesc.trim(), source: 'manual', order: milestones.length });
    setAddModal(false); setNewTitle(''); setNewDesc('');
    showToast('Milestone added.');
  };

  const handleApproveAll = () => {
    suggested.forEach((m) => store.approveMilestone(m.id));
    showToast(`${suggested.length} milestones approved.`);
  };

  const handlePublish = () => {
    store.publishMilestones(cafeId);
    if (latestJob) store.updateAiJob(latestJob.id, { status: 'published' });
    setPhase('published');
    showToast('Onboarding published! Staff are now auto-assigned.');
  };

  // ── Re-upload (appends, doesn't overwrite approved) ────────
  const handleReupload = () => {
    setFiles([]);
    setPhase('upload');
  };

  const MilestoneCard = ({ ms, showActions = true }) => {
    const isEditing = editId === ms.id;
    return (
      <div style={{ background: th.bgCard, borderRadius: th.card, border: `1px solid ${ms.fromGap ? th.urgent + '44' : th.line}`, padding: 16, boxShadow: sh.card }}>
        {ms.fromGap && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ ...ty.label, color: th.urgent, background: `${th.urgent}18`, padding: '2px 8px', borderRadius: 999 }}>Gap detected</span>
          </div>
        )}
        {isEditing ? (
          <>
            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
              style={{ width: '100%', ...ty.body, fontWeight: 500, padding: '6px 10px', background: th.bgInset, border: `1.5px solid ${th.accent}`, borderRadius: 8, color: th.ink, outline: 'none', marginBottom: 8, boxSizing: 'border-box' }} />
            <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3}
              style={{ width: '100%', ...ty.bodySmall, padding: '6px 10px', background: th.bgInset, border: `1.5px solid ${th.accent}`, borderRadius: 8, color: th.muted, outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 10 }} />
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={handleEditSave} style={{ ...ty.label, padding: '5px 14px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>Save</button>
              <button onClick={() => setEditId(null)} style={{ ...ty.label, padding: '5px 14px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.muted, cursor: 'pointer' }}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <p style={{ ...ty.body, fontWeight: 500, color: th.ink, margin: '0 0 4px' }}>{ms.title}</p>
                <p style={{ ...ty.caption, color: th.muted, margin: 0, lineHeight: 1.5 }}>{ms.desc}</p>
                <p style={{ ...ty.caption, color: ms.source === 'extracted' ? th.accent : th.muted, marginTop: 6, margin: '6px 0 0', fontStyle: 'italic' }}>
                  {ms.source === 'extracted' ? '✓ From your documents' : ms.source === 'manual' ? '+ Added manually' : '⊙ Standard template'}
                  {' · '}{ms.role}
                </p>
              </div>
              {showActions && (
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setEditId(ms.id); setEditTitle(ms.title); setEditDesc(ms.desc); }}
                    style={{ ...ty.caption, padding: '4px 10px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.muted, cursor: 'pointer' }}>Edit</button>
                  {ms.status === 'suggested' && <>
                    <button onClick={() => handleApprove(ms.id)}
                      style={{ ...ty.caption, padding: '4px 10px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>Approve</button>
                    <button onClick={() => handleDismiss(ms.id)}
                      style={{ ...ty.caption, padding: '4px 10px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.muted, cursor: 'pointer' }}>Dismiss</button>
                  </>}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: th.bg }}>
      {/* Nav */}
      <div style={{ background: th.bgCard, borderBottom: `1px solid ${th.line}`, padding: '0 24px', display: 'flex', alignItems: 'center', height: 56 }}>
        <span onClick={() => window.CopiActions?.navigate('dashboard')} style={{ ...ty.displayItalic, fontSize: 22, color: th.accent, cursor: 'pointer', marginRight: 32 }}>Copi.</span>
        <button onClick={() => window.CopiActions?.navigate('dashboard')} style={{ ...ty.nav, background: 'none', border: 'none', cursor: 'pointer', color: th.muted, padding: '6px 12px' }}>← Dashboard</button>
        <div style={{ flex: 1 }} />
        <button data-app-action="logout" style={{ ...ty.label, padding: '5px 12px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.muted, cursor: 'pointer' }}>Log out</button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ ...ty.eyebrow, color: th.accent, marginBottom: 4 }}>AI Setup</p>
          <h1 style={{ ...ty.h2, color: th.ink, margin: '0 0 8px' }}>Onboarding setup</h1>
          <p style={{ ...ty.body, color: th.muted }}>Upload your existing training materials. The AI will map them into a structured onboarding environment for your team.</p>
        </div>

        {/* Phase: upload */}
        {phase === 'upload' && (
          <>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? th.accent : th.line}`, borderRadius: th.card,
                padding: '48px 24px', textAlign: 'center', cursor: 'pointer',
                background: dragging ? `${th.accent}08` : th.bgInset,
                transition: 'all 140ms', marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
              <p style={{ ...ty.body, color: th.ink, marginBottom: 4 }}>Drop files here or click to choose</p>
              <p style={{ ...ty.caption, color: th.muted }}>PDFs, text files, Word docs, markdown — anything goes</p>
              <input ref={fileRef} type="file" multiple accept=".pdf,.txt,.md,.doc,.docx" style={{ display: 'none' }} onChange={(e) => handleFiles(e.target.files)} />
            </div>

            {files.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ ...ty.label, color: th.ink, marginBottom: 8 }}>{files.length} file{files.length !== 1 ? 's' : ''} selected:</p>
                {files.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: th.bgCard, borderRadius: 10, border: `1px solid ${th.line}`, marginBottom: 6 }}>
                    <span style={{ ...ty.bodySmall, color: th.ink }}>📄 {f.name}</span>
                    <button onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: th.muted, cursor: 'pointer', fontSize: 16 }}>×</button>
                  </div>
                ))}
              </div>
            )}

            {latestJob && (latestJob.status === 'ready' || latestJob.status === 'published') && (
              <div style={{ padding: '12px 16px', background: `${th.accent}10`, border: `1px solid ${th.accent}33`, borderRadius: 10, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ ...ty.bodySmall, color: th.accent, margin: 0 }}>
                  {latestJob.status === 'published' ? '✓ Onboarding is live.' : 'Previous AI run is ready for review.'}
                </p>
                <button onClick={() => setPhase(latestJob.status)} style={{ ...ty.label, color: th.accent, background: 'none', border: 'none', cursor: 'pointer' }}>View results →</button>
              </div>
            )}

            <button onClick={handleProcess} disabled={!files.length || processing}
              style={{ padding: '11px 28px', background: th.accent, color: th.onDark, border: 'none', borderRadius: th.pill, ...ty.button, cursor: files.length ? 'pointer' : 'not-allowed', opacity: files.length ? 1 : 0.4 }}>
              Generate onboarding →
            </button>
          </>
        )}

        {/* Phase: processing */}
        {phase === 'processing' && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⚙</span>
            </div>
            <h2 style={{ ...ty.h3, color: th.ink, marginBottom: 8 }}>Reading your documents…</h2>
            <p style={{ ...ty.body, color: th.muted, maxWidth: 420, margin: '0 auto 24px' }}>
              The AI is mapping your material into onboarding milestones and checking for gaps. This takes about 8 seconds.
            </p>
            <div style={{ background: th.bgInset, borderRadius: 999, height: 6, maxWidth: 280, margin: '0 auto', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: th.accent, borderRadius: 999, animation: 'progressPulse 2s ease-in-out infinite', width: '60%' }} />
            </div>
          </div>
        )}

        {/* Phase: ready / edit */}
        {(phase === 'ready' || phase === 'edit' || phase === 'published') && (
          <>
            {/* Summary banner */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
              {[
                { label: 'Suggested', value: suggested.length, color: th.muted },
                { label: 'Approved', value: approved.length, color: th.accent },
                { label: 'Dismissed', value: dismissed.length, color: th.muted },
                { label: 'Gaps found', value: gaps.length, color: gaps.length ? th.urgent : th.muted },
              ].map((s) => (
                <div key={s.label} style={{ padding: '10px 18px', background: th.bgCard, borderRadius: th.card, border: `1px solid ${th.line}`, textAlign: 'center', boxShadow: sh.card, minWidth: 90 }}>
                  <p style={{ ...ty.h3, color: s.color, margin: '0 0 2px' }}>{s.value}</p>
                  <p style={{ ...ty.caption, color: th.muted, margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Gap warnings */}
            {gaps.length > 0 && (
              <div style={{ background: `${th.urgent}0c`, border: `1px solid ${th.urgent}44`, borderRadius: th.card, padding: '16px 18px', marginBottom: 24 }}>
                <p style={{ ...ty.label, color: th.urgent, marginBottom: 8 }}>Gaps in your uploaded documents</p>
                {gaps.map((g, i) => (
                  <p key={i} style={{ ...ty.caption, color: th.muted, margin: '4px 0' }}>• {g.title} ({g.role}): {g.message}</p>
                ))}
              </div>
            )}

            {/* Action bar */}
            {phase !== 'published' && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                {suggested.length > 0 && (
                  <button onClick={handleApproveAll} style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>
                    Approve all ({suggested.length})
                  </button>
                )}
                <button onClick={() => setAddModal(true)} style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.ink, cursor: 'pointer' }}>
                  + Add milestone
                </button>
                <button onClick={handleReupload} style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.muted, cursor: 'pointer' }}>
                  Re-upload documents
                </button>
                <div style={{ flex: 1 }} />
                <button
                  onClick={handlePublish}
                  disabled={approved.length === 0}
                  style={{ ...ty.button, padding: '9px 24px', borderRadius: 999, background: approved.length ? th.accentDeep : th.bgInset, border: 'none', color: approved.length ? th.onDark : th.muted, cursor: approved.length ? 'pointer' : 'not-allowed' }}>
                  Publish onboarding →
                </button>
              </div>
            )}

            {phase === 'published' && (
              <div style={{ padding: '12px 16px', background: `${th.accent}12`, border: `1px solid ${th.accent}44`, borderRadius: 10, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ ...ty.body, color: th.accent, margin: 0 }}>✓ Onboarding is live — staff are being auto-assigned.</p>
                <button onClick={handleReupload} style={{ ...ty.label, color: th.accent, background: 'none', border: 'none', cursor: 'pointer' }}>Add more documents</button>
              </div>
            )}

            {/* Suggested milestones */}
            {suggested.length > 0 && (
              <section style={{ marginBottom: 28 }}>
                <p style={{ ...ty.eyebrow, color: th.muted, marginBottom: 12 }}>Awaiting review ({suggested.length})</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {suggested.map((ms) => <MilestoneCard key={ms.id} ms={ms} showActions={phase !== 'published'} />)}
                </div>
              </section>
            )}

            {/* Approved milestones */}
            {approved.length > 0 && (
              <section style={{ marginBottom: 28 }}>
                <p style={{ ...ty.eyebrow, color: th.accent, marginBottom: 12 }}>Approved ({approved.length})</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {approved.map((ms) => <MilestoneCard key={ms.id} ms={ms} showActions={phase !== 'published'} />)}
                </div>
              </section>
            )}

            {/* Dismissed */}
            {dismissed.length > 0 && (
              <details style={{ marginBottom: 16 }}>
                <summary style={{ ...ty.label, color: th.muted, cursor: 'pointer', marginBottom: 10 }}>Dismissed ({dismissed.length})</summary>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                  {dismissed.map((ms) => (
                    <div key={ms.id} style={{ padding: '10px 14px', background: th.bgInset, borderRadius: 10, opacity: 0.6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ ...ty.bodySmall, color: th.muted, margin: 0, textDecoration: 'line-through' }}>{ms.title}</p>
                      <button onClick={() => store.updateMilestone(ms.id, { status: 'suggested' })} style={{ ...ty.caption, color: th.accent, background: 'none', border: 'none', cursor: 'pointer' }}>Restore</button>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </>
        )}
      </div>

      {/* Add milestone modal */}
      {addModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(31,27,20,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setAddModal(false); }}>
          <div style={{ background: th.bgCard, borderRadius: 18, boxShadow: sh.modal, width: '100%', maxWidth: 480 }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${th.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ ...ty.h4, color: th.ink, margin: 0 }}>Add milestone manually</h3>
              <button onClick={() => setAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: th.muted, fontSize: 22, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ ...ty.label, display: 'block', marginBottom: 5, color: th.ink }}>Title</label>
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Cold brew calibration"
                  style={{ width: '100%', ...ty.body, padding: '9px 14px', background: th.bgCard, border: `1.5px solid ${th.line}`, borderRadius: th.input || 10, color: th.ink, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ ...ty.label, display: 'block', marginBottom: 5, color: th.ink }}>Description</label>
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={3} placeholder="What does this milestone cover?"
                  style={{ width: '100%', ...ty.body, padding: '9px 14px', background: th.bgCard, border: `1.5px solid ${th.line}`, borderRadius: th.input || 10, color: th.ink, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ ...ty.label, display: 'block', marginBottom: 5, color: th.ink }}>Role</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)}
                  style={{ width: '100%', ...ty.body, padding: '9px 14px', background: th.bgCard, border: `1.5px solid ${th.line}`, borderRadius: th.input || 10, color: th.ink, outline: 'none', cursor: 'pointer' }}>
                  <option value="barista">Barista</option>
                  <option value="host">Host</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setAddModal(false)} style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.bgInset, border: `1px solid ${th.line}`, color: th.ink, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleAddMilestone} style={{ ...ty.button, padding: '9px 20px', borderRadius: 999, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>Add milestone</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: th.ink, color: th.onDark, padding: '12px 20px', borderRadius: 999, ...ty.bodySmall, maxWidth: 500, boxShadow: sh.modal }}>
          {toast}
        </div>
      )}
    </div>
  );
}

window.AiReviewPage = AiReviewPage;
