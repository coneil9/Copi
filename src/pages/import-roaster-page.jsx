// ═════════════════════════════════════════════════════════
// IMPORT ROASTER — Onboarding step that takes a roaster website URL,
// runs it through the roaster-import service (mirrors POST
// /api/import/roaster), and previews the generated curriculum before
// the owner publishes it.
//
// Four UI states: input → loading (cycling messages) → success
// preview → error (with Skip). Skip is available at every state so
// this never blocks the owner from reaching their dashboard.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { importRoaster, publishCurriculum, getRateLimitState } from '../lib/roaster-import-service.js';

const LOADING_MESSAGES = [
  'Fetching your roaster\'s website…',
  'Reading their coffees and origins…',
  'Building your training curriculum…',
  'Almost ready…'
];

function PageShell({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--pearl-bush)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px'
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 30,
            color: 'var(--glade-green-deep)',
            letterSpacing: '-0.02em'
          }}>
            Copi
          </span>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--roman-coffee)',
            margin: '6px 0 0 0'
          }}>
            One more step before your dashboard.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProgressDots({ step = 3, total = 3 }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 22 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 8, height: 8, borderRadius: 99,
            background: i + 1 <= step ? 'var(--glade-green-deep)' : 'var(--heathered-gray)'
          }}
        />
      ))}
    </div>
  );
}

function SkipLink({ onSkip, label = 'Skip for now' }) {
  return (
    <button
      type="button"
      onClick={onSkip}
      style={{
        background: 'none',
        border: 'none',
        color: 'var(--roman-coffee)',
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        textDecoration: 'underline',
        textUnderlineOffset: 3,
        padding: 0
      }}
    >
      {label}
    </button>
  );
}

// ─── Loading state ─────────────────────────────────────────
function LoadingState({ message }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        padding: '36px 24px'
      }}
    >
      <div style={{ position: 'relative', width: 44, height: 44 }}>
        <div style={{
          position: 'absolute', inset: 0,
          border: '3px solid var(--pearl-bush)',
          borderTopColor: 'var(--glade-green-deep)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      </div>
      <div
        key={message /* re-key so the fade re-runs on each change */}
        className="copi-reveal copi-reveal--fade-up is-in"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--graphite)',
          textAlign: 'center',
          transitionDuration: '300ms'
        }}
      >
        {message}
      </div>
    </div>
  );
}

// ─── Success preview ───────────────────────────────────────
function formatTeachTime(totalMinutes) {
  if (!totalMinutes || totalMinutes < 1) return null;
  if (totalMinutes < 60) return `~${totalMinutes}m to teach`;
  const hours = totalMinutes / 60;
  // Show one decimal for sub-2h so 1.5h doesn't round down to 1h.
  const display = hours < 2 ? hours.toFixed(1) : Math.round(hours);
  return `~${display}h to teach`;
}

