// ═════════════════════════════════════════════════════════
// COPI FOOTER — Almanac direction
// Shared footer used across About, Pricing, Curriculum
// ═════════════════════════════════════════════════════════
function CopiFooter({ theme = {} }) {
  const p = {
    fg: '#1A1410',
    accent: '#3F5A3A',
    cream: '#F4EBD2',
    sun: '#C68A3D',
    ...(theme.palette || {}),
  };
  const display = { fontFamily: theme.displayFont || 'Unna' };
  const sub = { fontFamily: 'Yrsa' };
  const sans = { fontFamily: 'Lato' };
  const lbl = { fontFamily: 'Lato', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };

  const columns = [
    {
      h: 'Curriculum',
      items: ['History of coffee', 'Processing methods', 'Barista knowledge', 'Preview a volume'],
    },
    {
      h: 'Company',
      items: ['About', 'The editors', 'Pricing'],
    },
    {
      h: 'Contact',
      items: ['hello@copi.coffee', 'Request a demo', 'Write for Copi', 'Press kit'],
    },
  ];

  return (
    <footer style={{
      background: p.fg, color: p.cream,
      paddingTop: 80, paddingBottom: 28,
      paddingLeft: 48, paddingRight: 48,
      ...sans,
    }}>
      {/* TOP — wordmark + 3 link columns + newsletter */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1.2fr',
        gap: 56,
        alignItems: 'start',
        paddingBottom: 64,
        borderBottom: `1px solid ${p.cream}25`,
      }}>
        {/* Wordmark + tagline */}
        <div>
          <div style={{ ...display, fontStyle: 'italic', fontSize: 88, lineHeight: 0.85, letterSpacing: '-0.02em' }}>
            Copi
          </div>
          <p style={{ ...sub, fontSize: 18, lineHeight: 1.45, opacity: 0.78, marginTop: 18, maxWidth: 320, fontWeight: 400 }}>
            Coffee education for the people who pour it. Built with working baristas, Q-graders, and roasters.
          </p>
          <div style={{ ...lbl, color: p.sun, marginTop: 22, opacity: 0.9 }}>EST. 2024 · VANCOUVER, BC</div>
        </div>

        {/* Three link columns */}
        {columns.map((c, i) => (
          <div key={i}>
            <div style={{ ...lbl, color: p.sun, marginBottom: 18, opacity: 0.95 }}>{c.h}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {c.items.map((it, j) => (
                <li key={j} style={{ ...sub, fontSize: 17, fontWeight: 400, opacity: 0.85, letterSpacing: '-0.005em' }}>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div>
          <div style={{ ...lbl, color: p.sun, marginBottom: 18, opacity: 0.95 }}>The Almanac</div>
          <p style={{ ...sub, fontSize: 17, lineHeight: 1.45, opacity: 0.82, marginBottom: 18, fontWeight: 400 }}>
            One letter a month — new entries, drills, and notes from the editors.
          </p>
          <div style={{ display: 'flex', border: `1px solid ${p.cream}40` }}>
            <div style={{
              flex: 1, padding: '12px 14px', ...sans, fontSize: 13, opacity: 0.55,
              borderRight: `1px solid ${p.cream}40`,
            }}>
              your@cafe.coffee
            </div>
            <button style={{
              background: p.sun, color: p.fg, padding: '0 18px', borderRadius: 0,
              ...sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Subscribe →
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM — copyright strip */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        ...lbl, opacity: 0.55, marginTop: 28, gap: 16, flexWrap: 'wrap',
      }}>
        <span>© MMXXVI COPI ALMANAC · ALL RIGHTS RESERVED</span>
        <span>EDITION 001 · MMXXVI</span>
        <span style={{ display: 'flex', gap: 18 }}>
          <span>PRIVACY</span>
          <span>TERMS</span>
          <span>COOKIES</span>
        </span>
        <span>VANCOUVER, BC · CANADA</span>
      </div>
    </footer>
  );
}

Object.assign(window, { CopiFooter });
