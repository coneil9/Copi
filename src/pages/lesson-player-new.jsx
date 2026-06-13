// New lesson player: read blocks → flashcard blocks → drag-drop blocks → quiz → result
// Backward compatible with old vol-based lessons (read[] + quiz[]).
import React from 'react';
import { FlashcardBlock } from './blocks/FlashcardBlock.jsx';
import { DragDropBlock } from './blocks/DragDropBlock.jsx';

function NewLessonPlayer({ open, email, target, onClose }) {
  const th = window.THEME || {}, ty = window.TYPOGRAPHY || {}, sh = window.SHADOW || {};
  const store = window.CopiStore;

  const [blockIdx, setBlockIdx] = React.useState(0); // which block we're on
  const [phase, setPhase]       = React.useState('blocks'); // 'blocks' | 'quiz' | 'result'
  const [qIdx, setQIdx]         = React.useState(0);
  const [selected, setSelected] = React.useState(null);
  const [revealed, setRevealed] = React.useState(false);
  const [answers, setAnswers]   = React.useState([]);
  const [passed, setPassed]     = React.useState(false);
  const [score, setScore]       = React.useState(0);
  const scrollRef = React.useRef(null);

  // ── Resolve target into unit ──────────────────────────────
  const unit = React.useMemo(() => {
    if (!target || !store) return null;
    const v = store.volById(target.volId);
    if (!v) return null;

    if (target.kind === 'final') {
      return {
        isFinal: true, vol: v,
        eyebrow: `${v.vol} · FINAL TEST`,
        title: v.finalTest.title,
        readBlocks: [],
        extraBlocks: [],
        quiz: v.finalTest.quiz,
        passMark: v.finalTest.passMark || 0.7,
        lessonId: v.finalTest.id,
      };
    }

    const lesson = v.lessons.find((l) => l.id === target.lessonId);
    if (!lesson) return null;

    // Check if there are DB blocks for this lesson (demo: v1l1 has them)
    const dbLesson = Object.values(store.raw().lessons || {}).find((l) => l.id === `${target.lessonId}-demo`);
    const extraBlocks = dbLesson ? dbLesson.blockIds.map((id) => store.raw().blocks[id]).filter(Boolean) : [];

    return {
      isFinal: false, vol: v, lesson,
      eyebrow: `${v.vol} · LESSON ${lesson.num} · ${lesson.minutes} MIN`,
      title: lesson.title,
      readBlocks: lesson.read || [],
      extraBlocks,
      quiz: lesson.quiz,
      passMark: 0.6,
      lessonId: lesson.id,
    };
  }, [target, open]);

  // Build ordered block list: read paragraphs as one block, then extra blocks
  const allBlocks = React.useMemo(() => {
    if (!unit) return [];
    const blocks = [];
    if (unit.readBlocks.length) blocks.push({ type: 'read', content: unit.readBlocks });
    unit.extraBlocks.forEach((b) => blocks.push(b));
    return blocks;
  }, [unit]);

  React.useEffect(() => {
    if (!open) return;
    setBlockIdx(0); setPhase('blocks'); setQIdx(0);
    setSelected(null); setRevealed(false); setAnswers([]);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open, target]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [phase, qIdx, blockIdx]);

  React.useEffect(() => {
    if (open && allBlocks.length === 0 && unit) setPhase('quiz');
  }, [allBlocks.length, open, unit]);

  if (!open || !unit) return null;

  const handleClose = () => { document.body.style.overflow = ''; onClose(); };

  // ── Block navigation ──────────────────────────────────────
  const handleBlockDone = () => {
    if (blockIdx < allBlocks.length - 1) {
      setBlockIdx(blockIdx + 1);
    } else {
      if (unit.quiz.length > 0) {
        setPhase('quiz');
      } else {
        // No quiz — complete immediately
        handleComplete(0, 0);
      }
    }
  };

  // ── Quiz ──────────────────────────────────────────────────
  const question = unit.quiz[qIdx];
  const handleSelect = (idx) => { if (!revealed) setSelected(idx); };
  const handleReveal = () => {
    if (selected === null) return;
    setRevealed(true);
    setAnswers((prev) => [...prev, { q: qIdx, selected, correct: selected === question.answer }]);
  };
  const handleNext = () => {
    if (qIdx < unit.quiz.length - 1) {
      setQIdx(qIdx + 1); setSelected(null); setRevealed(false);
    } else {
      const correctCount = answers.filter((a) => a.correct).length + (selected === question.answer ? 1 : 0);
      handleComplete(correctCount, unit.quiz.length);
    }
  };

  const handleComplete = (correct, total) => {
    const didPass = total === 0 || (correct / total) >= unit.passMark;
    setPassed(didPass); setScore(correct);
    if (unit.isFinal) {
      store.completeFinal(email, unit.vol.id, correct, total);
    } else {
      store.completeLesson(email, unit.lessonId, correct, total);
      // Also record attempt for history
      if (store.recordLessonAttempt) {
        store.recordLessonAttempt(
          store.getUserByEmail ? store.getUserByEmail(email)?.id : email,
          unit.lessonId, correct, total, didPass
        );
      }
    }
    setPhase('result');
  };

  const handleRetry = () => {
    setBlockIdx(0); setPhase(allBlocks.length ? 'blocks' : 'quiz');
    setQIdx(0); setSelected(null); setRevealed(false); setAnswers([]);
  };

  const currentBlock = allBlocks[blockIdx];
  const progressPct = phase === 'blocks'
    ? Math.round((blockIdx / (allBlocks.length + unit.quiz.length)) * 100)
    : phase === 'quiz'
    ? Math.round(((allBlocks.length + qIdx) / (allBlocks.length + unit.quiz.length)) * 100)
    : 100;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 8500, display: 'flex', flexDirection: 'column', background: th.bg }}>
      {/* Header */}
      <div style={{ background: th.bgCard, borderBottom: `1px solid ${th.line}`, padding: '0 24px', display: 'flex', alignItems: 'center', height: 54, gap: 12, flexShrink: 0 }}>
        <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: th.muted, fontSize: 18, lineHeight: 1, padding: '4px 8px', borderRadius: 8 }}>←</button>
        <div style={{ flex: 1 }}>
          <p style={{ ...ty.eyebrow, color: th.muted, margin: 0, marginBottom: 2 }}>{unit.eyebrow}</p>
          <div style={{ background: th.bgInset, borderRadius: 999, height: 4, overflow: 'hidden' }}>
            <div style={{ width: `${progressPct}%`, height: '100%', background: th.accent, borderRadius: 999, transition: 'width 300ms ease' }} />
          </div>
        </div>
        <span style={{ ...ty.caption, color: th.muted, flexShrink: 0 }}>{progressPct}%</span>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '0 24px 40px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', paddingTop: 32 }}>
          <h2 style={{ ...ty.h3, color: th.ink, marginBottom: 24 }}>{unit.title}</h2>

          {/* ── Blocks ────────────────────────────────────────── */}
          {phase === 'blocks' && currentBlock && (
            <>
              {currentBlock.type === 'read' && (
                <div>
                  {currentBlock.content.map((para, i) => (
                    <p key={i} style={{ ...ty.body, color: th.ink, marginBottom: 18, lineHeight: 1.75 }}>{para}</p>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                    <button onClick={handleBlockDone}
                      style={{ ...ty.button, padding: '10px 28px', borderRadius: th.pill, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>
                      {allBlocks.length === 1 && unit.quiz.length === 0 ? 'Mark complete ✓' : allBlocks.length > blockIdx + 1 ? 'Continue →' : 'Take the quiz →'}
                    </button>
                  </div>
                </div>
              )}

              {currentBlock.type === 'flashcard' && (
                <FlashcardBlock data={currentBlock.data} onComplete={handleBlockDone} />
              )}

              {currentBlock.type === 'drag_and_drop' && (
                <DragDropBlock data={currentBlock.data} onComplete={handleBlockDone} />
              )}
            </>
          )}

          {/* ── Quiz ──────────────────────────────────────────── */}
          {phase === 'quiz' && unit.quiz.length > 0 && (
            <div>
              <p style={{ ...ty.eyebrow, color: th.muted, marginBottom: 12 }}>
                QUESTION {qIdx + 1} OF {unit.quiz.length}
              </p>
              <p style={{ ...ty.h4, color: th.ink, marginBottom: 20, fontFamily: '"DM Serif Display", Georgia, serif' }}>{question.q}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {question.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect  = revealed && i === question.answer;
                  const isWrong    = revealed && isSelected && i !== question.answer;
                  return (
                    <button key={i} onClick={() => handleSelect(i)}
                      style={{
                        padding: '14px 18px', borderRadius: th.card, textAlign: 'left',
                        background: isCorrect ? `${th.accent}15` : isWrong ? `${th.danger}10` : isSelected ? th.bgInset : th.bgCard,
                        border: `2px solid ${isCorrect ? th.accent : isWrong ? th.danger : isSelected ? th.accent : th.line}`,
                        cursor: revealed ? 'default' : 'pointer', transition: 'all 140ms',
                        ...ty.body, color: th.ink,
                      }}>
                      {isCorrect && <span style={{ color: th.accent, marginRight: 8 }}>✓</span>}
                      {isWrong && <span style={{ color: th.danger, marginRight: 8 }}>✗</span>}
                      {opt}
                    </button>
                  );
                })}
              </div>

              {revealed && (
                <div style={{ padding: '14px 18px', background: `${th.accent}08`, border: `1px solid ${th.accent}33`, borderRadius: th.card, marginBottom: 20 }}>
                  <p style={{ ...ty.bodySmall, color: th.ink, margin: 0, fontStyle: 'italic' }}>{question.why}</p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {!revealed
                  ? <button onClick={handleReveal} disabled={selected === null}
                      style={{ ...ty.button, padding: '10px 28px', borderRadius: th.pill, background: selected !== null ? th.accent : th.bgInset, border: 'none', color: selected !== null ? th.onDark : th.muted, cursor: selected !== null ? 'pointer' : 'default' }}>
                      Check answer
                    </button>
                  : <button onClick={handleNext}
                      style={{ ...ty.button, padding: '10px 28px', borderRadius: th.pill, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>
                      {qIdx < unit.quiz.length - 1 ? 'Next question →' : 'See results →'}
                    </button>
                }
              </div>
            </div>
          )}

          {/* ── Result ────────────────────────────────────────── */}
          {phase === 'result' && (
            <div style={{ textAlign: 'center', paddingTop: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{passed ? '🏅' : '☕'}</div>
              <h2 style={{ ...ty.h3, color: passed ? th.accent : th.ink, marginBottom: 8 }}>
                {passed ? (unit.isFinal ? 'Certified!' : 'Lesson complete!') : 'Not quite yet.'}
              </h2>
              {unit.quiz.length > 0 && (
                <p style={{ ...ty.body, color: th.muted, marginBottom: 8 }}>
                  {score} of {unit.quiz.length} correct · {Math.round((score / unit.quiz.length) * 100)}%
                </p>
              )}
              <p style={{ ...ty.bodySmall, color: th.muted, marginBottom: 32 }}>
                {passed
                  ? unit.isFinal ? 'You\'ve passed the final. Well earned.' : 'Next lesson is now unlocked.'
                  : `You need ${Math.round(unit.passMark * 100)}% to pass. Keep going — retries are unlimited.`}
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                {!passed && (
                  <button onClick={handleRetry}
                    style={{ ...ty.button, padding: '10px 24px', borderRadius: th.pill, background: th.bgInset, border: `1.5px solid ${th.line}`, color: th.ink, cursor: 'pointer' }}>
                    Try again
                  </button>
                )}
                <button onClick={handleClose}
                  style={{ ...ty.button, padding: '10px 24px', borderRadius: th.pill, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>
                  {passed ? 'Continue ✓' : 'Close'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.NewLessonPlayer = NewLessonPlayer;