function SuccessPreview({ result, onPublish, onReview, publishing }) {
  const totalLessons = (result.tracks || []).reduce((s, t) => s + (t.lessonCount || 0), 0);
  const totalMinutes = (result.tracks || []).reduce((s, t) => s + (t.totalMinutes || 0), 0);
  const teachTime    = formatTeachTime(totalMinutes);
  return (
    <div
      className="copi-reveal copi-reveal--fade-up is-in"
      style={{
        background: 'var(--white)',
        borderRadius: 14,
        padding: 28,
        border: '1px solid var(--pearl-bush)',
        boxShadow: '0 8px 24px rgba(31, 26, 20, 0.08)',
        transitionDuration: '300ms'
      }}
    >
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--glade-green-deep)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: 8
      }}>
        Draft ready
      </div>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 26,
        color: 'var(--graphite)',
        margin: '0 0 4px 0',
        letterSpacing: '-0.01em'
      }}>
        {result.shop_name}
      </h2>
      {result.tagline && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--roman-coffee)',
          marginBottom: 14
        }}>
          {result.tagline}
        </div>
      )}

      <div style={{
        display: 'inline-flex',
        gap: 14,
        padding: '8px 14px',
        borderRadius: 999,
        background: 'var(--pearl-bush)',
        marginBottom: 18,
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--graphite)'
      }}>
        <span>{result.tracks.length} {result.tracks.length === 1 ? 'track' : 'tracks'}</span>
        <span style={{ color: 'var(--heathered-gray)' }}>·</span>
        <span>{totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'}</span>
        {teachTime && (
          <>
            <span style={{ color: 'var(--heathered-gray)' }}>·</span>
            <span>{teachTime}</span>
          </>
        )}
      </div>

      <div style={{
        maxHeight: 220,
        overflowY: 'auto',
        border: '1px solid var(--pearl-bush)',
        borderRadius: 10,
        padding: '4px 0',
        marginBottom: 20
      }}>
        {result.tracks.map((t, i) => (
          <div
            key={t.title}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              borderBottom: i === result.tracks.length - 1 ? 'none' : '1px solid var(--pearl-bush)'
            }}
          >
            <div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--graphite)'
              }}>
                {t.title}
              </div>
              {t.description && (
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--roman-coffee)',
                  marginTop: 2,
                  maxWidth: 360,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {t.description}
                </div>
              )}
            </div>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--heathered-gray)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              marginLeft: 16
            }}>
              {t.lessonCount} {t.lessonCount === 1 ? 'lesson' : 'lessons'}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={onPublish}
          disabled={publishing}
          style={{
            flex: 1,
            minWidth: 180,
            padding: '11px 22px',
            background: 'var(--glade-green-deep)',
            color: 'var(--white)',
            border: 'none',
            borderRadius: 999,
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 600,
            cursor: publishing ? 'not-allowed' : 'pointer',
            opacity: publishing ? 0.7 : 1
          }}
        >
          {publishing ? 'Publishing…' : 'Publish curriculum'}
        </button>
        <button
          type="button"
          onClick={onReview}
          style={{
            flex: 1,
            minWidth: 140,
            padding: '11px 22px',
            background: 'transparent',
            color: 'var(--glade-green-deep)',
            border: '1.5px solid var(--glade-green-deep)',
            borderRadius: 999,
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Review first
        </button>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────
export function ImportRoasterPage({ user = {}, onComplete }) {
  const [phase, setPhase]       = React.useState('input'); // input | loading | success | error
  const [url, setUrl]           = React.useState('');
  const [error, setError]       = React.useState(null);
  const [result, setResult]     = React.useState(null);
  const [loadingIdx, setLoadingIdx] = React.useState(0);
  const [publishing, setPublishing] = React.useState(false);
  const intervalRef = React.useRef(null);

  const shopId = user?.cafeId || user?.cafe || (window.CopiStore?.getDefaultCafe?.()?.id) || null;
  const existingDraft = shopId && window.CopiStore?.getDraftCurriculumForCafe
    ? window.CopiStore.getDraftCurriculumForCafe(shopId)
    : null;

  const goToDashboard = () => {
    if (typeof onComplete === 'function') return onComplete({ skipped: false });
    if (window.CopiActions?.navigate) window.CopiActions.navigate('admin-home');
  };

  const skip = () => {
    if (typeof onComplete === 'function') return onComplete({ skipped: true });
    if (window.CopiActions?.navigate) window.CopiActions.navigate('admin-home');
  };

  // Cycle loading messages every 3.2s while we wait on the import call.
  React.useEffect(() => {
    if (phase !== 'loading') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    setLoadingIdx(0);
    intervalRef.current = setInterval(() => {
      setLoadingIdx((i) => Math.min(LOADING_MESSAGES.length - 1, i + 1));
    }, 3200);
    return () => clearInterval(intervalRef.current);
  }, [phase]);

  const submit = async (e) => {
    e?.preventDefault?.();
    setError(null);

    // Quick client-side check before fanning out to the service.
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      setError('URL must start with http:// or https://');
      return;
    }

    setPhase('loading');
    const resp = await importRoaster({ url: trimmed, shopId });
    if (resp.error) {
      setError(resp.message);
      setPhase('error');
      return;
    }
    setResult(resp.data);
    setPhase('success');
  };

  const onPublish = async () => {
    if (!result?.curriculumId) return;
    setPublishing(true);
    await publishCurriculum(result.curriculumId);
    setPublishing(false);
    goToDashboard();
  };

  const onReview = () => {
    if (window.CopiActions?.navigate) window.CopiActions.navigate('admin-curriculum-page');
  };

  const rate = getRateLimitState();

  return (
    <PageShell>
      <div style={{
        background: 'var(--white)',
        borderRadius: 16,
        padding: 32,
        border: '1px solid var(--pearl-bush)',
        boxShadow: '0 8px 24px rgba(31, 26, 20, 0.06)'
      }}>
        <ProgressDots step={3} total={3} />

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 28,
          color: 'var(--graphite)',
          margin: '0 0 6px 0',
          textAlign: 'center',
          letterSpacing: '-0.01em'
        }}>
          Import from your roaster
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--roman-coffee)',
          margin: '0 0 24px 0',
          textAlign: 'center',
          lineHeight: 1.5
        }}>
          Drop in your roaster's website URL and Copi will draft a starting curriculum from their coffees, origins, and brew guides. You'll review every lesson before it goes live to your team.
        </p>

        {phase === 'input' && (
          <form onSubmit={submit}>
            {existingDraft && (
              <div style={{
                marginBottom: 16,
                padding: '12px 14px',
                borderRadius: 10,
                background: 'var(--ripe-lemon-soft)',
                border: '1px solid var(--ripe-lemon)',
                fontFamily: 'var(--font-body)',
                fontSize: 12.5,
                color: 'var(--graphite)',
                lineHeight: 1.5
              }}>
                You already have a draft curriculum from{' '}
                <b>{existingDraft.shopName || existingDraft.sourceUrl}</b>. Importing a new
                one will replace it.
              </div>
            )}
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--graphite)',
              marginBottom: 6
            }}>
              Your roaster's website
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://onyxcoffeelab.com"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 10,
                border: `1.5px solid ${error ? 'var(--danger)' : 'var(--pearl-bush)'}`,
                background: 'var(--alabaster)',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--graphite)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {error && (
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--danger)',
                marginTop: 8
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                marginTop: 18,
                width: '100%',
                padding: '12px',
                background: 'var(--glade-green-deep)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: 999,
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Import curriculum
            </button>

            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <SkipLink onSkip={skip} />
            </div>

            {rate.remaining < RATE_LIMIT_NOTE_THRESHOLD && (
              <div style={{
                marginTop: 14,
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--heathered-gray)',
                textAlign: 'center'
              }}>
                {rate.remaining} of {rate.max} imports left this session.
              </div>
            )}
          </form>
        )}

        {phase === 'loading' && <LoadingState message={LOADING_MESSAGES[loadingIdx]} />}

        {phase === 'success' && result && (
          <>
            <SuccessPreview
              result={result}
              onPublish={onPublish}
              onReview={onReview}
              publishing={publishing}
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <SkipLink onSkip={skip} label="Skip and go to dashboard" />
            </div>
          </>
        )}

        {phase === 'error' && (
          <div>
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 10,
                background: 'rgba(156, 61, 39, 0.10)',
                border: '1px solid rgba(156, 61, 39, 0.25)',
                color: 'var(--danger)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                lineHeight: 1.5,
                marginBottom: 18
              }}
            >
              {error || 'We couldn\'t read that site. Try a different URL, or skip this step and build your curriculum manually.'}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => { setPhase('input'); setError(null); }}
                style={{
                  flex: 1,
                  minWidth: 140,
                  padding: '11px 22px',
                  background: 'var(--glade-green-deep)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: 999,
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Try a different URL
              </button>
              <button
                type="button"
                onClick={skip}
                style={{
                  flex: 1,
                  minWidth: 140,
                  padding: '11px 22px',
                  background: 'transparent',
                  color: 'var(--glade-green-deep)',
                  border: '1.5px solid var(--glade-green-deep)',
                  borderRadius: 999,
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Skip for now
              </button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

const RATE_LIMIT_NOTE_THRESHOLD = 2;

if (typeof window !== 'undefined') {
  window.ImportRoasterPage = ImportRoasterPage;
}

export default ImportRoasterPage;
