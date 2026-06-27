// ═════════════════════════════════════════════════════════
// CUPPER CHAT — Right-side drawer modal that opens when the
// owner sends their first message from AskCupperCard. Holds
// the full message history client-side (fresh per open).
// Submits each turn to /api/ai/cupper via cupper-service.
// ═════════════════════════════════════════════════════════

import React from 'react';
import { createPortal } from 'react-dom';
import { askCupper } from '../lib/cupper-service.js';

function Bubble({ role, text }) {
  const isUser = role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 12,
    }}>
      <div style={{
        maxWidth: '85%',
        padding: '11px 16px',
        borderRadius: 16,
        background: isUser ? 'var(--glade-green-deep)' : 'var(--white)',
        color: isUser ? 'var(--white)' : 'var(--graphite)',
        border: isUser ? 'none' : '1px solid var(--pearl-bush)',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        lineHeight: 1.55,
        whiteSpace: 'pre-wrap',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}>
        {text}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '11px 16px', alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--roman-coffee)',
            opacity: 0.5,
            animation: `cupperBlink 1.2s ${i * 0.18}s ease-in-out infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes cupperBlink {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}

export function CupperChat({ open, initialMessage = null, context = null, onClose }) {
  const [messages, setMessages] = React.useState([]); // {role, content}
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const [error, setError] = React.useState(null);
  const scrollRef = React.useRef(null);
  const inputRef  = React.useRef(null);

  // On open: reset state, seed initial message if provided, and fire it.
  React.useEffect(() => {
    if (!open) return;
    setClosing(false);
    setError(null);
    setBusy(false);
    setInput('');
    document.body.style.overflow = 'hidden';

    if (initialMessage && initialMessage.trim()) {
      const first = [{ role: 'user', content: initialMessage.trim() }];
      setMessages(first);
      fireTurn(first);
    } else {
      setMessages([]);
    }

    return () => { document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialMessage]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape' && !busy) attemptClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, busy]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy]);

  if (!open && !closing) return null;

  const attemptClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setMessages([]); // fresh next open
      onClose?.();
    }, 200);
  };

  const fireTurn = async (history) => {
    setBusy(true);
    setError(null);
    const resp = await askCupper({ messages: history, context });
    if (resp?.error) {
      setError(resp.message || 'Cupper failed to reply.');
      setBusy(false);
      return;
    }
    setMessages([...history, { role: 'assistant', content: resp.data.reply }]);
    setBusy(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const send = () => {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    fireTurn(next);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return createPortal((
    <div
      data-proto-ui
      onClick={(e) => { if (e.target === e.currentTarget && !busy) attemptClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9700,
        background: 'rgba(28,28,26,0.45)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end',
        opacity: closing ? 0 : 1,
        transition: 'opacity 180ms ease',
      }}
    >
      <aside style={{
        width: 'min(480px, 100%)',
        height: '100vh',
        background: 'var(--alabaster)',
        boxShadow: '-12px 0 32px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        transform: closing ? 'translateX(20px)' : 'translateX(0)',
        transition: 'transform 200ms cubic-bezier(.2,.7,.2,1)',
      }}>
        {/* Header */}
        <header style={{
          padding: '16px 20px',
          background: 'var(--white)',
          borderBottom: '1px solid var(--pearl-bush)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <img
              src="/assets/cupper-ai.png"
              alt="Cupper"
              width={36}
              height={Math.round(36 * (1108 / 944))}
              style={{ display: 'block', flexShrink: 0 }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 16,
                color: 'var(--graphite)',
              }}>
                Cupper
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11.5,
                color: 'var(--glade-green-deep)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--glade-green)',
                }} />
                {busy ? 'thinking…' : 'online'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={attemptClose}
            aria-label="Close Cupper"
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

        {/* Messages */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            background: 'var(--pearl-bush)',
          }}
        >
          {messages.length === 0 && !busy && (
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--roman-coffee)',
              textAlign: 'center',
              padding: '32px 16px',
              lineHeight: 1.6,
            }}>
              Ask me about your curriculum, onboarding, coffee technique, or how
              to get more out of Copi. I'll keep answers short unless you want
              depth.
            </div>
          )}
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role} text={m.content} />
          ))}
          {busy && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                background: 'var(--white)',
                border: '1px solid var(--pearl-bush)',
                borderRadius: 16,
              }}>
                <TypingDots />
              </div>
            </div>
          )}
          {error && !busy && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(156, 61, 39, 0.10)',
              border: '1px solid rgba(156, 61, 39, 0.25)',
              color: 'var(--danger)',
              fontFamily: 'var(--font-body)',
              fontSize: 12.5,
              lineHeight: 1.5,
              marginTop: 8,
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{
          padding: '12px 16px 16px',
          background: 'var(--white)',
          borderTop: '1px solid var(--pearl-bush)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            background: 'var(--alabaster)',
            border: '1px solid var(--pearl-bush)',
            borderRadius: 16,
            padding: '6px 6px 6px 14px',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Reply to Cupper… (Enter to send, Shift+Enter for newline)"
              rows={1}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--graphite)',
                padding: '8px 0',
                maxHeight: 140,
                lineHeight: 1.5,
              }}
            />
            <button
              type="button"
              onClick={send}
              disabled={!input.trim() || busy}
              style={{
                background: input.trim() && !busy ? 'var(--glade-green-deep)' : 'var(--heathered-gray)',
                color: 'var(--white)',
                border: 'none',
                padding: '9px 16px',
                borderRadius: 12,
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                cursor: input.trim() && !busy ? 'pointer' : 'not-allowed',
                flexShrink: 0,
              }}
            >
              Send
            </button>
          </div>
        </div>
      </aside>
    </div>
  ), document.body);
}

if (typeof window !== 'undefined') {
  window.CupperChat = CupperChat;
}

export default CupperChat;
