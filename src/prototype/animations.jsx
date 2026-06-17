// ═════════════════════════════════════════════════════════
// ANIMATIONS — shared motion utilities for the landing page.
// IntersectionObserver-driven reveals, count-up, idle float,
// highlight underline, and diagonal section dividers.
// All animations respect prefers-reduced-motion (handled in styles.css
// for CSS-driven motion + the useReducedMotion hook for JS-driven motion).
// ═════════════════════════════════════════════════════════

import React from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq.addListener) mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else if (mq.removeListener) mq.removeListener(handler);
    };
  }, []);
  return reduced;
}

export function useInView({ threshold = 0.15, rootMargin = '0px 0px -40px 0px', once = true } = {}) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);
  return [ref, inView];
}

// Reveal — wraps children in a div that animates in when scrolled into view.
// Variants: 'fade-up' | 'slide-up' | 'slide-right' | 'slide-left' | 'scale' | 'clip'
export function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 360,
  threshold = 0.15,
  style = {},
  className = '',
  ...rest
}) {
  const [ref, inView] = useInView({ threshold, once: true });
  return (
    <div
      ref={ref}
      className={`copi-reveal copi-reveal--${variant}${inView ? ' is-in' : ''}${className ? ' ' + className : ''}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        ...style
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

// CountUp — animates a number from `from` to `to` when in view.
export function CountUp({ to, from = 0, duration = 900, suffix = '', prefix = '', decimals = 0, style = {} }) {
  const [ref, inView] = useInView({ threshold: 0.4, once: true });
  const reduced = useReducedMotion();
  const [value, setValue] = React.useState(from);
  React.useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setValue(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, from, duration, reduced]);
  return (
    <span ref={ref} style={style}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  );
}

// Highlight — wraps inline text with a hand-drawn yellow underline.
export function Highlight({ children, color = '#F4C542', strokeWidth = 7 }) {
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        paddingBottom: '0.05em'
      }}
    >
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 14"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '-0.04em',
          width: '100%',
          height: '0.34em',
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        <path
          d="M 2 11 Q 100 -1 198 8"
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

// SectionDivider — diagonal or curved SVG slice between two sections.
// Render INSIDE the section that has the new color. `fromColor` is the
// color of the section above (for top divider) or below (for bottom).
export function SectionDivider({
  fromColor,
  position = 'top',
  height = 70,
  variant = 'diagonal' // 'diagonal' | 'curve'
}) {
  const path =
    variant === 'curve'
      ? 'M 0 0 L 1440 0 L 1440 20 Q 720 110 0 50 Z'
      : 'M 0 0 L 1440 0 L 1440 35 L 0 100 Z';

  const placement =
    position === 'top'
      ? { top: -1 }
      : { bottom: -1, transform: 'scaleY(-1)' };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        width: '100%',
        height,
        display: 'block',
        pointerEvents: 'none',
        zIndex: 1,
        ...placement
      }}
    >
      <path d={path} fill={fromColor} />
    </svg>
  );
}

// Expose for App.jsx inline-page usage
if (typeof window !== 'undefined') {
  window.CopiAnim = { useReducedMotion, useInView, Reveal, CountUp, Highlight, SectionDivider };
}

export default { useReducedMotion, useInView, Reveal, CountUp, Highlight, SectionDivider };
