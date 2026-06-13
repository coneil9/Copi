import React from 'react';

export function FlashcardBlock({ data, onComplete }) {
  const [current, setCurrent] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const cards = data?.cards || [];

  const th = window.THEME || {}, ty = window.TYPOGRAPHY || {}, sh = window.SHADOW || {};

  if (!cards.length) { onComplete(); return null; }

  const handleNext = () => {
    if (current < cards.length - 1) {
      setCurrent(current + 1);
      setFlipped(false);
    } else {
      onComplete();
    }
  };

  const card = cards[current];
  const isLast = current === cards.length - 1;

  return (
    <div style={{ padding: '24px 0' }}>
      <p style={{ ...ty.eyebrow, color: th.accent, marginBottom: 16, textAlign: 'center' }}>
        Flashcard {current + 1} of {cards.length}
      </p>

      {/* Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          minHeight: 200, borderRadius: th.card + 2, border: `1.5px solid ${flipped ? th.accent : th.line}`,
          background: flipped ? `${th.accent}0d` : th.bgCard,
          padding: 32, cursor: 'pointer', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          transition: 'all 200ms ease', boxShadow: sh.cardHover,
          userSelect: 'none',
        }}
      >
        {!flipped ? (
          <>
            <p style={{ ...ty.eyebrow, color: th.muted, marginBottom: 12 }}>Front — tap to reveal</p>
            <p style={{ ...ty.h3, color: th.ink, margin: 0 }}>{card.front}</p>
          </>
        ) : (
          <>
            <p style={{ ...ty.eyebrow, color: th.accent, marginBottom: 12 }}>Answer</p>
            <p style={{ ...ty.bodyLarge, color: th.ink, margin: 0, lineHeight: 1.6 }}>{card.back}</p>
          </>
        )}
      </div>

      <p style={{ ...ty.caption, color: th.muted, textAlign: 'center', marginTop: 10 }}>
        {flipped ? 'Got it? Continue.' : 'Tap the card to flip.'}
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        <button
          onClick={handleNext}
          disabled={!flipped}
          style={{
            ...ty.button, padding: '10px 28px', borderRadius: th.pill,
            background: flipped ? th.accent : th.bgInset,
            color: flipped ? th.onDark : th.muted,
            border: 'none', cursor: flipped ? 'pointer' : 'default', transition: 'all 200ms',
          }}
        >{isLast ? 'Continue to quiz →' : 'Next card →'}</button>
      </div>
    </div>
  );
}
