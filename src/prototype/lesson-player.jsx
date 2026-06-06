// ═════════════════════════════════════════════════════════
// LESSON PLAYER — the actual learning experience.
// Read the editorial explanation → take the multiple-choice
// check → see results. Passing marks the lesson done in
// CopiStore, which unlocks the next section. Also runs the
// end-of-module final test.
//
// target = { kind:'lesson', volId, lessonId } | { kind:'final', volId }
// ═════════════════════════════════════════════════════════

function LessonPlayer({ open, email, target, onClose }) {
  const p = {
    bg: '#E8DDC2', fg: '#1A1410', accent: '#3F5A3A',
    cream: '#F4EBD2', sun: '#C68A3D', cherry: '#7A2B1F',
  };
  const display = { fontFamily: 'Unna' };
  const sub = { fontFamily: 'Yrsa' };
  const sans = { fontFamily: 'Lato' };
  const lbl = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 10 };

  const store = window.CopiStore;
  const [phase, setPhase] = React.useState('read'); // read | quiz | result
  const [qIdx, setQIdx] = React.useState(0);
  const [selected, setSelected] = React.useState(null);
  const [revealed, setRevealed] = React.useState(false);
  const [answers, setAnswers] = React.useState([]);
  const [closing, setClosing] = React.useState(false);
  const scrollRef = React.useRef(null);

  // Resolve the target into a renderable unit.
  const unit = React.useMemo(() => {
    if (!target) return null;
    const v = store.volById(target.volId);
    if (!v) return null;
    if (target.kind === 'final') {
      return {
        isFinal: true, vol: v,
        eyebrow: `${v.vol} \u00B7 FINAL TEST`,
        title: v.finalTest.title,
        read: null,
        quiz: v.finalTest.quiz,
        passMark: v.finalTest.passMark || 0.7,
      };
    }
    const lesson = v.lessons.find((l) => l.id === target.lessonId);
    if (!lesson) return null;
    const idx = v.lessons.indexOf(lesson);
    return {
      isFinal: false, vol: v, lesson, idx,
      eyebrow: `${v.vol} \u00B7 LESSON ${lesson.num} \u00B7 ${lesson.minutes} MIN`,
      title: lesson.title,
      read: lesson.read,
      quiz: lesson.quiz,
      passMark: 0.6,
    };
  }, [target]);

  React.useEffect(() => {
    if (open) {
      setPhase('read'); setQIdx(0); setSelected(null); setRevealed(false); setAnswers([]); setClosing(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, target]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [phase, qIdx]);

  if ((!open && !closing) || !unit) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose && onClose(); }, 240);
  };

  const score = answers.filter((a, i) => a === unit.quiz[i].answer).length;
  const total = unit.quiz.length;
  const passed = total ? (score / total) >= unit.passMark : false;

  const startQuiz = () => { setPhase('quiz'); setQIdx(0); setSelected(null); setRevealed(false); setAnswers([]); };

  const reveal = () => { if (selected === null) return; setRevealed(true); };
  const nextQ = () => {
    const nextAnswers = [...answers]; nextAnswers[qIdx] = selected;
    setAnswers(nextAnswers);
    if (qIdx < total - 1) {
      setQIdx(qIdx + 1); setSelected(null); setRevealed(false);
    } else {
      // finalize
      const finalScore = nextAnswers.filter((a, i) => a === unit.quiz[i].answer).length;
      const didPass = (finalScore / total) >= unit.passMark;
      if (didPass) {
        if (unit.isFinal) store.completeFinal(email, unit.vol.id, finalScore, total);
        else store.completeLesson(email, unit.lesson.id, finalScore, total);
      }
      setPhase('result');
    }
  };

  const retry = () => { setPhase(unit.isFinal ? 'quiz' : 'read'); setQIdx(0); setSelected(null); setRevealed(false); setAnswers([]); };

  // what unlocks next, for the success message
  const nextUp = (() => {
    if (unit.isFinal) return { kind: 'cert', label: `${unit.vol.cert} \u2014 certified` };
    const nextLesson = unit.vol.lessons[unit.idx + 1];
    if (nextLesson) return { kind: 'lesson', label: `${unit.vol.vol} \u00B7 ${nextLesson.num} ${nextLesson.title}` };
    return { kind: 'final', label: `${unit.vol.vol} \u00B7 Final test` };
  })();

  // ── shared chrome ─────────────────────────────────────────
  const Shell = ({ children, footer }) => (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9500,
        background: 'rgba(26,20,16,0.62)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'grid', placeItems: 'center', padding: '24px',
        opacity: closing ? 0 : 1, transition: 'opacity 240ms ease',
      }}
    >
      <div style={{
        width: 'min(760px, 100%)', maxHeight: 'calc(100vh - 48px)',
        background: p.bg, border: `2px solid ${p.fg}`, borderRadius: 24,
        boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: closing ? 'translateY(10px) scale(0.985)' : 'translateY(0) scale(1)',
        opacity: closing ? 0 : 1,
        transition: 'transform 240ms cubic-bezier(.2,.7,.2,1), opacity 240ms ease',
      }}>
        {/* top bar */}
        <div style={{
          flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', borderBottom: `1.5px solid ${p.fg}`, background: p.cream,
        }}>
          <span style={{ ...lbl, opacity: 0.8 }}>{unit.eyebrow}</span>
          <button onClick={handleClose} style={{ ...lbl, color: p.fg, opacity: 0.7, cursor: 'pointer', background: 'none', border: 'none' }}>
            CLOSE ✕
          </button>
        </div>
        {/* scroll body */}
        <div ref={scrollRef} style={{ flex: '1 1 auto', overflowY: 'auto' }}>{children}</div>
        {/* footer */}
        {footer && (
          <div style={{
            flex: '0 0 auto', padding: '18px 24px', borderTop: `1.5px solid ${p.fg}`,
            background: p.cream, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          }}>{footer}</div>
        )}
      </div>
    </div>
  );

  const primaryBtn = (labelText, onClick, enabled = true) => (
    <button
      onClick={onClick} disabled={!enabled}
      style={{
        ...sans, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
        background: enabled ? p.accent : `${p.fg}35`, color: p.cream,
        padding: '14px 26px', border: 'none', borderRadius: 999,
        cursor: enabled ? 'pointer' : 'not-allowed',
        display: 'inline-flex', alignItems: 'center', gap: 10,
        transition: 'background 160ms ease',
      }}
    >{labelText}</button>
  );

  // ── READING PHASE ─────────────────────────────────────────
  if (phase === 'read') {
    return (
      <Shell footer={
        <React.Fragment>
          <span style={{ ...sans, fontSize: 12, opacity: 0.6 }}>
            Read through, then take the {total}-question check.
          </span>
          {primaryBtn(<React.Fragment>Begin the check &rarr;</React.Fragment>, startQuiz)}
        </React.Fragment>
      }>
        <div style={{ padding: '44px 56px 40px', maxWidth: 680, margin: '0 auto' }}>
          <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>◆ {unit.vol.name.toUpperCase()}</div>
          <h1 style={{ ...display, fontSize: 58, lineHeight: 0.98, letterSpacing: '-0.03em', fontWeight: 400, margin: '0 0 28px' }}>
            {unit.title}.
          </h1>
          {unit.read.map((para, i) => (
            <p key={i} style={{
              ...sub, fontSize: 21, lineHeight: 1.62, fontWeight: 400, color: p.fg,
              margin: '0 0 22px', textWrap: 'pretty',
            }}>{para}</p>
          ))}
          <div style={{
            marginTop: 32, padding: '18px 22px', borderRadius: 16,
            background: p.cream, border: `1.5px solid ${p.fg}20`,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%', flex: '0 0 auto',
              background: p.sun, display: 'grid', placeItems: 'center', border: `1.5px solid ${p.fg}`,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
            </div>
            <div style={{ ...sans, fontSize: 13.5, lineHeight: 1.4, opacity: 0.8 }}>
              A quick check of {total} questions follows. Score {Math.ceil(unit.passMark * total)}/{total} or better to {unit.isFinal ? 'earn the certification' : 'complete this lesson and unlock the next'}.
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  // ── QUIZ PHASE ────────────────────────────────────────────
  if (phase === 'quiz') {
    const q = unit.quiz[qIdx];
    return (
      <Shell footer={
        <React.Fragment>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {unit.quiz.map((_, i) => (
              <span key={i} style={{
                width: i === qIdx ? 24 : 8, height: 8, borderRadius: 99,
                background: i < qIdx ? p.accent : i === qIdx ? p.sun : `${p.fg}25`,
                transition: 'all 220ms ease',
              }} />
            ))}
          </div>
          {!revealed
            ? primaryBtn('Check', reveal, selected !== null)
            : primaryBtn(qIdx < total - 1 ? <React.Fragment>Next &rarr;</React.Fragment> : 'See results', nextQ)}
        </React.Fragment>
      }>
        <div style={{ padding: '44px 56px 40px', maxWidth: 680, margin: '0 auto' }}>
          <div style={{ ...lbl, color: p.accent, marginBottom: 20 }}>QUESTION {qIdx + 1} OF {total}</div>
          <h2 style={{ ...display, fontSize: 40, lineHeight: 1.08, letterSpacing: '-0.02em', fontWeight: 400, margin: '0 0 30px' }}>
            {q.q}
          </h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {q.options.map((opt, i) => {
              const isSel = selected === i;
              const isAnswer = i === q.answer;
              let border = `1.5px solid ${p.fg}25`;
              let bg = p.cream;
              let mark = null;
              if (revealed) {
                if (isAnswer) { border = `2px solid ${p.accent}`; bg = 'rgba(63,90,58,0.12)'; mark = '\u2713'; }
                else if (isSel) { border = `2px solid ${p.cherry}`; bg = 'rgba(122,43,31,0.10)'; mark = '\u2715'; }
              } else if (isSel) { border = `2px solid ${p.fg}`; bg = p.cream; }
              return (
                <button
                  key={i}
                  onClick={() => { if (!revealed) setSelected(i); }}
                  disabled={revealed}
                  style={{
                    textAlign: 'left', cursor: revealed ? 'default' : 'pointer',
                    background: bg, border, borderRadius: 14, padding: '16px 18px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    transition: 'border 140ms ease, background 140ms ease',
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', flex: '0 0 auto',
                    border: `1.5px solid ${p.fg}`,
                    background: revealed && isAnswer ? p.accent : revealed && isSel ? p.cherry : 'transparent',
                    color: (revealed && (isAnswer || isSel)) ? p.cream : p.fg,
                    display: 'grid', placeItems: 'center',
                    ...sans, fontSize: 13, fontWeight: 700,
                  }}>{mark || String.fromCharCode(65 + i)}</span>
                  <span style={{ ...sub, fontSize: 19, fontWeight: 400, lineHeight: 1.3 }}>{opt}</span>
                </button>
              );
            })}
          </div>
          {revealed && (
            <div style={{
              marginTop: 22, padding: '16px 20px', borderRadius: 14,
              background: selected === q.answer ? 'rgba(63,90,58,0.10)' : 'rgba(198,138,61,0.12)',
              border: `1.5px solid ${selected === q.answer ? p.accent : p.sun}`,
            }}>
              <div style={{ ...lbl, fontSize: 9, color: selected === q.answer ? p.accent : p.sun, marginBottom: 6 }}>
                {selected === q.answer ? '\u25C6 CORRECT' : '\u25C6 NOT QUITE'}
              </div>
              <div style={{ ...sub, fontSize: 17, lineHeight: 1.45, fontWeight: 400 }}>{q.why}</div>
            </div>
          )}
        </div>
      </Shell>
    );
  }

  // ── RESULT PHASE ──────────────────────────────────────────
  const pct = Math.round((score / total) * 100);
  return (
    <Shell footer={
      <React.Fragment>
        <span style={{ ...sans, fontSize: 12, opacity: 0.6 }}>
          {passed ? 'Progress saved.' : 'Nothing saved — give it another go.'}
        </span>
        <div style={{ display: 'flex', gap: 10 }}>
          {!passed && (
            <button onClick={retry} style={{
              ...sans, fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
              background: 'transparent', color: p.fg, padding: '14px 22px',
              border: `1.5px solid ${p.fg}`, borderRadius: 999, cursor: 'pointer',
            }}>Try again</button>
          )}
          {primaryBtn(passed ? <React.Fragment>Continue &rarr;</React.Fragment> : 'Back to lesson', passed ? handleClose : retry)}
        </div>
      </React.Fragment>
    }>
      <div style={{ padding: '52px 56px 44px', maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ ...lbl, color: passed ? p.accent : p.cherry, marginBottom: 22 }}>
          {passed ? (unit.isFinal ? '\u25C6 CERTIFICATION EARNED' : '\u25C6 LESSON COMPLETE') : '\u25C6 NOT PASSED YET'}
        </div>

        {/* score ring */}
        <div style={{ position: 'relative', width: 150, height: 150, margin: '0 auto 28px' }}>
          <svg width="150" height="150" viewBox="0 0 150 150">
            <circle cx="75" cy="75" r="64" fill="none" stroke={`${p.fg}18`} strokeWidth="12" />
            <circle cx="75" cy="75" r="64" fill="none" stroke={passed ? p.accent : p.cherry} strokeWidth="12" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 64} strokeDashoffset={2 * Math.PI * 64 * (1 - pct / 100)}
              transform="rotate(-90 75 75)" style={{ transition: 'stroke-dashoffset 600ms ease' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            <div style={{ ...display, fontStyle: 'italic', fontSize: 46, color: passed ? p.accent : p.cherry, fontWeight: 400, lineHeight: 1 }}>
              {score}/{total}
            </div>
          </div>
        </div>

        <h1 style={{ ...display, fontSize: 50, lineHeight: 1.0, letterSpacing: '-0.025em', fontWeight: 400, margin: '0 0 14px' }}>
          {passed
            ? (unit.isFinal ? <React.Fragment>You&rsquo;re <em style={{ fontStyle: 'italic', color: p.accent }}>certified.</em></React.Fragment> : <React.Fragment>Nicely <em style={{ fontStyle: 'italic', color: p.accent }}>done.</em></React.Fragment>)
            : <React.Fragment>So <em style={{ fontStyle: 'italic', color: p.cherry }}>close.</em></React.Fragment>}
        </h1>
        <p style={{ ...sub, fontSize: 20, lineHeight: 1.45, opacity: 0.78, fontWeight: 400, margin: '0 auto', maxWidth: 440 }}>
          {passed
            ? (unit.isFinal
              ? `You\u2019ve completed ${unit.vol.name} and earned the ${unit.vol.cert} certification. Your manager can see it on the team board.`
              : `You scored ${pct}% on the check. The next section is now unlocked.`)
            : `You need ${Math.ceil(unit.passMark * total)} of ${total} to pass. Have another look at the lesson and try the check again — no penalty.`}
        </p>

        {passed && (
          <div style={{
            marginTop: 30, padding: '18px 22px', borderRadius: 16,
            background: p.cream, border: `1.5px solid ${p.fg}20`,
            display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', flex: '0 0 auto',
              background: nextUp.kind === 'cert' ? p.sun : p.accent,
              display: 'grid', placeItems: 'center', border: `1.5px solid ${p.fg}`,
            }}>
              {nextUp.kind === 'cert'
                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="2"><circle cx="12" cy="8" r="6" /><path d="M9 13l-2 8 5-3 5 3-2-8" /></svg>
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p.cream} strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>}
            </div>
            <div>
              <div style={{ ...lbl, fontSize: 9, opacity: 0.55, marginBottom: 4 }}>
                {nextUp.kind === 'cert' ? 'NOW CERTIFIED' : 'UNLOCKED NEXT'}
              </div>
              <div style={{ ...sub, fontSize: 19, fontWeight: 500 }}>{nextUp.label}</div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

window.LessonPlayer = LessonPlayer;
