// ═════════════════════════════════════════════════════════
// BRANDING TEMPLATE 3 — Almanac
// Beige paper · Moss-green accent · Calendar wheel, agrarian record
// ═════════════════════════════════════════════════════════
function BrandingTemplate3() {
  const p = {
    bg: '#E8DDC2',
    fg: '#1A1410',
    accent: '#3F5A3A', // moss
    cream: '#F4EBD2',
    sun: '#C68A3D', // ochre
    rule: '#7A6B4E'
  };
  const display = { fontFamily: 'Unna' };
  const sub = { fontFamily: 'Yrsa' };
  const sans = { fontFamily: 'Lato' };
  const lbl = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };

  // Almanac wheel — concentric ring of "months" / chapters
  const AlmanacWheel = ({ size = 520 }) => {
    const months = [
    { l: 'JAN', t: 'Origin' }, { l: 'FEB', t: 'Roast' },
    { l: 'MAR', t: 'Water' }, { l: 'APR', t: 'Cup' },
    { l: 'MAY', t: 'Grind' }, { l: 'JUN', t: 'Dial' },
    { l: 'JUL', t: 'Pull' }, { l: 'AUG', t: 'Steam' },
    { l: 'SEP', t: 'Pour' }, { l: 'OCT', t: 'Bar' },
    { l: 'NOV', t: 'Serve' }, { l: 'DEC', t: 'Audit' }];

    const cx = size / 2,cy = size / 2;
    const rOuter = size / 2 - 4;
    const rText = size / 2 - 36;
    const rInner = size / 2 - 70;
    const rHub = 70;

    return (
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}
      style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.18))' }}>
        <defs>
          {months.map((_, i) => {
            const startA = i / 12 * 360 - 90;
            const r = rText;
            const path = `M ${cx + r * Math.cos(startA * Math.PI / 180)} ${cy + r * Math.sin(startA * Math.PI / 180)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos((startA + 30) * Math.PI / 180)} ${cy + r * Math.sin((startA + 30) * Math.PI / 180)}`;
            return <path key={i} id={`arc-${i}`} d={path} fill="none" />;
          })}
        </defs>

        {/* outer disc */}
        <circle cx={cx} cy={cy} r={rOuter} fill={p.cream} stroke={p.fg} strokeWidth="1.5" />
        {/* inner ring */}
        <circle cx={cx} cy={cy} r={rInner} fill="none" stroke={p.fg} strokeWidth="1" opacity="0.4" />
        {/* spokes */}
        {months.map((_, i) => {
          const a = i / 12 * 2 * Math.PI - Math.PI / 2;
          return <line key={i}
          x1={cx + Math.cos(a) * rHub} y1={cy + Math.sin(a) * rHub}
          x2={cx + Math.cos(a) * rOuter} y2={cy + Math.sin(a) * rOuter}
          stroke={p.fg} strokeWidth="0.7" opacity="0.35" />;
        })}
        {/* arc labels */}
        {months.map((m, i) =>
        <text key={i} style={{ fontFamily: 'Lato', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', fill: p.fg }}>
            <textPath href={`#arc-${i}`} startOffset="20%">{m.l} · {m.t.toUpperCase()}</textPath>
          </text>
        )}
        {/* tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const a = i / 60 * 2 * Math.PI - Math.PI / 2;
          const r1 = rOuter - 14,r2 = rOuter - 6;
          return <line key={i}
          x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1}
          x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2}
          stroke={p.fg} strokeWidth={i % 5 === 0 ? 1.2 : 0.5} opacity="0.6" />;
        })}
        {/* hub */}
        <circle cx={cx} cy={cy} r={rHub} fill={p.accent} />
        <circle cx={cx} cy={cy} r={rHub - 8} fill="none" stroke={p.cream} strokeWidth="0.8" opacity="0.6" />
        <text x={cx} y={cy - 6} textAnchor="middle"
        style={{ fontFamily: 'Unna', fontStyle: 'italic', fontSize: 28, fill: p.cream }}>Copi</text>
        <text x={cx} y={cy + 14} textAnchor="middle"
        style={{ fontFamily: 'Lato', fontSize: 9, fontWeight: 600, letterSpacing: '0.25em', fill: p.cream, opacity: 0.8 }}>
          ALMANAC · MMXXVI
        </text>
        {/* "now" indicator — a small sun at JUN */}
        {(() => {
          const a = 5.5 / 12 * 2 * Math.PI - Math.PI / 2;
          return (
            <g>
              <circle cx={cx + Math.cos(a) * (rText - 10)} cy={cy + Math.sin(a) * (rText - 10)} r="8" fill={p.sun} />
              <circle cx={cx + Math.cos(a) * (rText - 10)} cy={cy + Math.sin(a) * (rText - 10)} r="14" fill="none" stroke={p.sun} strokeWidth="1" opacity="0.5" />
            </g>);

        })()}
      </svg>);

  };

  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg, position: 'relative', overflow: 'hidden' }}>

      {/* NAV */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'center',
        padding: '20px 48px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ ...display, fontStyle: 'italic', fontSize: 44, lineHeight: 1 }}>Copi</span>
        </div>
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', ...sans, fontSize: 13 }}>
          {['Home', 'Curriculum', 'Pricing', 'About'].map((x) => (
            <a key={x} style={{
              opacity: x === 'Home' ? 1 : 0.75,
              fontWeight: x === 'Home' ? 700 : 400,
              borderBottom: x === 'Home' ? `1.5px solid ${p.fg}` : 'none',
              paddingBottom: 2,
            }}>{x}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <a style={{ ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.75 }}>
            Log in
          </a>
          <button style={{ background: p.accent, color: p.cream, padding: '11px 22px', borderRadius: 0,
            ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Start free trial →
          </button>
        </div>
      </div>

      {/* METADATA STRIP */}
      <div style={{ ...lbl, opacity: 0.65, display: 'flex', justifyContent: 'space-between',
        padding: '12px 48px', borderBottom: `1px solid ${p.fg}30` }}>
        <span>DEVELOPED BY Q-GRADERS</span>
        <span>AI ASSISTED LEARNING AND ONBOARDING</span>
        <span>CUSTOMIZED FOR YOUR TEAM</span>
      </div>

      {/* HERO */}
      <div style={{ padding: '60px 48px 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          <h1 style={{ ...display, fontSize: 180, lineHeight: 0.88, letterSpacing: '-0.04em', fontWeight: 400, marginTop: 8 }}>
            World class<br />
            <em style={{ fontStyle: 'italic', color: p.accent }}>coffee</em><br />
            education.
          </h1>
          <p style={{ ...sans, fontSize: 18, lineHeight: 1.55, opacity: 0.8, marginTop: 32, maxWidth: 440 }}>AI-powered coffee education that onboards and trains your entire team — without taking your best people off the floor.

          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 36, alignItems: 'center' }}>
            <button style={{ background: p.accent, color: p.cream, padding: '16px 26px', borderRadius: 0,
              ...sans, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Start free trial →
            </button>
            <button style={{ padding: '16px 22px', borderRadius: 0,
              ...sans, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
              border: `1.5px solid ${p.fg}` }}>See the curriculum</button>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 40, ...lbl, opacity: 0.6 }}>
            <span>30-DAY TRIAL</span><span>NO CARD</span><span>240+ STUDIOS</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PourOver size={540} ink={p.fg} paper={p.cream} brew={p.fg} />
        </div>
      </div>

      {/* HOW IT WORKS — three editorial steps */}
      <div style={{ background: p.cream, padding: '96px 48px', borderTop: `1.5px solid ${p.fg}`, borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 64 }}>
          <h2 style={{ ...display, fontSize: 88, lineHeight: 0.95, letterSpacing: '-0.025em', fontWeight: 400 }}>
            How <em style={{ fontStyle: 'italic', color: p.accent }}>Copi</em> works.
          </h2>
          <div style={{ ...lbl, opacity: 0.6 }}>◆ THREE STEPS · ON THE BAR</div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop: `1.5px solid ${p.fg}`,
        }}>
          {[
            {
              num: 'I.',
              title: 'Your café is already in the system.',
              body: 'Point Copi at your website and it does the rest — reading your menu, values, and current offerings to build a training environment around the place your team actually works.',
              meta: 'AI · DAY ONE',
            },
            {
              num: 'II.',
              title: 'Assign the lessons. Step away.',
              body: 'Assign content by role, hire date, or seniority. Copi walks each team member through your drinks, your process, and your standards — without pulling you off the floor.',
              meta: 'FAST · ZERO HAND-HOLDING',
            },
            {
              num: 'III.',
              title: 'Watch your team become great.',
              body: "See real-time progress across every hire. Know who's ready before they have to ask. Build a team that genuinely knows your business — tracked, not assumed.",
              meta: 'MANAGER · NOT THE CALENDAR',
            },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '40px 32px 8px',
              borderRight: i < 2 ? `1.5px solid ${p.fg}` : 'none',
            }}>
              <div style={{
                ...display, fontStyle: 'italic', fontSize: 88, lineHeight: 0.85,
                letterSpacing: '-0.04em', color: p.accent, fontWeight: 400, marginBottom: 24,
              }}>
                {s.num}
              </div>
              <h3 style={{ ...display, fontSize: 34, lineHeight: 1.05, letterSpacing: '-0.02em', fontWeight: 400, marginBottom: 18 }}>
                {s.title}
              </h3>
              <p style={{ ...sans, fontSize: 14, lineHeight: 1.7, opacity: 0.82, fontWeight: 400, maxWidth: 360 }}>
                {s.body}
              </p>
              <div style={{ ...lbl, opacity: 0.55, marginTop: 28, paddingTop: 18, borderTop: `1px dashed ${p.fg}30` }}>
                {s.meta}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BY THE NUMBERS + QUOTE — combined editorial spread */}
      <div style={{ background: p.fg, color: p.cream, padding: '88px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 80, alignItems: 'center' }}>

          {/* Stats */}
          <div>
            <div style={{ ...lbl, color: p.sun, opacity: 0.85, marginBottom: 28 }}>◆ HARVEST · COHORT MMXXVI</div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 48, rowGap: 32,
              borderTop: `1.5px solid ${p.cream}40`,
            }}>
              {[
                { v: '14×',  l: 'AVG RAMP-UP',      sub: 'vs. shadow-and-pray' },
                { v: '92%',  l: 'RETENTION @ 90D',  sub: 'across 240+ cafes' },
                { v: '11d',  l: 'TO FIRST CERT',    sub: 'foundations · signed' },
                { v: '240+', l: 'CAFES',            sub: 'pouring with copi' },
              ].map((s, i) => (
                <div key={i} style={{
                  paddingTop: 24,
                  borderBottom: `1px dashed ${p.cream}30`,
                  paddingBottom: 24,
                }}>
                  <div style={{
                    ...display, fontStyle: i === 0 ? 'italic' : 'normal',
                    fontSize: 72, lineHeight: 0.9, color: i === 0 ? p.sun : p.cream, fontWeight: 400,
                    letterSpacing: '-0.03em',
                  }}>
                    {s.v}
                  </div>
                  <div style={{ ...lbl, opacity: 0.7, marginTop: 12, color: p.cream }}>{s.l}</div>
                  <div style={{ ...sans, fontSize: 12, opacity: 0.55, marginTop: 6, color: p.cream }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div>
            <div style={{ ...lbl, color: p.sun, opacity: 0.85, marginBottom: 28 }}>◆ FROM THE FIELD</div>
            <blockquote style={{
              ...display, fontSize: 44, lineHeight: 1.18, letterSpacing: '-0.015em',
              fontStyle: 'italic', fontWeight: 400, margin: 0,
            }}>
              "We onboarded eleven baristas in two weeks. Before Copi that was a three-month death march — Maren and I in the shop on every closed Monday, going over the same dialing-in script for the fifth time."
            </blockquote>
            <div style={{
              marginTop: 36, paddingTop: 24,
              borderTop: `1px solid ${p.cream}30`,
              display: 'flex', alignItems: 'center', gap: 18,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: p.cream, color: p.fg,
                display: 'grid', placeItems: 'center',
                ...display, fontStyle: 'italic', fontSize: 22, fontWeight: 400,
              }}>
                J
              </div>
              <div>
                <div style={{ ...sub, fontSize: 17, fontWeight: 500 }}>Jules Park</div>
                <div style={{ ...lbl, opacity: 0.65, marginTop: 4 }}>OWNER · MORTAR COFFEE · VANCOUVER</div>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ ...lbl, opacity: 0.55, textAlign: 'right' }}>USING COPI<br />SINCE MMXXV</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: p.accent, color: p.cream, padding: '120px 48px', textAlign: 'center' }}>
        <h2 style={{ ...display, fontSize: 200, lineHeight: 0.88, letterSpacing: '-0.04em' }}>
          Elevate your <em style={{ fontStyle: 'italic' }}>team.</em>
        </h2>
        <p style={{ ...sans, fontSize: 17, opacity: 0.82, marginTop: 32, maxWidth: 480, marginInline: 'auto', lineHeight: 1.55, fontWeight: 300 }}>30 days free. No card. Start on day one.

        </p>
        <button style={{ background: p.cream, color: p.accent, padding: '20px 32px', borderRadius: 0,
          ...sans, fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 40 }}>
          Start free trial →
        </button>
      </div>

      <CopiFooter />
    </div>);

}

Object.assign(window, { BrandingTemplate3 });