// ═════════════════════════════════════════════════════════
// PRICING PAGE — Almanac direction (Template 3)
// Beige paper · Moss-green accent · Three subscription tiers
// ═════════════════════════════════════════════════════════
function PricingPage({ theme = {} }) {
  const p = {
    bg: '#E8DDC2',
    fg: '#1A1410',
    accent: '#3F5A3A', // moss
    cream: '#F4EBD2',
    sun: '#C68A3D',    // ochre
    rule: '#7A6B4E',
    ...(theme.palette || {}),
  };
  const display = { fontFamily: theme.displayFont || 'Unna' };
  const sub = { fontFamily: 'Yrsa' };
  const sans = { fontFamily: 'Lato' };
  const lbl = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };

  const tiers = [
    {
      side: 'I',
      name: 'Trial',
      tagline: 'Trying Copi for FREE',
      price: '0',
      unit: '/ month',
      sub: 'for 30 days',
      seats: '1 manager · unlimited baristas',
      cta: 'Start free trial',
      featured: false,
      features: [
        'Full Foundations track (12 entries)',
        'First two espresso drills',
        'Bring your own menu',
        'Email support, 1 business day',
        'No card required',
      ],
    },
    {
      side: 'II',
      name: 'Studio',
      tagline: 'For independent cafés.',
      price: '25',
      unit: '/ month',
      sub: 'billed monthly',
      seats: '2–5 baristas',
      cta: 'Start with Studio',
      featured: true,
      features: [
        'Entire 50-entry almanac',
        'Calibrated rubrics + manager sign-off',
        'Menu and recipe import',
        'Certification tracking',
        'Priority editor support',
      ],
    },
    {
      side: 'III',
      name: 'Roastery',
      tagline: 'For multi-bar operations.',
      price: '50',
      unit: '/ month',
      sub: 'billed monthly',
      seats: '5+ baristas · multi-location',
      cta: 'Start with Roastery',
      featured: false,
      features: [
        'Everything in Studio',
        'Multi-location dashboards',
        'Custom tracks + your own drills',
        'API access + roster sync',
        'Dedicated onboarding editor',
      ],
    },
  ];

  // Tiny check glyph (almanac feel — small filled seed)
  const Tick = () => (
    <svg width="11" height="11" viewBox="0 0 12 12" style={{ flex: '0 0 11px', marginTop: 6 }}>
      <path d="M6 1 C 9 4, 9 8, 6 11 C 3 8, 3 4, 6 1 Z" fill={p.accent} />
    </svg>
  );

  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg, position: 'relative', overflow: 'hidden' }}>

      {/* NAV */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'center',
        padding: '20px 48px', borderBottom: `1.5px solid ${p.fg}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ ...display, fontStyle: 'italic', fontSize: 44, lineHeight: 1 }}>Copi</span>
        </div>
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', ...sans, fontSize: 13 }}>
          {['Home', 'Curriculum', 'Pricing', 'About'].map((x) => (
            <a key={x} style={{
              opacity: x === 'Pricing' ? 1 : 0.75,
              fontWeight: x === 'Pricing' ? 700 : 400,
              borderBottom: x === 'Pricing' ? `1.5px solid ${p.fg}` : 'none',
              paddingBottom: 2,
            }}>{x}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <a style={{ ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.75 }}>
            Log in
          </a>
          <button style={{
            background: p.accent, color: p.cream, padding: '11px 22px', borderRadius: 0,
            ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            Start free trial →
          </button>
        </div>
      </div>

      {/* METADATA STRIP */}
      <div style={{
        ...lbl, opacity: 0.65, display: 'flex', justifyContent: 'space-between',
        padding: '12px 48px', borderBottom: `1px solid ${p.fg}30`,
      }}>
        <span>PRICING · EDITION 001</span>
        <span>MONTHLY · NO CARD FOR TRIAL</span>
        <span>USD · MMXXVI</span>
      </div>

      {/* HEADER */}
      <div style={{ padding: '96px 48px 72px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ ...lbl, color: p.accent, marginBottom: 28 }}>◆ SUBSCRIPTIONS · THREE EDITIONS</div>
        <h1 style={{
          ...display, fontSize: 104, lineHeight: 0.95, letterSpacing: '-0.035em', fontWeight: 400,
          whiteSpace: 'nowrap',
        }}>
          Honest <em style={{ fontStyle: 'italic', color: p.accent }}>pricing</em>, by the month.
        </h1>
      </div>

      {/* TIERS */}
      <div style={{ padding: '80px 48px 96px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
          border: `1.5px solid ${p.fg}`,
        }}>
          {tiers.map((t, i) => {
            const featured = t.featured;
            const fg = featured ? p.cream : p.fg;
            const bg = featured ? p.accent : p.bg;
            const dim = featured ? `${p.cream}55` : `${p.fg}30`;
            return (
              <div key={i} style={{
                background: bg, color: fg, padding: '40px 32px 36px',
                borderRight: i < 2 ? `1.5px solid ${p.fg}` : 'none',
                display: 'flex', flexDirection: 'column', position: 'relative',
              }}>
                {featured && (
                  <div style={{
                    position: 'absolute', top: -14, left: 24,
                    background: p.sun, color: p.fg, padding: '5px 10px',
                    ...lbl, fontSize: 9,
                  }}>
                    ◆ MOST POPULAR
                  </div>
                )}

                {/* Side label + name */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ ...lbl, opacity: featured ? 0.7 : 0.55, color: fg }}>{t.side} · {t.name.toUpperCase()}</div>
                  <div style={{ ...lbl, opacity: featured ? 0.7 : 0.55, color: fg }}>{t.sub}</div>
                </div>

                {/* Tagline */}
                <div style={{ ...display, fontStyle: 'italic', fontSize: 40, lineHeight: 1.05, letterSpacing: '-0.015em', marginBottom: 32 }}>
                  {t.tagline}
                </div>

                {/* Price block */}
                <div style={{
                  display: 'flex', alignItems: 'baseline', gap: 10,
                  paddingBottom: 14, borderBottom: `1.5px solid ${dim}`,
                }}>
                  {t.price !== null && (
                    <span style={{ ...display, fontSize: 56, lineHeight: 1, opacity: 0.7, fontWeight: 400 }}>$</span>
                  )}
                  <span style={{ ...display, fontSize: 132, lineHeight: 0.85, letterSpacing: '-0.04em', fontWeight: 400 }}>
                    {t.price}
                  </span>
                  <span style={{ ...sans, fontSize: 14, opacity: 0.7, fontWeight: 400, marginLeft: 4 }}>{t.unit}</span>
                </div>

                {/* Seats */}
                <div style={{ ...sans, fontSize: 13, opacity: 0.78, marginTop: 14, marginBottom: 28, fontWeight: 400 }}>
                  <span style={{ ...lbl, opacity: 0.6, marginRight: 6, color: fg }}>FOR</span>
                  {t.seats}
                </div>

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
                  {t.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', gap: 12, ...sans, fontSize: 14, lineHeight: 1.5, fontWeight: 400 }}>
                      <svg width="11" height="11" viewBox="0 0 12 12" style={{ flex: '0 0 11px', marginTop: 6 }}>
                        <path d="M6 1 C 9 4, 9 8, 6 11 C 3 8, 3 4, 6 1 Z" fill={featured ? p.sun : p.accent} />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button style={{
                  marginTop: 'auto',
                  background: featured ? p.cream : p.accent,
                  color: featured ? p.accent : p.cream,
                  padding: '16px 22px', borderRadius: 0,
                  ...sans, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  textAlign: 'left',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span>{t.cta}</span>
                  <span>→</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Fine print row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          ...lbl, opacity: 0.55, marginTop: 24,
        }}>
          <span>NO PER-SEAT CHARGES · CANCEL ANY MONTH</span>
          <span>ANNUAL PLANS −15% · TALK TO US</span>
          <span>USD · TAXES NOT INCLUDED</span>
        </div>
      </div>

      <CopiFooter theme={theme} />
    </div>
  );
}

Object.assign(window, { PricingPage });
