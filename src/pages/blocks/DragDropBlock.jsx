// Click-to-place matching (no HTML5 DnD to avoid mobile friction).
import React from 'react';

export function DragDropBlock({ data, onComplete }) {
  const th = window.THEME || {}, ty = window.TYPOGRAPHY || {}, sh = window.SHADOW || {};
  const mode = data?.mode || 'match';

  if (mode === 'match') return <MatchBlock data={data} onComplete={onComplete} th={th} ty={ty} sh={sh} />;
  return <OrderBlock data={data} onComplete={onComplete} th={th} ty={ty} sh={sh} />;
}

// ── Match: left terms → right definitions ────────────────
function MatchBlock({ data, onComplete, th, ty, sh }) {
  const pairs = data?.pairs || [];
  const [selected, setSelected] = React.useState(null); // { side:'left'|'right', index }
  const [matches, setMatches] = React.useState({}); // leftIndex → rightIndex
  const [wrong, setWrong] = React.useState(null); // { left, right }

  const rightOrder = React.useMemo(() => {
    const idxs = pairs.map((_, i) => i);
    for (let i = idxs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
    }
    return idxs;
  }, [pairs.length]);

  const allMatched = Object.keys(matches).length === pairs.length;
  const matchedRights = new Set(Object.values(matches));

  const handleLeft = (li) => {
    if (matches[li] !== undefined) return;
    setSelected(selected?.side === 'left' && selected?.index === li ? null : { side: 'left', index: li });
  };

  const handleRight = (ri) => {
    if (matchedRights.has(ri)) return;
    if (!selected || selected.side !== 'left') { setSelected({ side: 'right', index: ri }); return; }
    const li = selected.index;
    if (li === ri) {
      setMatches((m) => ({ ...m, [li]: ri }));
      setSelected(null); setWrong(null);
    } else {
      setWrong({ left: li, right: ri });
      setTimeout(() => { setWrong(null); setSelected(null); }, 800);
    }
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <p style={{ ...ty.eyebrow, color: th.accent, marginBottom: 8, textAlign: 'center' }}>Match the pairs</p>
      <p style={{ ...ty.caption, color: th.muted, marginBottom: 20, textAlign: 'center' }}>{data?.prompt || 'Click a term, then its definition.'}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pairs.map((p, li) => {
            const matched = matches[li] !== undefined;
            const isSelected = selected?.side === 'left' && selected?.index === li;
            const isWrong = wrong?.left === li;
            return (
              <div key={li} onClick={() => handleLeft(li)}
                style={{
                  padding: '12px 16px', borderRadius: th.card, border: `2px solid ${matched ? th.accent : isWrong ? th.danger : isSelected ? th.accent : th.line}`,
                  background: matched ? `${th.accent}12` : isSelected ? `${th.accent}08` : th.bgCard,
                  cursor: matched ? 'default' : 'pointer', transition: 'all 140ms',
                  opacity: matched ? 0.7 : 1,
                }}>
                <p style={{ ...ty.bodySmall, color: th.ink, margin: 0, fontWeight: 500 }}>{p.term}</p>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rightOrder.map((ri) => {
            const matched = matchedRights.has(ri);
            const isWrong = wrong?.right === ri;
            return (
              <div key={ri} onClick={() => handleRight(ri)}
                style={{
                  padding: '12px 16px', borderRadius: th.card, border: `2px solid ${matched ? th.accent : isWrong ? th.danger : th.line}`,
                  background: matched ? `${th.accent}12` : th.bgCard,
                  cursor: matched ? 'default' : 'pointer', transition: 'all 140ms',
                  opacity: matched ? 0.7 : 1,
                }}>
                <p style={{ ...ty.bodySmall, color: th.muted, margin: 0 }}>{pairs[ri].definition}</p>
              </div>
            );
          })}
        </div>
      </div>

      {allMatched && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ ...ty.body, color: th.accent, marginBottom: 12 }}>✓ All matched!</p>
          <button onClick={onComplete} style={{ ...ty.button, padding: '10px 28px', borderRadius: th.pill, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Order: drag items into correct sequence ───────────────
function OrderBlock({ data, onComplete, th, ty, sh }) {
  const items = data?.items || [];
  const [order, setOrder] = React.useState(() => {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
  const [checked, setChecked] = React.useState(false);
  const [selected, setSelected] = React.useState(null);

  const isCorrect = order.join('|') === items.join('|');

  const handleClick = (i) => {
    if (checked) return;
    if (selected === null) { setSelected(i); return; }
    if (selected === i) { setSelected(null); return; }
    const newOrder = [...order];
    [newOrder[selected], newOrder[i]] = [newOrder[i], newOrder[selected]];
    setOrder(newOrder);
    setSelected(null);
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <p style={{ ...ty.eyebrow, color: th.accent, marginBottom: 8, textAlign: 'center' }}>Put in the correct order</p>
      <p style={{ ...ty.caption, color: th.muted, marginBottom: 20, textAlign: 'center' }}>{data?.prompt || 'Click two items to swap them.'}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {order.map((item, i) => {
          const correct = checked && item === items[i];
          const wrong   = checked && item !== items[i];
          return (
            <div key={i} onClick={() => handleClick(i)}
              style={{
                padding: '12px 16px', borderRadius: th.card,
                border: `2px solid ${correct ? th.accent : wrong ? th.danger : selected === i ? th.accent : th.line}`,
                background: correct ? `${th.accent}12` : wrong ? `${th.danger}0d` : selected === i ? `${th.accent}08` : th.bgCard,
                cursor: checked ? 'default' : 'pointer', transition: 'all 140ms', display: 'flex', alignItems: 'center', gap: 12,
              }}>
              <span style={{ ...ty.label, color: th.muted, background: th.bgInset, padding: '2px 8px', borderRadius: 999, minWidth: 28, textAlign: 'center' }}>{i + 1}</span>
              <p style={{ ...ty.bodySmall, color: th.ink, margin: 0 }}>{item}</p>
            </div>
          );
        })}
      </div>

      {!checked ? (
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => setChecked(true)} style={{ ...ty.button, padding: '10px 28px', borderRadius: th.pill, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>Check order</button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p style={{ ...ty.body, color: isCorrect ? th.accent : th.danger, marginBottom: 12 }}>
            {isCorrect ? '✓ Correct order!' : '✗ Not quite — the correct order is shown above.'}
          </p>
          <button onClick={onComplete} style={{ ...ty.button, padding: '10px 28px', borderRadius: th.pill, background: th.accent, border: 'none', color: th.onDark, cursor: 'pointer' }}>
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
