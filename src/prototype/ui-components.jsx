// ═════════════════════════════════════════════════════════
// UI COMPONENTS — Reusable components for new design system
// Buttons, inputs, cards, tags, badges, progress bars, eyebrow labels
// ═════════════════════════════════════════════════════════

import React from 'react';
import { NEW_PALETTE, TYPOGRAPHY, RADIUS, SHADOW } from './design-system.jsx';

// ═══════════════════════════════════
// BUTTON (Primary pill style)
// ═══════════════════════════════════

function Button({ children, variant = 'primary', onClick, type = 'button', style = {}, ...props }) {
  const p = NEW_PALETTE;
  const t = TYPOGRAPHY;

  const baseStyle = {
    ...t.button,
    padding: '14px 28px',
    borderRadius: RADIUS.pill,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-block',
    textDecoration: 'none'
  };

  const variants = {
    primary: {
      background: p.accent,
      color: '#FFFFFF',
      '&:hover': {
        background: p.accentHover
      }
    },
    ghost: {
      background: 'transparent',
      color: p.textPrimary,
      border: `1px solid ${p.tagBorder}`,
      '&:hover': {
        background: p.tagBg
      }
    },
    cta: {
      background: '#F4C542',  // Yellow for strong CTA
      color: p.textPrimary,
      fontWeight: 600,
      '&:hover': {
        background: '#E5B736'
      }
    }
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const buttonStyle = {
    ...baseStyle,
    ...variants[variant],
    ...(isHovered && variant === 'primary' && { background: p.accentHover }),
    ...(isHovered && variant === 'ghost' && { background: p.tagBg }),
    ...(isHovered && variant === 'cta' && { background: '#E5B736' }),
    ...style
  };

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={buttonStyle}
      {...props}
    >
      {children}
    </button>
  );
}

// ═══════════════════════════════════
// INPUT (Pill-shaped input field)
// ═══════════════════════════════════

function Input({ placeholder, value, onChange, type = 'email', style = {}, ...props }) {
  const p = NEW_PALETTE;
  const t = TYPOGRAPHY;

  const inputStyle = {
    ...t.body,
    fontSize: 15,
    padding: '14px 24px',
    borderRadius: RADIUS.pill,
    border: `1px solid ${p.tagBorder}`,
    background: p.bgCard,
    color: p.textPrimary,
    outline: 'none',
    transition: 'all 0.2s ease',
    width: '100%',
    '&:focus': {
      borderColor: p.accent
    },
    ...style
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={inputStyle}
      {...props}
    />
  );
}

// ═══════════════════════════════════
// INPUT WITH BUTTON (Inline CTA pattern)
// ═══════════════════════════════════

function InputWithButton({
  placeholder = 'you@yourcafe.com',
  buttonText = 'Join the waitlist',
  onSubmit,
  inputStyle = {},
  buttonStyle = {},
  ...props
}) {
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(email);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        ...props.style
      }}
    >
      <Input
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ flex: 1, ...inputStyle }}
      />
      <Button type="submit" variant={props.variant || 'primary'} style={buttonStyle}>
        {buttonText}
      </Button>
    </form>
  );
}

// ═══════════════════════════════════
// CARD (Feature card with icon)
// ═══════════════════════════════════

