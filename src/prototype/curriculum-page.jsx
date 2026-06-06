// ═════════════════════════════════════════════════════════
// CURRICULUM PAGE — Almanac direction (Template 3)
// Beige paper · Moss-green accent · Three tracks
// ═════════════════════════════════════════════════════════
function CurriculumPage({ theme = {} }) {
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

  // Seed glyph
  const Seed = ({ size = 12, color }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M10 2 C 14 6, 14 14, 10 18 C 6 14, 6 6, 10 2 Z" fill={color || p.accent} />
      <line x1="10" y1="2" x2="10" y2="18" stroke={p.cream} strokeWidth="0.6" opacity="0.6" />
    </svg>
  );

  const tracks = window.COPI_VOLUMES = [
    {
      vol: 'VOL · I',
      num: '01',
      name: 'History of coffee',
      tag: 'Origins, trade routes, lineage.',
      shortBlurb: 'From Ethiopian highlands to the third-wave roaster — why what\'s in the hopper got there.',
      blurb: 'A working history from the Ethiopian highlands to the third-wave roaster. Your team learns why what\'s in the hopper got there — and why the coffee they\'re pouring today is a direct descendant of a 9th-century Sufi ritual.',
      meta: { entries: 9, time: '2h 14m', cert: 'Foundations' },
      lessons: [
        ['01', 'Ethiopia, the cradle'],
        ['02', 'Yemen and the Sufi cup'],
        ['03', 'The Ottoman coffeehouse'],
        ['04', 'Coffee meets Europe'],
        ['05', 'Plantations and empire'],
        ['06', 'First wave — convenience'],
        ['07', 'Second wave — espresso'],
        ['08', 'Third wave — provenance'],
        ['09', 'Where it goes from here'],
      ],
    },
    {
      vol: 'VOL · II',
      num: '02',
      name: 'Processing methods',
      tag: 'Washed, natural, honey, anaerobic.',
      shortBlurb: 'How the cherry becomes the bean — and how every choice on the farm shows up in the cup.',
      blurb: 'How the cherry becomes the bean — and how every choice on the farm shows up in the cup. Drilled with cupping rubrics so your team can name what they\'re tasting and trace it back to processing.',
      meta: { entries: 7, time: '1h 48m', cert: 'Foundations' },
      lessons: [
        ['01', 'The cherry, anatomy of'],
        ['02', 'Washed process'],
        ['03', 'Natural / dry process'],
        ['04', 'Honey / pulped natural'],
        ['05', 'Anaerobic and experimental'],
        ['06', 'Drying, sorting, milling'],
        ['07', 'Calibrated cupping rubric'],
      ],
    },
    {
      vol: 'VOL · III',
      num: '03',
      name: 'Barista knowledge',
      tag: 'On bar, every shift, every drink.',
      shortBlurb: 'The on-bar craft, drilled with manager sign-off. Grind, dial, pull, steam, pour, recover.',
      blurb: 'The on-bar craft, drilled with manager sign-off. Grind, dial, pull, steam, pour, recover — every drill has a rubric and a video so your team can compare what they did to what good looks like.',
      meta: { entries: 12, time: '3h 26m', cert: 'Bar certified' },
      lessons: [
        ['01', 'Reading the grinder'],
        ['02', 'Dialing in espresso'],
        ['03', 'The pulled-shot rubric'],
        ['04', 'Recovery and resets'],
        ['05', 'Steaming microfoam'],
        ['06', 'Free-pour patterns'],
        ['07', 'Pour-over fundamentals'],
        ['08', 'Batch brew and dispense'],
        ['09', 'Service flow and pacing'],
        ['10', 'Allergen and dietary'],
        ['11', 'Calling out and recovery'],
        ['12', 'Closing the bar'],
      ],
    },
  ];

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
              opacity: x === 'Curriculum' ? 1 : 0.75,
              fontWeight: x === 'Curriculum' ? 700 : 400,
              borderBottom: x === 'Curriculum' ? `1.5px solid ${p.fg}` : 'none',
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
        <span>CURRICULUM · EDITION 001</span>
        <span>THREE VOLUMES · 28 ENTRIES · 7h 28m</span>
        <span>SIGNED BY THE EDITORS</span>
      </div>

      {/* HEADER */}
      <div style={{ padding: '96px 48px 64px', borderBottom: `1.5px solid ${p.fg}`, textAlign: 'center' }}>
        <div style={{ ...lbl, color: p.accent, marginBottom: 28 }}>◆ THE CURRICULUM · IN THREE VOLUMES</div>
        <h1 style={{
          ...display, fontSize: 108, lineHeight: 0.95, letterSpacing: '-0.035em', fontWeight: 400,
          whiteSpace: 'nowrap',
        }}>
          From the cherry to the <em style={{ fontStyle: 'italic', color: p.accent }}>cup.</em>
        </h1>
        <p style={{ ...sub, fontSize: 22, lineHeight: 1.5, opacity: 0.82, maxWidth: 680, fontWeight: 400, marginTop: 32, marginInline: 'auto' }}>
          Three volumes, signed off by working baristas and Q-graders. Every entry ends in a hands-on drill with a calibrated rubric.
        </p>
      </div>

      {/* THREE VOLUMES — stacked horizontal cards (distinct from pricing's 3-up grid) */}
      <div style={{ padding: '64px 48px 80px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {tracks.map((t, i) => {
          const featured = i === 1;
          const cardBg = featured ? p.accent : p.cream;
          const cardFg = featured ? p.cream : p.fg;
          const dim    = featured ? `${p.cream}55` : `${p.fg}30`;
          const numCol = featured ? p.sun : p.accent;
          return (
            <article key={i} style={{
              background: cardBg, color: cardFg,
              border: `1.5px solid ${p.fg}`,
              display: 'grid',
              gridTemplateColumns: '220px 1fr 320px',
              alignItems: 'stretch',
              position: 'relative',
            }}>
              {featured && (
                <div style={{
                  position: 'absolute', top: -14, left: 24,
                  background: p.sun, color: p.fg, padding: '5px 10px',
                  ...lbl, fontSize: 9,
                }}>
                  ◆ EDITORS' PICK
                </div>
              )}

              {/* Left rail — big numeral, volume label */}
              <div style={{
                padding: '40px 32px',
                borderRight: `1.5px solid ${featured ? `${p.cream}55` : p.fg}`,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div style={{ ...lbl, opacity: featured ? 0.75 : 0.6, color: cardFg }}>{t.vol}</div>
                <div style={{
                  ...display, fontStyle: 'italic', fontSize: 156, lineHeight: 0.82,
                  letterSpacing: '-0.04em', color: numCol, fontWeight: 400, marginTop: 14,
                }}>
                  {t.num}
                </div>
              </div>

              {/* Middle — title + tagline + blurb */}
              <div style={{
                padding: '40px 40px',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
              }}>
                <h2 style={{
                  ...display, fontSize: 56, lineHeight: 0.98, letterSpacing: '-0.025em', fontWeight: 400, margin: 0,
                }}>
                  {t.name}.
                </h2>
                <div style={{
                  ...sub, fontStyle: 'italic', fontSize: 22, opacity: 0.78, marginTop: 10, fontWeight: 400,
                }}>
                  {t.tag}
                </div>
                <p style={{
                  ...sans, fontSize: 14, lineHeight: 1.6, opacity: 0.82, fontWeight: 400,
                  marginTop: 18, maxWidth: 540,
                }}>
                  {t.shortBlurb}
                </p>
              </div>

              {/* Right — meta + CTA */}
              <div style={{
                padding: '40px 32px',
                borderLeft: `1.5px solid ${featured ? `${p.cream}55` : p.fg}`,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                gap: 24,
              }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0,
                  borderTop: `1px solid ${dim}`,
                }}>
                  {[
                    ['Entries',        `${t.meta.entries}`],
                    ['Time on bar',    t.meta.time],
                    ['Certification',  t.meta.cert],
                    ['Sample',         'First 2 free'],
                  ].map((row, j) => (
                    <li key={j} style={{
                      display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'baseline',
                      padding: '11px 0', borderBottom: `1px dashed ${dim}`,
                      ...sans, fontSize: 13, fontWeight: 400,
                    }}>
                      <span style={{ opacity: 0.7 }}>{row[0]}</span>
                      <span style={{ ...sub, fontSize: 15, fontWeight: 500 }}>{row[1]}</span>
                    </li>
                  ))}
                </ul>

                <button
                  data-volume-idx={i}
                  style={{
                    background: featured ? p.cream : p.accent,
                    color: featured ? p.accent : p.cream,
                    padding: '14px 18px', borderRadius: 0,
                    ...sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                  }}>
                  <span>Read the volume</span>
                  <span>→</span>
                </button>
              </div>
            </article>
          );
        })}

        {/* Tally footer row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          ...lbl, opacity: 0.55, marginTop: 16,
        }}>
          <span>◆ MORE VOLUMES IN PROGRESS</span>
          <span>NEXT EDITION · ROASTING · SERVICE · CUPPING</span>
          <span>ALL TRACKS · ALL TIERS · NO ADD-ONS</span>
        </div>
      </div>

      <CopiFooter theme={theme} />
    </div>
  );
}

Object.assign(window, { CurriculumPage });
