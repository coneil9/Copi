// ═════════════════════════════════════════════════════════
// DRAFT CURRICULUM EDITOR — Full-screen modal that opens
// from the "Edit lessons" banner button and from "Read draft"
// on imported track cards. Lets the owner read and edit the
// generated lesson content before publishing.
//
// Layout: track list on the left (expandable), single-lesson
// editor on the right. Save is explicit; "Save & publish all"
// at the footer flushes pending edits and flips the curriculum
// from draft → published in one step.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { publishCurriculum as apiPublishCurriculum } from '../lib/roaster-import-service.js';

function fmtDuration(minutes) {
  if (!minutes || minutes < 1) return '—';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function ChevronRight({ open }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 160ms ease' }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function DraftCurriculumEditor({ open, curriculumId, initialTrackId = null, onClose, onPublished }) {
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const [activeLessonId, setActiveLessonId] = React.useState(null);
  const [expandedTracks, setExpandedTracks] = React.useState(() => new Set());
  const [draftTitle, setDraftTitle] = React.useState('');
  const [draftMinutes, setDraftMinutes] = React.useState(10);
  const [draftContent, setDraftContent] = React.useState('');
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [closing, setClosing] = React.useState(false);

  const curriculum = curriculumId && store?.getCurriculum ? store.getCurriculum(curriculumId) : null;
  const tracks = curriculumId && store?.getTracksForCurriculum ? store.getTracksForCurriculum(curriculumId) : [];

  // Resolve the active lesson fresh from the store on every render so
  // edits elsewhere don't leave us stale.
  const activeLesson = React.useMemo(() => {
    if (!activeLessonId || !store) return null;
    return store.raw().trackLessons?.[activeLessonId] || null;
  }, [activeLessonId, store, dirty, expandedTracks]);

  // When a new lesson is selected, load it into the editor fields.
  React.useEffect(() => {
    if (!activeLesson) return;
    setDraftTitle(activeLesson.title || '');
    setDraftMinutes(activeLesson.estimatedMinutes ?? 10);
    setDraftContent(activeLesson.content || '');
    setDirty(false);
  }, [activeLessonId]);

  // Auto-expand the initial track + select its first lesson when the
  // modal opens.
  React.useEffect(() => {
    if (!open) return;
    setExpandedTracks(new Set(initialTrackId ? [initialTrackId] : tracks.map((t) => t.id)));
    const first = initialTrackId
      ? store?.getLessonsForTrack?.(initialTrackId)?.[0]
      : (tracks[0] && store?.getLessonsForTrack?.(tracks[0].id)?.[0]);
    if (first) setActiveLessonId(first.id);
  }, [open, initialTrackId, curriculumId]);

  // Lock body scroll while open + handle escape.
  React.useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') attemptClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, dirty]);

  if (!open && !closing) return null;

  const attemptClose = () => {
    if (dirty) {
      const ok = window.confirm('You have unsaved changes to this lesson. Discard them?');
      if (!ok) return;
    }
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose?.();
    }, 200);
  };

  const toggleTrack = (trackId) => {
    setExpandedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) next.delete(trackId);
      else next.add(trackId);
      return next;
    });
  };

  const selectLesson = (lessonId) => {
    if (dirty) {
      const ok = window.confirm('You have unsaved changes. Discard them?');
      if (!ok) return;
    }
    setActiveLessonId(lessonId);
  };

  const saveLesson = () => {
    if (!activeLessonId || !dirty) return;
    setSaving(true);
    store.updateTrackLesson(activeLessonId, {
      title: draftTitle.trim() || 'Untitled lesson',
      estimatedMinutes: Math.max(1, Math.min(60, Number(draftMinutes) || 1)),
      content: draftContent,
      aiGenerated: false, // owner has reviewed/touched it — no longer raw AI
    });
    setDirty(false);
    setSaving(false);
    showToast('Lesson saved.');
  };

  const publishAll = async () => {
    if (dirty && activeLessonId) {
      store.updateTrackLesson(activeLessonId, {
        title: draftTitle.trim() || 'Untitled lesson',
        estimatedMinutes: Math.max(1, Math.min(60, Number(draftMinutes) || 1)),
        content: draftContent,
        aiGenerated: false,
      });
      setDirty(false);
    }
    setPublishing(true);
    const resp = await apiPublishCurriculum(curriculumId);
    setPublishing(false);
    if (resp?.error) {
      showToast(resp.message || 'Publish failed.');
      return;
    }
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onPublished?.();
      onClose?.();
    }, 200);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div
      data-proto-ui
      onClick={(e) => { if (e.target === e.currentTarget) attemptClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9500,
        background: 'rgba(28,28,26,0.55)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'grid', placeItems: 'center', padding: 24,
        opacity: closing ? 0 : 1,
        transition: 'opacity 180ms ease',
      }}
    >
      <div style={{
        width: 'min(1100px, 100%)',
        height: 'min(720px, calc(100vh - 48px))',
        background: 'var(--alabaster)',
        borderRadius: 18,
        boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        overflow: 'hidden',
        transform: closing ? 'translateY(8px) scale(0.985)' : 'translateY(0) scale(1)',
        transition: 'transform 200ms cubic-bezier(.2,.7,.2,1)',
      }}>
        {/* ── Header ─────────────────────────────────────── */}
        <header style={{
          padding: '18px 24px',
          background: 'var(--white)',
          borderBottom: '1px solid var(--pearl-bush)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--glade-green-deep)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}>
              Draft curriculum
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 22,
              color: 'var(--graphite)',
              margin: 0,
              letterSpacing: '-0.01em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {curriculum?.shopName || 'Imported roaster'}
            </h2>
            {curriculum?.sourceUrl && (
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--roman-coffee)',
                marginTop: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                Imported from{' '}
                <a
                  href={curriculum.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--glade-green-deep)', textDecoration: 'underline' }}
                >
                  {curriculum.sourceUrl}
                </a>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={attemptClose}
            aria-label="Close editor"
            style={{
              background: 'transparent',
              border: '1px solid var(--pearl-bush)',
              borderRadius: 10,
              padding: '6px 12px',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--graphite)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Close
          </button>
        </header>

        {/* ── Body: track list + editor ──────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', minHeight: 0 }}>
          {/* Track list */}
          <aside style={{
            background: 'var(--pearl-bush)',
            borderRight: '1px solid var(--heathered-gray)',
            overflowY: 'auto',
            padding: '12px 0',
          }}>
            {tracks.length === 0 && (
              <div style={{
                padding: '16px 20px',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--roman-coffee)',
              }}>
                No tracks in this draft.
              </div>
            )}
            {tracks.map((track) => {
              const lessons = store.getLessonsForTrack(track.id);
              const isOpen = expandedTracks.has(track.id);
              return (
                <div key={track.id}>
                  <button
                    type="button"
                    onClick={() => toggleTrack(track.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--graphite)',
                      textAlign: 'left',
                    }}
                  >
                    <ChevronRight open={isOpen} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--graphite)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {track.title}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
                        color: 'var(--roman-coffee)',
                      }}>
                        {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                      </div>
                    </div>
                  </button>
                  {isOpen && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {lessons.map((lesson) => {
                        const active = lesson.id === activeLessonId;
                        return (
                          <li key={lesson.id}>
                            <button
                              type="button"
                              onClick={() => selectLesson(lesson.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 8,
                                width: '100%',
                                padding: '8px 16px 8px 38px',
                                background: active ? 'var(--alabaster)' : 'transparent',
                                borderLeft: active ? '3px solid var(--glade-green-deep)' : '3px solid transparent',
                                border: 'none',
                                borderRight: 'none',
                                borderTop: 'none',
                                borderBottom: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                            >
                              <span style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 12.5,
                                fontWeight: active ? 700 : 500,
                                color: 'var(--graphite)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                                minWidth: 0,
                              }}>
                                {lesson.title}
                              </span>
                              <span style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 11,
                                color: 'var(--heathered-gray)',
                                flexShrink: 0,
                              }}>
                                {lesson.estimatedMinutes}m
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </aside>

          {/* Editor pane */}
          <section style={{ overflowY: 'auto', padding: '24px 28px' }}>
            {!activeLesson && (
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--roman-coffee)',
                padding: '24px 0',
              }}>
                Select a lesson from the left to review its content.
              </div>
            )}
            {activeLesson && (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 16,
                  flexWrap: 'wrap',
                }}>
                  {activeLesson.aiGenerated && (
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 6,
                      background: 'var(--heathered-gray)',
                      color: 'var(--white)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                    }}>AI GENERATED</span>
                  )}
                  {!activeLesson.aiGenerated && (
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 6,
                      background: 'rgba(111, 139, 95, 0.18)',
                      color: 'var(--glade-green-deep)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                    }}>REVIEWED</span>
                  )}
                  {dirty && (
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      color: 'var(--danger)',
                      fontWeight: 600,
                    }}>
                      Unsaved changes
                    </span>
                  )}
                </div>

                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--roman-coffee)',
                  marginBottom: 6,
                }}>
                  Lesson title
                </label>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => { setDraftTitle(e.target.value); setDirty(true); }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1.5px solid var(--pearl-bush)',
                    background: 'var(--white)',
                    fontFamily: 'var(--font-display)',
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--graphite)',
                    outline: 'none',
                    marginBottom: 16,
                    boxSizing: 'border-box',
                  }}
                />

                <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-end' }}>
                  <div style={{ width: 140 }}>
                    <label style={{
                      display: 'block',
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--roman-coffee)',
                      marginBottom: 6,
                    }}>
                      Estimated minutes
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={draftMinutes}
                      onChange={(e) => { setDraftMinutes(e.target.value); setDirty(true); }}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1.5px solid var(--pearl-bush)',
                        background: 'var(--white)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 14,
                        color: 'var(--graphite)',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'var(--heathered-gray)',
                    paddingBottom: 10,
                  }}>
                    {draftContent.trim().split(/\s+/).filter(Boolean).length} words
                  </div>
                </div>

                <label style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--roman-coffee)',
                  marginBottom: 6,
                }}>
                  Lesson content
                </label>
                <textarea
                  value={draftContent}
                  onChange={(e) => { setDraftContent(e.target.value); setDirty(true); }}
                  rows={14}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 10,
                    border: '1.5px solid var(--pearl-bush)',
                    background: 'var(--white)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: 'var(--graphite)',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: 220,
                    boxSizing: 'border-box',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={saveLesson}
                    disabled={!dirty || saving}
                    style={{
                      padding: '10px 18px',
                      background: dirty ? 'var(--glade-green-deep)' : 'var(--heathered-gray)',
                      color: 'var(--white)',
                      border: 'none',
                      borderRadius: 999,
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: dirty && !saving ? 'pointer' : 'not-allowed',
                      opacity: saving ? 0.7 : 1,
                    }}
                  >
                    {saving ? 'Saving…' : 'Save lesson'}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>

        {/* ── Footer ─────────────────────────────────────── */}
        <footer style={{
          padding: '14px 24px',
          background: 'var(--white)',
          borderTop: '1px solid var(--pearl-bush)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--roman-coffee)',
          }}>
            {tracks.reduce((sum, t) => sum + store.getLessonsForTrack(t.id).length, 0)} lessons across{' '}
            {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
            {' · '}
            ~{fmtDuration(
              tracks.reduce((sum, t) => sum +
                store.getLessonsForTrack(t.id).reduce((s, l) => s + (l.estimatedMinutes || 0), 0), 0)
            )} to teach
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={attemptClose}
              style={{
                padding: '10px 18px',
                background: 'transparent',
                color: 'var(--graphite)',
                border: '1.5px solid var(--pearl-bush)',
                borderRadius: 999,
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Keep editing later
            </button>
            <button
              type="button"
              onClick={publishAll}
              disabled={publishing}
              style={{
                padding: '10px 18px',
                background: 'var(--glade-green-deep)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: 999,
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                cursor: publishing ? 'not-allowed' : 'pointer',
                opacity: publishing ? 0.7 : 1,
              }}
            >
              {publishing ? 'Publishing…' : 'Save & publish all'}
            </button>
          </div>
        </footer>

        {/* ── Toast ──────────────────────────────────────── */}
        {toast && (
          <div
            className="copi-reveal copi-reveal--fade-up is-in"
            style={{
              position: 'absolute',
              bottom: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--graphite)',
              color: 'var(--alabaster)',
              padding: '10px 18px',
              borderRadius: 999,
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 600,
              boxShadow: '0 12px 32px rgba(0,0,0,0.22)',
              zIndex: 10,
              transitionDuration: '200ms',
            }}
          >
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

if (typeof window !== 'undefined') {
  window.DraftCurriculumEditor = DraftCurriculumEditor;
}

export default DraftCurriculumEditor;
