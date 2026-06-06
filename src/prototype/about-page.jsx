// ═════════════════════════════════════════════════════════
// ABOUT PAGE — Almanac direction (Template 3)
// Beige paper · Moss-green accent · Editorial / almanac
// ═════════════════════════════════════════════════════════
function AboutPage({ theme = {} }) {
  const p = {
    bg: '#E8DDC2',
    fg: '#1A1410',
    accent: '#3F5A3A', // moss
    cream: '#F4EBD2',
    sun: '#C68A3D', // ochre
    rule: '#7A6B4E',
    ...(theme.palette || {})
  };
  const display = { fontFamily: theme.displayFont || 'Unna' };
  const sub = { fontFamily: 'Yrsa' };
  const sans = { fontFamily: 'Lato' };
  const lbl = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };

  // A small editorial portrait — either a real line-art image, or concentric rings + initials placeholder
  const Portrait = ({ initials, src }) =>
  <div style={{
    width: '100%', aspectRatio: '4 / 5', background: p.cream,
    border: `1.5px solid ${p.fg}`, position: 'relative', overflow: 'hidden',
    display: 'grid', placeItems: 'center'
  }}>
      <svg width="100%" height="100%" viewBox="0 0 200 250" style={{ position: 'absolute', inset: 0, opacity: src ? 0.25 : 0.5 }}>
        <defs>
          <pattern id={`hatch-${initials}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={p.fg} strokeWidth="0.4" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="200" height="250" fill={`url(#hatch-${initials})`} />
        {!src && <circle cx="100" cy="120" r="56" fill="none" stroke={p.fg} strokeWidth="0.8" opacity="0.4" />}
        {!src && <circle cx="100" cy="120" r="40" fill="none" stroke={p.fg} strokeWidth="0.5" opacity="0.3" />}
      </svg>
      {src ?
        <img src={src} alt={initials} style={{
          position: 'relative', width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 20%',
          mixBlendMode: 'multiply',
        }} /> :
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ ...display, fontStyle: 'italic', fontSize: 64, lineHeight: 1, color: p.accent }}>{initials}</div>
          <div style={{ ...lbl, opacity: 0.6, marginTop: 10, fontSize: 9 }}>PORTRAIT · TBD</div>
        </div>
      }
    </div>;


  // Tiny seed/leaf marker
  const Seed = ({ size = 14, color }) =>
  <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M10 2 C 14 6, 14 14, 10 18 C 6 14, 6 6, 10 2 Z" fill={color || p.accent} />
      <line x1="10" y1="2" x2="10" y2="18" stroke={p.cream} strokeWidth="0.6" opacity="0.6" />
    </svg>;


  // Editors / contributors. RES() prefers a bundled blob URL
  // (standalone export) and falls back to the on-disk path live.
  const RES = (id, path) => (window.__resources && window.__resources[id]) || path;
  const editors = [
  { i: 'OM', name: 'Owen McRann', role: 'Copi CEO', src: RES('owenPortrait', 'uploads/owen-mcrann-portrait.png'), bio: 'Green coffee importer. Founder of AIS, sourcing direct from Indonesian origins. 5 years in specialty coffee trade.' },
  { i: 'MA', name: 'Miguel Arte', role: 'Curriculum Lead', src: RES('miguelPortrait', 'uploads/miguel-arte-portrait.png'), bio: '10 years across origin, roasting, and bar. Coffee grower, importer, roaster, and working barista.' }];


  // Principles
  const principles = [
  { n: '01', t: 'Education for everyone.', d: 'Coffee knowledge shouldn\'t sit behind a $1,500 course or a senior title. Everyone working in the industry deserves a real education, regardless of their role or what they can afford.' },
  { n: '02', t: 'Built around your level.', d: 'No two employees start in the same place. Copi adapts to where each person is, what their role requires, and what their team actually needs to know.' },
  { n: '03', t: 'Quality lives in every role.', d: 'Your reputation isn\'t built by your best barista alone. It\'s carried by everyone on the floor, from the front bar to the back of house. Every person needs to know their part.' },
  { n: '04', t: 'Managers deserve breathing room.', d: 'The industry is demanding and managers carry most of that weight. Copi handles structured training so they can focus on running the business, not repeating themselves every six weeks.' },
  { n: '05', t: 'Built by people who\'ve done it.', d: 'Every module is designed by certified Q-graders, working baristas, roasters, and importers — people who have worked every side of the industry, not just written about it.' },
  { n: '06', t: 'Learning never stops.', d: 'The coffee industry evolves constantly. Education shouldn\'t have a finish line. Copi is built to grow with your team as the industry grows around you.' }];


  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg, position: 'relative', overflow: 'hidden' }}>

      {/* NAV */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'center',
        padding: '20px 48px', borderBottom: `1.5px solid ${p.fg}`
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ ...display, fontStyle: 'italic', fontSize: 44, lineHeight: 1 }}>Copi</span>
        </div>
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', ...sans, fontSize: 13 }}>
          {['Home', 'Curriculum', 'Pricing', 'About'].map((x) =>
          <a key={x} style={{
            opacity: x === 'About' ? 1 : 0.75,
            fontWeight: x === 'About' ? 700 : 400,
            borderBottom: x === 'About' ? `1.5px solid ${p.fg}` : 'none',
            paddingBottom: 2
          }}>{x}</a>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <a style={{ ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.75 }}>
            Log in
          </a>
          <button style={{
            background: p.accent, color: p.cream, padding: '11px 22px', borderRadius: 0,
            ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase'
          }}>
            Start free trial →
          </button>
        </div>
      </div>

      {/* METADATA STRIP */}
      <div style={{
        ...lbl, opacity: 0.65, display: 'flex', justifyContent: 'space-between',
        padding: '12px 48px', borderBottom: `1px solid ${p.fg}30`
      }}>
        <span>ABOUT · EDITION 001</span>
        <span>COMPILED IN VANCOUVER · CANADA</span>
        <span>MMXXVI</span>
      </div>

      {/* ORIGIN STORY — three-column editorial */}
      <div style={{ padding: '120px 48px', background: p.cream, borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 80, alignItems: 'start', marginBottom: 80 }}>
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 16 }}>I. ORIGIN</div>
            <h2 style={{ ...display, fontSize: 84, lineHeight: 0.95, letterSpacing: '-0.025em' }}>
              How <em style={{ fontStyle: 'italic', color: p.accent }}>Copi</em><br />came to be.
            </h2>
            <div style={{ ...lbl, opacity: 0.55, marginTop: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 18, height: 1, background: p.fg, opacity: 0.5 }} />
              <span>THE EDITOR'S LETTER</span>
            </div>
          </div>
          <div style={{ paddingTop: 24, borderTop: `2px solid ${p.fg}` }}>
            {/* Lead — first line as a pull-quote */}
            <p style={{ ...display, fontSize: 60, lineHeight: 1.12, fontStyle: 'italic', letterSpacing: '-0.02em', marginTop: 28, maxWidth: '20ch', fontWeight: 400 }}>
              We believe everyone in coffee deserves a real <em style={{ fontStyle: 'italic', color: p.accent }}>education</em> — not passed-down knowledge from whoever was on shift.
            </p>

            {/* Section break */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '56px 0 40px' }}>
              <span style={{ flex: '0 0 auto', width: 28, height: 1, background: p.fg, opacity: 0.45 }} />
              <span style={{ ...lbl, opacity: 0.5, fontSize: 9 }}>◆</span>
              <span style={{ flex: '1 1 auto', height: 1, background: p.fg, opacity: 0.25 }} />
            </div>

            {/* Body — two paragraphs in Yrsa */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }}>
              <p style={{ ...sub, fontSize: 26, lineHeight: 1.45, fontWeight: 400, opacity: 0.9, letterSpacing: '-0.005em' }}>
                The industry's biggest knowledge gap isn't at origin or in competition. It's inside the cafés and roasteries where most people actually work — the bars pouring eleven hundred drinks a week, the rooms where a new hire learns the craft from whoever happens to be on shift.
              </p>
              <p style={{ ...sub, fontSize: 26, lineHeight: 1.45, fontWeight: 400, opacity: 0.9, letterSpacing: '-0.005em' }}>
                Copi is an AI-supplemented onboarding platform built for those teams — training every new employee to be competent and confident, regardless of where they're starting from, and giving managers their afternoons back.
              </p>
            </div>

            {/* Signoff */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 40, ...lbl, opacity: 0.55 }}>
              <Seed size={12} />
              <span>SIGNED · OWEN McRANN · COPI CEO</span>
            </div>
          </div>
        </div>
      </div>

      {/* PRINCIPLES — six entries, two-column ledger */}
      <div style={{ padding: '120px 48px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 56 }}>
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 16 }}>II. PRINCIPLES</div>
            <h2 style={{ ...display, fontSize: 84, lineHeight: 0.95, letterSpacing: '-0.025em' }}>
              Six things we<br />
              <em style={{ fontStyle: 'italic', color: p.accent }}>believe,</em> in writing.
            </h2>
          </div>
          <div style={{ ...lbl, opacity: 0.55 }}>SIGNED · THE EDITORS</div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          borderTop: `1.5px solid ${p.fg}`, borderBottom: `1.5px solid ${p.fg}`
        }}>
          {principles.map((row, i) => {
            const isLeft = i % 2 === 0;
            const isLastRow = i >= principles.length - 2;
            return (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '110px 1fr', gap: 28,
                padding: '44px 36px',
                borderBottom: !isLastRow ? `1px dashed ${p.fg}30` : 'none',
                borderRight: isLeft ? `1.5px solid ${p.fg}` : 'none',
                alignItems: 'start'
              }}>
                <div style={{
                  ...display, fontStyle: 'italic', fontSize: 76, lineHeight: 0.9, color: p.accent, fontWeight: 400
                }}>
                  {row.n}
                </div>
                <div>
                  <div style={{ ...sub, fontSize: 34, letterSpacing: '-0.015em', fontWeight: 500, lineHeight: 1.15 }}>
                    {row.t}
                  </div>
                  <p style={{ ...sans, fontSize: 17, lineHeight: 1.6, opacity: 0.82, marginTop: 16, fontWeight: 400 }}>
                    {row.d}
                  </p>
                </div>
              </div>);

          })}
        </div>
      </div>

      {/* EDITORS — masthead row */}
      <div style={{ padding: '120px 48px', background: p.cream, borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 56 }}>
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 16 }}>III. THE EDITORS</div>
            <h2 style={{ ...display, fontSize: 84, lineHeight: 0.95, letterSpacing: '-0.025em' }}>
              Who <em style={{ fontStyle: 'italic', color: p.accent }}>signs off</em><br />
              every lesson.
            </h2>
          </div>
          <p style={{ ...sans, fontSize: 14, lineHeight: 1.6, opacity: 0.75, maxWidth: 360 }}>
            Every track in Copi is written, drilled, and signed by a working barista or licensed Q-grader. No anonymous curriculum. No black-box AI.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 56, maxWidth: 820, margin: '0 auto' }}>
          {editors.map((e, i) =>
          <div key={i}>
              <Portrait initials={e.i} src={e.src} />
              <div style={{ ...lbl, color: p.accent, marginTop: 18 }}>{e.role}</div>
              <div style={{ ...display, fontSize: 32, lineHeight: 1.1, marginTop: 6, letterSpacing: '-0.01em' }}>{e.name}</div>
              <p style={{ ...sans, fontSize: 13, lineHeight: 1.6, opacity: 0.78, marginTop: 12, fontWeight: 400 }}>
                {e.bio}
              </p>
            </div>
          )}
        </div>

        <div style={{ ...lbl, opacity: 0.5, marginTop: 48, textAlign: 'center' }}>── +7 MORE CONTRIBUTING EDITORS ──

        </div>
      </div>

      <CopiFooter theme={theme} />
    </div>);

}

Object.assign(window, { AboutPage });