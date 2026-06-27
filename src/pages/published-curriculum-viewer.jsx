// ═════════════════════════════════════════════════════════
// PUBLISHED CURRICULUM VIEWER — Read-only modal for a
// published imported curriculum. Used by both admin (browse
// what was published) and barista library (read their
// assigned curriculum lessons).
// ═════════════════════════════════════════════════════════

import React from 'react';
import { createPortal } from 'react-dom';

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

export function PublishedCurriculumViewer({ open, curriculumId, initialTrackId = null, onClose }) {
  const store = window.useCopiStore ? window.useCopiStore() : window.CopiStore;
  const [activeLessonId, setActiveLessonId] = React.useState(null);
  const [expandedTracks, setExpandedTracks] = React.useState(() => new Set());
  const [closing, setClosing] = React.useState(false);

  const curriculum = curriculumId && store?.getCurriculum ? store.getCurriculum(curriculumId) : null;
  const tracks = curriculumId && store?.getTracksForCurriculum ? store.getTracksForCurriculum(curriculumId) : [];

  const activeLesson = React.useMemo(() => {
    if (!activeLessonId || !store) return null;
    return store.raw().trackLessons?.[activeLessonId] || null;
  }, [activeLessonId, store, expandedTracks]);

  React.useEffect(() => {
    if (!open) return;
    setExpandedTracks(new Set(initialTrackId ? [initialTrackId] : tracks.map((t) => t.id)));
    const first = initialTrackId
      ? store?.getLessonsForTrack?.(initialTrackId)?.[0]
      : (tracks[0] && store?.getLessonsForTrack?.(tracks[0].id)?.[0]);
    if (first) setActiveLessonId(first.id);
  }, [open, initialTrackId, curriculumId]);

  React.useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') attemptClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!open && !closing) return null;

  const attemptClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose?.(); }, 200);
  };

  const toggleTrack = (trackId) => {
    setExpandedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) next.delete(trackId);
      else next.add(trackId);
      return next;
    });
  };

  const totalLessons = tracks.reduce(
    (sum, t) => sum + (store?.getLessonsForTrack?.(t.id)?.length || 0), 0);
  const totalMinutes = tracks.reduce(
    (sum, t) => sum + (store?.getLessonsForTrack?.(t.id)
      ?.reduce((s, l) => s + (l.estimatedMinutes || 0), 0) || 0), 0);

  return createPortal((
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
        {/* Header */}
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
              House curriculum
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
              {curriculum?.shopName || 'Curriculum'}
            </h2>
            {curriculum?.tagline && (
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--roman-coffee)',
                marginTop: 2,
              }}>
                {curriculum.tagline}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={attemptClose}
            aria-label="Close viewer"
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

        {/* Body */}
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
                No tracks in this curriculum.
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
                              onClick={() => setActiveLessonId(lesson.id)}
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

          {/* Reader pane */}
          <section style={{ overflowY: 'auto', padding: '32px 40px' }}>
            {!activeLesson && (
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--roman-coffee)',
                padding: '24px 0',
              }}>
                Pick a lesson from the left to read it.
              </div>
            )}
            {activeLesson && (
              <article style={{ maxWidth: 680 }}>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--roman-coffee)',
                  marginBottom: 8,
                }}>
                  {fmtDuration(activeLesson.estimatedMinutes)} read
                </div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 32,
                  color: 'var(--graphite)',
                  margin: '0 0 22px 0',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.15,
                }}>
                  {activeLesson.title}
                </h1>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 15.5,
                  lineHeight: 1.7,
                  color: 'var(--graphite)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {activeLesson.content || 'This lesson has no content yet.'}
                </div>
              </article>
            )}
          </section>
        </div>

        {/* Footer summary */}
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
            {totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'} across{' '}
            {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
            {totalMinutes > 0 && ` · ~${fmtDuration(totalMinutes)} to teach`}
          </div>
          {curriculum?.sourceUrl && (
            <a
              href={curriculum.sourceUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--glade-green-deep)',
                textDecoration: 'underline',
              }}
            >
              Source ↗
            </a>
          )}
        </footer>
      </div>
    </div>
  ), document.body);
}

if (typeof window !== 'undefined') {
  window.PublishedCurriculumViewer = PublishedCurriculumViewer;
}

export default PublishedCurriculumViewer;