function Card({ icon, title, children, style = {}, ...props }) {
  const p = NEW_PALETTE;
  const t = TYPOGRAPHY;

  const cardStyle = {
    background: p.bgCard,
    borderRadius: RADIUS.card,
    padding: 24,
    border: `1px solid ${p.tagBorder}`,
    boxShadow: SHADOW.card,
    transition: 'all 0.2s ease',
    ...style
  };

  return (
    <div style={cardStyle} {...props}>
      {icon && (
        <div style={{ fontSize: 32, marginBottom: 16 }}>
          {icon}
        </div>
      )}
      {title && (
        <h3 style={{
          ...t.body,
          fontSize: 18,
          fontWeight: 600,
          margin: '0 0 12px 0',
          color: p.textPrimary
        }}>
          {title}
        </h3>
      )}
      <div style={{
        ...t.bodySmall,
        color: p.textMuted
      }}>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════
// TAG / PILL LABEL
// ═══════════════════════════════════

function Tag({ children, style = {}, ...props }) {
  const p = NEW_PALETTE;
  const t = TYPOGRAPHY;

  const tagStyle = {
    ...t.label,
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: RADIUS.tag,
    background: p.tagBg,
    border: `1px solid ${p.tagBorder}`,
    color: p.textMuted,
    ...style
  };

  return (
    <span style={tagStyle} {...props}>
      {children}
    </span>
  );
}

// ═══════════════════════════════════
// EYEBROW LABEL (Uppercase, tracked)
// ═══════════════════════════════════

function Eyebrow({ children, style = {}, ...props }) {
  const p = NEW_PALETTE;
  const t = TYPOGRAPHY;

  const eyebrowStyle = {
    ...t.eyebrow,
    color: p.textMuted,
    display: 'block',
    marginBottom: 12,
    ...style
  };

  return (
    <div style={eyebrowStyle} {...props}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════
// STEP INDICATOR BADGE
// ═══════════════════════════════════

function StepBadge({ number, style = {}, ...props }) {
  const p = NEW_PALETTE;
  const t = TYPOGRAPHY;

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: RADIUS.badge,
    background: p.stepNum,
    color: '#FFFFFF',
    ...t.button,
    fontSize: 16,
    fontWeight: 600,
    ...style
  };

  return (
    <div style={badgeStyle} {...props}>
      {number}
    </div>
  );
}

// ═══════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════

function ProgressBar({ progress = 0, style = {}, ...props }) {
  const p = NEW_PALETTE;

  const containerStyle = {
    width: '100%',
    height: 6,
    background: p.tagBg,
    borderRadius: RADIUS.progress,
    overflow: 'hidden',
    ...style
  };

  const fillStyle = {
    height: '100%',
    width: `${Math.min(100, Math.max(0, progress * 100))}%`,
    background: p.progress,
    borderRadius: RADIUS.progress,
    transition: 'width 0.3s ease'
  };

  return (
    <div style={containerStyle} {...props}>
      <div style={fillStyle} />
    </div>
  );
}

// ═══════════════════════════════════
// LESSON CARD (with completion status)
// ═══════════════════════════════════

function LessonCard({
  title,
  status = 'locked', // 'complete' | 'in-progress' | 'locked'
  progress = 0,
  style = {},
  ...props
}) {
  const p = NEW_PALETTE;
  const t = TYPOGRAPHY;

  const statusIcons = {
    complete: '✓',
    'in-progress': '⏳',
    locked: '🔒'
  };

  const statusText = {
    complete: 'Lesson complete.',
    'in-progress': 'In progress...',
    locked: 'Unlocks next'
  };

  const cardStyle = {
    background: p.bgCard,
    borderRadius: RADIUS.card,
    padding: 16,
    border: `1px solid ${p.tagBorder}`,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
    ...style
  };

  const iconStyle = {
    fontSize: 20,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: status === 'complete' ? p.stepNum : status === 'in-progress' ? p.tagBg : p.tagBg,
    color: status === 'complete' ? '#FFFFFF' : p.textMuted,
    flexShrink: 0
  };

  return (
    <div style={cardStyle} {...props}>
      <div style={iconStyle}>
        {statusIcons[status]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          ...t.bodySmall,
          fontWeight: 500,
          color: p.textPrimary,
          marginBottom: status === 'in-progress' ? 8 : 4
        }}>
          {title}
        </div>
        <div style={{
          ...t.caption,
          color: p.textMuted
        }}>
          {statusText[status]}
        </div>
        {status === 'in-progress' && (
          <ProgressBar progress={progress} style={{ marginTop: 8 }} />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════
// EXPORTS
// ═══════════════════════════════════

// Export to window
window.Button = Button;
window.Input = Input;
window.InputWithButton = InputWithButton;
window.Card = Card;
window.Tag = Tag;
window.Eyebrow = Eyebrow;
window.StepBadge = StepBadge;
window.ProgressBar = ProgressBar;
window.LessonCard = LessonCard;

export {
  Button,
  Input,
  InputWithButton,
  Card,
  Tag,
  Eyebrow,
  StepBadge,
  ProgressBar,
  LessonCard
};
