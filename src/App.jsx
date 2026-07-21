import React from 'react';
import { supabase } from './lib/supabaseClient.js';
import './store/copi-store.js';

// Import new design system and components
import './prototype/design-system.jsx';

// New pages
import './pages/signup-page.jsx';
import './pages/cafe-setup-page.jsx';
import './pages/import-roaster-page.jsx';
import './pages/invite-accept-page.jsx';
import './pages/staff-page.jsx';
import './pages/manager-dashboard.jsx';
import './pages/ai-review-page.jsx';
import './pages/owner-dashboard.jsx';
import './pages/blocks/FlashcardBlock.jsx';
import './pages/blocks/DragDropBlock.jsx';
import './pages/lesson-player-new.jsx';
import './pages/cms-page.jsx';
import './pages/paywall-page.jsx';
import './pages/barista-profile-new.jsx';
import './pages/admin-curriculum-new.jsx';
import './pages/admin-analytics-new.jsx';
import './pages/admin-settings-new.jsx';
import './pages/admin-shell.jsx';
import './pages/admin-ui.jsx';
import './pages/admin-home.jsx';
import './pages/admin-team.jsx';
import './pages/admin-lessons-grid.jsx';
import './pages/admin-setup-copi.jsx';
import './pages/admin-analytics-page.jsx';
import './pages/admin-curriculum-page.jsx';
import './pages/admin-billing-page.jsx';
import './pages/admin-profile-page.jsx';
import './pages/admin-notifications-page.jsx';
import './pages/draft-curriculum-editor.jsx';
import './pages/curriculum-assign-modal.jsx';
import './pages/published-curriculum-viewer.jsx';
import './pages/cupper-chat.jsx';
import './prototype/coffee-mascot.jsx';
import './prototype/animations.jsx';
import './prototype/ui-components.jsx';
import './prototype/nav-new.jsx';
import './prototype/hero-section.jsx';
import './prototype/problem-section.jsx';
import './prototype/value-props-section.jsx';
import './prototype/how-it-works-section.jsx';
import './prototype/curriculum-section.jsx';
import './prototype/cta-section.jsx';
import './prototype/footer-new.jsx';
import './prototype/landing-page-new.jsx';

// Resource URLs extracted from the standalone HTML bundle.
if (typeof window !== 'undefined') {
  window.__resources = {
  "owenPortrait": "/assets/owenPortrait.png",
  "miguelPortrait": "/assets/miguelPortrait.png"
};
}


// ===== ui-atoms.jsx =====
// Shared utilities for all directions

const PaperGrain = ({ opacity = 0.05 }) => (
  <div style={{
    position: 'absolute', inset: 0, pointerEvents: 'none',
    opacity, mixBlendMode: 'multiply',
    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
  }} />
);

function ImagePlaceholder({ label, bg, fg, height = 280 }) {
  const id = React.useId().replace(/:/g, '');
  return (
    <div style={{
      width: '100%', height, borderRadius: 10,
      background: bg, color: fg, border: `1px solid ${fg}22`,
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
        <defs>
          <pattern id={`p-${id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={fg} strokeWidth="0.6" opacity="0.35"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#p-${id})`} />
      </svg>
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{
          fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', opacity: 0.7, marginBottom: 6,
        }}>
          {label}
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          border: `1px dashed ${fg}`, opacity: 0.4,
          margin: '0 auto', display: 'grid', placeItems: 'center',
          fontSize: 14,
        }}>
          ▢
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// InkMark — the Copi AI Editor mark (logo #9 · "Ink Splash")
// A slightly-irregular inkblot with two pairs of splash droplets
// (moss + sun) and a center cross-spark. Used wherever the AI Editor
// is represented across the product — dashboards, mailroom cards,
// transcripts, editor's notes, sidebar.
//
// `size`  — pixel size of the square mark (default 14)
// `color` — fill of the central inkblot. The cross + droplets adapt:
//           dark inks get a cream cross, light inks (sun/cream) get a
//           dark cross, so the mark stays legible on either ground.
// ──────────────────────────────────────────────────────────
function InkMark({ size = 14, color = '#1A1410' }) {
  const PAL = { fg: '#1A1410', accent: '#3F5A3A', sun: '#C68A3D', cream: '#F4EBD2' };
  const isLight = color === PAL.sun || color === PAL.cream;
  const sparkColor = isLight ? PAL.fg : PAL.cream;
  // Droplet palette pairs — moss + sun on dark inkblot, moss + dark on light inkblot
  const dropA = PAL.accent;
  const dropB = isLight ? PAL.fg : PAL.sun;
  const stroke = Math.max(1.1, Math.min(2.2, size / 8));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: 'inline-block', verticalAlign: 'middle', flex: 'none' }}
      aria-hidden="true"
    >
      {/* Slightly-irregular inkblot — drawn, not geometric */}
      <path
        d="M 12 6 C 16 6, 18.7 8, 18.7 12 C 18.7 16.7, 15.3 18.7, 12 18.7 C 8 18.7, 5.3 16, 5.3 12 C 5.3 8, 8.3 6, 12 6 Z"
        fill={color}
      />
      {/* Splash droplets — moss pair (NE + SW), accent pair (SE + NW) */}
      <circle cx="19.5" cy="4.5"  r="1"    fill={dropA} />
      <circle cx="4.5"  cy="20"   r="0.85" fill={dropA} />
      <circle cx="21.4" cy="18.7" r="0.7"  fill={dropB} />
      <circle cx="2.6"  cy="7.4"  r="0.7"  fill={dropB} />
      {/* Center cross-spark */}
      <path
        d="M 12 9.6 L 12 14.4 M 9.6 12 L 14.4 12"
        stroke={sparkColor}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

Object.assign(window, { PaperGrain, ImagePlaceholder, InkMark });


// ===== content-volume-history.jsx =====
// ═════════════════════════════════════════════════════════
// COPI CONTENT · VOLUME I — History of coffee
// Real editorial lessons + multiple-choice checks.
// Each lesson: read[] (paragraphs) + quiz[] ({ q, options, answer, why }).
// Exposed as window.COPI_VOL1 — assembled by copi-store.jsx.
// ═════════════════════════════════════════════════════════

window.COPI_VOL1 = {
  id: 'vol-1',
  vol: 'VOL · I',
  num: '01',
  name: 'History of coffee',
  tag: 'Origins, trade routes, lineage.',
  cert: 'Foundations',
  blurb: 'A working history from the Ethiopian highlands to the third-wave roaster — why what\u2019s in the hopper got there.',
  lessons: [
    {
      id: 'v1l1', num: '01', title: 'Ethiopia, the cradle', minutes: 9,
      read: [
        'Every coffee plant on earth traces back to the forests of southwestern Ethiopia, where Coffea arabica still grows wild in the shade of the highland canopy. Long before anyone brewed it, the cherry was eaten — crushed with fat into energy balls, or fermented into a light wine. The famous tale of Kaldi, the goatherd who noticed his flock dancing after nibbling the bright red cherries, is a later legend, but it points at a real truth: coffee was discovered as a food and a stimulant centuries before it became a drink.',
        'What makes Ethiopia singular is genetic diversity. Because arabica originated there, the country holds thousands of distinct heirloom varieties — most still uncatalogued — which is why an Ethiopian cup can taste of jasmine, bergamot, blueberry, or stone fruit depending on the lot. When you pour a washed Yirgacheffe or a natural Sidamo today, you are tasting the closest thing we have to coffee in its original form.',
      ],
      quiz: [
        { q: 'Where did Coffea arabica originate?', options: ['Yemen', 'Brazil', 'Southwestern Ethiopia', 'Colombia'], answer: 2, why: 'Arabica grew wild in the Ethiopian highlands long before it was cultivated anywhere else.' },
        { q: 'How was coffee first consumed in Ethiopia?', options: ['As a hot brewed drink', 'As a food — eaten with fat or fermented', 'As an espresso', 'As a cold brew'], answer: 1, why: 'The cherry was eaten and fermented for centuries before anyone brewed the bean.' },
        { q: 'Why do Ethiopian coffees taste so varied?', options: ['Heavy roasting', 'Thousands of wild heirloom varieties', 'Added flavourings', 'Unusually high altitude alone'], answer: 1, why: 'As coffee\u2019s birthplace, Ethiopia holds enormous genetic diversity — hence the range of flavours.' },
      ],
    },
    {
      id: 'v1l2', num: '02', title: 'Yemen and the Sufi cup', minutes: 8,
      read: [
        'Coffee crossed the Red Sea from Ethiopia to Yemen, and it was there — in the 15th century — that it first became the brewed, roasted drink we would recognise. Sufi mystics in the port of Mocha drank it to stay awake through long nights of prayer and chanting. They called the infusion qahwa, a word that had once meant wine, and roasted, ground, and steeped the beans much as we still do.',
        'Yemen gave coffee both its name and its first trade. For roughly two centuries the port of Mocha was the only place on earth exporting coffee, and the Yemenis guarded it fiercely — beans were parboiled or dried before leaving so they could not be germinated elsewhere. \u201CMocha\u201D survives today both as a coffee origin and, confusingly, as a name for chocolate-coffee drinks, a much later European invention.',
      ],
      quiz: [
        { q: 'Who first brewed coffee as a hot drink to stay awake for prayer?', options: ['Ottoman soldiers', 'Sufi mystics in Yemen', 'Venetian traders', 'Brazilian farmers'], answer: 1, why: 'Yemeni Sufis brewed qahwa to sustain night-long devotions in the 15th century.' },
        { q: 'The word \u201Cqahwa\u201D originally referred to what?', options: ['Wine', 'Tea', 'Bread', 'Honey'], answer: 0, why: 'Qahwa once meant wine; it was transferred to the new stimulating brew.' },
        { q: 'Why did Yemen parboil or dry beans before export?', options: ['To improve flavour', 'To prevent them being grown elsewhere', 'To make them lighter to ship', 'Religious custom'], answer: 1, why: 'Treated beans can\u2019t germinate — it protected Yemen\u2019s monopoly on coffee.' },
      ],
    },
    {
      id: 'v1l3', num: '03', title: 'The Ottoman coffeehouse', minutes: 8,
      read: [
        'As coffee moved north into the Ottoman world, it found its institution: the coffeehouse. The first appeared in Constantinople in the 1550s, and they spread fast as places to talk, play chess, hear music, and trade news. They were nicknamed \u201Cschools of the wise,\u201D because so much learning and argument happened over the cup — which is precisely why authorities periodically tried to ban them.',
        'This is the moment coffee became social infrastructure, not just a stimulant. The Ottoman ritual also fixed certain habits we still keep: finely ground coffee simmered with its grounds, served strong and small. When Europeans first encountered coffee, it was through this Ottoman lens — exotic, a little suspect, and irresistibly sociable.',
      ],
      quiz: [
        { q: 'Where did the first coffeehouses appear?', options: ['Vienna', 'Constantinople', 'London', 'Cairo'], answer: 1, why: 'The first coffeehouses opened in Constantinople in the 1550s.' },
        { q: 'Why were coffeehouses called \u201Cschools of the wise\u201D?', options: ['They sold books', 'So much debate and learning happened there', 'They were run by teachers', 'They taught coffee-making'], answer: 1, why: 'They were hubs of conversation, news and argument — sometimes alarming the authorities.' },
        { q: 'What style of coffee did the Ottomans fix?', options: ['Espresso', 'Filter drip', 'Finely ground, simmered with the grounds, served strong and small', 'Cold brew'], answer: 2, why: 'Ottoman/Turkish-style coffee is finely ground and simmered with its grounds.' },
      ],
    },
    {
      id: 'v1l4', num: '04', title: 'Coffee meets Europe', minutes: 9,
      read: [
        'Coffee reached Europe through Venice in the early 1600s, arriving via trade with the Ottomans. It was met with suspicion — some clergy wanted it banned as a \u201CMuslim drink\u201D — until, by legend, Pope Clement VIII tasted it and approved. Whether or not that story is true, coffee was quickly baptised into European life, and the coffeehouse model came with it.',
        'By the late 1600s, London alone had thousands of coffeehouses, each catering to a trade or interest. One on Lombard Street, run by Edward Lloyd, became the meeting place for shipping merchants and underwriters — and grew into Lloyd\u2019s of London. The London Stock Exchange has similar roots. Coffee didn\u2019t just wake Europe up; it furnished the rooms where modern commerce and journalism were invented.',
      ],
      quiz: [
        { q: 'Through which city did coffee first enter Europe?', options: ['Paris', 'Venice', 'Amsterdam', 'Lisbon'], answer: 1, why: 'Venice, trading with the Ottomans, was coffee\u2019s European gateway in the early 1600s.' },
        { q: 'A London coffeehouse grew into which institution?', options: ['The Bank of England', 'Lloyd\u2019s of London', 'The Royal Mint', 'The BBC'], answer: 1, why: 'Edward Lloyd\u2019s coffeehouse became the insurance market Lloyd\u2019s of London.' },
        { q: 'What broader role did European coffeehouses play?', options: ['Only serving drinks', 'Birthplaces of commerce and journalism', 'Religious worship', 'Government offices'], answer: 1, why: 'Trade, news and finance organised themselves around the coffeehouse.' },
      ],
    },
    {
      id: 'v1l5', num: '05', title: 'Plantations and empire', minutes: 10,
      read: [
        'Once Europeans were hooked, they wanted to grow coffee themselves — and they did it through colonial plantations. The Dutch smuggled seedlings out of Yemen and planted them in Java; the French took a single plant to the Caribbean. From a handful of stolen seedlings, vast plantation systems spread across the tropics, very often built on enslaved and forced labour.',
        'This is the hard part of coffee\u2019s history, and it still shapes the trade. Production moved from its highland origins to colonies chosen for climate and cheap labour, and the wealth flowed back to Europe. Brazil, planted in the 18th century, would become the giant it remains today. Understanding this history is part of why third-wave coffee cares so much about traceability and fair pricing — it is a direct response to centuries of extraction.',
      ],
      quiz: [
        { q: 'How did coffee cultivation leave Yemen and Ethiopia?', options: ['It was freely shared', 'Through colonial smuggling and plantations', 'It evolved naturally', 'It never did'], answer: 1, why: 'Europeans smuggled seedlings to colonies like Java and the Caribbean.' },
        { q: 'Colonial coffee plantations were largely built on what?', options: ['Volunteer labour', 'Enslaved and forced labour', 'Machinery', 'Family farms'], answer: 1, why: 'Plantation coffee relied heavily on enslaved and forced labour.' },
        { q: 'Which country became the dominant producer from the 18th century on?', options: ['Vietnam', 'Brazil', 'Kenya', 'India'], answer: 1, why: 'Brazil grew into — and remains — the world\u2019s largest coffee producer.' },
      ],
    },
    {
      id: 'v1l6', num: '06', title: 'First wave \u2014 convenience', minutes: 8,
      read: [
        'The \u201Cwaves\u201D are a useful shorthand for coffee culture. The first wave, roughly from the late 1800s through the mid-1900s, was about getting coffee into every home, cheaply and conveniently. Vacuum packaging, pre-ground tins, instant coffee, and the percolator made coffee a mass commodity. Brands competed on price and consistency, not flavour or origin.',
        'First-wave coffee gets a bad reputation among specialty folks, but it did something important: it made coffee an everyday ritual for ordinary people. The trade-off was that quality and provenance disappeared. Coffee became a brown, caffeinated default — reliable, forgettable, and completely disconnected from the farms that grew it.',
      ],
      quiz: [
        { q: 'What was the first wave of coffee mainly about?', options: ['Single-origin flavour', 'Convenience and mass availability', 'Latte art', 'Direct trade'], answer: 1, why: 'First wave prioritised getting cheap, convenient coffee into every home.' },
        { q: 'Which innovation belongs to the first wave?', options: ['Instant coffee and pre-ground tins', 'Anaerobic fermentation', 'The flat white', 'Pour-over drippers'], answer: 0, why: 'Vacuum tins, instant and percolators defined first-wave convenience.' },
        { q: 'What was the main trade-off of the first wave?', options: ['Higher prices', 'Loss of quality and provenance', 'Too much variety', 'Slow brewing'], answer: 1, why: 'Convenience came at the cost of flavour and any connection to origin.' },
      ],
    },
    {
      id: 'v1l7', num: '07', title: 'Second wave \u2014 espresso', minutes: 9,
      read: [
        'The second wave, from the 1960s onward and accelerating in the 1980s\u201390s, brought coffee back as an experience. It was led by cafés — Peet\u2019s, then most famously Starbucks — that introduced Americans to espresso drinks, darker European-style roasts, and the café as a \u201Cthird place\u201D between home and work. Suddenly people learned words like latte, cappuccino, and barista.',
        'Second-wave coffee made origin part of the story again, if loosely — you\u2019d hear \u201CColombian\u201D or \u201CSumatran\u201D on the menu. Roasts ran dark, partly to deliver a consistent, bold flavour across huge volumes. The lasting legacy is cultural: it normalised paying real money for a crafted coffee drink and built the café industry that specialty coffee would later refine.',
      ],
      quiz: [
        { q: 'The second wave is most associated with what?', options: ['Instant coffee', 'Espresso drinks and café culture', 'Farm-level traceability', 'Cold brew'], answer: 1, why: 'Second wave popularised espresso, lattes and the café as a \u201Cthird place.\u201D' },
        { q: 'Which chain most defined the second wave?', options: ['Blue Bottle', 'Starbucks', 'Stumptown', 'Counter Culture'], answer: 1, why: 'Starbucks brought espresso culture and the café experience to the mainstream.' },
        { q: 'Second-wave roasts were typically what?', options: ['Very light', 'Dark, for bold consistency', 'Unroasted', 'Always decaf'], answer: 1, why: 'Darker roasts gave a consistent, bold flavour at scale.' },
      ],
    },
    {
      id: 'v1l8', num: '08', title: 'Third wave \u2014 provenance', minutes: 10,
      read: [
        'The third wave, from the early 2000s, treats coffee like wine: a craft product whose flavour reflects a specific place, variety, and process. Roasters go lighter to preserve origin character, publish the farm and altitude, and brew with precision — weighed doses, controlled water, timed extractions. The barista becomes a skilled craftsperson, and the cup is meant to taste of somewhere.',
        'Underneath the latte art and pour-overs is an ethical project: direct trade relationships, better farmer pay, and transparency about where money goes. Third wave is a deliberate reversal of the first wave\u2019s anonymity and the colonial extraction before it. When your café lists a washed Ethiopian with the producer\u2019s name and tasting notes of bergamot and peach, that\u2019s the third wave in a cup.',
      ],
      quiz: [
        { q: 'Third-wave coffee treats coffee most like what?', options: ['A commodity', 'Wine — a craft product of place', 'Fast food', 'Medicine'], answer: 1, why: 'Third wave emphasises terroir, variety and process, like fine wine.' },
        { q: 'Why do third-wave roasters tend to roast lighter?', options: ['To save money', 'To preserve origin character and flavour', 'For caffeine', 'Tradition'], answer: 1, why: 'Lighter roasting keeps the distinctive flavours of a specific origin.' },
        { q: 'What ethical aim sits under the third wave?', options: ['Cheaper coffee', 'Transparency, direct trade and fairer farmer pay', 'Faster service', 'Bigger cups'], answer: 1, why: 'Traceability and fairer pricing answer the extraction of earlier eras.' },
      ],
    },
    {
      id: 'v1l9', num: '09', title: 'Where it goes from here', minutes: 8,
      read: [
        'Coffee\u2019s next chapter is being written around two pressures: climate and equity. Arabica is fussy about temperature and rainfall, and a warming climate is shrinking the land that can grow it well — pushing farms to higher altitudes and driving interest in hardier varieties and even other species like the rediscovered Coffea stenophylla. At the same time, producers are asking for a bigger share of a trade that has historically underpaid them.',
        'For a café, this matters at the bar. The coffee you pour is the end of a long, fragile chain, and the choices a roaster makes — which farms, what price, which varieties — increasingly decide whether that chain survives. Knowing the history lets you tell that story to a customer, and telling it well is part of what makes specialty coffee worth its price.',
      ],
      quiz: [
        { q: 'What are the two big pressures on coffee\u2019s future?', options: ['Packaging and branding', 'Climate change and equity for producers', 'Caffeine and decaf', 'Speed and price'], answer: 1, why: 'A warming climate and fairer pay for farmers define coffee\u2019s next chapter.' },
        { q: 'How is climate change affecting where coffee grows?', options: ['No effect', 'Shrinking suitable land, pushing farms higher', 'Making it easier everywhere', 'Only affecting robusta'], answer: 1, why: 'Warming reduces arabica-suitable land and pushes cultivation to altitude.' },
        { q: 'Why does this history matter at the bar?', options: ['It doesn\u2019t', 'It lets you tell the coffee\u2019s story and justify its value', 'Only for managers', 'For pricing only'], answer: 1, why: 'Understanding the chain lets a barista tell the story that earns specialty pricing.' },
      ],
    },
  ],
  finalTest: {
    id: 'vol-1-final',
    title: 'Volume I \u2014 Final test',
    passMark: 0.7,
    quiz: [
      { q: 'Coffee originated as a wild plant in which region?', options: ['Yemen', 'Ethiopia', 'Brazil', 'Java'], answer: 1, why: 'Coffea arabica is native to the Ethiopian highlands.' },
      { q: 'Where did coffee first become a brewed, roasted drink?', options: ['Yemen', 'Italy', 'England', 'Turkey'], answer: 0, why: 'Yemeni Sufis first brewed qahwa in the 15th century.' },
      { q: 'The first coffeehouses opened in which city?', options: ['Venice', 'London', 'Constantinople', 'Cairo'], answer: 2, why: 'Constantinople, 1550s.' },
      { q: 'A London coffeehouse became which institution?', options: ['Lloyd\u2019s of London', 'The Bank of England', 'The Royal Society', 'Harrods'], answer: 0, why: 'Edward Lloyd\u2019s coffeehouse became Lloyd\u2019s of London.' },
      { q: 'Which wave centred on espresso and café culture?', options: ['First', 'Second', 'Third', 'Fourth'], answer: 1, why: 'The second wave brought espresso drinks and the café experience.' },
      { q: 'Third-wave roasters generally roast lighter in order to:', options: ['Save money', 'Preserve origin flavour', 'Add more caffeine', 'Speed up service'], answer: 1, why: 'Light roasting preserves the distinctive character of an origin.' },
    ],
  },
};


// ===== content-volume-processing.jsx =====
// ═════════════════════════════════════════════════════════
// COPI CONTENT · VOLUME II — Processing methods
// window.COPI_VOL2 — assembled by copi-store.jsx.
// ═════════════════════════════════════════════════════════

window.COPI_VOL2 = {
  id: 'vol-2',
  vol: 'VOL · II',
  num: '02',
  name: 'Processing methods',
  tag: 'Washed, natural, honey, anaerobic.',
  cert: 'Foundations',
  blurb: 'How the cherry becomes the bean \u2014 and how every choice on the farm shows up in the cup.',
  lessons: [
    {
      id: 'v2l1', num: '01', title: 'The cherry, anatomy of', minutes: 8,
      read: [
        'A coffee \u201Cbean\u201D is actually a seed, and it starts life inside a fruit called the cherry. Working from the outside in, there\u2019s the skin, then a layer of sweet, sticky pulp, then a slippery mucilage, then a papery parchment, and finally a thin silverskin wrapped around the seed itself. Most cherries hold two seeds, flat-sided where they press together; occasionally a single round seed forms instead, called a peaberry.',
        'Processing is simply the set of decisions about how and when you remove these layers — and how much of the fruit\u2019s sugar you let the seed soak up along the way. That\u2019s the whole game. The skin and pulp are full of sugars and acids, so whether they\u2019re stripped off immediately or left to dry on the seed has an enormous effect on the final flavour. Understanding the anatomy is the key that unlocks every method that follows.',
      ],
      quiz: [
        { q: 'A coffee bean is botanically what?', options: ['A nut', 'A seed inside a fruit', 'A dried leaf', 'A root'], answer: 1, why: 'The bean is the seed of the coffee cherry.' },
        { q: 'What is the sticky layer between pulp and parchment called?', options: ['Silverskin', 'Mucilage', 'Chaff', 'Husk'], answer: 1, why: 'Mucilage is the sweet, slippery layer that processing methods treat differently.' },
        { q: 'A single round seed instead of two flat ones is called a:', options: ['Peaberry', 'Maragogype', 'Caracol twin', 'Quaker'], answer: 0, why: 'A peaberry forms when only one seed develops in the cherry.' },
      ],
    },
    {
      id: 'v2l2', num: '02', title: 'Washed process', minutes: 9,
      read: [
        'In the washed (or \u201Cwet\u201D) process, the skin and pulp are removed from the cherry within hours of picking, and the remaining mucilage is broken down — usually by fermenting the beans in tanks of water, then rinsing them clean. The seed is dried in its parchment with essentially none of the fruit still attached. Because the sugars are washed away before drying, washed coffees taste of the seed itself: clean, bright, and transparent.',
        'Washed processing is the method of choice when a producer wants to show off acidity and clarity — think of the crisp citrus of a Kenyan or the floral, tea-like delicacy of a washed Ethiopian. The trade-off is that it uses a lot of clean water and careful timing; over-fermentation can introduce sour, vinegary off-notes. When you taste \u201Cclean\u201D and \u201Cbright,\u201D you\u2019re usually tasting a washed coffee.',
      ],
      quiz: [
        { q: 'In the washed process, when is the fruit removed?', options: ['After drying', 'Within hours of picking, before drying', 'Never', 'Only the skin, never the pulp'], answer: 1, why: 'Washed coffees have skin and pulp removed early, then ferment to strip mucilage.' },
        { q: 'Washed coffees are prized for what quality?', options: ['Heavy, boozy body', 'Clean, bright clarity', 'Earthy funk', 'Low acidity'], answer: 1, why: 'Removing sugars before drying yields a clean, transparent, acidic cup.' },
        { q: 'A risk of the washed process is:', options: ['Too much fruit flavour', 'Over-fermentation causing sour off-notes', 'No flavour at all', 'Excess caffeine'], answer: 1, why: 'Poorly controlled fermentation can introduce vinegary, sour defects.' },
      ],
    },
    {
      id: 'v2l3', num: '03', title: 'Natural / dry process', minutes: 9,
      read: [
        'The natural (or dry) process is the oldest method and, in a sense, the simplest: the whole cherry is dried intact, fruit and all, before the seed is hulled out. As it dries — often on raised beds over two to four weeks — the seed slowly absorbs sugars and compounds from the fermenting fruit around it. The result is a cup with big, fruity, sometimes boozy or jammy flavours: blueberry, strawberry, overripe fruit.',
        'Natural processing needs sun and space, which is why it\u2019s historically associated with dry regions like parts of Ethiopia, Yemen, and Brazil. It\u2019s less predictable than washed — uneven drying or stray cherries can introduce funky, fermented, or mouldy notes — so it rewards careful sorting. When a coffee tastes intensely of fruit and almost of wine, it\u2019s very likely a natural.',
      ],
      quiz: [
        { q: 'In the natural process, the cherry is:', options: ['Pulped immediately', 'Dried whole with the fruit on', 'Fermented in water', 'Frozen'], answer: 1, why: 'Natural coffees dry intact, so the seed absorbs the fruit\u2019s sugars.' },
        { q: 'Natural-processed coffees typically taste:', options: ['Clean and tea-like', 'Big, fruity, sometimes boozy', 'Flat and woody', 'Salty'], answer: 1, why: 'Drying in the fruit gives jammy, fruit-forward, wine-like flavours.' },
        { q: 'Natural processing is associated with which conditions?', options: ['Cold, wet climates', 'Dry, sunny regions with space to dry', 'Indoor factories', 'High-water environments'], answer: 1, why: 'It needs sun and room — hence Ethiopia, Yemen and Brazil.' },
      ],
    },
    {
      id: 'v2l4', num: '04', title: 'Honey / pulped natural', minutes: 8,
      read: [
        'Honey processing sits between washed and natural. The skin is removed, but some or all of the sticky mucilage is left on the seed to dry. The name has nothing to do with the flavour of honey — it refers to how tacky the beans get. Producers grade it by how much mucilage stays on and how it\u2019s dried: white, yellow, red, and black honey, with black leaving the most fruit on for the longest.',
        'The result is a middle path: more body and sweetness than a washed coffee, but cleaner and more balanced than a natural. Honey coffees, strongly associated with Costa Rica and Central America, often taste of caramel, stone fruit, and rounded sweetness. They\u2019re a good example of how a producer can dial flavour up or down simply by choosing how much fruit to leave on the seed.',
      ],
      quiz: [
        { q: 'In honey processing, what is left on the seed to dry?', options: ['The whole cherry', 'Some or all of the mucilage', 'Nothing', 'Only the skin'], answer: 1, why: 'Honey process removes skin but leaves mucilage on during drying.' },
        { q: 'The \u201Choney\u201D in honey process refers to:', options: ['Added honey', 'The tacky, sticky beans', 'A honey flavour', 'A region'], answer: 1, why: 'It describes the sticky texture, not a honey taste.' },
        { q: 'Honey coffees sit flavour-wise:', options: ['Between washed clarity and natural fruit', 'More acidic than washed', 'Identical to natural', 'With no sweetness'], answer: 0, why: 'They balance washed cleanliness with natural sweetness and body.' },
      ],
    },
    {
      id: 'v2l5', num: '05', title: 'Anaerobic and experimental', minutes: 9,
      read: [
        'Newer \u201Cexperimental\u201D methods borrow ideas from winemaking and brewing. The headline one is anaerobic fermentation: cherries (whole or pulped) are sealed in tanks without oxygen, often with controlled temperature and sometimes added cultures, so a specific set of microbes drives the fermentation. This produces intense, distinctive, sometimes wild flavours — think cinnamon, tropical fruit, fermented funk, even bubblegum.',
        'These methods give producers a new lever and can earn premium prices, but they\u2019re polarising: done well they\u2019re thrilling, done poorly they taste of solvent or rot, and critics argue they can overwhelm the origin\u2019s natural character. For a barista, the key is to flag them to curious customers and set expectations — an anaerobic natural is a ride, not a quiet morning cup.',
      ],
      quiz: [
        { q: 'Anaerobic fermentation means fermenting:', options: ['In sunlight', 'Without oxygen in a sealed tank', 'In boiling water', 'After roasting'], answer: 1, why: 'Anaerobic = no oxygen; cherries ferment sealed, often with controlled microbes.' },
        { q: 'Experimental processing borrows ideas mainly from:', options: ['Baking', 'Winemaking and brewing', 'Distilling spirits only', 'Tea production'], answer: 1, why: 'Controlled fermentation techniques come from wine and beer making.' },
        { q: 'Why are experimental coffees polarising?', options: ['Always tasteless', 'Can be thrilling but may mask origin or taste of solvent if poor', 'Illegal', 'Too cheap'], answer: 1, why: 'Bold flavours can overwhelm origin character or, done badly, taste off.' },
      ],
    },
    {
      id: 'v2l6', num: '06', title: 'Drying, sorting, milling', minutes: 8,
      read: [
        'Whatever the method, every coffee must be dried to a stable moisture level — around 10\u201312% — or it will spoil or roast unevenly. Drying too fast cracks the seed; too slow invites mould. Producers dry on patios, raised beds, or mechanical dryers, raking and turning constantly. This unglamorous step makes or breaks a lot of coffees.',
        'After drying, the parchment and silverskin are removed by milling (hulling), and the beans are sorted — by size, density, and colour — to pull out defects. Defective beans, like the dreaded \u201Cquaker\u201D that won\u2019t roast, are what separate a clean specialty lot from a muddy commodity one. By the time green coffee reaches a roaster, it has already been graded and sorted many times.',
      ],
      quiz: [
        { q: 'Coffee must be dried to roughly what moisture level?', options: ['0%', '10\u201312%', '30%', '50%'], answer: 1, why: 'Around 10\u201312% moisture keeps coffee stable for storage and roasting.' },
        { q: 'Removing the parchment layer is called:', options: ['Pulping', 'Milling / hulling', 'Cupping', 'Roasting'], answer: 1, why: 'Milling (hulling) strips parchment and silverskin from the dried seed.' },
        { q: 'A \u201Cquaker\u201D is:', options: ['A premium bean', 'A defective bean that won\u2019t roast', 'A drying bed', 'A region'], answer: 1, why: 'Quakers are underdeveloped beans that stay pale and must be sorted out.' },
      ],
    },
    {
      id: 'v2l7', num: '07', title: 'Calibrated cupping rubric', minutes: 10,
      read: [
        'Cupping is the standard way the industry tastes and scores coffee, and it\u2019s how you connect processing back to flavour. The ritual is deliberately simple so everyone tastes the same way: ground coffee in a bowl, hot water poured over, a crust that forms and is \u201Cbroken\u201D and skimmed, then slurped from a spoon to spray the coffee across the palate. Slurping aerates it and hits every taste receptor at once.',
        'On a calibrated rubric you score attributes separately — fragrance/aroma, flavour, aftertaste, acidity, body, balance, sweetness, and cleanliness — usually toward a 100-point scale, where 80+ marks \u201Cspecialty.\u201D For a working café team, the point isn\u2019t the number; it\u2019s building a shared vocabulary so \u201Cbright,\u201D \u201Cclean,\u201D or \u201Cfruity\u201D means the same thing to everyone, and so you can taste a cup and reason backward to how it was processed.',
      ],
      quiz: [
        { q: 'Why do cuppers slurp the coffee loudly?', options: ['Tradition only', 'To aerate it and spread it across the palate', 'To cool it instantly', 'To remove grounds'], answer: 1, why: 'Slurping sprays coffee across all taste receptors at once.' },
        { q: 'A cupping score of 80+ on the 100-point scale indicates:', options: ['A defect', 'Specialty grade', 'Decaf', 'Instant coffee'], answer: 1, why: '80 points and above is the threshold for \u201Cspecialty\u201D coffee.' },
        { q: 'For a café team, the main value of cupping is:', options: ['Winning awards', 'A shared vocabulary and tasting backward to process', 'Faster service', 'Cheaper beans'], answer: 1, why: 'Calibrated tasting gives the team a common language and links flavour to method.' },
      ],
    },
  ],
  finalTest: {
    id: 'vol-2-final',
    title: 'Volume II \u2014 Final test',
    passMark: 0.7,
    quiz: [
      { q: 'Processing is essentially the decision about:', options: ['Roast colour', 'How and when to remove the fruit layers', 'Grind size', 'Water temperature'], answer: 1, why: 'Processing is about removing the cherry\u2019s layers and how much sugar the seed absorbs.' },
      { q: 'Which method gives the cleanest, brightest cup?', options: ['Natural', 'Washed', 'Black honey', 'Anaerobic'], answer: 1, why: 'Washed processing strips sugars before drying for a clean, bright result.' },
      { q: 'Big, jammy, wine-like fruit flavour usually means:', options: ['Washed', 'Natural', 'Pulped and rinsed', 'Decaf'], answer: 1, why: 'Natural drying in the fruit gives intense fruit-forward flavours.' },
      { q: 'Honey process leaves what on the seed?', options: ['The skin', 'Some or all mucilage', 'Added honey', 'Nothing'], answer: 1, why: 'Honey process removes skin but keeps mucilage on during drying.' },
      { q: 'Anaerobic fermentation happens:', options: ['In sunlight', 'Sealed without oxygen', 'During roasting', 'In the grinder'], answer: 1, why: 'Anaerobic means oxygen-free, sealed fermentation.' },
      { q: 'Coffee is dried to roughly:', options: ['10\u201312% moisture', '0% moisture', '40% moisture', '60% moisture'], answer: 0, why: '10\u201312% moisture keeps green coffee stable.' },
    ],
  },
};


// ===== content-volume-barista.jsx =====
// ═════════════════════════════════════════════════════════
// COPI CONTENT · VOLUME III — Barista knowledge
// window.COPI_VOL3 — assembled by copi-store.jsx.
// ═════════════════════════════════════════════════════════

window.COPI_VOL3 = {
  id: 'vol-3',
  vol: 'VOL · III',
  num: '03',
  name: 'Barista knowledge',
  tag: 'On bar, every shift, every drink.',
  cert: 'Bar certified',
  blurb: 'The on-bar craft, drilled with manager sign-off. Grind, dial, pull, steam, pour, recover.',
  lessons: [
    {
      id: 'v3l1', num: '01', title: 'Reading the grinder', minutes: 8,
      read: [
        'The grinder is the most important machine on the bar \u2014 more than the espresso machine. Grind size controls how fast water flows through the coffee, and therefore how much flavour it extracts. Finer grind slows the water and extracts more; coarser grind speeds it up and extracts less. Almost every espresso problem you\u2019ll meet is solved at the grinder, not the machine.',
        'Good baristas learn to \u201Cread\u201D their grinder: how the dial moves, how fresh beans grind differently from older ones, and how humidity changes things through the day. Burrs also heat up and wear down. The habit to build is small adjustments and tasting \u2014 nudge the grind, pull a shot, taste, repeat \u2014 rather than big swings.',
      ],
      quiz: [
        { q: 'Finer grind does what to extraction?', options: ['Speeds water up, extracts less', 'Slows water down, extracts more', 'No effect', 'Only changes temperature'], answer: 1, why: 'Finer grind slows water flow and increases extraction.' },
        { q: 'Most espresso problems are solved at the:', options: ['Espresso machine', 'Grinder', 'Tamper', 'Cup warmer'], answer: 1, why: 'Grind size is the primary lever for espresso quality.' },
        { q: 'The right way to dial is:', options: ['One big adjustment', 'Small nudges, taste, repeat', 'Never adjust', 'Change beans constantly'], answer: 1, why: 'Small adjustments and tasting beat large, blind swings.' },
      ],
    },
    {
      id: 'v3l2', num: '02', title: 'Dialing in espresso', minutes: 9,
      read: [
        'Dialing in means setting the three numbers that define a shot: the dose (grams of coffee in), the yield (grams of espresso out), and the time. A common starting point is an 18g dose pulling about 36g out in 25\u201330 seconds \u2014 a \u201C1:2 ratio.\u201D These are not sacred; they\u2019re a map. The destination is taste.',
        'If a shot runs too fast and tastes sour and thin, it\u2019s under-extracted \u2014 grind finer. If it runs too slow and tastes bitter and harsh, it\u2019s over-extracted \u2014 grind coarser. Change one variable at a time, keep the dose consistent, and always confirm with your mouth. A scale and a timer turn guessing into a repeatable recipe the whole team can hit.',
      ],
      quiz: [
        { q: 'A 1:2 ratio with an 18g dose yields about:', options: ['9g out', '18g out', '36g out', '72g out'], answer: 2, why: '1:2 means double the dose out — 36g from 18g in.' },
        { q: 'A fast shot tasting sour and thin is:', options: ['Over-extracted, grind coarser', 'Under-extracted, grind finer', 'Perfect', 'Too hot'], answer: 1, why: 'Sour and fast = under-extracted; grind finer to slow it down.' },
        { q: 'When dialing, you should change:', options: ['Everything at once', 'One variable at a time', 'Nothing', 'Only the cup'], answer: 1, why: 'Changing one variable keeps the cause of any change clear.' },
      ],
    },
    {
      id: 'v3l3', num: '03', title: 'The pulled-shot rubric', minutes: 9,
      read: [
        'A good espresso has a few tells you can learn to spot. The pour should start after a couple of seconds, fall in a steady, thin stream the colour of warm honey, and end before it turns pale and watery (\u201Cblonding\u201D). The crema should be reddish-brown and persistent, not thin and grey. None of this guarantees taste, but together they signal an even extraction.',
        'The rubric for sign-off at most bars: correct dose and yield by weight, time in range, an even (not gushing or dripping) pour, and \u2014 the only thing that really matters \u2014 a balanced, sweet taste with no harsh sourness or bitterness. Pulling to a rubric, not to vibes, is what lets two different baristas make the same drink.',
      ],
      quiz: [
        { q: 'A well-pulled shot streams the colour of:', options: ['Black ink', 'Warm honey', 'Clear water', 'Milk'], answer: 1, why: 'A steady honey-coloured stream signals a good extraction.' },
        { q: '\u201CBlonding\u201D refers to:', options: ['The crema colour at rest', 'The shot turning pale and watery near the end', 'A light roast', 'Adding milk'], answer: 1, why: 'Blonding is the pale, watery phase you stop before.' },
        { q: 'The ultimate test of a shot is:', options: ['Its time only', 'Its taste \u2014 balanced and sweet', 'Its crema only', 'Its temperature'], answer: 1, why: 'Numbers guide you, but balanced sweet taste is the real measure.' },
      ],
    },
    {
      id: 'v3l4', num: '04', title: 'Recovery and resets', minutes: 7,
      read: [
        'Things drift mid-service: humidity changes, a bag of beans runs low, the grinder warms up. A shot that was dialed at open can run fast or slow by midday. Recovery is the habit of noticing \u2014 a shot timing off, crema looking thin \u2014 and correcting it with a small grind adjustment before it reaches a customer.',
        'Resets matter too. When you change beans, purge the grinder of the old grounds and re-dial. After a quiet spell, the first shot may be off because grounds sat in the chamber. The professional move is to taste-test the first shot of a new bean or after a lull, rather than serving it blind. A quick reset costs seconds; a bad drink costs a customer.',
      ],
      quiz: [
        { q: 'Why might a shot dialed at open run differently by midday?', options: ['The machine is broken', 'Humidity, bean level and grinder heat change', 'Customers changed', 'The cups changed'], answer: 1, why: 'Environmental and equipment drift shift extraction through the day.' },
        { q: 'When switching to a new bag of beans you should:', options: ['Serve immediately', 'Purge and re-dial the grinder', 'Turn off the machine', 'Add sugar'], answer: 1, why: 'Purge old grounds and re-dial so the new bean is set correctly.' },
        { q: 'After a quiet spell, the first shot should be:', options: ['Served blind', 'Taste-tested before serving', 'Thrown away always', 'Doubled'], answer: 1, why: 'Grounds sitting in the chamber can throw the first shot — check it.' },
      ],
    },
    {
      id: 'v3l5', num: '05', title: 'Steaming microfoam', minutes: 9,
      read: [
        'Microfoam is steamed milk with bubbles so small the surface looks like wet paint \u2014 glossy and pourable, not stiff and dry. You make it in two phases. First, \u201Cstretching\u201D: with the steam wand tip just at the surface, you introduce a little air (a gentle hiss) to add volume. Then \u201Ctexturing\u201D: you submerge the tip slightly and create a whirlpool that folds those big bubbles down into a smooth, fine foam.',
        'Temperature matters: take milk to around 55\u201365\u00B0C (warm to the touch, not scalding) \u2014 too hot and you scorch the sugars and lose sweetness. Stop stretching early; most beginners add air for too long and end up with stiff, bubbly foam. Good microfoam is what makes a flat white silky and latte art possible.',
      ],
      quiz: [
        { q: 'Good microfoam looks like:', options: ['Dry, stiff peaks', 'Glossy wet paint', 'Large visible bubbles', 'Plain hot milk'], answer: 1, why: 'Fine microfoam is glossy and pourable, like wet paint.' },
        { q: 'The two phases of steaming are:', options: ['Boil then cool', 'Stretching then texturing', 'Pour then stir', 'Foam then reheat'], answer: 1, why: 'Stretch to add air, then texture to fold bubbles into fine foam.' },
        { q: 'Milk steamed too hot will:', options: ['Taste sweeter', 'Scorch and lose sweetness', 'Foam better', 'Stay cold'], answer: 1, why: 'Above ~65\u00B0C the sugars scorch and sweetness drops.' },
      ],
    },
    {
      id: 'v3l6', num: '06', title: 'Free-pour patterns', minutes: 8,
      read: [
        'Latte art isn\u2019t just decoration \u2014 a clean pour is evidence that your microfoam and your espresso are both good. The basics: start pouring from a height to let milk go under the crema, then drop the jug close to the surface to let the white foam surface and \u201Cpaint.\u201D Move the jug to push the pattern, and finish by cutting through with a thin stream. From these moves come the heart, the rosetta, and the tulip.',
        'For a working bar, consistency beats flourish. A customer would rather get the same tidy heart every time than an ambitious tulip half the time. Practice with water and dish soap to save milk, and remember that if your foam is wrong, no amount of wrist technique will save the pour \u2014 art starts at the steam wand.',
      ],
      quiz: [
        { q: 'A clean free-pour is evidence of:', options: ['Expensive cups', 'Good microfoam and espresso', 'Hot water', 'A new machine'], answer: 1, why: 'You can only pour art with well-textured milk and a proper shot.' },
        { q: 'You start a pour from height in order to:', options: ['Cool the drink', 'Let milk go under the crema', 'Make bubbles', 'Show off'], answer: 1, why: 'Pouring high sinks milk beneath the crema before you paint on top.' },
        { q: 'For a busy bar, the priority is:', options: ['Ambitious patterns', 'Consistency every time', 'The biggest design', 'Speed over foam'], answer: 1, why: 'A reliable tidy pour serves customers better than occasional flair.' },
      ],
    },
    {
      id: 'v3l7', num: '07', title: 'Pour-over fundamentals', minutes: 9,
      read: [
        'Pour-over (filter) brewing is espresso\u2019s opposite: gentle, slow, and revealing. The variables are grind (medium, like table salt), ratio (a common start is 60g coffee per litre of water, or ~15g to 250g for a single cup), water temperature (around 92\u201396\u00B0C), and pour technique. You begin with a \u201Cbloom\u201D \u2014 a small pour that wets the grounds and lets trapped CO\u2082 escape \u2014 then add the rest in stages.',
        'The goal is an even extraction: all the grounds in contact with water for a similar time. Pour in slow circles, keep the bed flat, and aim for a total brew time around 2.5\u20133.5 minutes for a single cup. Filter coffee is where origin character shines, so it\u2019s the best way to taste what a washed Ethiopian or a natural Colombian actually offers.',
      ],
      quiz: [
        { q: 'The \u201Cbloom\u201D in pour-over is:', options: ['The final pour', 'A first small pour to release CO\u2082', 'A latte art term', 'A grind setting'], answer: 1, why: 'Blooming wets the grounds and lets trapped gas escape for even extraction.' },
        { q: 'A typical pour-over water temperature is:', options: ['60\u00B0C', '75\u00B0C', '92\u201396\u00B0C', 'Boiling, 100\u00B0C+'], answer: 2, why: 'Around 92\u201396\u00B0C extracts well without scorching.' },
        { q: 'Pour-over is the best method to:', options: ['Hide defects', 'Show origin character', 'Make milk drinks', 'Brew fastest'], answer: 1, why: 'Its clean, gentle extraction reveals an origin\u2019s flavour.' },
      ],
    },
    {
      id: 'v3l8', num: '08', title: 'Batch brew and dispense', minutes: 7,
      read: [
        'Batch brew is the workhorse of a busy café \u2014 a machine brewing filter coffee by the litre. The same principles apply: a good ratio (around 55\u201365g per litre), correct grind, and water that actually reaches brew temperature. The advantage is speed and consistency at volume; the risk is staleness, because brewed coffee degrades fast.',
        'The rules of thumb: hold brewed batch no longer than about 30\u201360 minutes in a thermal server (never on a hot plate, which stews it), label the brew time, and taste before topping up a customer. A fresh, well-dialed batch can be excellent and is most of what many customers actually drink \u2014 so it deserves the same care as a pour-over, not neglect.',
      ],
      quiz: [
        { q: 'Brewed batch coffee should be held:', options: ['All day', 'About 30\u201360 minutes in a thermal server', 'On a hot plate indefinitely', 'Frozen'], answer: 1, why: 'Hold briefly in a thermal server; hot plates stew and spoil it.' },
        { q: 'A hot plate is bad for batch coffee because it:', options: ['Cools it', 'Stews and degrades it', 'Adds flavour', 'Saves power'], answer: 1, why: 'Continuous heat cooks brewed coffee into bitterness.' },
        { q: 'Batch brew deserves:', options: ['Neglect, it\u2019s cheap', 'The same care as pour-over', 'No dialing', 'Only decaf'], answer: 1, why: 'It\u2019s most of what many customers drink — dial and taste it properly.' },
      ],
    },
    {
      id: 'v3l9', num: '09', title: 'Service flow and pacing', minutes: 8,
      read: [
        'On a busy bar, craft has to coexist with speed. Good flow means sequencing tasks so nothing goes cold or stale: pull shots and steam milk so they meet fresh, group similar drinks, and keep the workspace clean as you go rather than in a panic later. Espresso waits for no one \u2014 a shot left sitting goes bitter in under a minute, so milk and shot should finish together.',
        'Pacing is also about the customer\u2019s experience of time. A warm acknowledgement at the till buys patience; a long silent wait feels longer than it is. Learn the rhythm of your café \u2014 the rush, the lull, the regulars \u2014 and you\u2019ll keep quality up without falling behind. Speed without quality is just fast bad coffee.',
      ],
      quiz: [
        { q: 'An espresso shot left standing:', options: ['Improves', 'Turns bitter within about a minute', 'Stays fine for an hour', 'Gets sweeter'], answer: 1, why: 'Espresso degrades fast — pair it with milk immediately.' },
        { q: 'Good service flow means:', options: ['Cleaning only at close', 'Sequencing tasks so drinks meet fresh', 'Making one drink at a time slowly', 'Ignoring the queue'], answer: 1, why: 'Sequencing keeps shots and milk fresh and the bar moving.' },
        { q: 'A warm acknowledgement at the till:', options: ['Wastes time', 'Buys customer patience', 'Slows service', 'Is unnecessary'], answer: 1, why: 'Being seen makes a wait feel shorter and service feel better.' },
      ],
    },
    {
      id: 'v3l10', num: '10', title: 'Allergen and dietary', minutes: 8,
      read: [
        'Behind the bar you\u2019re handling food, and that carries real responsibility. The big café allergens are dairy and, increasingly, the proteins in some plant milks (soy, nuts). Cross-contact is the hidden risk: the same steam wand, jug, or portafilter spout can transfer traces. For a customer with a genuine allergy, \u201Ca splash of normal milk\u201D isn\u2019t a small thing \u2014 it can be dangerous.',
        'The safe habits: ask, don\u2019t assume; use a clean or dedicated jug for allergen orders; wipe the wand between milks; and know which of your syrups and powders contain nuts, gluten, or dairy. If you\u2019re ever unsure, say so and check rather than guess. Knowing your menu\u2019s ingredients cold is part of the job, not an extra.',
      ],
      quiz: [
        { q: 'The hidden allergen risk on a bar is:', options: ['Too much foam', 'Cross-contact via shared jugs and wands', 'Cold milk', 'Slow service'], answer: 1, why: 'Traces transfer through shared equipment — cross-contact is the danger.' },
        { q: 'For a customer with a milk allergy you should:', options: ['Use the same jug, it\u2019s fine', 'Use a clean or dedicated jug and wipe the wand', 'Refuse service', 'Guess the ingredients'], answer: 1, why: 'Dedicated clean equipment prevents dangerous cross-contact.' },
        { q: 'If unsure whether a syrup contains an allergen:', options: ['Guess', 'Say so and check', 'Serve it anyway', 'Change the order silently'], answer: 1, why: 'Never guess with allergens — check and be honest.' },
      ],
    },
    {
      id: 'v3l11', num: '11', title: 'Calling out and recovery', minutes: 7,
      read: [
        'Clear communication keeps a bar from descending into chaos. \u201CCalling out\u201D \u2014 announcing drinks and steps out loud (\u201Ctwo flat whites, one oat\u201D) \u2014 keeps everyone synced, prevents remakes, and catches mistakes before they reach a customer. A good bar sounds like a kitchen: short, clear, repeated calls.',
        'Recovery is what you do when something still goes wrong, because it will. The move is simple and human: acknowledge it, fix it fast, and don\u2019t make the customer feel like a problem. A remade drink and a genuine \u201Csorry about that\u201D usually turns a misstep into goodwill. The worst recovery is a defensive one \u2014 own it, solve it, move on.',
      ],
      quiz: [
        { q: '\u201CCalling out\u201D drinks helps by:', options: ['Showing off', 'Keeping the team synced and catching errors', 'Slowing things down', 'Entertaining customers'], answer: 1, why: 'Spoken calls sync the team and prevent remakes and mistakes.' },
        { q: 'When a drink goes wrong, the best recovery is:', options: ['Blame the customer', 'Acknowledge, fix fast, stay gracious', 'Ignore it', 'Argue'], answer: 1, why: 'Owning it and fixing it quickly builds goodwill.' },
        { q: 'The worst kind of recovery is:', options: ['A quick remake', 'A genuine apology', 'A defensive one', 'A free drink'], answer: 2, why: 'Defensiveness makes the customer feel like the problem.' },
      ],
    },
    {
      id: 'v3l12', num: '12', title: 'Closing the bar', minutes: 8,
      read: [
        'How you close decides how the next shift opens. Espresso machines need a backflush with detergent to clear oils from the group heads, portafilters and baskets need a deep clean, and the grinder hopper should be wiped of oils that go rancid. Steam wands get purged and wiped, drip trays emptied, and the milk fridge cleaned and stocked. Coffee oils are the enemy of a clean cup.',
        'Beyond cleaning, a good close sets up tomorrow: note what beans are low, flag any equipment issues, and leave the dial-in information for the morning. A bar closed properly is a small gift to whoever opens \u2014 and a bar closed badly poisons the first hundred drinks of the next day with stale, rancid flavours. Closing well is part of the craft, not an afterthought.',
      ],
      quiz: [
        { q: 'Backflushing the espresso machine removes:', options: ['Limescale only', 'Coffee oils from the group heads', 'Milk', 'Water'], answer: 1, why: 'Backflushing with detergent clears rancid-prone oils from the group.' },
        { q: 'Old coffee oils left on equipment cause:', options: ['Better flavour', 'Rancid, stale-tasting drinks', 'Faster shots', 'Nothing'], answer: 1, why: 'Coffee oils go rancid and taint every later drink.' },
        { q: 'A good close also:', options: ['Ignores tomorrow', 'Flags low beans and equipment issues for the morning', 'Skips cleaning', 'Leaves milk out'], answer: 1, why: 'Setting up the next shift is part of closing well.' },
      ],
    },
  ],
  finalTest: {
    id: 'vol-3-final',
    title: 'Volume III \u2014 Bar certification test',
    passMark: 0.75,
    quiz: [
      { q: 'The single biggest lever on espresso quality is the:', options: ['Cup', 'Grinder', 'Tamper', 'Timer'], answer: 1, why: 'Grind size controls extraction more than anything else.' },
      { q: 'A sour, fast shot is:', options: ['Over-extracted', 'Under-extracted', 'Perfect', 'Too cold'], answer: 1, why: 'Sour and fast means under-extracted — grind finer.' },
      { q: 'Microfoam should look like:', options: ['Stiff peaks', 'Glossy wet paint', 'Big bubbles', 'Plain milk'], answer: 1, why: 'Fine, glossy, pourable foam is the target.' },
      { q: 'The pour-over \u201Cbloom\u201D exists to:', options: ['Cool the water', 'Release trapped CO\u2082 for even extraction', 'Add foam', 'Speed it up'], answer: 1, why: 'Blooming degasses the grounds for an even brew.' },
      { q: 'The hidden allergen danger is:', options: ['Cold milk', 'Cross-contact via shared equipment', 'Slow service', 'Latte art'], answer: 1, why: 'Traces transfer through shared jugs and wands.' },
      { q: 'Backflushing at close removes:', options: ['Limescale', 'Coffee oils from the group head', 'Milk residue only', 'Water'], answer: 1, why: 'It clears rancid-prone oils so the next day starts clean.' },
    ],
  },
};


// Assemble curriculum now that all three volumes are defined above
window.COPI_CURRICULUM = [window.COPI_VOL1, window.COPI_VOL2, window.COPI_VOL3].filter(Boolean);
// window.CopiStore / window.useCopiStore are set by src/store/copi-store.js (imported at top)



// ===== lesson-player.jsx =====
// ═════════════════════════════════════════════════════════
// LESSON PLAYER — the actual learning experience.
// Read the editorial explanation → take the multiple-choice
// check → see results. Passing marks the lesson done in
// CopiStore, which unlocks the next section. Also runs the
// end-of-module final test.
//
// target = { kind:'lesson', volId, lessonId } | { kind:'final', volId }
// ═════════════════════════════════════════════════════════

function LessonPlayer({ open, email, target, onClose }) {
  const _th = window.THEME || {};
  const _ty = window.TYPOGRAPHY || {};
  const p = { bg: _th.bg||'#EFE9DA', fg: _th.ink||'#1F1B14', accent: _th.accent||'#44704B', cream: _th.bgCard||'#FBF8F0', sun: _th.gold||'#C49455', cherry: _th.danger||'#7A2B1F', rule: _th.line||'#D5CDBA', muted: _th.muted||'#6E675A' };
  const display = _ty.displayItalic || { fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif', fontStyle: 'italic' };
  const sub = _ty.body || { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const sans = _ty.button || { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const lbl = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 10 };

  const store = window.CopiStore;
  const [phase, setPhase] = React.useState('read'); // read | quiz | result
  const [qIdx, setQIdx] = React.useState(0);
  const [selected, setSelected] = React.useState(null);
  const [revealed, setRevealed] = React.useState(false);
  const [answers, setAnswers] = React.useState([]);
  const [closing, setClosing] = React.useState(false);
  const scrollRef = React.useRef(null);

  // Resolve the target into a renderable unit.
  const unit = React.useMemo(() => {
    if (!target) return null;
    const v = store.volById(target.volId);
    if (!v) return null;
    if (target.kind === 'final') {
      return {
        isFinal: true, vol: v,
        eyebrow: `${v.vol} \u00B7 FINAL TEST`,
        title: v.finalTest.title,
        read: null,
        quiz: v.finalTest.quiz,
        passMark: v.finalTest.passMark || 0.7,
      };
    }
    const lesson = v.lessons.find((l) => l.id === target.lessonId);
    if (!lesson) return null;
    const idx = v.lessons.indexOf(lesson);
    return {
      isFinal: false, vol: v, lesson, idx,
      eyebrow: `${v.vol} \u00B7 LESSON ${lesson.num} \u00B7 ${lesson.minutes} MIN`,
      title: lesson.title,
      read: lesson.read,
      quiz: lesson.quiz,
      passMark: 0.6,
    };
  }, [target]);

  React.useEffect(() => {
    if (open) {
      setPhase('read'); setQIdx(0); setSelected(null); setRevealed(false); setAnswers([]); setClosing(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, target]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [phase, qIdx]);

  if ((!open && !closing) || !unit) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose && onClose(); }, 240);
  };

  const score = answers.filter((a, i) => a === unit.quiz[i].answer).length;
  const total = unit.quiz.length;
  const passed = total ? (score / total) >= unit.passMark : false;

  const startQuiz = () => { setPhase('quiz'); setQIdx(0); setSelected(null); setRevealed(false); setAnswers([]); };

  const reveal = () => { if (selected === null) return; setRevealed(true); };
  const nextQ = () => {
    const nextAnswers = [...answers]; nextAnswers[qIdx] = selected;
    setAnswers(nextAnswers);
    if (qIdx < total - 1) {
      setQIdx(qIdx + 1); setSelected(null); setRevealed(false);
    } else {
      // finalize
      const finalScore = nextAnswers.filter((a, i) => a === unit.quiz[i].answer).length;
      const didPass = (finalScore / total) >= unit.passMark;
      if (didPass) {
        if (unit.isFinal) store.completeFinal(email, unit.vol.id, finalScore, total);
        else store.completeLesson(email, unit.lesson.id, finalScore, total);
      }
      setPhase('result');
    }
  };

  const retry = () => { setPhase(unit.isFinal ? 'quiz' : 'read'); setQIdx(0); setSelected(null); setRevealed(false); setAnswers([]); };

  // what unlocks next, for the success message
  const nextUp = (() => {
    if (unit.isFinal) return { kind: 'cert', label: `${unit.vol.cert} \u2014 certified` };
    const nextLesson = unit.vol.lessons[unit.idx + 1];
    if (nextLesson) return { kind: 'lesson', label: `${unit.vol.vol} \u00B7 ${nextLesson.num} ${nextLesson.title}` };
    return { kind: 'final', label: `${unit.vol.vol} \u00B7 Final test` };
  })();

  // ── shared chrome ─────────────────────────────────────────
  const Shell = ({ children, footer }) => (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9500,
        background: 'rgba(26,20,16,0.62)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'grid', placeItems: 'center', padding: '24px',
        opacity: closing ? 0 : 1, transition: 'opacity 240ms ease',
      }}
    >
      <div style={{
        width: 'min(760px, 100%)', maxHeight: 'calc(100vh - 48px)',
        background: p.bg, border: `2px solid ${p.fg}`, borderRadius: 24,
        boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: closing ? 'translateY(10px) scale(0.985)' : 'translateY(0) scale(1)',
        opacity: closing ? 0 : 1,
        transition: 'transform 240ms cubic-bezier(.2,.7,.2,1), opacity 240ms ease',
      }}>
        {/* top bar */}
        <div style={{
          flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', borderBottom: `1.5px solid ${p.fg}`, background: p.cream,
        }}>
          <span style={{ ...lbl, opacity: 0.8 }}>{unit.eyebrow}</span>
          <button onClick={handleClose} style={{ ...lbl, color: p.fg, opacity: 0.7, cursor: 'pointer', background: 'none', border: 'none' }}>
            CLOSE ✕
          </button>
        </div>
        {/* scroll body */}
        <div ref={scrollRef} style={{ flex: '1 1 auto', overflowY: 'auto' }}>{children}</div>
        {/* footer */}
        {footer && (
          <div style={{
            flex: '0 0 auto', padding: '18px 24px', borderTop: `1.5px solid ${p.fg}`,
            background: p.cream, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          }}>{footer}</div>
        )}
      </div>
    </div>
  );

  const primaryBtn = (labelText, onClick, enabled = true) => (
    <button
      onClick={onClick} disabled={!enabled}
      style={{
        ...sans, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
        background: enabled ? p.accent : `${p.fg}35`, color: p.cream,
        padding: '14px 26px', border: 'none', borderRadius: 999,
        cursor: enabled ? 'pointer' : 'not-allowed',
        display: 'inline-flex', alignItems: 'center', gap: 10,
        transition: 'background 160ms ease',
      }}
    >{labelText}</button>
  );

  // ── READING PHASE ─────────────────────────────────────────
  if (phase === 'read') {
    return (
      <Shell footer={
        <React.Fragment>
          <span style={{ ...sans, fontSize: 12, opacity: 0.6 }}>
            Read through, then take the {total}-question check.
          </span>
          {primaryBtn(<React.Fragment>Begin the check &rarr;</React.Fragment>, startQuiz)}
        </React.Fragment>
      }>
        <div style={{ padding: '44px 56px 40px', maxWidth: 680, margin: '0 auto' }}>
          <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>◆ {unit.vol.name.toUpperCase()}</div>
          <h1 style={{ ...display, fontSize: 58, lineHeight: 0.98, letterSpacing: '-0.03em', fontWeight: 400, margin: '0 0 28px' }}>
            {unit.title}.
          </h1>
          {unit.read.map((para, i) => (
            <p key={i} style={{
              ...sub, fontSize: 21, lineHeight: 1.62, fontWeight: 400, color: p.fg,
              margin: '0 0 22px', textWrap: 'pretty',
            }}>{para}</p>
          ))}
          <div style={{
            marginTop: 32, padding: '18px 22px', borderRadius: 16,
            background: p.cream, border: `1.5px solid ${p.fg}20`,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%', flex: '0 0 auto',
              background: p.sun, display: 'grid', placeItems: 'center', border: `1.5px solid ${p.fg}`,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
            </div>
            <div style={{ ...sans, fontSize: 13.5, lineHeight: 1.4, opacity: 0.8 }}>
              A quick check of {total} questions follows. Score {Math.ceil(unit.passMark * total)}/{total} or better to {unit.isFinal ? 'earn the certification' : 'complete this lesson and unlock the next'}.
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  // ── QUIZ PHASE ────────────────────────────────────────────
  if (phase === 'quiz') {
    const q = unit.quiz[qIdx];
    return (
      <Shell footer={
        <React.Fragment>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {unit.quiz.map((_, i) => (
              <span key={i} style={{
                width: i === qIdx ? 24 : 8, height: 8, borderRadius: 99,
                background: i < qIdx ? p.accent : i === qIdx ? p.sun : `${p.fg}25`,
                transition: 'all 220ms ease',
              }} />
            ))}
          </div>
          {!revealed
            ? primaryBtn('Check', reveal, selected !== null)
            : primaryBtn(qIdx < total - 1 ? <React.Fragment>Next &rarr;</React.Fragment> : 'See results', nextQ)}
        </React.Fragment>
      }>
        <div style={{ padding: '44px 56px 40px', maxWidth: 680, margin: '0 auto' }}>
          <div style={{ ...lbl, color: p.accent, marginBottom: 20 }}>QUESTION {qIdx + 1} OF {total}</div>
          <h2 style={{ ...display, fontSize: 40, lineHeight: 1.08, letterSpacing: '-0.02em', fontWeight: 400, margin: '0 0 30px' }}>
            {q.q}
          </h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {q.options.map((opt, i) => {
              const isSel = selected === i;
              const isAnswer = i === q.answer;
              let border = `1.5px solid ${p.fg}25`;
              let bg = p.cream;
              let mark = null;
              if (revealed) {
                if (isAnswer) { border = `2px solid ${p.accent}`; bg = 'rgba(63,90,58,0.12)'; mark = '\u2713'; }
                else if (isSel) { border = `2px solid ${p.cherry}`; bg = 'rgba(122,43,31,0.10)'; mark = '\u2715'; }
              } else if (isSel) { border = `2px solid ${p.fg}`; bg = p.cream; }
              return (
                <button
                  key={i}
                  onClick={() => { if (!revealed) setSelected(i); }}
                  disabled={revealed}
                  style={{
                    textAlign: 'left', cursor: revealed ? 'default' : 'pointer',
                    background: bg, border, borderRadius: 14, padding: '16px 18px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    transition: 'border 140ms ease, background 140ms ease',
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', flex: '0 0 auto',
                    border: `1.5px solid ${p.fg}`,
                    background: revealed && isAnswer ? p.accent : revealed && isSel ? p.cherry : 'transparent',
                    color: (revealed && (isAnswer || isSel)) ? p.cream : p.fg,
                    display: 'grid', placeItems: 'center',
                    ...sans, fontSize: 13, fontWeight: 700,
                  }}>{mark || String.fromCharCode(65 + i)}</span>
                  <span style={{ ...sub, fontSize: 19, fontWeight: 400, lineHeight: 1.3 }}>{opt}</span>
                </button>
              );
            })}
          </div>
          {revealed && (
            <div style={{
              marginTop: 22, padding: '16px 20px', borderRadius: 14,
              background: selected === q.answer ? 'rgba(63,90,58,0.10)' : 'rgba(198,138,61,0.12)',
              border: `1.5px solid ${selected === q.answer ? p.accent : p.sun}`,
            }}>
              <div style={{ ...lbl, fontSize: 9, color: selected === q.answer ? p.accent : p.sun, marginBottom: 6 }}>
                {selected === q.answer ? '\u25C6 CORRECT' : '\u25C6 NOT QUITE'}
              </div>
              <div style={{ ...sub, fontSize: 17, lineHeight: 1.45, fontWeight: 400 }}>{q.why}</div>
            </div>
          )}
        </div>
      </Shell>
    );
  }

  // ── RESULT PHASE ──────────────────────────────────────────
  const pct = Math.round((score / total) * 100);
  return (
    <Shell footer={
      <React.Fragment>
        <span style={{ ...sans, fontSize: 12, opacity: 0.6 }}>
          {passed ? 'Progress saved.' : 'Nothing saved — give it another go.'}
        </span>
        <div style={{ display: 'flex', gap: 10 }}>
          {!passed && (
            <button onClick={retry} style={{
              ...sans, fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
              background: 'transparent', color: p.fg, padding: '14px 22px',
              border: `1.5px solid ${p.fg}`, borderRadius: 999, cursor: 'pointer',
            }}>Try again</button>
          )}
          {primaryBtn(passed ? <React.Fragment>Continue &rarr;</React.Fragment> : 'Back to lesson', passed ? handleClose : retry)}
        </div>
      </React.Fragment>
    }>
      <div style={{ padding: '52px 56px 44px', maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ ...lbl, color: passed ? p.accent : p.cherry, marginBottom: 22 }}>
          {passed ? (unit.isFinal ? '\u25C6 CERTIFICATION EARNED' : '\u25C6 LESSON COMPLETE') : '\u25C6 NOT PASSED YET'}
        </div>

        {/* score ring */}
        <div style={{ position: 'relative', width: 150, height: 150, margin: '0 auto 28px' }}>
          <svg width="150" height="150" viewBox="0 0 150 150">
            <circle cx="75" cy="75" r="64" fill="none" stroke={`${p.fg}18`} strokeWidth="12" />
            <circle cx="75" cy="75" r="64" fill="none" stroke={passed ? p.accent : p.cherry} strokeWidth="12" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 64} strokeDashoffset={2 * Math.PI * 64 * (1 - pct / 100)}
              transform="rotate(-90 75 75)" style={{ transition: 'stroke-dashoffset 600ms ease' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            <div style={{ ...display, fontStyle: 'italic', fontSize: 46, color: passed ? p.accent : p.cherry, fontWeight: 400, lineHeight: 1 }}>
              {score}/{total}
            </div>
          </div>
        </div>

        <h1 style={{ ...display, fontSize: 50, lineHeight: 1.0, letterSpacing: '-0.025em', fontWeight: 400, margin: '0 0 14px' }}>
          {passed
            ? (unit.isFinal ? <React.Fragment>You&rsquo;re <em style={{ fontStyle: 'italic', color: p.accent }}>certified.</em></React.Fragment> : <React.Fragment>Nicely <em style={{ fontStyle: 'italic', color: p.accent }}>done.</em></React.Fragment>)
            : <React.Fragment>So <em style={{ fontStyle: 'italic', color: p.cherry }}>close.</em></React.Fragment>}
        </h1>
        <p style={{ ...sub, fontSize: 20, lineHeight: 1.45, opacity: 0.78, fontWeight: 400, margin: '0 auto', maxWidth: 440 }}>
          {passed
            ? (unit.isFinal
              ? `You\u2019ve completed ${unit.vol.name} and earned the ${unit.vol.cert} certification. Your manager can see it on the team board.`
              : `You scored ${pct}% on the check. The next section is now unlocked.`)
            : `You need ${Math.ceil(unit.passMark * total)} of ${total} to pass. Have another look at the lesson and try the check again — no penalty.`}
        </p>

        {passed && (
          <div style={{
            marginTop: 30, padding: '18px 22px', borderRadius: 16,
            background: p.cream, border: `1.5px solid ${p.fg}20`,
            display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', flex: '0 0 auto',
              background: nextUp.kind === 'cert' ? p.sun : p.accent,
              display: 'grid', placeItems: 'center', border: `1.5px solid ${p.fg}`,
            }}>
              {nextUp.kind === 'cert'
                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="2"><circle cx="12" cy="8" r="6" /><path d="M9 13l-2 8 5-3 5 3-2-8" /></svg>
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p.cream} strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>}
            </div>
            <div>
              <div style={{ ...lbl, fontSize: 9, opacity: 0.55, marginBottom: 4 }}>
                {nextUp.kind === 'cert' ? 'NOW CERTIFIED' : 'UNLOCKED NEXT'}
              </div>
              <div style={{ ...sub, fontSize: 19, fontWeight: 500 }}>{nextUp.label}</div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

window.LessonPlayer = LessonPlayer;


// ===== assign-modal.jsx =====
// ═════════════════════════════════════════════════════════
// ASSIGN MODAL — admin assigns a volume to selected baristas.
// Writes straight to CopiStore; the barista's Today view and
// the analytics rollup update the moment it closes.
// ═════════════════════════════════════════════════════════

function AssignModal({ open, volId, onClose }) {
  const _th = window.THEME || {};
  const _ty = window.TYPOGRAPHY || {};
  const p = { bg: _th.bg||'#EFE9DA', fg: _th.ink||'#1F1B14', accent: _th.accent||'#44704B', cream: _th.bgCard||'#FBF8F0', sun: _th.gold||'#C49455', cherry: _th.danger||'#7A2B1F', rule: _th.line||'#D5CDBA', muted: _th.muted||'#6E675A' };
  const display = _ty.displayItalic || { fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif', fontStyle: 'italic' };
  const sub = _ty.body || { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const sans = _ty.button || { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const lbl = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };

  const store = window.CopiStore;
  const vol = volId ? store.volById(volId) : null;

  const [selected, setSelected] = React.useState(() => new Set());
  const [closing, setClosing] = React.useState(false);
  const [done, setDone] = React.useState(0); // count assigned, >0 shows success

  React.useEffect(() => {
    if (open && vol) {
      // Pre-check those already assigned.
      const pre = new Set(store.assignedEmails(vol.id));
      setSelected(pre);
      setDone(0); setClosing(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, volId]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if ((!open && !closing) || !vol) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose && onClose(); }, 220);
  };

  const alreadyAssigned = new Set(store.assignedEmails(vol.id));
  const toggle = (email) => {
    const next = new Set(selected);
    if (next.has(email)) next.delete(email); else next.add(email);
    setSelected(next);
  };
  const allChecked = store.team.every((t) => selected.has(t.email));
  const toggleAll = () => {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(store.team.map((t) => t.email)));
  };

  const newlyAdded = store.team.filter((t) => selected.has(t.email) && !alreadyAssigned.has(t.email));

  const commit = () => {
    // additions
    const toAdd = store.team.filter((t) => selected.has(t.email) && !alreadyAssigned.has(t.email)).map((t) => t.email);
    const toRemove = store.team.filter((t) => !selected.has(t.email) && alreadyAssigned.has(t.email)).map((t) => t.email);
    if (toRemove.length) store.unassignVolume(vol.id, toRemove);
    if (toAdd.length) store.assignVolume(vol.id, toAdd);
    setDone(toAdd.length || -1); // -1 = saved with no new adds
  };

  const Mono = ({ name, size = 36 }) => {
    const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: p.accent, color: p.cream,
        border: `1px solid ${p.fg}`, display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.36, fontWeight: 700, letterSpacing: '0.04em', flex: '0 0 auto',
      }}>{initials}</div>
    );
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9200,
        background: 'rgba(26,20,16,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'grid', placeItems: 'center', padding: 24,
        opacity: closing ? 0 : 1, transition: 'opacity 220ms ease',
      }}
    >
      <div style={{
        width: 'min(620px, 100%)', maxHeight: 'calc(100vh - 48px)',
        background: p.cream, border: `1.5px solid ${p.fg}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: closing ? 'translateY(8px) scale(0.98)' : 'translateY(0) scale(1)',
        opacity: closing ? 0 : 1,
        transition: 'transform 220ms cubic-bezier(.2,.7,.2,1), opacity 220ms ease',
      }}>
        {/* top bar */}
        <div style={{
          flex: '0 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 24px', borderBottom: `1px solid ${p.fg}30`, ...lbl, opacity: 0.8,
        }}>
          <span>◆ ASSIGN · {vol.vol}</span>
          <button onClick={handleClose} style={{ ...lbl, color: p.fg, opacity: 0.7, cursor: 'pointer', background: 'none', border: 'none' }}>ESC ✕</button>
        </div>

        {done !== 0 ? (
          <div style={{ padding: '52px 44px', textAlign: 'center' }}>
            <div style={{ ...lbl, color: p.accent, marginBottom: 16 }}>◆ ASSIGNED</div>
            <h2 style={{ ...display, fontSize: 52, lineHeight: 0.98, letterSpacing: '-0.025em', fontWeight: 400, margin: '0 0 14px' }}>
              {vol.name} is <em style={{ fontStyle: 'italic', color: p.accent }}>out.</em>
            </h2>
            <p style={{ ...sub, fontSize: 20, lineHeight: 1.45, opacity: 0.8, fontWeight: 400, maxWidth: 420, margin: '0 auto' }}>
              {done > 0
                ? `${done} barista${done > 1 ? 's' : ''} just got ${vol.vol}. It shows up on their Today view, and their progress will land here as they go.`
                : `Saved. ${vol.vol} assignments are up to date.`}
            </p>
            <button onClick={handleClose} style={{
              marginTop: 30, ...sans, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              background: p.accent, color: p.cream, padding: '14px 26px', border: 'none', cursor: 'pointer',
            }}>Done</button>
          </div>
        ) : (
          <React.Fragment>
            <div style={{ flex: '0 0 auto', padding: '28px 32px 18px' }}>
              <h2 style={{ ...display, fontSize: 40, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: '0 0 8px' }}>
                Assign <em style={{ fontStyle: 'italic', color: p.accent }}>{vol.name}</em>
              </h2>
              <p style={{ ...sub, fontSize: 17, lineHeight: 1.4, opacity: 0.72, fontWeight: 400, margin: 0 }}>
                {vol.lessons.length} lessons · ends in a final test · earns {vol.cert}. Pick who should take it.
              </p>
            </div>

            <div style={{ flex: '0 0 auto', padding: '0 32px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ ...lbl, opacity: 0.6 }}>{selected.size} OF {store.team.length} SELECTED</span>
              <button onClick={toggleAll} style={{
                ...lbl, color: p.accent, cursor: 'pointer', background: 'none', border: 'none', padding: 4,
              }}>{allChecked ? 'CLEAR ALL' : 'SELECT ALL'}</button>
            </div>

            <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: '0 32px', borderTop: `1px solid ${p.fg}20` }}>
              {store.team.map((t, i) => {
                const checked = selected.has(t.email);
                const was = alreadyAssigned.has(t.email);
                const vs = store.volumeStats(t.email, vol.id);
                return (
                  <button
                    key={t.email}
                    onClick={() => toggle(t.email)}
                    style={{
                      width: '100%', textAlign: 'left', cursor: 'pointer',
                      display: 'grid', gridTemplateColumns: '24px 36px 1fr auto', gap: 14, alignItems: 'center',
                      padding: '16px 4px', background: 'transparent',
                      border: 'none', borderBottom: i < store.team.length - 1 ? `1px dashed ${p.fg}20` : 'none',
                    }}
                  >
                    <span style={{
                      width: 22, height: 22, borderRadius: 5, border: `1.5px solid ${p.fg}`,
                      background: checked ? p.accent : 'transparent',
                      display: 'grid', placeItems: 'center', flex: '0 0 auto',
                    }}>
                      {checked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.cream} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>}
                    </span>
                    <Mono name={t.name} />
                    <div>
                      <div style={{ ...sub, fontSize: 18, fontWeight: 500, lineHeight: 1.1 }}>{t.name}</div>
                      <div style={{ ...lbl, fontSize: 8.5, opacity: 0.5, marginTop: 3 }}>{t.role.toUpperCase()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {was ? (
                        <span style={{ ...lbl, fontSize: 8.5, color: p.accent }}>
                          {vs.certified ? '\u25C6 CERTIFIED' : vs.done > 0 ? `${vs.done}/${vs.total} DONE` : 'ASSIGNED'}
                        </span>
                      ) : (
                        <span style={{ ...lbl, fontSize: 8.5, opacity: 0.4 }}>NOT ASSIGNED</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{
              flex: '0 0 auto', padding: '18px 24px', borderTop: `1.5px solid ${p.fg}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            }}>
              <button onClick={handleClose} style={{
                ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                background: 'transparent', color: p.fg, padding: '13px 20px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
              }}>Cancel</button>
              <button
                onClick={commit}
                style={{
                  ...sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  background: p.accent, color: p.cream, padding: '13px 24px', border: 'none', cursor: 'pointer',
                }}
              >
                {newlyAdded.length > 0
                  ? `Assign to ${newlyAdded.length} barista${newlyAdded.length > 1 ? 's' : ''} \u2192`
                  : 'Save assignments \u2192'}
              </button>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

window.AssignModal = AssignModal;


// ===== barista-detail-modal.jsx =====
// ═════════════════════════════════════════════════════════
// BARISTA DETAIL — the manager's per-person view. Opens from
// the Team table, Analytics, or the dashboard. Reads CopiStore:
// volume-by-volume progress, every quiz score, certifications,
// and a clear "what to coach next." Unassigned volumes can be
// assigned right here.
//
// Opened via window.CopiActions.openBarista(email).
// ═════════════════════════════════════════════════════════

function BaristaDetailModal({ open, email, onClose }) {
  const _th = window.THEME || {};
  const _ty = window.TYPOGRAPHY || {};
  const p = { bg: _th.bg||'#EFE9DA', fg: _th.ink||'#1F1B14', accent: _th.accent||'#44704B', cream: _th.bgCard||'#FBF8F0', sun: _th.gold||'#C49455', cherry: _th.danger||'#7A2B1F', rule: _th.line||'#D5CDBA', muted: _th.muted||'#6E675A' };
  const display = _ty.displayItalic || { fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif', fontStyle: 'italic' };
  const sub = _ty.body || { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const sans = _ty.button || { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const lbl = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };
  const mono = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontVariantNumeric: 'tabular-nums' };

  const store = window.useCopiStore();
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    if (open) { setClosing(false); document.body.style.overflow = 'hidden'; }
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if ((!open && !closing) || !email) return null;
  const person = store.team.find((t) => t.email === email);
  if (!person) return null;

  const handleClose = () => { setClosing(true); setTimeout(() => { setClosing(false); onClose && onClose(); }, 220); };

  const pct = Math.round(store.overallPct(email) * 100);
  const snap = store.teamSnapshot().find((t) => t.email === email) || {};
  const cert = snap.cert || '—';

  // last active
  const _dbU1 = store.getUserByEmail ? store.getUserByEmail(email) : null;
  const _prog1 = _dbU1 ? (store.raw().progress[_dbU1.id] || {}) : {};
  const u = { lessons: _prog1.lessons || {}, finals: _prog1.finals || {} };
  let lastTs = 0;
  Object.values(u.lessons).forEach((r) => { if (r.ts > lastTs) lastTs = r.ts; });
  Object.values(u.finals || {}).forEach((r) => { if (r.ts > lastTs) lastTs = r.ts; });
  const relTime = (ts) => {
    if (!ts) return 'no activity yet';
    const s = (Date.now() - ts) / 1000;
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + 'm ago';
    if (s < 86400) return Math.round(s / 3600) + 'h ago';
    const d = Math.round(s / 86400);
    return d <= 1 ? 'yesterday' : d + ' days ago';
  };

  const current = store.currentLesson(email);

  // weakest completed lesson (lowest score ratio)
  let weakest = null;
  Object.entries(u.lessons).forEach(([lid, r]) => {
    if (!r.done) return;
    const ratio = r.score / r.total;
    if (!weakest || ratio < weakest.ratio) {
      const found = store.lessonById(lid);
      if (found) weakest = { ratio, score: r.score, total: r.total, ...found };
    }
  });
  if (weakest && weakest.ratio === 1) weakest = null; // only flag if they actually missed something

  const Mono = ({ size = 64 }) => {
    const initials = person.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: pct < 35 ? p.cherry : p.accent, color: p.cream,
        border: `1.5px solid ${p.fg}`, display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.36, fontWeight: 700, letterSpacing: '0.04em', flex: '0 0 auto',
      }}>{initials}</div>
    );
  };

  const Bar = ({ value, color = p.accent, height = 8 }) => (
    <div style={{ width: '100%', height, background: `${p.fg}15`, border: `1px solid ${p.fg}30`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: `${Math.round(value * 100)}%`, height: '100%', background: color }} />
    </div>
  );

  const act = window.CopiActions || {};

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9300,
        background: 'rgba(26,20,16,0.58)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'grid', placeItems: 'center', padding: 24,
        opacity: closing ? 0 : 1, transition: 'opacity 220ms ease',
      }}
    >
      <div style={{
        width: 'min(760px, 100%)', maxHeight: 'calc(100vh - 48px)',
        background: p.bg, border: `1.5px solid ${p.fg}`, boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: closing ? 'translateY(8px) scale(0.985)' : 'translateY(0) scale(1)',
        opacity: closing ? 0 : 1,
        transition: 'transform 220ms cubic-bezier(.2,.7,.2,1), opacity 220ms ease',
      }}>
        {/* top bar */}
        <div style={{
          flex: '0 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 24px', borderBottom: `1px solid ${p.fg}30`, background: p.cream, ...lbl, opacity: 0.85,
        }}>
          <span>◆ BARISTA · {person.role.toUpperCase()}</span>
          <button onClick={handleClose} style={{ ...lbl, color: p.fg, opacity: 0.7, cursor: 'pointer', background: 'none', border: 'none' }}>ESC ✕</button>
        </div>

        <div style={{ flex: '1 1 auto', overflowY: 'auto' }}>
          {/* header */}
          <div style={{
            padding: '32px 32px', borderBottom: `1.5px solid ${p.fg}`, background: p.cream,
            display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center',
          }}>
            <Mono size={72} />
            <div>
              <h2 style={{ ...display, fontSize: 48, lineHeight: 0.98, letterSpacing: '-0.025em', fontWeight: 400, margin: 0 }}>{person.name}</h2>
              <div style={{ ...sans, fontSize: 13, opacity: 0.65, marginTop: 6 }}>
                {person.email} · joined {person.joined}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{ ...lbl, fontSize: 9, padding: '5px 10px', background: cert === '—' ? 'transparent' : p.accent, color: cert === '—' ? p.fg : p.cream, border: cert === '—' ? `1px solid ${p.fg}40` : 'none' }}>
                  {cert === '—' ? 'NO CERT YET' : `◆ ${cert.toUpperCase()}`}
                </span>
                <span style={{ ...lbl, fontSize: 9, padding: '5px 10px', border: `1px solid ${p.fg}40`, opacity: 0.7 }}>
                  ACTIVE {relTime(lastTs).toUpperCase()}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ ...display, fontStyle: 'italic', fontSize: 60, lineHeight: 1, color: pct < 35 ? p.cherry : p.accent, fontWeight: 400, ...mono }}>{pct}%</div>
              <div style={{ ...lbl, fontSize: 8.5, opacity: 0.55, marginTop: 2 }}>OVERALL</div>
            </div>
          </div>

          {/* what to coach next */}
          <div style={{ padding: '26px 32px', borderBottom: `1px solid ${p.fg}20`, background: 'rgba(63,90,58,0.06)' }}>
            <div style={{ ...lbl, color: p.accent, marginBottom: 12 }}>◆ WHAT TO WORK ON NEXT</div>
            <div style={{ display: 'grid', gridTemplateColumns: weakest ? '1fr 1fr' : '1fr', gap: 20 }}>
              <div>
                <div style={{ ...lbl, fontSize: 8.5, opacity: 0.55, marginBottom: 6 }}>UP NEXT</div>
                <div style={{ ...sub, fontSize: 20, fontWeight: 500, lineHeight: 1.2 }}>
                  {current
                    ? (current.isFinal ? `${current.vol.vol} · Final test (${current.vol.cert})` : `${current.vol.vol} · ${current.lesson.title}`)
                    : 'All assigned volumes complete.'}
                </div>
              </div>
              {weakest && (
                <div>
                  <div style={{ ...lbl, fontSize: 8.5, opacity: 0.55, marginBottom: 6 }}>WEAKEST CHECK</div>
                  <div style={{ ...sub, fontSize: 20, fontWeight: 500, lineHeight: 1.2 }}>
                    {weakest.lesson.title} <span style={{ ...mono, color: p.cherry, fontWeight: 700, fontSize: 16 }}>{weakest.score}/{weakest.total}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* volumes */}
          <div style={{ padding: '28px 32px 36px' }}>
            <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>◆ VOLUME BY VOLUME</div>
            <div style={{ display: 'grid', gap: 16 }}>
              {store.curriculum.map((v) => {
                const assigned = store.isAssigned(email, v.id);
                const vs = store.volumeStats(email, v.id);
                const fstat = store.finalStatus(email, v.id);
                return (
                  <div key={v.id} style={{ border: `1.5px solid ${p.fg}`, background: p.cream }}>
                    {/* vol header */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, alignItems: 'center', padding: '16px 20px', borderBottom: assigned ? `1px solid ${p.fg}20` : 'none' }}>
                      <div style={{ ...display, fontStyle: 'italic', fontSize: 34, color: p.accent, ...mono, lineHeight: 1 }}>{v.num}</div>
                      <div>
                        <div style={{ ...display, fontSize: 24, lineHeight: 1.05, fontWeight: 400, letterSpacing: '-0.015em' }}>{v.name}</div>
                        <div style={{ ...lbl, fontSize: 8.5, opacity: 0.55, marginTop: 4 }}>{v.vol} · {v.cert.toUpperCase()}</div>
                      </div>
                      {assigned ? (
                        <div style={{ textAlign: 'right', minWidth: 120 }}>
                          <Bar value={vs.total ? vs.done / vs.total : 0} color={vs.certified ? p.accent : p.sun} />
                          <div style={{ ...lbl, fontSize: 8.5, opacity: 0.6, marginTop: 6 }}>
                            {vs.certified ? '◆ CERTIFIED' : `${vs.done}/${vs.total} LESSONS`}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => act.openAssign && act.openAssign(v.id)}
                          style={{ ...sans, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: p.fg, color: p.cream, padding: '9px 14px', border: 'none', cursor: 'pointer' }}
                        >Assign →</button>
                      )}
                    </div>

                    {/* lessons */}
                    {assigned && (
                      <div style={{ padding: '6px 20px 14px' }}>
                        {v.lessons.map((lesson, i) => {
                          const st = store.lessonStatus(email, v.id, i);
                          const rec = store.lessonRecord(email, lesson.id);
                          const dot = st === 'done' ? p.accent : st === 'current' ? p.sun : `${p.fg}25`;
                          return (
                            <div key={lesson.id} style={{ display: 'grid', gridTemplateColumns: '16px 1fr auto', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: `1px dashed ${p.fg}15` }}>
                              <span style={{ width: 10, height: 10, borderRadius: '50%', background: dot }} />
                              <span style={{ ...sans, fontSize: 13.5, opacity: st === 'locked' ? 0.45 : 0.9 }}>
                                <span style={{ ...mono, opacity: 0.5, marginRight: 8 }}>{lesson.num}</span>{lesson.title}
                              </span>
                              <span style={{ ...mono, fontSize: 12, fontWeight: 700, color: rec ? (rec.score === rec.total ? p.accent : p.sun) : `${p.fg}40` }}>
                                {rec ? `${rec.score}/${rec.total}` : st === 'current' ? 'NEXT' : '—'}
                              </span>
                            </div>
                          );
                        })}
                        {/* final */}
                        <div style={{ display: 'grid', gridTemplateColumns: '16px 1fr auto', gap: 12, alignItems: 'center', padding: '10px 0 2px' }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: fstat === 'done' ? p.accent : fstat === 'current' ? p.sun : `${p.fg}25` }} />
                          <span style={{ ...sub, fontSize: 15, fontWeight: 500, opacity: fstat === 'locked' ? 0.5 : 1 }}>Final test — {v.cert}</span>
                          <span style={{ ...lbl, fontSize: 8.5, color: fstat === 'done' ? p.accent : fstat === 'current' ? p.sun : `${p.fg}50` }}>
                            {fstat === 'done' ? 'PASSED' : fstat === 'current' ? 'READY' : 'LOCKED'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* footer */}
        <div style={{ flex: '0 0 auto', padding: '16px 24px', borderTop: `1.5px solid ${p.fg}`, background: p.cream, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={handleClose} style={{ ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'transparent', color: p.fg, padding: '12px 20px', border: `1.5px solid ${p.fg}`, cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

window.BaristaDetailModal = BaristaDetailModal;


// ===== pour-over-illustration.jsx =====
// Vintage technical-illustration of a pour-over brewing setup
// Single-ink line drawing, callout annotations — like a field manual figure.
// Reusable across templates that want the same hero.
function PourOver({
  size = 540,
  ink = '#1A1410',
  paper = '#F4EBD2',
  brew = '#1A1410',
  spark = null // optional warm accent (set to a hex for T4 cherry); null for plain
}) {
  const w = size;
  const h = 600;
  const cx = w / 2;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}
    style={{ filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.12))' }}>

      {/* FIG label — top right */}
      <g transform={`translate(${w - 140}, 28)`}>
        <text style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.28em', fill: ink, opacity: 0.6 }}>
          FIG. I
        </text>
        <text y="18" style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontStyle: 'italic', fontSize: 16, fill: ink }}>
          The pour-over
        </text>
        <line x1="0" y1="26" x2="110" y2="26" stroke={ink} strokeWidth="0.6" opacity="0.5" />
      </g>

      {/* Counter line (twin rule, almanac-style) */}
      <line x1="40" y1="540" x2={w - 40} y2="540" stroke={ink} strokeWidth="1.2" />
      <line x1="40" y1="546" x2={w - 40} y2="546" stroke={ink} strokeWidth="0.4" opacity="0.5" />

      {/* Scale */}
      <rect x={cx - 110} y="510" width="220" height="30" fill={paper} stroke={ink} strokeWidth="1.3" />
      <rect x={cx + 50} y="518" width="50" height="14" fill="none" stroke={ink} strokeWidth="0.6" opacity="0.7" />
      <text x={cx + 75} y="530" textAnchor="middle"
      style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', fill: ink, fontVariantNumeric: 'tabular-nums' }}>
        324 g
      </text>
      {/* scale platform line */}
      <line x1={cx - 95} y1="510" x2={cx + 30} y2="510" stroke={ink} strokeWidth="0.5" opacity="0.4" />

      {/* Carafe / server — glass cylinder, slightly tapered, with handle */}
      <path d={`
        M ${cx - 72} 380
        L ${cx - 78} 495
        Q ${cx - 78} 510 ${cx - 60} 510
        L ${cx + 60} 510
        Q ${cx + 78} 510 ${cx + 78} 495
        L ${cx + 72} 380
        Z
      `} fill={paper} stroke={ink} strokeWidth="1.3" />
      {/* carafe top rim */}
      <ellipse cx={cx} cy="380" rx="72" ry="7" fill={paper} stroke={ink} strokeWidth="1.3" />
      <ellipse cx={cx} cy="380" rx="64" ry="4" fill="none" stroke={ink} strokeWidth="0.5" opacity="0.5" />

      {/* coffee fill inside carafe */}
      <path d={`
        M ${cx - 76} 455
        L ${cx - 78} 495
        Q ${cx - 78} 510 ${cx - 60} 510
        L ${cx + 60} 510
        Q ${cx + 78} 510 ${cx + 78} 495
        L ${cx + 76} 455
        Z
      `} fill={brew} opacity="0.85" />
      <ellipse cx={cx} cy="455" rx="77" ry="4.5" fill={brew} opacity="0.85" />

      {/* carafe handle */}
      <path d={`M ${cx + 76} 405 Q ${cx + 112} 415 ${cx + 110} 445 Q ${cx + 108} 470 ${cx + 78} 472`}
      fill="none" stroke={ink} strokeWidth="1.3" />

      {/* ── DRIPPER ── */}
      {/* V60 cone outline */}
      <path d={`
        M ${cx - 100} 246
        L ${cx - 22} 372
        L ${cx + 22} 372
        L ${cx + 100} 246
        Z
      `} fill={paper} stroke={ink} strokeWidth="1.4" />
      {/* top rim */}
      <ellipse cx={cx} cy="246" rx="100" ry="9" fill={paper} stroke={ink} strokeWidth="1.4" />
      <ellipse cx={cx} cy="246" rx="92" ry="5" fill="none" stroke={ink} strokeWidth="0.5" opacity="0.5" />
      {/* spiral ridges hint */}
      {[0.18, 0.36, 0.54, 0.72].map((t, i) => {
        const y = 246 + (372 - 246) * t;
        const rx = 100 - (100 - 22) * t;
        return <ellipse key={i} cx={cx} cy={y} rx={rx} ry={rx * 0.08}
        fill="none" stroke={ink} strokeWidth="0.4" opacity="0.45" />;
      })}
      {/* handle */}
      <path d={`M ${cx + 95} 260 Q ${cx + 125} 274 ${cx + 122} 300 Q ${cx + 116} 315 ${cx + 84} 318`}
      fill="none" stroke={ink} strokeWidth="1.3" />
      {/* filter paper edge (interior, lighter line) */}
      <path d={`M ${cx - 88} 248 L ${cx - 18} 370 L ${cx + 18} 370 L ${cx + 88} 248`}
      fill="none" stroke={ink} strokeWidth="0.45" opacity="0.4" />

      {/* coffee drip from dripper into carafe */}
      <line x1={cx} y1="372" x2={cx} y2="378" stroke={brew} strokeWidth="1.6" />
      <ellipse cx={cx} cy="382" rx="1.6" ry="2.4" fill={brew} />

      {/* ── GOOSENECK KETTLE ── pouring into the dripper from the left */}
      <g transform="translate(58, 232)">
        {/* body */}
        <path d={`
          M 20 30
          L 14 84
          Q 14 102 32 102
          L 142 102
          Q 160 102 160 84
          L 154 30
          Q 152 18 140 18
          L 34 18
          Q 22 18 20 30 Z
        `} fill={paper} stroke={ink} strokeWidth="1.3" />
        {/* lid + finial */}
        <ellipse cx="87" cy="18" rx="55" ry="5" fill={paper} stroke={ink} strokeWidth="1.3" />
        <ellipse cx="87" cy="18" rx="46" ry="3" fill="none" stroke={ink} strokeWidth="0.5" opacity="0.5" />
        <rect x="83" y="6" width="8" height="12" rx="1.5" fill={paper} stroke={ink} strokeWidth="1" />
        {/* gooseneck spout: long, curving toward the dripper top */}
        <path d={`
          M 160 44
          C 200 44, 232 56, 252 84
          C 262 100, 268 120, 270 138
        `} fill="none" stroke={ink} strokeWidth="1.4" />
        <path d={`
          M 160 60
          C 198 60, 226 70, 244 90
          C 252 102, 258 118, 262 135
        `} fill="none" stroke={ink} strokeWidth="1.4" />
        {/* spout tip */}
        <line x1="262" y1="135" x2="270" y2="138" stroke={ink} strokeWidth="1.4" />
        {/* handle, on the left */}
        <path d={`M 20 46 Q -14 56 -14 80 Q -14 102 22 100`}
        fill="none" stroke={ink} strokeWidth="1.3" />
        <path d={`M 22 56 Q -2 64 -2 82 Q -2 94 24 92`}
        fill="none" stroke={ink} strokeWidth="0.5" opacity="0.5" />
      </g>

      {/* water stream from kettle spout into dripper */}
      <path d={`M 328 370 Q 320 320 ${cx - 28} 248`}
      fill="none" stroke={ink} strokeWidth="0.6" opacity="0.55"
      strokeDasharray="1.5 3" />

      {/* steam wisps above the dripper */}
      {[
      { x: cx - 34, y0: 234, y1: 178, sway: 9 },
      { x: cx + 2, y0: 228, y1: 162, sway: -11 },
      { x: cx + 32, y0: 236, y1: 184, sway: 7 }].
      map((s, i) =>
      <path key={i}
      d={`M ${s.x} ${s.y0} Q ${s.x + s.sway} ${(s.y0 + s.y1) / 2} ${s.x} ${s.y1}`}
      fill="none" stroke={ink} strokeWidth="0.6" opacity="0.4" />
      )}

      {/* ── ANNOTATIONS — vintage callouts ── */}
      {/* 60° cone, right of dripper */}
      <g>
        <line x1={cx + 100} y1="278" x2={cx + 165} y2="252" stroke={ink} strokeWidth="0.5" opacity="0.7" />
        <circle cx={cx + 100} cy="278" r="1.6" fill={ink} opacity="0.7" />
        <text x={cx + 168} y="244"
        style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', fill: ink, opacity: 0.8 }}>
          60° CONE
        </text>
        <text x={cx + 168} y="259"
        style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontStyle: 'italic', fontSize: 12, fill: ink, opacity: 0.7 }}>
          bloom 45 s
        </text>
      </g>

      {/* 94°C, left of kettle */}
      <g>
        <line x1="158" y1="262" x2="60" y2="200" stroke={ink} strokeWidth="0.5" opacity="0.7" />
        <circle cx="158" cy="262" r="1.6" fill={ink} opacity="0.7" />
        <text x="22" y="188"
        style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', fill: ink, opacity: 0.8 }}>
          GOOSENECK · 94°C
        </text>
        <text x="22" y="203"
        style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontStyle: 'italic', fontSize: 12, fill: ink, opacity: 0.7 }}>
          steady, slow pour
        </text>
      </g>

      {/* RATIO 1:16, on the carafe */}
      <g>
        <line x1={cx - 78} y1="455" x2="60" y2="478" stroke={ink} strokeWidth="0.5" opacity="0.7" />
        {spark ?
        <circle cx={cx - 78} cy="455" r="3.5" fill={spark} stroke={ink} strokeWidth="0.5" /> :
        <circle cx={cx - 78} cy="455" r="1.6" fill={ink} opacity="0.7" />}
        <text x="22" y="476"
        style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', fill: ink, opacity: 0.8 }}>
          RATIO 1 : 16
        </text>
        <text x="22" y="491"
        style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontStyle: 'italic', fontSize: 12, fill: ink, opacity: 0.7 }}>
          20 g coffee · 320 g water
        </text>
      </g>
    </svg>);

}

Object.assign(window, { PourOver });

// ===== footer.jsx =====
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
  const display = { fontFamily: theme.displayFont || '"Playpen Sans", "Fredoka", system-ui, sans-serif' };
  const sub = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const sans = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const lbl = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };

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


// ===== landing-page.jsx =====
// ═════════════════════════════════════════════════════════
// BRANDING TEMPLATE 3 — Almanac
// Beige paper · Moss-green accent · Calendar wheel, agrarian record
// ═════════════════════════════════════════════════════════
function BrandingTemplate3() {
  const p = {
    bg: (window.THEME||{}).bg||'#EFE9DA',
    fg: '#1A1410',
    accent: '#3F5A3A', // moss
    cream: '#F4EBD2',
    sun: '#C68A3D', // ochre
    rule: '#7A6B4E'
  };
  const display = { fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif' };
  const sub = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const sans = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const lbl = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };

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
        <text key={i} style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', fill: p.fg }}>
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
        style={{ fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif', fontStyle: 'italic', fontSize: 28, fill: p.cream }}>Copi</text>
        <text x={cx} y={cy + 14} textAnchor="middle"
        style={{ fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontSize: 9, fontWeight: 600, letterSpacing: '0.25em', fill: p.cream, opacity: 0.8 }}>
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

// ===== about-page.jsx =====
// ═════════════════════════════════════════════════════════
// ABOUT PAGE — Updated to match new design system
// Warm parchment · Forest green accent · Clean modern layout
// ═════════════════════════════════════════════════════════
function AboutPage({ theme = {} }) {
  const p = { ...window.NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...window.TYPOGRAPHY, ...(theme.typography || {}) };
  const RADIUS = window.RADIUS || { card: 12, pill: 999, tag: 999 };
  const SHADOW = window.SHADOW || { card: '0 1px 3px rgba(0,0,0,0.04)' };

  const NavNew = window.NavNew;
  const FooterNew = window.FooterNew;
  const Eyebrow = window.Eyebrow;

  const RES = (id, path) => (window.__resources && window.__resources[id]) || path;
  const editors = [
    { initials: 'OM', name: 'Owen McRann', role: 'Copi CEO', src: RES('owenPortrait', 'uploads/owen-mcrann-portrait.png'), bio: 'Green coffee importer. Founder of AIS, sourcing direct from Indonesian origins. 5 years in specialty coffee trade.' },
    { initials: 'MA', name: 'Miguel Arte', role: 'Curriculum Lead', src: RES('miguelPortrait', 'uploads/miguel-arte-portrait.png'), bio: '10 years across origin, roasting, and bar. Coffee grower, importer, roaster, and working barista.' }
  ];

  const principles = [
    { num: '01', title: 'Education for everyone', description: 'Coffee knowledge shouldn\'t sit behind a $1,500 course or a senior title. Everyone working in the industry deserves a real education, regardless of their role or what they can afford.' },
    { num: '02', title: 'Built around your level', description: 'No two employees start in the same place. Copi adapts to where each person is, what their role requires, and what their team actually needs to know.' },
    { num: '03', title: 'Quality lives in every role', description: 'Your reputation isn\'t built by your best barista alone. It\'s carried by everyone on the floor, from the front bar to the back of house. Every person needs to know their part.' },
    { num: '04', title: 'Managers deserve breathing room', description: 'The industry is demanding and managers carry most of that weight. Copi handles structured training so they can focus on running the business, not repeating themselves every six weeks.' },
    { num: '05', title: 'Built by people who\'ve done it', description: 'Every module is designed by certified Q-graders, working baristas, roasters, and importers — people who have worked every side of the industry, not just written about it.' },
    { num: '06', title: 'Learning never stops', description: 'The coffee industry evolves constantly. Education shouldn\'t have a finish line. Copi is built to grow with your team as the industry grows around you.' }
  ];

  const container = { maxWidth: 1100, margin: '0 auto', padding: '0 24px' };
  const sectionPad = { padding: '80px 24px' };

  return (
    <div style={{ minHeight: '100vh', background: p.bg }}>
      {NavNew && <NavNew theme={{ palette: p, typography: t }} />}

      {/* Header */}
      <section style={{ ...sectionPad, paddingTop: 80, paddingBottom: 64, textAlign: 'center' }}>
        <div style={{ ...container, maxWidth: 800 }}>
          {Eyebrow && <Eyebrow style={{ marginBottom: 16 }}>ABOUT COPI</Eyebrow>}
          <h1 style={{ ...t.h1, color: p.textPrimary, margin: '0 0 24px 0', fontSize: 56 }}>
            Built by people who've done it.
          </h1>
          <p style={{ ...t.bodyLarge, color: p.textMuted, margin: 0, lineHeight: 1.7, maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' }}>
            We believe everyone in coffee deserves a real education — not passed-down knowledge from whoever was on shift. Every module is designed by certified Q-graders, working baristas, roasters, and importers.
          </p>
        </div>
      </section>

      {/* Team */}
      <section style={{ ...sectionPad }}>
        <div style={{ ...container }}>
          <div style={{ marginBottom: 48, textAlign: 'center' }}>
            {Eyebrow && <Eyebrow style={{ marginBottom: 16 }}>THE TEAM</Eyebrow>}
            <h2 style={{ ...t.h2, fontSize: 36, color: p.textPrimary, margin: 0 }}>Meet the editors</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
            {editors.map((editor, i) => (
              <div key={i} style={{ background: p.bgCard, borderRadius: RADIUS.card, border: `1px solid ${p.tagBorder}`, padding: 32, display: 'flex', gap: 24 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: p.tagBg, flexShrink: 0, overflow: 'hidden', border: `2px solid ${p.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {editor.src
                    ? <img src={editor.src} alt={editor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ ...t.display, fontSize: 32, fontStyle: 'italic', color: p.accent }}>{editor.initials}</span>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ ...t.h3, fontSize: 22, color: p.textPrimary, margin: '0 0 4px 0' }}>{editor.name}</h3>
                  <div style={{ ...t.eyebrow, color: p.textMuted, marginBottom: 12 }}>{editor.role}</div>
                  <p style={{ ...t.bodySmall, color: p.textMuted, lineHeight: 1.6, margin: 0 }}>{editor.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section style={{ ...sectionPad }}>
        <div style={{ ...container }}>
          {Eyebrow && <Eyebrow style={{ textAlign: 'center', marginBottom: 16 }}>OUR PRINCIPLES</Eyebrow>}
          <h2 style={{ ...t.h2, color: p.textPrimary, textAlign: 'center', margin: '0 0 48px 0' }}>What we believe</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {principles.map((principle, i) => (
              <div key={i} style={{ background: p.bgCard, borderRadius: RADIUS.card, border: `1px solid ${p.tagBorder}`, padding: 32 }}>
                <div style={{ ...t.display, fontSize: 48, lineHeight: 1, color: p.accent, opacity: 0.3, marginBottom: 16 }}>{principle.num}</div>
                <h3 style={{ ...t.body, fontSize: 18, fontWeight: 600, color: p.textPrimary, margin: '0 0 12px 0' }}>{principle.title}</h3>
                <p style={{ ...t.bodySmall, color: p.textMuted, lineHeight: 1.6, margin: 0 }}>{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {FooterNew && <FooterNew theme={{ palette: p, typography: t }} />}
    </div>
  );
}

Object.assign(window, { AboutPage });

// ===== pricing-page.jsx =====
// ═════════════════════════════════════════════════════════
// PRICING PAGE — Updated to match new design system
// ═════════════════════════════════════════════════════════
function PricingPage({ theme = {} }) {
  const p = { ...window.NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...window.TYPOGRAPHY, ...(theme.typography || {}) };
  const RADIUS = window.RADIUS || { card: 12, pill: 999 };
  const SHADOW = window.SHADOW || { card: '0 1px 3px rgba(0,0,0,0.04)', cardHover: '0 4px 6px rgba(0,0,0,0.06)' };
  const NavNew = window.NavNew;
  const FooterNew = window.FooterNew;
  const Eyebrow = window.Eyebrow;

  const tiers = [
    {
      name: 'Trial',
      tagline: 'Trying Copi for FREE',
      price: '0',
      period: '30 days free',
      description: '1 manager · unlimited baristas',
      features: [
        'Full Foundations track (12 entries)',
        'First two espresso drills',
        'Bring your own menu',
        'Email support, 1 business day',
        'No card required',
      ],
      cta: 'Start free trial',
      featured: false,
    },
    {
      name: 'Studio',
      tagline: 'For independent cafés',
      price: '25',
      period: 'per month',
      description: '2–5 baristas',
      features: [
        'Entire 50-entry almanac',
        'Calibrated rubrics + manager sign-off',
        'Menu and recipe import',
        'Certification tracking',
        'Priority editor support',
      ],
      cta: 'Start with Studio',
      featured: true,
    },
    {
      name: 'Roastery',
      tagline: 'For multi-bar operations',
      price: '50',
      period: 'per month',
      description: '5+ baristas · multi-location',
      features: [
        'Everything in Studio',
        'Multi-location dashboards',
        'Custom tracks + your own drills',
        'API access + roster sync',
        'Dedicated onboarding editor',
      ],
      cta: 'Start with Roastery',
      featured: false,
    },
  ];

  const [hoveredTier, setHoveredTier] = React.useState(null);
  const container = { maxWidth: 1100, margin: '0 auto', padding: '0 24px' };

  return (
    <div style={{ minHeight: '100vh', background: p.bg }}>
      {NavNew && <NavNew theme={{ palette: p, typography: t }} />}

      {/* Header */}
      <section style={{ padding: '80px 24px 64px', textAlign: 'center' }}>
        <div style={{ ...container, maxWidth: 700 }}>
          {Eyebrow && <Eyebrow style={{ marginBottom: 16 }}>PRICING</Eyebrow>}
          <h1 style={{ ...t.h1, color: p.textPrimary, margin: '0 0 20px 0', fontSize: 56 }}>
            Honest pricing, by the month.
          </h1>
          <p style={{ ...t.bodyLarge, color: p.textMuted, margin: 0, lineHeight: 1.6 }}>
            Start with a free 30-day trial. No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ ...container, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' }}>
          {tiers.map((tier, i) => {
            const isHovered = hoveredTier === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredTier(i)}
                onMouseLeave={() => setHoveredTier(null)}
                style={{
                  background: tier.featured ? p.accent : p.bgCard,
                  borderRadius: RADIUS.card,
                  border: `1px solid ${tier.featured ? p.accent : p.tagBorder}`,
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: tier.featured || isHovered ? SHADOW.cardHover : SHADOW.card,
                  transform: tier.featured ? 'translateY(-8px)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {tier.featured && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: p.progress, color: p.textPrimary,
                    padding: '6px 14px', borderRadius: RADIUS.pill,
                    ...t.label, fontSize: 10,
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ ...t.eyebrow, color: tier.featured ? p.textOnDark : p.textMuted, opacity: tier.featured ? 0.9 : 1, marginBottom: 12 }}>
                  {tier.name}
                </div>

                <h2 style={{ ...t.h3, fontSize: 26, fontStyle: 'italic', color: tier.featured ? p.textOnDark : p.textPrimary, margin: '0 0 24px 0', lineHeight: 1.2 }}>
                  {tier.tagline}
                </h2>

                <div style={{ marginBottom: 16, paddingBottom: 20, borderBottom: `1px solid ${tier.featured ? 'rgba(255,255,255,0.2)' : p.tagBorder}` }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ ...t.display, fontSize: 28, color: tier.featured ? p.textOnDark : p.textPrimary, opacity: 0.7 }}>$</span>
                    <span style={{ ...t.display, fontSize: 64, lineHeight: 1, color: tier.featured ? p.textOnDark : p.textPrimary }}>{tier.price}</span>
                    <span style={{ ...t.bodySmall, color: tier.featured ? p.textOnDark : p.textMuted, opacity: tier.featured ? 0.8 : 1, marginLeft: 8 }}>{tier.period}</span>
                  </div>
                </div>

                <div style={{ ...t.bodySmall, color: tier.featured ? p.textOnDark : p.textMuted, opacity: tier.featured ? 0.9 : 1, marginBottom: 24 }}>
                  {tier.description}
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                  {tier.features.map((feature, j) => (
                    <li key={j} style={{ ...t.bodySmall, color: tier.featured ? p.textOnDark : p.textPrimary, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: tier.featured ? p.progress : p.accent,
                        color: '#FFFFFF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, flexShrink: 0, marginTop: 2,
                      }}>✓</div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => { if (window.CopiActions && window.CopiActions.openTrial) window.CopiActions.openTrial(); }}
                  style={{
                    ...t.button,
                    width: '100%',
                    padding: '14px 24px',
                    borderRadius: RADIUS.pill,
                    border: 'none',
                    cursor: 'pointer',
                    background: tier.featured ? '#FFFFFF' : p.accent,
                    color: tier.featured ? p.accent : '#FFFFFF',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tier.cta}
                </button>
              </div>
            );
          })}
        </div>

        <p style={{ ...t.bodySmall, color: p.textMuted, textAlign: 'center', marginTop: 32 }}>
          No per-seat charges · Cancel any month · Annual plans −15%
        </p>
      </section>

      {FooterNew && <FooterNew theme={{ palette: p, typography: t }} />}
    </div>
  );
}

Object.assign(window, { PricingPage });


// ===== curriculum-page.jsx =====
// ═════════════════════════════════════════════════════════
// CURRICULUM PAGE — Updated to match new design system
// ═════════════════════════════════════════════════════════
function CurriculumPage({ theme = {} }) {
  const p = { ...window.NEW_PALETTE, ...(theme.palette || {}) };
  const t = { ...window.TYPOGRAPHY, ...(theme.typography || {}) };
  const RADIUS = window.RADIUS || { card: 12, pill: 999 };
  const SHADOW = window.SHADOW || { card: '0 1px 3px rgba(0,0,0,0.04)', cardHover: '0 4px 6px rgba(0,0,0,0.06)' };
  const NavNew = window.NavNew;
  const FooterNew = window.FooterNew;
  const Eyebrow = window.Eyebrow;

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

  const container = { maxWidth: 1100, margin: '0 auto', padding: '0 24px' };
  const [hoveredCard, setHoveredCard] = React.useState(null);

  return (
    <div style={{ minHeight: '100vh', background: p.bg }}>
      {NavNew && <NavNew theme={{ palette: p, typography: t }} />}

      {/* Header */}
      <section style={{ padding: '80px 24px 64px', textAlign: 'center' }}>
        <div style={{ ...container, maxWidth: 800 }}>
          {Eyebrow && <Eyebrow style={{ marginBottom: 16 }}>THE CURRICULUM</Eyebrow>}
          <h1 style={{ ...t.h1, color: p.textPrimary, margin: '0 0 20px 0', fontSize: 56 }}>
            From the cherry to the cup.
          </h1>
          <p style={{ ...t.bodyLarge, color: p.textMuted, margin: 0, lineHeight: 1.6 }}>
            Three volumes, signed off by working baristas and Q-graders. Every entry ends in a hands-on drill with a calibrated rubric.
          </p>
        </div>
      </section>

      {/* Volumes */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ ...container, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {tracks.map((track, i) => {
            const isHovered = hoveredCard === i;
            return (
              <article
                key={i}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: p.bgCard,
                  borderRadius: RADIUS.card,
                  border: `1px solid ${p.tagBorder}`,
                  padding: 40,
                  display: 'grid',
                  gridTemplateColumns: '1fr 280px',
                  gap: 40,
                  alignItems: 'center',
                  position: 'relative',
                  boxShadow: isHovered ? SHADOW.cardHover : SHADOW.card,
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Big ghost numeral */}
                <div style={{
                  ...t.display, fontSize: 120, lineHeight: 1, color: p.accent, fontStyle: 'italic',
                  opacity: 0.1, position: 'absolute', left: 24, top: 16, fontWeight: 400, pointerEvents: 'none',
                }}>
                  0{i + 1}
                </div>

                {/* Left — content */}
                <div style={{ position: 'relative' }}>
                  <div style={{ ...t.eyebrow, color: p.textMuted, marginBottom: 12 }}>{track.vol}</div>
                  <h2 style={{ ...t.h2, fontSize: 36, color: p.textPrimary, margin: '0 0 8px 0' }}>{track.name}</h2>
                  <div style={{ ...t.body, fontSize: 15, fontStyle: 'italic', color: p.textMuted, margin: '0 0 16px 0' }}>{track.tag}</div>
                  <p style={{ ...t.bodySmall, color: p.textMuted, lineHeight: 1.6, margin: 0 }}>{track.shortBlurb}</p>
                </div>

                {/* Right — meta + CTA */}
                <div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {[
                      ['Lessons', `${track.meta.entries}`],
                      ['Duration', track.meta.time],
                      ['Certification', track.meta.cert],
                    ].map(([label, value], j) => (
                      <li key={j} style={{
                        ...t.bodySmall, color: p.textPrimary,
                        display: 'flex', justifyContent: 'space-between',
                        paddingBottom: 12, borderBottom: `1px solid ${p.tagBorder}`,
                        marginBottom: 12,
                      }}>
                        <span style={{ color: p.textMuted }}>{label}</span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    data-volume-idx={i}
                    style={{
                      ...t.button,
                      width: '100%',
                      padding: '14px 24px',
                      borderRadius: RADIUS.pill,
                      border: 'none',
                      background: p.accent,
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    View volume
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {FooterNew && <FooterNew theme={{ palette: p, typography: t }} />}
    </div>
  );
}

Object.assign(window, { CurriculumPage });


// ===== admin-dashboard.jsx =====
// ═════════════════════════════════════════════════════════
// ROASTER DASHBOARD — First screen after login
// Almanac aesthetic · Editorial workspace
// Built for a roastery admin: their team, sign-offs, lessons
// ═════════════════════════════════════════════════════════

function RoasterDashboard({ user = {} }) {
  const p = window.NEW_PALETTE || PROTO_PALETTE;
  const t = window.TYPOGRAPHY || {};
  const RADIUS = window.RADIUS || { card: 12, pill: 999, tag: 999 };
  const SHADOW = window.SHADOW || { card: '0 1px 3px rgba(0,0,0,0.04)', cardHover: '0 4px 6px rgba(0,0,0,0.06)' };

  const display = { fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif', fontWeight: 700 };
  const sans = { fontFamily: 'Inter, sans-serif' };

  const name = user.name || 'Brian';
  const cafe = user.cafe || 'Milano Coffee';

  const store = window.useCopiStore();
  // ── Demo data ──────────────────────────────────────────────

  const DEMO_TEAM = [
    { name: 'Lili Turko',    email: 'lili@milano.coffee',    role: 'Barista',  location: 'Downtown', prog: 72, milestone: 'Milk texturing', status: 'on-track' },
    { name: 'Jules Patel',   email: 'jules@milano.coffee',   role: 'Barista',  location: 'Downtown', prog: 45, milestone: 'Espresso dial-in', status: 'behind' },
    { name: 'Sara Chen',     email: 'sara@milano.coffee',    role: 'Manager',  location: 'Westside', prog: 91, milestone: 'Opening checklist', status: 'on-track' },
    { name: 'Marco Reyes',   email: 'marco@milano.coffee',   role: 'Barista',  location: 'Westside', prog: 33, milestone: 'Bar setup', status: 'behind' },
    { name: 'Anika Mehta',   email: 'anika@milano.coffee',   role: 'Host',     location: 'Downtown', prog: 60, milestone: 'Menu knowledge', status: 'studying' },
    { name: 'Devon Park',    email: 'devon@milano.coffee',   role: 'Barista',  location: 'Downtown', prog: 85, milestone: 'Latte art basics', status: 'on-track' },
  ];

  const LOCATIONS = [
    { id: 'all',       label: 'All Locations' },
    { id: 'downtown',  label: 'Downtown' },
    { id: 'westside',  label: 'Westside' },
  ];

  const DEMO_MILESTONES = [
    { id: 'm1', title: 'Complete health & safety orientation', source: 'uploaded',  done: true,  signedBy: 'Sara C.', signedAt: 'Jun 2' },
    { id: 'm2', title: 'Pull your first espresso shot',        source: 'uploaded',  done: true,  signedBy: 'Sara C.', signedAt: 'Jun 5' },
    { id: 'm3', title: 'Steam and texture milk to standard',   source: 'uploaded',  done: false, signedBy: null,      signedAt: null   },
    { id: 'm4', title: 'Pass Volume I final assessment',       source: 'suggested', done: false, signedBy: null,      signedAt: null   },
    { id: 'm5', title: 'Shadow a full opening shift',         source: 'suggested', done: false, signedBy: null,      signedAt: null   },
  ];

  const SETUP_STEPS = ['Upload docs', 'Review AI setup', 'Publish'];

  // ── State ───────────────────────────────────────────────────
  const [activeLocation, setActiveLocation] = React.useState('all');
  const [activeFilter,   setActiveFilter]   = React.useState('All');
  const [setupDone,      setSetupDone]       = React.useState([false, false, false]);
  const [showSetupModal, setShowSetupModal]  = React.useState(false);
  const [modalStep,      setModalStep]       = React.useState(0);
  const [uploadedFiles,  setUploadedFiles]   = React.useState([]);
  const [aiProcessing,   setAiProcessing]    = React.useState(false);
  const [milestones,     setMilestones]      = React.useState(DEMO_MILESTONES);
  const [gaps,           setGaps]            = React.useState([
    'No formal barista advancement criteria found — consider adding promotion milestones',
    'Missing allergen awareness training — recommended for compliance',
  ]);
  const [selectedStaff,  setSelectedStaff]   = React.useState(null);
  const [noteText,       setNoteText]        = React.useState('');
  const [navActive,      setNavActive]       = React.useState('Dashboard');

  const setupAllDone = setupDone.every(Boolean);

  // ── Filtered team ───────────────────────────────────────────
  const filteredTeam = DEMO_TEAM.filter(m => {
    const locOk = activeLocation === 'all' || m.location.toLowerCase() === activeLocation;
    const filterOk = activeFilter === 'All' || m.status === activeFilter.toLowerCase().replace(' ', '-');
    return locOk && filterOk;
  });

  const teamCompletion = Math.round(DEMO_TEAM.reduce((s, m) => s + m.prog, 0) / DEMO_TEAM.length);
  const needingAttn    = DEMO_TEAM.filter(m => m.status === 'behind').length;

  // ── Sub-components ──────────────────────────────────────────
  const Avatar = ({ name: n, size = 32 }) => {
    const initials = n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['#4A7C59', '#6B8F71', '#3D5A3E', '#5A7A62'];
    const bg = colors[n.charCodeAt(0) % colors.length];
    return (
      <div style={{
        width: size, height: size, borderRadius: RADIUS.pill,
        background: bg, color: '#fff',
        display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.38, fontWeight: 600,
        flex: '0 0 auto', letterSpacing: '0.02em',
      }}>{initials}</div>
    );
  };

  const StatusBadge = ({ status }) => {
    const map = {
      'on-track': { bg: '#E6F2EB', color: '#2D6A4F', label: 'On track'  },
      'behind':   { bg: '#FDECEA', color: '#B91C1C', label: 'Behind'    },
      'studying': { bg: p.tagBg,   color: p.textMuted, label: 'Studying' },
    };
    const s = map[status] || map['studying'];
    return (
      <span style={{
        ...sans, fontSize: 12, fontWeight: 500,
        padding: '3px 10px', borderRadius: RADIUS.pill,
        background: s.bg, color: s.color,
      }}>{s.label}</span>
    );
  };

  // ── App nav ─────────────────────────────────────────────────
  const AppNav = () => (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: p.bgCard, borderBottom: `1px solid ${p.tagBorder}`,
      boxShadow: SHADOW.nav || '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <span style={{ ...display, fontStyle: 'italic', fontSize: 22, color: p.textPrimary }}>Copi.</span>
          <nav style={{ display: 'flex', gap: 4 }}>
            {['Dashboard', 'Team', 'Curriculum', 'Settings'].map(item => (
              <button key={item} onClick={() => {
                setNavActive(item);
                if (item === 'Team' && window.CopiActions) window.CopiActions.navigate('admin-team');
              }} style={{
                ...sans, fontSize: 14, fontWeight: 500,
                padding: '6px 14px', borderRadius: RADIUS.pill,
                background: navActive === item ? p.tagBg : 'transparent',
                color: navActive === item ? p.textPrimary : p.textMuted,
                border: 'none', cursor: 'pointer',
              }}>{item}</button>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => { setShowSetupModal(true); setModalStep(0); }}
            style={{
              ...sans, fontSize: 13, fontWeight: 500,
              padding: '8px 18px', borderRadius: RADIUS.pill,
              background: p.accent, color: '#fff',
              border: 'none', cursor: 'pointer',
            }}
          >+ Add staff</button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: RADIUS.pill,
            background: p.tagBg, cursor: 'pointer',
          }}>
            <Avatar name={name} size={26} />
            <span style={{ ...sans, fontSize: 13, fontWeight: 500, color: p.textPrimary }}>{name}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Setup task card ─────────────────────────────────────────
  const SetupCard = () => {
    if (setupAllDone) return null;
    return (
      <div style={{
        background: p.bgCard, borderRadius: RADIUS.card,
        border: `1px solid ${p.tagBorder}`,
        boxShadow: SHADOW.card,
        padding: '20px 24px', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ ...sans, fontSize: 15, fontWeight: 600, color: p.textPrimary }}>Finish setting up {cafe}</div>
            <div style={{ ...sans, fontSize: 13, color: p.textMuted, marginTop: 2 }}>
              {setupDone.filter(Boolean).length} of 3 steps complete
            </div>
          </div>
          <button
            onClick={() => { setShowSetupModal(true); setModalStep(setupDone.filter(Boolean).length); }}
            style={{
              ...sans, fontSize: 13, fontWeight: 500,
              padding: '8px 18px', borderRadius: RADIUS.pill,
              background: p.accent, color: '#fff',
              border: 'none', cursor: 'pointer',
            }}
          >Continue setup →</button>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {SETUP_STEPS.map((step, i) => (
            <div key={step} style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: RADIUS.card,
              background: setupDone[i] ? '#E6F2EB' : p.bg,
              border: `1px solid ${setupDone[i] ? '#C3DFC9' : p.tagBorder}`,
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: RADIUS.pill,
                background: setupDone[i] ? p.accent : p.tagBorder,
                display: 'grid', placeItems: 'center', flex: '0 0 auto',
              }}>
                {setupDone[i]
                  ? <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <span style={{ ...sans, fontSize: 10, fontWeight: 700, color: p.textMuted }}>{i + 1}</span>
                }
              </div>
              <span style={{ ...sans, fontSize: 13, fontWeight: 500, color: setupDone[i] ? '#2D6A4F' : p.textMuted }}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Setup modal ─────────────────────────────────────────────
  const SetupModal = () => {
    if (!showSetupModal) return null;
    const handleUpload = () => {
      setUploadedFiles(['Staff Handbook v3.pdf', 'Barista Training SOP.pdf']);
    };
    const handleAnalyze = () => {
      setAiProcessing(true);
      setTimeout(() => { setAiProcessing(false); setModalStep(1); }, 1800);
    };
    const handlePublish = () => {
      setSetupDone([true, true, true]);
      setShowSetupModal(false);
    };
    const stepDots = (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: RADIUS.pill,
            background: i === modalStep ? p.accent : p.tagBorder,
            transition: 'background 0.2s',
          }} />
        ))}
      </div>
    );
    return (
      <div
        onClick={e => { if (e.target === e.currentTarget) setShowSetupModal(false); }}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(28,28,26,0.5)',
          display: 'grid', placeItems: 'center', padding: 24,
        }}
      >
        <div style={{
          background: p.bgCard, borderRadius: RADIUS.card * 2,
          width: '100%', maxWidth: 560,
          padding: '36px 40px',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}>
          <button onClick={() => setShowSetupModal(false)} style={{
            position: 'absolute', top: 16, right: 16,
            background: 'transparent', border: 'none', cursor: 'pointer',
            ...sans, fontSize: 18, color: p.textMuted, padding: 4,
          }}>✕</button>
          {stepDots}
          {modalStep === 0 && (
            <div>
              <div style={{ ...sans, fontSize: 13, fontWeight: 600, color: p.accent, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Step 1 of 3</div>
              <h2 style={{ ...display, fontStyle: 'italic', fontSize: 32, color: p.textPrimary, margin: '0 0 8px' }}>Upload your docs</h2>
              <p style={{ ...sans, fontSize: 14, color: p.textMuted, marginBottom: 24, lineHeight: 1.6 }}>
                Upload your existing training materials, handbooks, or SOPs. Copi AI will read them and build your onboarding milestones automatically.
              </p>
              <div
                onClick={handleUpload}
                style={{
                  border: `2px dashed ${uploadedFiles.length ? p.accent : p.tagBorder}`,
                  borderRadius: RADIUS.card,
                  padding: '32px 24px', textAlign: 'center', cursor: 'pointer',
                  background: uploadedFiles.length ? '#E6F2EB' : p.bg,
                  marginBottom: 16, transition: 'all 0.2s',
                }}
              >
                {uploadedFiles.length ? (
                  <div>
                    <div style={{ ...sans, fontSize: 24, marginBottom: 8 }}>✓</div>
                    {uploadedFiles.map(f => (
                      <div key={f} style={{ ...sans, fontSize: 13, color: '#2D6A4F', fontWeight: 500 }}>{f}</div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div style={{ ...sans, fontSize: 32, marginBottom: 8, opacity: 0.3 }}>↑</div>
                    <div style={{ ...sans, fontSize: 14, color: p.textMuted }}>Click to upload PDF or text files</div>
                    <div style={{ ...sans, fontSize: 12, color: p.textMuted, marginTop: 4, opacity: 0.7 }}>or drag and drop</div>
                  </div>
                )}
              </div>
              {uploadedFiles.length > 0 && (
                <button
                  onClick={handleAnalyze}
                  disabled={aiProcessing}
                  style={{
                    width: '100%', ...sans, fontSize: 14, fontWeight: 600,
                    padding: '13px', borderRadius: RADIUS.pill,
                    background: aiProcessing ? p.tagBg : p.accent,
                    color: aiProcessing ? p.textMuted : '#fff',
                    border: 'none', cursor: aiProcessing ? 'wait' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  {aiProcessing ? (
                    <><span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #aaa', borderTopColor: p.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Analyzing docs…</>
                  ) : 'Analyze with Copi AI →'}
                </button>
              )}
            </div>
          )}
          {modalStep === 1 && (
            <div>
              <div style={{ ...sans, fontSize: 13, fontWeight: 600, color: p.accent, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Step 2 of 3</div>
              <h2 style={{ ...display, fontStyle: 'italic', fontSize: 32, color: p.textPrimary, margin: '0 0 8px' }}>Review AI setup</h2>
              <p style={{ ...sans, fontSize: 14, color: p.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
                Copi found {milestones.length} onboarding milestones. Edit or remove any before publishing.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto', marginBottom: 16 }}>
                {milestones.map((m, i) => (
                  <div key={m.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: RADIUS.card,
                    background: p.bg, border: `1px solid ${p.tagBorder}`,
                  }}>
                    <span style={{
                      ...sans, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: RADIUS.pill,
                      background: m.source === 'uploaded' ? '#E6F2EB' : p.tagBg,
                      color: m.source === 'uploaded' ? '#2D6A4F' : p.textMuted,
                    }}>{m.source === 'uploaded' ? 'From docs' : 'Suggested'}</span>
                    <span style={{ ...sans, fontSize: 13, color: p.textPrimary, flex: 1 }}>{m.title}</span>
                    <button onClick={() => setMilestones(milestones.filter((_, j) => j !== i))} style={{
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      ...sans, fontSize: 16, color: p.textMuted, padding: 2, lineHeight: 1,
                    }}>×</button>
                  </div>
                ))}
              </div>
              {gaps.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ ...sans, fontSize: 12, fontWeight: 600, color: p.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gap suggestions</div>
                  {gaps.map((g, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '10px 14px', borderRadius: RADIUS.card,
                      background: '#FFFBF0', border: '1px solid #F0E0A0',
                      marginBottom: 6,
                    }}>
                      <span style={{ ...sans, fontSize: 12, color: '#92400E', flex: 1, lineHeight: 1.5 }}>{g}</span>
                      <button onClick={() => setGaps(gaps.filter((_, j) => j !== i))} style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        ...sans, fontSize: 14, color: '#92400E', padding: 0, lineHeight: 1, flex: '0 0 auto',
                      }}>×</button>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => { setSetupDone([true, true, false]); setModalStep(2); }}
                style={{
                  width: '100%', ...sans, fontSize: 14, fontWeight: 600,
                  padding: '13px', borderRadius: RADIUS.pill,
                  background: p.accent, color: '#fff',
                  border: 'none', cursor: 'pointer',
                }}
              >Looks good — continue →</button>
            </div>
          )}
          {modalStep === 2 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ ...sans, fontSize: 13, fontWeight: 600, color: p.accent, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Step 3 of 3</div>
              <h2 style={{ ...display, fontStyle: 'italic', fontSize: 32, color: p.textPrimary, margin: '0 0 12px' }}>Ready to publish</h2>
              <p style={{ ...sans, fontSize: 14, color: p.textMuted, marginBottom: 24, lineHeight: 1.6 }}>
                Your team will see <strong>{milestones.length} milestones</strong> and receive access to their onboarding track. You can edit milestones any time.
              </p>
              <div style={{
                background: p.bg, borderRadius: RADIUS.card, padding: '16px 20px', marginBottom: 24, textAlign: 'left',
              }}>
                {[
                  `${milestones.filter(m => m.source === 'uploaded').length} milestones from your docs`,
                  `${milestones.filter(m => m.source === 'suggested').length} AI-suggested milestones`,
                  `${DEMO_TEAM.length} staff will receive access`,
                ].map(line => (
                  <div key={line} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ color: p.accent, fontSize: 16 }}>✓</span>
                    <span style={{ ...sans, fontSize: 13, color: p.textPrimary }}>{line}</span>
                  </div>
                ))}
              </div>
              <button onClick={handlePublish} style={{
                width: '100%', ...sans, fontSize: 14, fontWeight: 600,
                padding: '13px', borderRadius: RADIUS.pill,
                background: p.accent, color: '#fff',
                border: 'none', cursor: 'pointer',
              }}>Publish onboarding →</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Staff detail drawer ─────────────────────────────────────
  const StaffDrawer = () => {
    if (!selectedStaff) return null;
    const staff = DEMO_TEAM.find(m => m.email === selectedStaff);
    if (!staff) return null;
    return (
      <div
        onClick={e => { if (e.target === e.currentTarget) setSelectedStaff(null); }}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(28,28,26,0.3)',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0,
          width: Math.min(480, window.innerWidth),
          background: p.bgCard,
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}>
          <div style={{ padding: '24px 28px', borderBottom: `1px solid ${p.tagBorder}`, display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setSelectedStaff(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', ...sans, fontSize: 20, color: p.textMuted, padding: 4, marginRight: 4 }}>←</button>
            <Avatar name={staff.name} size={44} />
            <div>
              <div style={{ ...sans, fontSize: 16, fontWeight: 600, color: p.textPrimary }}>{staff.name}</div>
              <div style={{ ...sans, fontSize: 13, color: p.textMuted }}>{staff.role} · {staff.location}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}><StatusBadge status={staff.status} /></div>
          </div>
          <div style={{ padding: '24px 28px', flex: 1 }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ ...sans, fontSize: 13, fontWeight: 600, color: p.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Progress</div>
              <div style={{ height: 6, background: p.tagBg, borderRadius: RADIUS.pill, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ height: '100%', width: `${staff.prog}%`, background: p.accent, borderRadius: RADIUS.pill }} />
              </div>
              <div style={{ ...sans, fontSize: 13, color: p.textMuted }}>{staff.prog}% complete · Current: {staff.milestone}</div>
            </div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ ...sans, fontSize: 13, fontWeight: 600, color: p.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Onboarding milestones</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DEMO_MILESTONES.map(m => (
                  <div key={m.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: RADIUS.card,
                    background: m.done ? '#E6F2EB' : p.bg,
                    border: `1px solid ${m.done ? '#C3DFC9' : p.tagBorder}`,
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: RADIUS.pill, flex: '0 0 auto',
                      background: m.done ? p.accent : 'transparent',
                      border: m.done ? 'none' : `2px solid ${p.tagBorder}`,
                      display: 'grid', placeItems: 'center',
                    }}>
                      {m.done && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...sans, fontSize: 13, color: p.textPrimary, fontWeight: m.done ? 400 : 500 }}>{m.title}</div>
                      {m.done && <div style={{ ...sans, fontSize: 11, color: '#2D6A4F', marginTop: 2 }}>Signed off by {m.signedBy} · {m.signedAt}</div>}
                    </div>
                    {!m.done && (
                      <button style={{
                        ...sans, fontSize: 12, fontWeight: 500,
                        padding: '5px 12px', borderRadius: RADIUS.pill,
                        background: 'transparent', color: p.accent,
                        border: `1px solid ${p.accent}`, cursor: 'pointer',
                      }}>Sign off</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ ...sans, fontSize: 13, fontWeight: 600, color: p.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Manager notes</div>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Add a note about this staff member…"
                style={{
                  width: '100%', minHeight: 90, borderRadius: RADIUS.card,
                  border: `1px solid ${p.tagBorder}`, background: p.bg,
                  ...sans, fontSize: 13, color: p.textPrimary,
                  padding: '12px 14px', boxSizing: 'border-box',
                  resize: 'vertical', outline: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Main render ─────────────────────────────────────────────
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: p.bg, color: p.textPrimary }}>
      <AppNav />
      <SetupModal />
      <StaffDrawer />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px 64px' }}>
        <SetupCard />

        {/* ── Page header ─────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ ...display, fontStyle: 'italic', fontSize: 42, fontWeight: 400, color: p.textPrimary, margin: 0, lineHeight: 1.1 }}>
              {cafe}
            </h1>
            <p style={{ ...sans, fontSize: 14, color: p.textMuted, margin: '4px 0 0' }}>
              {DEMO_TEAM.length} staff · {LOCATIONS.length - 1} locations
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {LOCATIONS.map(loc => (
              <button key={loc.id} onClick={() => setActiveLocation(loc.id)} style={{
                ...sans, fontSize: 13, fontWeight: 500,
                padding: '8px 18px', borderRadius: RADIUS.pill,
                background: activeLocation === loc.id ? p.textPrimary : p.bgCard,
                color: activeLocation === loc.id ? '#fff' : p.textMuted,
                border: `1px solid ${activeLocation === loc.id ? p.textPrimary : p.tagBorder}`,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>{loc.label}</button>
            ))}
          </div>
        </div>

        {/* ── Stats row ─────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Team completion',   value: `${teamCompletion}%`, sub: 'avg across all staff' },
            { label: 'Active staff',      value: String(DEMO_TEAM.length), sub: 'with account access' },
            { label: 'Lessons this week', value: String(store.lessonsThisWeek ? store.lessonsThisWeek() : 14), sub: 'last 7 days' },
            { label: 'Needing attention', value: String(needingAttn),   sub: 'behind on milestones', alert: needingAttn > 0 },
          ].map(stat => (
            <div key={stat.label} style={{
              background: p.bgCard, borderRadius: RADIUS.card,
              border: `1px solid ${stat.alert ? '#FCA5A5' : p.tagBorder}`,
              padding: '20px 22px',
              boxShadow: SHADOW.card,
            }}>
              <div style={{ ...sans, fontSize: 28, fontWeight: 700, color: stat.alert ? '#B91C1C' : p.textPrimary, lineHeight: 1, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ ...sans, fontSize: 13, fontWeight: 500, color: p.textPrimary, marginBottom: 2 }}>{stat.label}</div>
              <div style={{ ...sans, fontSize: 12, color: p.textMuted }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Staff table ────────────────────────────────────────── */}
        <div style={{ background: p.bgCard, borderRadius: RADIUS.card, border: `1px solid ${p.tagBorder}`, boxShadow: SHADOW.card }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${p.tagBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ ...sans, fontSize: 15, fontWeight: 600, color: p.textPrimary }}>Staff</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['All', 'On track', 'Behind', 'Studying'].map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} style={{
                  ...sans, fontSize: 12, fontWeight: 500,
                  padding: '5px 12px', borderRadius: RADIUS.pill,
                  background: activeFilter === f ? p.tagBg : 'transparent',
                  color: activeFilter === f ? p.textPrimary : p.textMuted,
                  border: `1px solid ${activeFilter === f ? p.tagBorder : 'transparent'}`,
                  cursor: 'pointer',
                }}>{f}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: '0 24px 8px' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1fr 80px',
              gap: 16, padding: '12px 0',
              borderBottom: `1px solid ${p.tagBorder}`,
              ...sans, fontSize: 11, fontWeight: 600, color: p.textMuted,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              <span>Name</span><span>Role</span><span>Location</span><span>Milestone</span><span>Progress</span><span>Status</span>
            </div>
            {filteredTeam.map((member, i) => (
              <div
                key={member.email}
                onClick={() => setSelectedStaff(member.email)}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1fr 80px',
                  gap: 16, padding: '14px 0', alignItems: 'center',
                  borderBottom: i < filteredTeam.length - 1 ? `1px solid ${p.tagBorder}` : 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={member.name} size={34} />
                  <div>
                    <div style={{ ...sans, fontSize: 14, fontWeight: 500, color: p.textPrimary }}>{member.name}</div>
                    <div style={{ ...sans, fontSize: 12, color: p.textMuted }}>{member.email}</div>
                  </div>
                </div>
                <span style={{ ...sans, fontSize: 13, color: p.textPrimary }}>{member.role}</span>
                <span style={{ ...sans, fontSize: 13, color: p.textMuted }}>{member.location}</span>
                <span style={{ ...sans, fontSize: 13, color: p.textPrimary }}>{member.milestone}</span>
                <div>
                  <div style={{ height: 4, background: p.tagBg, borderRadius: RADIUS.pill, overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{ height: '100%', width: `${member.prog}%`, background: member.status === 'behind' ? '#EF4444' : p.accent, borderRadius: RADIUS.pill }} />
                  </div>
                  <span style={{ ...sans, fontSize: 12, color: p.textMuted }}>{member.prog}%</span>
                </div>
                <StatusBadge status={member.status} />
              </div>
            ))}
            {filteredTeam.length === 0 && (
              <div style={{ padding: '32px 0', textAlign: 'center', ...sans, fontSize: 14, color: p.textMuted }}>
                No staff match this filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RoasterDashboard });

// ===== admin-team-page.jsx =====
// ═════════════════════════════════════════════════════════
// ADMIN TEAM PAGE — Manage your team, invite new teammates
// Almanac aesthetic to match the dashboard
// ═════════════════════════════════════════════════════════

function AdminTeamPage({ user = {} }) {
  const p      = window.NEW_PALETTE || PROTO_PALETTE;
  const RADIUS = window.RADIUS || { card: 12, pill: 999 };
  const SHADOW = window.SHADOW || { card: '0 1px 3px rgba(0,0,0,0.04)' };
  const display = { fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif', fontWeight: 700 };
  const sans    = { fontFamily: 'Inter, sans-serif' };

  const name = user.name || 'Brian Turko';
  const cafe = user.cafe || 'Milano Coffee';

  const SEED_TEAM = (window.CopiStore ? window.CopiStore.teamSnapshot() : []).map((t) => ({
    name: t.name, email: t.email, role: t.role, cert: t.cert, joined: t.joined,
  }));

  const [team, setTeam] = React.useState(SEED_TEAM);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', role: 'Barista', location: 'Downtown' });
  const [sent, setSent] = React.useState(null);

  const Avatar = ({ name: n, size = 32 }) => {
    const initials = n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['#4A7C59', '#6B8F71', '#3D5A3E', '#5A7A62'];
    const bg = colors[n.charCodeAt(0) % colors.length];
    return (
      <div style={{
        width: size, height: size, borderRadius: RADIUS.pill,
        background: bg, color: '#fff',
        display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.38, fontWeight: 600,
        flex: '0 0 auto',
      }}>{initials}</div>
    );
  };

  const valid =
    form.name.trim().length > 1 &&
    /.+@.+\..+/.test(form.email.trim()) &&
    !team.some(t => t.email.toLowerCase() === form.email.trim().toLowerCase());

  const sendInvite = () => {
    if (!valid) return;
    const cleanName  = form.name.trim();
    const cleanEmail = form.email.trim();
    setTeam([...team, {
      name: cleanName, email: cleanEmail,
      role: form.role, cert: '—',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      pending: true,
    }]);
    const subject = encodeURIComponent(`Welcome to ${cafe} on Copi`);
    const body = encodeURIComponent(
      `Hi ${cleanName.split(' ')[0]},\n\n` +
      `${name} has invited you to join ${cafe}'s coffee training on Copi.\n\n` +
      `Set up your account here:\nhttps://app.copi.com/invite?email=${encodeURIComponent(cleanEmail)}\n\n` +
      `— ${name}, ${cafe}`
    );
    window.location.href = `mailto:${cleanEmail}?subject=${subject}&body=${body}`;
    setSent({ name: cleanName, email: cleanEmail });
    setForm({ name: '', email: '', role: 'Barista', location: 'Downtown' });
    setTimeout(() => { setOpen(false); setSent(null); }, 2400);
  };

  const inputStyle = {
    width: '100%', borderRadius: RADIUS.pill,
    border: `1px solid ${p.tagBorder}`,
    background: p.bg, padding: '12px 18px',
    ...sans, fontSize: 14, color: p.textPrimary,
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: p.bg, color: p.textPrimary }}>

      {/* ── Nav ────────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: p.bgCard, borderBottom: `1px solid ${p.tagBorder}`,
        boxShadow: SHADOW.nav || '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <span style={{ ...display, fontStyle: 'italic', fontSize: 22, color: p.textPrimary }}>Copi.</span>
            <nav style={{ display: 'flex', gap: 4 }}>
              {[
                { label: 'Dashboard', action: () => window.CopiActions && window.CopiActions.navigate('admin') },
                { label: 'Team',      action: null },
              ].map(item => (
                <button key={item.label} onClick={item.action || undefined} style={{
                  ...sans, fontSize: 14, fontWeight: 500,
                  padding: '6px 14px', borderRadius: RADIUS.pill,
                  background: !item.action ? p.tagBg : 'transparent',
                  color: !item.action ? p.textPrimary : p.textMuted,
                  border: 'none', cursor: item.action ? 'pointer' : 'default',
                }}>{item.label}</button>
              ))}
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setOpen(true)} style={{
              ...sans, fontSize: 13, fontWeight: 500,
              padding: '8px 18px', borderRadius: RADIUS.pill,
              background: p.accent, color: '#fff',
              border: 'none', cursor: 'pointer',
            }}>+ Add staff</button>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: RADIUS.pill,
              background: p.tagBg, cursor: 'pointer',
            }}>
              <Avatar name={name} size={26} />
              <span style={{ ...sans, fontSize: 13, fontWeight: 500, color: p.textPrimary }}>{name}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px 64px' }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ ...display, fontStyle: 'italic', fontSize: 36, fontWeight: 400, color: p.textPrimary, margin: 0, lineHeight: 1.1 }}>
              Team
            </h1>
            <p style={{ ...sans, fontSize: 14, color: p.textMuted, margin: '4px 0 0' }}>
              {team.length} staff members · {team.filter(t => t.pending).length} pending invite
            </p>
          </div>
          <button onClick={() => setOpen(true)} style={{
            ...sans, fontSize: 13, fontWeight: 500,
            padding: '10px 22px', borderRadius: RADIUS.pill,
            background: p.accent, color: '#fff',
            border: 'none', cursor: 'pointer',
          }}>+ Add staff member</button>
        </div>

        {/* ── Staff table ─────────────────────────────────────────── */}
        <div style={{
          background: p.bgCard, borderRadius: RADIUS.card,
          border: `1px solid ${p.tagBorder}`,
          boxShadow: SHADOW.card,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 1.4fr) 1fr 1fr 1fr 40px',
            gap: 16, padding: '12px 24px',
            borderBottom: `1px solid ${p.tagBorder}`,
            ...sans, fontSize: 11, fontWeight: 600, color: p.textMuted,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <span>Name</span><span>Email</span><span>Role</span><span>Status</span><span></span>
          </div>
          {team.map((member, i) => (
            <div key={member.email} style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(220px, 1.4fr) 1fr 1fr 1fr 40px',
              gap: 16, padding: '16px 24px', alignItems: 'center',
              borderBottom: i < team.length - 1 ? `1px solid ${p.tagBorder}` : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={member.name} size={36} />
                <div>
                  <div style={{ ...sans, fontSize: 14, fontWeight: 500, color: p.textPrimary }}>{member.name}</div>
                  <div style={{ ...sans, fontSize: 12, color: p.textMuted }}>
                    Joined {member.joined}
                  </div>
                </div>
              </div>
              <span style={{ ...sans, fontSize: 13, color: p.textMuted, wordBreak: 'break-all' }}>{member.email}</span>
              <span style={{ ...sans, fontSize: 13, color: p.textPrimary }}>{member.role}</span>
              <div>
                {member.pending ? (
                  <span style={{
                    ...sans, fontSize: 12, fontWeight: 500,
                    padding: '3px 10px', borderRadius: RADIUS.pill,
                    background: '#FEF9EC', color: '#92400E',
                  }}>Invite sent</span>
                ) : member.cert && member.cert !== '—' ? (
                  <span style={{
                    ...sans, fontSize: 12, fontWeight: 500,
                    padding: '3px 10px', borderRadius: RADIUS.pill,
                    background: '#E6F2EB', color: '#2D6A4F',
                  }}>Certified</span>
                ) : (
                  <span style={{
                    ...sans, fontSize: 12, fontWeight: 500,
                    padding: '3px 10px', borderRadius: RADIUS.pill,
                    background: p.tagBg, color: p.textMuted,
                  }}>In progress</span>
                )}
              </div>
              <button
                onClick={() => window.CopiActions && window.CopiActions.openBarista(member.email)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', ...sans, fontSize: 16, color: p.textMuted, padding: 4 }}
              >→</button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Add Staff Modal ──────────────────────────────────────── */}
      {open && (
        <div
          role="dialog" aria-modal="true"
          onClick={e => { if (e.target === e.currentTarget) { setOpen(false); setSent(null); } }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(28,28,26,0.5)',
            display: 'grid', placeItems: 'center', padding: 24,
          }}
        >
          <div style={{
            background: p.bgCard, borderRadius: RADIUS.card * 2,
            width: '100%', maxWidth: 480, padding: '36px 40px',
            position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            <button onClick={() => { setOpen(false); setSent(null); }} style={{
              position: 'absolute', top: 16, right: 16,
              background: 'transparent', border: 'none', cursor: 'pointer',
              ...sans, fontSize: 18, color: p.textMuted, padding: 4,
            }}>✕</button>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✉️</div>
                <h2 style={{ ...display, fontStyle: 'italic', fontSize: 28, color: p.textPrimary, margin: '0 0 10px' }}>
                  Invite sent to {sent.name.split(' ')[0]}
                </h2>
                <p style={{ ...sans, fontSize: 14, color: p.textMuted, lineHeight: 1.6 }}>
                  Your mail client opened with a draft to <strong>{sent.email}</strong>. They'll get access once you send it.
                </p>
              </div>
            ) : (
              <>
                <h2 style={{ ...display, fontStyle: 'italic', fontSize: 28, color: p.textPrimary, margin: '0 0 6px' }}>Add a staff member</h2>
                <p style={{ ...sans, fontSize: 14, color: p.textMuted, margin: '0 0 24px', lineHeight: 1.5 }}>
                  They'll receive an email invite with a link to set up their account.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ ...sans, fontSize: 12, fontWeight: 600, color: p.textMuted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Full name</label>
                    <input autoFocus type="text" placeholder="Devi Sharma" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ ...sans, fontSize: 12, fontWeight: 600, color: p.textMuted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
                    <input type="email" placeholder="devi@milano.coffee" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                    {form.email && !/.+@.+\..+/.test(form.email.trim()) && (
                      <div style={{ ...sans, fontSize: 12, color: '#B91C1C', marginTop: 4 }}>Enter a valid email</div>
                    )}
                    {form.email && team.some(t => t.email.toLowerCase() === form.email.trim().toLowerCase()) && (
                      <div style={{ ...sans, fontSize: 12, color: '#B91C1C', marginTop: 4 }}>Already on your team</div>
                    )}
                  </div>
                  <div>
                    <label style={{ ...sans, fontSize: 12, fontWeight: 600, color: p.textMuted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Role</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {['Barista', 'Manager', 'Host'].map(r => (
                        <button key={r} onClick={() => setForm({ ...form, role: r })} style={{
                          ...sans, fontSize: 13, fontWeight: 500,
                          padding: '8px 16px', borderRadius: RADIUS.pill,
                          background: form.role === r ? p.textPrimary : 'transparent',
                          color: form.role === r ? '#fff' : p.textMuted,
                          border: `1px solid ${form.role === r ? p.textPrimary : p.tagBorder}`,
                          cursor: 'pointer',
                        }}>{r}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ ...sans, fontSize: 12, fontWeight: 600, color: p.textMuted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Location</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['Downtown', 'Westside'].map(loc => (
                        <button key={loc} onClick={() => setForm({ ...form, location: loc })} style={{
                          ...sans, fontSize: 13, fontWeight: 500,
                          padding: '8px 16px', borderRadius: RADIUS.pill,
                          background: form.location === loc ? p.textPrimary : 'transparent',
                          color: form.location === loc ? '#fff' : p.textMuted,
                          border: `1px solid ${form.location === loc ? p.textPrimary : p.tagBorder}`,
                          cursor: 'pointer',
                        }}>{loc}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <button onClick={() => setOpen(false)} style={{
                    flex: '0 0 auto', ...sans, fontSize: 13, fontWeight: 500,
                    padding: '11px 20px', borderRadius: RADIUS.pill,
                    background: 'transparent', color: p.textMuted,
                    border: `1px solid ${p.tagBorder}`, cursor: 'pointer',
                  }}>Cancel</button>
                  <button onClick={sendInvite} disabled={!valid} style={{
                    flex: 1, ...sans, fontSize: 13, fontWeight: 600,
                    padding: '11px 20px', borderRadius: RADIUS.pill,
                    background: valid ? p.accent : p.tagBorder, color: '#fff',
                    border: 'none', cursor: valid ? 'pointer' : 'not-allowed',
                  }}>Send invite →</button>
                </div>
                <p style={{ ...sans, fontSize: 12, color: p.textMuted, textAlign: 'center', marginTop: 12 }}>
                  We'll open your mail client with a pre-filled draft
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { AdminTeamPage });


// ===== admin-curriculum-page.jsx =====
// ═════════════════════════════════════════════════════════
// ADMIN CURRICULUM PAGE — Coffee roaster's curriculum console
// Different from the landing page: workflow-driven, not editorial.
// Custom tracks (built with Bloom), standard library w/ team progress,
// and a "lessons in motion" feed showing what the team is doing now.
// ═════════════════════════════════════════════════════════

function AdminCurriculumPage({ user = {} }) {
  const p = {
    bg: (window.THEME||{}).bg||'#EFE9DA',
    fg: '#1A1410',
    accent: '#3F5A3A',
    cream: '#F4EBD2',
    sun: '#C68A3D',
    cherry: '#7A2B1F'
  };
  const display = { fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif' };
  const sub = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const sans = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const lbl = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };
  const mono = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontVariantNumeric: 'tabular-nums' };

  const name = user.name || 'Brian Turko';
  const cafe = user.cafe || 'Milano';
  const role = user.role || 'Roaster · Admin';

  const store = window.useCopiStore();
  const relTime = (ts) => {
    const s = (Date.now() - ts) / 1000;
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + 'm ago';
    if (s < 86400) return Math.round(s / 3600) + 'h ago';
    const d = Math.round(s / 86400);
    return d <= 1 ? 'yesterday' : d + ' days ago';
  };
  const fmtTime = (mins) => mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;

  // ── Custom tracks built for this café ──────────────────────
  const customTracks = [
  {
    name: 'The Milano bar manual',
    blurb: 'Your bar manual, drilled. Built by Bloom from the PDF you uploaded.',
    lessons: 12, time: '2h 40m', assigned: 6, completed: 2,
    source: 'milano_bar_manual_v3.pdf',
    updated: '4 days ago'
  },
  {
    name: 'Milano single-origins · Fall ’26',
    blurb: 'The five lots on bar this season — origin, processing, dial-in notes.',
    lessons: 5, time: '1h 12m', assigned: 6, completed: 0,
    source: 'fall-26-greenbook.md + tasting notes',
    updated: 'yesterday'
  }];


  // ── Standard Copi library with live team progress ──────────
  const library = store.curriculum.map((v) => {
    const ts = store.teamVolumeStats(v.id);
    const mins = v.lessons.reduce((a, l) => a + (l.minutes || 0), 0);
    return {
      id: v.id, vol: v.vol, num: v.num, name: v.name, lessons: v.lessons.length,
      time: fmtTime(mins), assigned: ts.assigned, completed: ts.completed,
      inProgress: ts.inProgress, cert: v.cert,
    };
  });

  // ── Lessons in motion (live activity feed) ─────────────────
  const motion = store.activity(6).map((a) => ({
    who: a.who, action: a.action, lesson: a.label, when: relTime(a.ts), kind: a.kind,
  }));

  // ── Top-level stats ────────────────────────────────────────
  const certifiedCount = store.teamSnapshot().filter((t) => t.cert !== '\u2014').length;
  const stats = [
    { label: 'VOLUMES', big: String(store.curriculum.length + customTracks.length), sub: `${customTracks.length} custom · ${store.curriculum.length} standard` },
    { label: 'LESSONS / WEEK', big: String(store.lessonsThisWeek()), sub: 'team · last 7 days' },
    { label: 'CERTIFIED', big: String(certifiedCount), sub: `of ${store.team.length} baristas`, alert: certifiedCount === 0 },
    { label: 'TEAM COMPLETION', big: Math.round(store.teamCompletion() * 100) + '%', sub: 'across assigned volumes' },
  ];


  // Initials monogram
  const Mono = ({ name: n, size = 26, bg = p.accent, color = p.cream }) => {
    const initials = n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: bg, color,
        border: `1px solid ${p.fg}`,
        display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.36, fontWeight: 700, letterSpacing: '0.04em',
        flex: '0 0 auto'
      }}>{initials}</div>);

  };

  // Progress bar — hatched almanac style
  const Bar = ({ value, color = p.fg, height = 6 }) =>
  <div style={{ width: '100%', height, background: `${p.fg}15`, border: `1px solid ${p.fg}30`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: `${Math.round(value * 100)}%`, height: '100%', background: color }} />
    </div>;


  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg, position: 'relative' }}>

      {/* ── TOP NAV (matches dashboard) ─────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'center',
        padding: '20px 48px', borderBottom: `1.5px solid ${p.fg}`
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ ...display, fontStyle: 'italic', fontSize: 44, lineHeight: 1 }}>Copi</span>
          <span style={{ ...lbl, opacity: 0.55, paddingLeft: 14, borderLeft: `1px solid ${p.fg}40`, alignSelf: 'center' }}>
            FOR ROASTERIES · {cafe.toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', ...sans, fontSize: 13 }}>
          {[
          { l: 'Dashboard', active: false },
          { l: 'Team', active: false },
          { l: 'Curriculum', active: true },
          { l: 'Analytics', active: false },
          { l: 'Settings', active: false }].
          map((x) =>
          <a key={x.l} data-app-nav={x.l} style={{
            opacity: x.active ? 1 : 0.7,
            fontWeight: x.active ? 700 : 400,
            borderBottom: x.active ? `1.5px solid ${p.fg}` : 'none',
            paddingBottom: 2, cursor: 'pointer'
          }}>{x.l}</a>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button data-app-action="notifications" style={{ position: 'relative', padding: 4, background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="1.8">
              <path d="M6 8a6 6 0 1 1 12 0c0 4 2 5 2 7H4c0-2 2-3 2-7Z" />
              <path d="M10 19a2 2 0 0 0 4 0" />
            </svg>
            <span style={{
              position: 'absolute', top: 2, right: 2,
              width: 7, height: 7, borderRadius: 99, background: p.cherry,
              border: `1.5px solid ${p.bg}`
            }} />
          </button>
          <button data-app-action="invite" style={{
            ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'transparent', color: p.fg,
            padding: '10px 14px', border: `1.5px solid ${p.fg}`, cursor: 'pointer'
          }}>
            + Invite barista
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px 4px 4px', border: `1.5px solid ${p.fg}`, cursor: 'pointer' }}>
            <Mono name={name} size={28} />
            <div style={{ ...sans, fontSize: 12, lineHeight: 1.2 }}>
              <div style={{ fontWeight: 700 }}>{name}</div>
              <div style={{ opacity: 0.6, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HEADING + STATS ─────────────────────────────────────── */}
      <div style={{ padding: '64px 48px 40px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'end' }}>
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>◆ CURRICULUM · NOV 2026</div>
            <h1 style={{
              ...display, fontSize: 92, lineHeight: 0.95, letterSpacing: '-0.035em', fontWeight: 400, margin: 0
            }}>
              What your team<br />
              <em style={{ fontStyle: 'italic', color: p.accent }}>is learning.</em>
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 16 }}>
            <span style={{ ...sub, fontSize: 17, opacity: 0.7, fontStyle: 'italic', maxWidth: 280, textAlign: 'right' }}>
              Custom tracks live on top of the Copi library. Bloom keeps both in sync with what's on bar.
            </span>
          </div>
        </div>

        <div style={{
          marginTop: 56,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          border: `1.5px solid ${p.fg}`
        }}>
          {stats.map((s, i) =>
          <div key={i} style={{
            padding: '24px 28px',
            borderRight: i < stats.length - 1 ? `1px solid ${p.fg}30` : 'none',
            background: s.alert ? `${p.cherry}10` : 'transparent',
            position: 'relative'
          }}>
              {s.alert &&
            <span style={{
              position: 'absolute', top: 14, right: 14,
              width: 7, height: 7, borderRadius: 99, background: p.cherry
            }} />
            }
              <div style={{ ...lbl, opacity: 0.6, marginBottom: 10 }}>{s.label}</div>
              <div style={{ ...display, fontSize: 64, lineHeight: 0.95, letterSpacing: '-0.03em', color: s.alert ? p.cherry : p.fg, ...mono }}>
                {s.big}
              </div>
              <div style={{ ...sub, fontSize: 14, opacity: 0.65, marginTop: 6, fontStyle: 'italic' }}>{s.sub}</div>
            </div>
          )}
        </div>
      </div>

      {/* ── CUSTOM TRACKS (Bloom-built) ─────────────────────────── */}
      <div style={{ padding: '64px 48px 48px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 14, height: 1, background: p.accent }} />
              CUSTOM · BUILT WITH BLOOM
            </div>
            <h2 style={{ ...display, fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: 0 }}>
              For <em style={{ fontStyle: 'italic', color: p.accent }}>{cafe}</em> only.
            </h2>
          </div>
          <button
            onClick={() => alert('Open Bloom to draft a new custom track.')}
            style={{
              ...sans, fontSize: 14, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
              background: p.fg, color: p.cream,
              padding: '16px 22px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10
            }}>+ BUILD WITH COPI AI


          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {customTracks.map((t, i) =>
          <article key={i} style={{
            background: p.cream, border: `1.5px solid ${p.fg}`,
            padding: '28px 28px 24px',
            display: 'flex', flexDirection: 'column', gap: 16,
            position: 'relative'
          }}>
              {/* corner tag */}
              <div style={{
              position: 'absolute', top: -12, left: 24,
              background: p.sun, color: p.fg,
              ...lbl, fontSize: 9, padding: '5px 10px',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
                <InkMark size={11} color={p.fg} />
                CUSTOM TRACK
              </div>

              <div style={{ marginTop: 6 }}>
                <h3 style={{
                ...display, fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.02em', fontWeight: 400, margin: 0
              }}>{t.name}</h3>
                <p style={{ ...sub, fontSize: 16, lineHeight: 1.45, opacity: 0.78, marginTop: 10, fontWeight: 400 }}>
                  {t.blurb}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 24, ...lbl, fontSize: 9, opacity: 0.7 }}>
                <span>{t.lessons} LESSONS</span>
                <span>· {t.time.toUpperCase()}</span>
                <span>· UPDATED {t.updated.toUpperCase()}</span>
              </div>

              {/* progress: assigned vs completed */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', ...lbl, fontSize: 8.5, opacity: 0.7, marginBottom: 6 }}>
                  <span>{t.completed} OF {t.assigned} COMPLETED</span>
                  <span>{Math.round(t.completed / t.assigned * 100)}%</span>
                </div>
                <Bar value={t.completed / t.assigned} color={p.accent} />
              </div>

              <div style={{ ...lbl, opacity: 0.5, fontSize: 8.5, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, background: p.accent, borderRadius: 99 }} />
                SOURCE · {t.source.toUpperCase()}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                onClick={() => alert(`Edit "${t.name}" with Bloom.`)}
                style={{
                  ...sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: 'transparent', color: p.fg,
                  padding: '10px 14px', border: `1.5px solid ${p.fg}`, cursor: 'pointer'
                }}>
                Edit with Bloom</button>
                <button
                onClick={() => alert(`Assign "${t.name}" to baristas.`)}
                style={{
                  ...sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: p.accent, color: p.cream,
                  padding: '10px 14px', border: `1.5px solid ${p.accent}`, cursor: 'pointer'
                }}>
                Assign →</button>
              </div>
            </article>
          )}
        </div>
      </div>

      {/* ── STANDARD LIBRARY w/ team progress ───────────────────── */}
      <div style={{ padding: '64px 48px 48px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ ...lbl, color: p.accent, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 14, height: 1, background: p.accent }} />
            THE COPI LIBRARY · TEAM PROGRESS
          </div>
          <h2 style={{ ...display, fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: 0 }}>
            Three <em style={{ fontStyle: 'italic', color: p.accent }}>volumes</em>, calibrated by Q-graders.
          </h2>
        </div>

        <div style={{ border: `1.5px solid ${p.fg}`, background: p.cream }}>
          {/* header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '110px minmax(220px, 1.6fr) 1fr 1.4fr 0.9fr 130px',
            gap: 18, padding: '14px 24px',
            borderBottom: `1.5px solid ${p.fg}`,
            ...lbl, fontSize: 9, opacity: 0.7
          }}>
            <span>VOLUME</span>
            <span>NAME</span>
            <span>SCOPE</span>
            <span>TEAM PROGRESS</span>
            <span>CERT</span>
            <span></span>
          </div>

          {library.map((l, i) =>
          <div key={l.num} style={{
            display: 'grid',
            gridTemplateColumns: '110px minmax(220px, 1.6fr) 1fr 1.4fr 0.9fr 130px',
            gap: 18, padding: '24px 24px',
            alignItems: 'center',
            borderBottom: i < library.length - 1 ? `1px dashed ${p.fg}25` : 'none'
          }}>
              <div>
                <div style={{ ...lbl, opacity: 0.55, fontSize: 9 }}>{l.vol}</div>
                <div style={{ ...display, fontStyle: 'italic', fontSize: 38, lineHeight: 1, color: p.accent, fontWeight: 400, ...mono }}>
                  {l.num}
                </div>
              </div>

              <div>
                <div style={{ ...display, fontSize: 26, lineHeight: 1.05, fontWeight: 400, letterSpacing: '-0.015em' }}>{l.name}</div>
                <div style={{ ...lbl, opacity: 0.55, fontSize: 8.5, marginTop: 6 }}>{l.lessons} LESSONS · {l.time.toUpperCase()}</div>
              </div>

              <div style={{ ...sans, fontSize: 12, ...mono }}>
                <div><strong style={{ fontWeight: 700 }}>{l.assigned}</strong> <span style={{ opacity: 0.6 }}>assigned</span></div>
                <div style={{ marginTop: 4 }}><strong style={{ fontWeight: 700 }}>{l.completed}</strong> <span style={{ opacity: 0.6 }}>completed</span></div>
                <div style={{ marginTop: 4 }}><strong style={{ fontWeight: 700 }}>{l.inProgress}</strong> <span style={{ opacity: 0.6 }}>in progress</span></div>
              </div>

              <div>
                <Bar value={l.assigned ? l.completed / l.assigned : 0} color={p.accent} height={8} />
                <div style={{ display: 'flex', justifyContent: 'space-between', ...lbl, fontSize: 8.5, opacity: 0.6, marginTop: 6 }}>
                  <span>{l.assigned ? Math.round(l.completed / l.assigned * 100) : 0}% COMPLETE</span>
                  <span>{l.assigned ? Math.round(l.inProgress / l.assigned * 100) : 0}% ACTIVE</span>
                </div>
              </div>

              <div style={{ ...lbl, color: p.accent, fontSize: 9 }}>◆ {l.cert.toUpperCase()}</div>

              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <button
                onClick={() => window.CopiActions && window.CopiActions.openLesson(l.id, store.volById(l.id).lessons[0].id)}
                style={{
                  ...sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: 'transparent', color: p.fg,
                  padding: '8px 10px', border: `1.5px solid ${p.fg}`, cursor: 'pointer'
                }}>
                Preview</button>
                <button
                onClick={() => window.CopiActions && window.CopiActions.openAssign(l.id)}
                style={{
                  ...sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: p.fg, color: p.cream,
                  padding: '8px 10px', border: `1.5px solid ${p.fg}`, cursor: 'pointer'
                }}>
                Assign</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <button
            style={{
              ...sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              background: 'transparent', color: p.fg,
              padding: '14px 28px', border: `1.5px solid ${p.fg}`, cursor: 'pointer'
            }}>
            Browse other volumes →</button>
        </div>
      </div>

      {/* ── LESSONS IN MOTION ───────────────────────────────────── */}
      <div style={{ padding: '64px 48px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 14, height: 1, background: p.accent }} />
              LESSONS IN MOTION
            </div>
            <h2 style={{ ...display, fontSize: 44, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: 0 }}>
              What happened <em style={{ fontStyle: 'italic', color: p.accent }}>this week.</em>
            </h2>
          </div>
          <a data-app-nav="Team" style={{
            ...lbl, color: p.fg, opacity: 0.7, cursor: 'pointer', borderBottom: `1px solid ${p.fg}40`, paddingBottom: 2
          }}>SEE ALL ACTIVITY →</a>
        </div>

        <div>
          {motion.map((m, i) => {
            const kindStyle = ({
              complete: { bg: p.accent, fg: p.cream, label: 'COMPLETED' },
              cert: { bg: p.accent, fg: p.cream, label: 'CERTIFIED' },
              assign: { bg: p.sun, fg: p.fg, label: 'ASSIGNED' },
              active: { bg: p.bg, fg: p.fg, label: 'IN PROGRESS', dashed: true },
              review: { bg: p.sun, fg: p.fg, label: 'SUBMITTED' }
            })[m.kind] || { bg: p.bg, fg: p.fg, label: (m.action || '').toUpperCase(), dashed: true };
            return (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '38px 1fr auto auto auto',
                gap: 18, alignItems: 'center',
                padding: '18px 0',
                borderTop: `1px dashed ${p.fg}30`,
                borderBottom: i === motion.length - 1 ? `1px dashed ${p.fg}30` : 'none'
              }}>
                <Mono name={m.who} size={32} bg={p.accent} />
                <div>
                  <div style={{ ...sub, fontSize: 16, fontWeight: 500, lineHeight: 1.2 }}>
                    {m.who} <span style={{ opacity: 0.6, fontWeight: 400 }}>{m.action}</span> {m.lesson}
                  </div>
                </div>
                <span style={{
                  ...lbl, fontSize: 9, padding: '4px 9px',
                  background: kindStyle.bg, color: kindStyle.fg,
                  border: kindStyle.dashed ? `1px dashed ${p.fg}55` : 'none'
                }}>{kindStyle.label}</span>
                <span style={{ ...sans, fontSize: 11, opacity: 0.55, minWidth: 88, textAlign: 'right' }}>{m.when}</span>
                {m.pending ?
                <button
                  onClick={() => alert(`Review ${m.who}'s submission`)}
                  style={{
                    ...sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: p.fg, color: p.cream,
                    padding: '7px 11px', border: `1.5px solid ${p.fg}`, cursor: 'pointer'
                  }}>
                  Review →</button> :

                <span style={{ ...lbl, opacity: 0.4, fontSize: 9, minWidth: 80, textAlign: 'right' }}>—</span>
                }
              </div>);

          })}
        </div>
      </div>
    </div>);

}

Object.assign(window, { AdminCurriculumPage });

// ===== admin-settings-page.jsx =====
// ═════════════════════════════════════════════════════════
// ADMIN SETTINGS PAGE — simple account settings for the roaster
// Profile, password, notifications, workspace — kept deliberately
// light. Matches the dashboard nav + almanac section styling.
// ═════════════════════════════════════════════════════════

function AdminSettingsPage({ user = {} }) {
  const p = {
    bg: (window.THEME||{}).bg||'#EFE9DA',
    fg: '#1A1410',
    accent: '#3F5A3A',
    cream: '#F4EBD2',
    sun: '#C68A3D',
    cherry: '#7A2B1F',
  };
  const display = { fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif' };
  const sub     = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const sans    = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const lbl     = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };

  const name = user.name || 'Brian Turko';
  const cafe = user.cafe || 'Milano';
  const role = user.role || 'Roaster · Admin';
  const email = user.email || 'admin@milano.coffee';

  // ── Local form state ───────────────────────────────────────
  const [fullName, setFullName] = React.useState(name);
  const [workEmail, setWorkEmail] = React.useState(email);
  const [cafeName, setCafeName] = React.useState(cafe);
  const [saved, setSaved] = React.useState(false);

  const [notes, setNotes] = React.useState({
    signoff: true,
    weekly: true,
    joins: true,
    product: false,
  });

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  // ── Initials monogram ──────────────────────────────────────
  const Mono = ({ name: n, size = 26, bg = p.accent, color = p.cream }) => {
    const initials = n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: bg, color,
        border: `1px solid ${p.fg}`,
        display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.36, fontWeight: 700, letterSpacing: '0.04em',
        flex: '0 0 auto',
      }}>{initials}</div>
    );
  };

  // ── Reusable bits ──────────────────────────────────────────
  const inputStyle = {
    ...sans, fontSize: 16, fontWeight: 400,
    width: '100%', padding: '12px 14px',
    background: p.bg, color: p.fg,
    border: `1.5px solid ${p.fg}`, borderRadius: 0,
    outline: 'none',
  };

  const Field = ({ label, children }) => (
    <label style={{ display: 'block' }}>
      <div style={{ ...lbl, marginBottom: 8 }}>{label}</div>
      {children}
    </label>
  );

  const Input = (props) => <input {...props} style={inputStyle} />;

  // Square almanac-style toggle
  const Toggle = ({ on, onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: 52, height: 28, flex: '0 0 auto',
        background: on ? p.accent : 'transparent',
        border: `1.5px solid ${p.fg}`,
        position: 'relative', cursor: 'pointer', padding: 0,
        transition: 'background 160ms ease',
      }}
      aria-pressed={on}
    >
      <span style={{
        position: 'absolute', top: 2, bottom: 2,
        left: on ? 26 : 2, width: 20,
        background: on ? p.cream : p.fg,
        transition: 'left 180ms cubic-bezier(.2,.7,.2,1), background 160ms ease',
      }} />
    </button>
  );

  // Section row — left label column, right content
  const Section = ({ kicker, title, desc, children, first }) => (
    <div style={{
      display: 'grid', gridTemplateColumns: '320px 1fr', gap: 56,
      padding: '48px 48px',
      borderTop: first ? 'none' : `1px dashed ${p.fg}30`,
    }}>
      <div>
        <div style={{ ...lbl, color: p.accent, marginBottom: 14 }}>{kicker}</div>
        <h2 style={{ ...display, fontSize: 38, lineHeight: 1.0, letterSpacing: '-0.02em', fontWeight: 400, margin: 0 }}>
          {title}
        </h2>
        {desc && (
          <p style={{ ...sub, fontSize: 17, lineHeight: 1.4, opacity: 0.7, marginTop: 12, fontWeight: 400, maxWidth: 240 }}>
            {desc}
          </p>
        )}
      </div>
      <div style={{ maxWidth: 640 }}>{children}</div>
    </div>
  );

  const noteRows = [
    { key: 'signoff', label: 'Sign-off requests', desc: 'When a barista submits a drill for your review.' },
    { key: 'weekly',  label: 'Weekly summary',    desc: 'A Monday digest of what your team learned.' },
    { key: 'joins',   label: 'New barista joins', desc: 'When someone accepts an invite to the workspace.' },
    { key: 'product', label: 'Product updates',   desc: 'Occasional notes on new Copi features.' },
  ];

  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg, position: 'relative' }}>

      {/* ── TOP NAV (matches dashboard) ─────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'center',
        padding: '20px 48px', borderBottom: `1.5px solid ${p.fg}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ ...display, fontStyle: 'italic', fontSize: 44, lineHeight: 1 }}>Copi</span>
          <span style={{ ...lbl, opacity: 0.55, paddingLeft: 14, borderLeft: `1px solid ${p.fg}40`, alignSelf: 'center' }}>
            FOR ROASTERIES · {cafe.toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', ...sans, fontSize: 13 }}>
          {[
            { l: 'Dashboard',  active: false },
            { l: 'Team',       active: false },
            { l: 'Curriculum', active: false },
            { l: 'Analytics',  active: false },
            { l: 'Settings',   active: true  },
          ].map((x) => (
            <a key={x.l} data-app-nav={x.l} style={{
              opacity: x.active ? 1 : 0.7,
              fontWeight: x.active ? 700 : 400,
              borderBottom: x.active ? `1.5px solid ${p.fg}` : 'none',
              paddingBottom: 2, cursor: 'pointer',
            }}>{x.l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button data-app-action="notifications" style={{ position: 'relative', padding: 4, background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="1.8">
              <path d="M6 8a6 6 0 1 1 12 0c0 4 2 5 2 7H4c0-2 2-3 2-7Z" />
              <path d="M10 19a2 2 0 0 0 4 0" />
            </svg>
            <span style={{
              position: 'absolute', top: 2, right: 2,
              width: 7, height: 7, borderRadius: 99, background: p.cherry,
              border: `1.5px solid ${p.bg}`,
            }} />
          </button>
          <button data-app-action="invite" style={{
            ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'transparent', color: p.fg,
            padding: '10px 14px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
          }}>
            + Invite barista
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px 4px 4px', border: `1.5px solid ${p.fg}`, cursor: 'pointer' }}>
            <Mono name={name} size={28} />
            <div style={{ ...sans, fontSize: 12, lineHeight: 1.2 }}>
              <div style={{ fontWeight: 700 }}>{name}</div>
              <div style={{ opacity: 0.6, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PAGE HEADING ────────────────────────────────────────── */}
      <div style={{ padding: '64px 48px 40px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>◆ ACCOUNT · SETTINGS</div>
        <h1 style={{ ...display, fontSize: 92, lineHeight: 0.95, letterSpacing: '-0.035em', fontWeight: 400, margin: 0 }}>
          Settings.
        </h1>
        <p style={{ ...sub, fontSize: 22, lineHeight: 1.4, opacity: 0.75, marginTop: 16, fontWeight: 400, maxWidth: 560 }}>
          Your account, your sign-in, and what Copi emails you about.
        </p>
      </div>

      {/* ── SECTIONS ────────────────────────────────────────────── */}

      {/* Profile */}
      <Section first kicker="◆ PROFILE" title="Who you are." desc="Shown to your team across the workspace.">
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
          <Mono name={fullName} size={64} />
          <div>
            <button style={{
              ...sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'transparent', color: p.fg,
              padding: '10px 16px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
            }}>Change photo</button>
            <div style={{ ...sans, fontSize: 12, opacity: 0.55, marginTop: 8 }}>JPG or PNG · up to 2MB</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Field label="FULL NAME">
            <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Field>
          <Field label="ROLE">
            <div style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed', display: 'flex', alignItems: 'center' }}>
              {role}
            </div>
          </Field>
        </div>
      </Section>

      {/* Sign-in */}
      <Section kicker="◆ SIGN-IN" title="Email & password." desc="Used to log in and to send you alerts.">
        <div style={{ display: 'grid', gap: 20 }}>
          <Field label="WORK EMAIL">
            <Input type="email" value={workEmail} onChange={(e) => setWorkEmail(e.target.value)} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Field label="NEW PASSWORD">
              <Input type="password" placeholder="••••••••" />
            </Field>
            <Field label="CONFIRM PASSWORD">
              <Input type="password" placeholder="••••••••" />
            </Field>
          </div>
          <div style={{ ...sans, fontSize: 12, opacity: 0.55 }}>
            Leave password fields blank to keep your current one.
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section kicker="◆ NOTIFICATIONS" title="What we email you." desc="Turn off anything you don't want landing in your inbox.">
        <div style={{ border: `1.5px solid ${p.fg}` }}>
          {noteRows.map((row, i) => (
            <div key={row.key} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
              padding: '20px 22px',
              borderBottom: i < noteRows.length - 1 ? `1px dashed ${p.fg}30` : 'none',
              background: i % 2 ? 'transparent' : `${p.cream}80`,
            }}>
              <div>
                <div style={{ ...sub, fontSize: 19, fontWeight: 500, lineHeight: 1.1 }}>{row.label}</div>
                <div style={{ ...sans, fontSize: 13, opacity: 0.6, marginTop: 4 }}>{row.desc}</div>
              </div>
              <Toggle on={notes[row.key]} onClick={() => setNotes({ ...notes, [row.key]: !notes[row.key] })} />
            </div>
          ))}
        </div>
      </Section>

      {/* Workspace */}
      <Section kicker="◆ WORKSPACE" title="Your café." desc="The name baristas see on their app.">
        <Field label="CAFÉ OR ROASTERY NAME">
          <Input type="text" value={cafeName} onChange={(e) => setCafeName(e.target.value)} />
        </Field>
      </Section>

      {/* ── SAVE BAR ────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        padding: '28px 48px', borderTop: `1.5px solid ${p.fg}`, background: p.cream,
        position: 'sticky', bottom: 0,
      }}>
        <button
          data-app-action="logout"
          style={{
            ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
            background: 'transparent', color: p.cherry,
            padding: '12px 18px', border: `1.5px solid ${p.cherry}`, cursor: 'pointer',
          }}
        >
          Sign out
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {saved && (
            <span style={{ ...lbl, color: p.accent }}>◆ Saved</span>
          )}
          <button
            onClick={flashSaved}
            style={{
              ...sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              background: p.accent, color: p.cream,
              padding: '14px 28px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
            }}
          >
            Save changes
          </button>
        </div>
      </div>

    </div>
  );
}

Object.assign(window, { AdminSettingsPage });


// ===== admin-analytics-page.jsx =====
// ═════════════════════════════════════════════════════════
// ADMIN ANALYTICS — what the manager needs to coach the floor.
// Team progress, where knowledge is thin, and a concrete
// on-bar drill for each gap. Almanac styling, matches the
// dashboard / curriculum console.
// ═════════════════════════════════════════════════════════

function AdminAnalyticsPage({ user = {} }) {
  const p = {
    bg: (window.THEME||{}).bg||'#EFE9DA',
    fg: '#1A1410',
    accent: '#3F5A3A',
    cream: '#F4EBD2',
    sun: '#C68A3D',
    cherry: '#7A2B1F',
  };
  const display = { fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif' };
  const sub     = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const sans    = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const lbl     = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 10 };
  const mono    = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontVariantNumeric: 'tabular-nums' };

  const name = user.name || 'Brian Turko';
  const cafe = user.cafe || 'Milano';
  const role = user.role || 'Roaster · Admin';

  // ── Top stats ──────────────────────────────────────────────
  const store = window.useCopiStore();
  const relTime = (ts) => {
    if (!ts) return 'no activity yet';
    const s = (Date.now() - ts) / 1000;
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + 'm ago';
    if (s < 86400) return Math.round(s / 3600) + 'h ago';
    const d = Math.round(s / 86400);
    return d <= 1 ? 'yesterday' : d + ' days ago';
  };
  const lastActive = (email) => {
    const _dbUser = store.getUserByEmail ? store.getUserByEmail(email) : null;
    const _uprog = _dbUser ? (store.raw().progress[_dbUser.id] || {}) : null;
    const u = _uprog ? { lessons: _uprog.lessons || {}, finals: _uprog.finals || {} } : null;
    if (!u) return 0;
    let m = 0;
    Object.values(u.lessons).forEach((r) => { if (r.ts > m) m = r.ts; });
    Object.values(u.finals || {}).forEach((r) => { if (r.ts > m) m = r.ts; });
    return m;
  };
  const weekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
  const snapshot = store.teamSnapshot();
  const needsAttention = snapshot.filter((t) => t.pct < 35).length;

  const stats = [
    { label: 'TEAM COMPLETION', big: Math.round(store.teamCompletion() * 100) + '%', sub: 'across assigned volumes' },
    { label: 'LESSONS / WEEK',  big: String(store.lessonsThisWeek()), sub: 'team · last 7 days' },
    { label: 'AVG QUIZ SCORE',  big: Math.round(store.avgScore() * 100) + '%', sub: 'across all checks' },
    { label: 'NEEDS ATTENTION', big: String(needsAttention), sub: 'baristas under 35%', alert: needsAttention > 0 },
  ];

  // ── Per-barista progress (live) ────────────────────────────
  const team = snapshot.map((t) => {
    const ts = lastActive(t.email);
    const flag = t.pct >= 80 ? 'strong' : t.pct >= 55 ? 'ok' : t.pct >= 35 ? 'watch' : 'risk';
    const trend = ts >= weekAgo ? 'up' : flag === 'risk' ? 'down' : 'steady';
    return { name: t.name, role: t.role, cert: t.cert, prog: t.pct, trend, active: relTime(ts), flag };
  });

  // ── Knowledge gaps + how to train them on bar ──────────────
  // Milano's own onboarding knowledge — the stuff Brian used to teach
  // off a laminated sheet — now tracked alongside the coffee skills.
  const gaps = [
    {
      topic: 'Introduction to Milano', vol: 'MILANO · CAFÉ', pass: 41, sev: 'HIGH',
      note: "New hires can't yet tell a customer what makes Milano different — the story, the blends, the why.",
      drill: 'At pre-shift, each new hire gives the 60-second Milano story to the team. The lead coaches it until it lands naturally with a customer.',
    },
    {
      topic: 'Milano standards & expectations', vol: 'MILANO · CAFÉ', pass: 49, sev: 'HIGH',
      note: 'The non-negotiables that used to live on the laminated sheet — service, cleanliness, ticket times — are inconsistent shift to shift.',
      drill: 'Walk the standards checklist together on the first shift and sign off each line. Re-check one section at every handover for the first two weeks.',
    },
    {
      topic: 'The house recipes', vol: 'MILANO · BAR', pass: 55, sev: 'MED',
      note: 'Cognac and Butter aren’t dialed to the house spec consistently — shots drift between baristas.',
      drill: 'Morning dial-in against the Milano recipe card: pull Cognac and Butter to spec, taste together, and only open the bar once both match the target.',
    },
    {
      topic: 'Knowing the menu', vol: 'MILANO · BAR', pass: 58, sev: 'MED',
      note: 'Team struggles to describe Cognac vs. Butter vs. Brian’s Summertime to a customer in plain language.',
      drill: 'At handover, each barista pitches one blend to the group in two sentences — no jargon. Rotate which blend each day.',
    },
    {
      topic: 'Origin & history', vol: 'VOL · I', pass: 73, sev: 'LOW',
      note: 'Solid overall — a few new hires still shaky on regions.',
      drill: 'Put a one-line origin story next to each coffee on the menu board this week. Rotate who writes it.',
    },
  ];

  const sevColor = (s) => s === 'HIGH' ? p.cherry : s === 'MED' ? p.sun : p.accent;

  // ── Initials monogram ──────────────────────────────────────
  const Mono = ({ name: n, size = 26, bg = p.accent, color = p.cream }) => {
    const initials = n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: bg, color,
        border: `1px solid ${p.fg}`, display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.36, fontWeight: 700, letterSpacing: '0.04em', flex: '0 0 auto',
      }}>{initials}</div>
    );
  };

  const Bar = ({ value, color = p.fg, height = 8 }) => (
    <div style={{ width: '100%', height, background: `${p.fg}15`, border: `1px solid ${p.fg}30`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: `${Math.round(value)}%`, height: '100%', background: color }} />
    </div>
  );

  const Trend = ({ dir }) => {
    const c = dir === 'up' ? p.accent : dir === 'down' ? p.cherry : `${p.fg}70`;
    const d = dir === 'up' ? 'M3 13l5-6 4 4 6-7' : dir === 'down' ? 'M3 5l5 6 4-4 6 7' : 'M3 10h16';
    return (
      <svg width="22" height="16" viewBox="0 0 22 18" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
        {dir !== 'steady' && <path d={dir === 'up' ? 'M14 4h5v5' : 'M14 14h5v-5'} />}
      </svg>
    );
  };

  const flagMap = {
    strong: { label: 'STRONG', bg: p.accent, fg: p.cream },
    ok:     { label: 'ON TRACK', bg: 'transparent', fg: p.fg, border: true },
    watch:  { label: 'WATCH', bg: p.sun, fg: p.fg },
    risk:   { label: 'AT RISK', bg: p.cherry, fg: p.cream },
  };

  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg, position: 'relative' }}>

      {/* ── TOP NAV ──────────────────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'center',
        padding: '20px 48px', borderBottom: `1.5px solid ${p.fg}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ ...display, fontStyle: 'italic', fontSize: 44, lineHeight: 1 }}>Copi</span>
          <span style={{ ...lbl, opacity: 0.55, paddingLeft: 14, borderLeft: `1px solid ${p.fg}40`, alignSelf: 'center' }}>
            FOR ROASTERIES · {cafe.toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', ...sans, fontSize: 13 }}>
          {[
            { l: 'Dashboard',  active: false },
            { l: 'Team',       active: false },
            { l: 'Curriculum', active: false },
            { l: 'Analytics',  active: true  },
            { l: 'Settings',   active: false },
          ].map((x) => (
            <a key={x.l} data-app-nav={x.l} style={{
              opacity: x.active ? 1 : 0.7,
              fontWeight: x.active ? 700 : 400,
              borderBottom: x.active ? `1.5px solid ${p.fg}` : 'none',
              paddingBottom: 2, cursor: 'pointer',
            }}>{x.l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button data-app-action="notifications" style={{ position: 'relative', padding: 4, background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="1.8">
              <path d="M6 8a6 6 0 1 1 12 0c0 4 2 5 2 7H4c0-2 2-3 2-7Z" />
              <path d="M10 19a2 2 0 0 0 4 0" />
            </svg>
            <span style={{ position: 'absolute', top: 2, right: 2, width: 7, height: 7, borderRadius: 99, background: p.cherry, border: `1.5px solid ${p.bg}` }} />
          </button>
          <button data-app-action="invite" style={{
            ...sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'transparent', color: p.fg, padding: '10px 14px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
          }}>+ Invite barista</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px 4px 4px', border: `1.5px solid ${p.fg}`, cursor: 'pointer' }}>
            <Mono name={name} size={28} />
            <div style={{ ...sans, fontSize: 12, lineHeight: 1.2 }}>
              <div style={{ fontWeight: 700 }}>{name}</div>
              <div style={{ opacity: 0.6, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HEADING + STATS ──────────────────────────────────────── */}
      <div style={{ padding: '64px 48px 40px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ ...lbl, color: p.accent, marginBottom: 18 }}>◆ ANALYTICS · NOV 2026</div>
        <h1 style={{ ...display, fontSize: 92, lineHeight: 0.95, letterSpacing: '-0.035em', fontWeight: 400, margin: 0 }}>
          Where your team<br /><em style={{ fontStyle: 'italic', color: p.accent }}>stands.</em>
        </h1>
        <p style={{ ...sub, fontSize: 22, lineHeight: 1.4, opacity: 0.75, marginTop: 18, fontWeight: 400, maxWidth: 680 }}>
          What everyone's learned, where the knowledge is thin, and exactly how to close each gap on the bar.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 44, border: `1.5px solid ${p.fg}` }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '24px 24px',
              borderRight: i < 3 ? `1px solid ${p.fg}30` : 'none',
              background: s.alert ? 'rgba(122,43,31,0.10)' : 'transparent',
            }}>
              <div style={{ ...lbl, fontSize: 9, opacity: 0.65 }}>{s.label}</div>
              <div style={{ ...display, fontSize: 60, lineHeight: 0.95, marginTop: 10, fontWeight: 400, color: s.alert ? p.cherry : p.fg, ...mono }}>{s.big}</div>
              <div style={{ ...sans, fontSize: 12, opacity: 0.6, marginTop: 6 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TEAM PROGRESS ────────────────────────────────────────── */}
      <div style={{ padding: '64px 48px 48px', borderBottom: `1.5px solid ${p.fg}` }}>
        <div style={{ ...lbl, color: p.accent, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 14, height: 1, background: p.accent }} />TEAM PROGRESS
        </div>
        <h2 style={{ ...display, fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: '0 0 28px' }}>
          Everyone, <em style={{ fontStyle: 'italic', color: p.accent }}>at a glance.</em>
        </h2>

        <div style={{ border: `1.5px solid ${p.fg}`, background: p.cream }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.6fr 0.7fr 1fr',
            gap: 18, padding: '14px 24px', borderBottom: `1.5px solid ${p.fg}`, ...lbl, fontSize: 9, opacity: 0.7,
          }}>
            <span>BARISTA</span><span>CERT</span><span>OVERALL PROGRESS</span><span>TREND</span><span>STATUS</span>
          </div>
          {team.map((t, i) => {
            const fm = flagMap[t.flag];
            return (
              <div key={t.name} style={{
                display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.6fr 0.7fr 1fr',
                gap: 18, padding: '18px 24px', alignItems: 'center',
                borderBottom: i < team.length - 1 ? `1px dashed ${p.fg}25` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Mono name={t.name} size={32} bg={t.flag === 'risk' ? p.cherry : p.accent} />
                  <div>
                    <div style={{ ...sub, fontSize: 18, fontWeight: 500, lineHeight: 1.05 }}>{t.name}</div>
                    <div style={{ ...lbl, fontSize: 8, opacity: 0.5, marginTop: 2 }}>{t.role.toUpperCase()} · {t.active.toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ ...lbl, fontSize: 9, color: t.cert === '—' ? `${p.fg}50` : p.accent }}>
                  {t.cert === '—' ? '—' : `◆ ${t.cert.toUpperCase()}`}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}><Bar value={t.prog} color={t.flag === 'risk' ? p.cherry : p.accent} /></div>
                  <span style={{ ...mono, fontSize: 14, fontWeight: 700, minWidth: 38, textAlign: 'right' }}>{t.prog}%</span>
                </div>
                <div><Trend dir={t.trend} /></div>
                <div>
                  <span style={{
                    ...lbl, fontSize: 8.5, padding: '4px 9px',
                    background: fm.bg, color: fm.fg,
                    border: fm.border ? `1px solid ${p.fg}40` : 'none',
                  }}>{fm.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── KNOWLEDGE GAPS + HOW TO TRAIN ────────────────────────── */}
      <div style={{ padding: '64px 48px 80px' }}>
        <div style={{ ...lbl, color: p.cherry, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 14, height: 1, background: p.cherry }} />KNOWLEDGE GAPS · RANKED
        </div>
        <h2 style={{ ...display, fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: '0 0 12px' }}>
          What's <em style={{ fontStyle: 'italic', color: p.cherry }}>thin</em> — and how to fix it.
        </h2>
        <p style={{ ...sub, fontSize: 19, lineHeight: 1.4, opacity: 0.72, margin: '0 0 36px', fontWeight: 400, maxWidth: 620 }}>
          Sorted by where the team struggles most. Each one comes with a drill you can run on the floor this week.
        </p>

        <div style={{ display: 'grid', gap: 18 }}>
          {gaps.map((g, i) => (
            <div key={i} style={{ border: `1.5px solid ${p.fg}`, background: p.cream, display: 'grid', gridTemplateColumns: '1.1fr 1.4fr' }}>
              {/* Left — the gap */}
              <div style={{ padding: '26px 28px', borderRight: `1.5px solid ${p.fg}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                  <div style={{ ...lbl, fontSize: 9, opacity: 0.55 }}>{g.vol}</div>
                  <span style={{ ...lbl, fontSize: 8.5, padding: '4px 9px', background: sevColor(g.sev), color: g.sev === 'MED' ? p.fg : p.cream }}>
                    {g.sev} GAP
                  </span>
                </div>
                <h3 style={{ ...display, fontSize: 34, lineHeight: 1.0, letterSpacing: '-0.02em', fontWeight: 400, margin: 0 }}>{g.topic}</h3>
                <p style={{ ...sans, fontSize: 13.5, lineHeight: 1.4, opacity: 0.7, marginTop: 12 }}>{g.note}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
                  <div style={{ flex: 1 }}><Bar value={g.pass} color={sevColor(g.sev)} height={8} /></div>
                  <span style={{ ...mono, fontSize: 14, fontWeight: 700 }}>{g.pass}%</span>
                </div>
                <div style={{ ...lbl, fontSize: 8, opacity: 0.5, marginTop: 6 }}>FIRST-ATTEMPT PASS RATE</div>
              </div>
              {/* Right — the drill */}
              <div style={{ padding: '26px 28px', background: 'rgba(63,90,58,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ ...lbl, color: p.accent, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 12, height: 1, background: p.accent }} />ON-BAR DRILL
                </div>
                <p style={{ ...sub, fontSize: 21, lineHeight: 1.4, fontWeight: 400 }}>{g.drill}</p>
                <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                  <button style={{
                    ...sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: p.accent, color: p.cream, padding: '11px 18px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
                  }}>Assign drill →</button>
                  <button style={{
                    ...sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: 'transparent', color: p.fg, padding: '11px 18px', border: `1.5px solid ${p.fg}`, cursor: 'pointer',
                  }}>See lesson</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

Object.assign(window, { AdminAnalyticsPage });


// ===== barista-dashboard.jsx =====
// ═════════════════════════════════════════════════════════
// BARISTA DASHBOARD — "Today". One clear next action, the
// current volume's path, and real progress. Reads everything
// from CopiStore; the big card launches the lesson player.
// ═════════════════════════════════════════════════════════

function BaristaDashboard({ user = {} }) {
  const _th = window.THEME || {};
  const p = { bg: _th.bg||'#EFE9DA', fg: _th.ink||'#1F1B14', accent: _th.accent||'#44704B', cream: _th.bgCard||'#FBF8F0', sun: _th.gold||'#C49455', cherry: _th.danger||'#7A2B1F', rule: _th.line||'#D5CDBA', muted: _th.muted||'#6E675A' };
  const display = { fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif' };
  const sub     = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const sans    = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const lbl     = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 10 };

  const store = window.useCopiStore();
  const email = user.email || 'lili@milano.coffee';
  const name = (user.name || 'Lili').split(' ')[0];

  const assignedVols = store.assignedVolumes(email);
  const current = store.currentLesson(email);
  const overall = Math.round(store.overallPct(email) * 100);

  // this week (per user) — look up progress by userId now
  const weekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
  const dbUser = store.getUserByEmail ? store.getUserByEmail(email) : null;
  const rawProg = dbUser ? (store.raw().progress[dbUser.id] || {}) : {};
  const rawLessons = rawProg.lessons || {};
  const thisWeek = Object.values(rawLessons).filter((r) => r.done && r.ts >= weekAgo).length;
  const badges = ['vol-1', 'vol-2', 'vol-3'].filter((v) => store.volumeStats(email, v).certified).length;

  // Product update modules assigned to this user
  const productUpdates = dbUser
    ? store.getAssignments(dbUser.id).filter((a) => {
        const mod = store.raw().modules[a.moduleId];
        return mod && mod.type === 'product_update' && mod.status === 'published' && a.status !== 'completed';
      }).map((a) => ({ assignment: a, module: store.raw().modules[a.moduleId] }))
    : [];

  // Product update modal state
  const [puModal, setPuModal] = React.useState(null); // { assignment, module }
  const [puComplete, setPuComplete] = React.useState(false);

  const openProductUpdate = (pu) => { setPuModal(pu); setPuComplete(false); };
  const completeProductUpdate = () => {
    if (!puModal) return;
    store.updateAssignmentStatus(puModal.assignment.id, 'completed');
    setPuComplete(true);
    setTimeout(() => setPuModal(null), 1400);
  };

  const act = window.CopiActions || {};

  // Initials monogram
  const Mono = ({ name: n, size = 36 }) => {
    const initials = (n || 'L').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: p.accent, color: p.cream, borderRadius: '50%',
        display: 'grid', placeItems: 'center', ...sans, fontSize: size * 0.38, fontWeight: 700,
        letterSpacing: '0.04em', flex: '0 0 auto',
      }}>{initials}</div>
    );
  };

  // The volume that holds the current action (for the path display)
  const focusVol = current ? current.vol : assignedVols[0] || null;

  // ── Big card content ──────────────────────────────────────
  const openCurrent = () => {
    if (!current) return;
    if (current.isFinal) act.openFinal && act.openFinal(current.vol.id);
    else act.openLesson && act.openLesson(current.vol.id, current.lesson.id);
  };

  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg }}>

      {/* ── TOP NAV ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px' }}>
        <span style={{ ...display, fontStyle: 'italic', fontSize: 38, lineHeight: 1 }}>Copi</span>
        <div style={{ display: 'flex', gap: 36, ...sans, fontSize: 13 }}>
          {[{ l: 'Today', active: true }, { l: 'Library', active: false }, { l: 'Profile', active: false }].map((x) => (
            <a key={x.l} data-app-nav={x.l} style={{
              opacity: x.active ? 1 : 0.55, fontWeight: x.active ? 700 : 400,
              borderBottom: x.active ? `2px solid ${p.fg}` : 'none', paddingBottom: 4, cursor: 'pointer',
            }}>{x.l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: p.sun, color: p.fg }}>
            <svg width="14" height="16" viewBox="0 0 14 16" fill={p.fg} aria-hidden="true">
              <path d="M7 0 C 8 4, 12 5, 12 10 C 12 13.5, 9.5 16, 7 16 C 4.5 16, 2 13.5, 2 10 C 2 7, 4 6, 5 4 C 6 2, 6 1, 7 0 Z" />
            </svg>
            <span style={{ ...sans, fontWeight: 700, fontSize: 14 }}>{overall}%</span>
          </div>
          <Mono name={user.name} size={36} />
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>

        <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 40 }}>
          <h1 style={{ ...display, fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: 0 }}>
            Hi <em style={{ fontStyle: 'italic', color: p.accent }}>{name}</em> —
          </h1>
          <p style={{ ...sub, fontSize: 22, opacity: 0.7, fontWeight: 400, margin: '12px 0 0', fontStyle: 'italic' }}>
            {current ? 'ready to pick up where you left off?' : assignedVols.length ? 'you\u2019re all caught up.' : 'nothing assigned yet.'}
          </p>
        </div>

        {/* ── BIG CARD ───────────────────────────────────────── */}
        {current ? (
          <button
            onClick={openCurrent}
            style={{
              width: '100%', background: p.accent, color: p.cream, border: 'none', borderRadius: 28,
              padding: '44px 36px 40px', boxShadow: `0 6px 0 ${p.fg}`, cursor: 'pointer', textAlign: 'left', display: 'block',
              transition: 'transform 120ms ease, box-shadow 120ms ease',
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = `0 3px 0 ${p.fg}`; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 0 ${p.fg}`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 0 ${p.fg}`; }}
          >
            <div style={{ ...lbl, opacity: 0.75, marginBottom: 18 }}>
              {current.isFinal
                ? `${current.vol.vol} · FINAL TEST · EARN ${current.vol.cert.toUpperCase()}`
                : `${current.vol.vol} · LESSON ${current.lesson.num} · ${current.lesson.minutes} MIN`}
            </div>
            <div style={{ ...display, fontSize: 64, lineHeight: 0.96, letterSpacing: '-0.03em', fontWeight: 400 }}>
              {current.isFinal ? `${current.vol.name} — final test.` : `${current.lesson.title}.`}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32 }}>
              <div style={{ ...sans, fontSize: 14, opacity: 0.85 }}>
                {(() => { const s = store.volumeStats(email, current.vol.id); return `${s.done} of ${s.total} lessons done in this volume`; })()}
              </div>
              <span style={{
                background: p.cream, color: p.accent, padding: '14px 24px', borderRadius: 999,
                ...sans, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                display: 'inline-flex', alignItems: 'center', gap: 10,
              }}>
                {current.isFinal ? 'Take the test →' : 'Start lesson →'}
              </span>
            </div>
          </button>
        ) : (
          <div style={{
            width: '100%', background: p.cream, borderRadius: 28, padding: '44px 36px',
            border: `1.5px solid ${p.fg}20`, boxShadow: `0 6px 0 ${p.fg}15`, textAlign: 'center',
          }}>
            <div style={{ ...lbl, color: p.accent, marginBottom: 14 }}>
              {assignedVols.length ? '◆ ALL CAUGHT UP' : '◆ WAITING ON YOUR MANAGER'}
            </div>
            <div style={{ ...display, fontSize: 44, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400 }}>
              {assignedVols.length
                ? <React.Fragment>You&rsquo;ve finished everything <em style={{ fontStyle: 'italic', color: p.accent }}>assigned.</em></React.Fragment>
                : <React.Fragment>No volumes <em style={{ fontStyle: 'italic', color: p.accent }}>yet.</em></React.Fragment>}
            </div>
            <p style={{ ...sub, fontSize: 19, opacity: 0.7, marginTop: 14, fontWeight: 400 }}>
              {assignedVols.length ? 'Nicely done. Your manager will assign the next volume soon.' : 'Once your manager assigns a volume, it\u2019ll show up right here.'}
            </p>
          </div>
        )}

        {/* ── PATH (current volume) ──────────────────────────── */}
        {focusVol && (
          <div style={{ marginTop: 60 }}>
            <div style={{ ...lbl, color: p.accent, textAlign: 'center', marginBottom: 8 }}>◆ {focusVol.vol} · {focusVol.name.toUpperCase()}</div>
            <p style={{ ...sub, fontSize: 16, fontStyle: 'italic', opacity: 0.6, textAlign: 'center', margin: '0 0 28px', fontWeight: 400 }}>
              {focusVol.lessons.length} lessons, then a final test for your {focusVol.cert} badge.
            </p>

            <div style={{ display: 'grid', gap: 10 }}>
              {focusVol.lessons.map((lesson, i) => {
                const status = store.lessonStatus(email, focusVol.id, i);
                const isDone = status === 'done';
                const isCurrent = status === 'current';
                const isLocked = status === 'locked';
                return (
                  <button
                    key={lesson.id}
                    onClick={() => { if (!isLocked) act.openLesson && act.openLesson(focusVol.id, lesson.id); }}
                    disabled={isLocked}
                    style={{
                      width: '100%', textAlign: 'left', cursor: isLocked ? 'not-allowed' : 'pointer',
                      background: isCurrent ? p.cream : 'transparent',
                      border: isCurrent ? `2.5px solid ${p.fg}` : `1.5px solid ${p.fg}20`,
                      borderRadius: 18, padding: '16px 20px', opacity: isLocked ? 0.55 : 1,
                      display: 'flex', alignItems: 'center', gap: 16,
                      boxShadow: isCurrent ? `0 4px 0 ${p.fg}` : 'none',
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', flex: '0 0 auto',
                      background: isDone ? p.accent : isCurrent ? p.sun : `${p.fg}15`,
                      color: isDone ? p.cream : p.fg, border: `2px solid ${p.fg}`,
                      display: 'grid', placeItems: 'center',
                      ...display, fontStyle: 'italic', fontSize: 22, fontWeight: 400,
                    }}>
                      {isDone ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p.cream} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                        : isLocked ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="2" opacity="0.6"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                        : lesson.num}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...sub, fontSize: 20, fontWeight: 500, lineHeight: 1.1 }}>{lesson.title}</div>
                      <div style={{ ...lbl, fontSize: 8.5, opacity: 0.5, marginTop: 4 }}>
                        {isDone ? 'COMPLETE' : isCurrent ? '◆ UP NEXT · TAP TO START' : `LESSON ${lesson.num} · LOCKED`}
                      </div>
                    </div>
                    {!isLocked && <span style={{ ...lbl, color: isDone ? p.accent : p.sun, fontSize: 10 }}>{isDone ? 'REVIEW' : 'START'} →</span>}
                  </button>
                );
              })}

              {/* Final test node */}
              {(() => {
                const fstat = store.finalStatus(email, focusVol.id);
                const fdone = fstat === 'done';
                const fcurrent = fstat === 'current';
                const flocked = fstat === 'locked';
                return (
                  <button
                    onClick={() => { if (!flocked) act.openFinal && act.openFinal(focusVol.id); }}
                    disabled={flocked}
                    style={{
                      width: '100%', textAlign: 'left', cursor: flocked ? 'not-allowed' : 'pointer',
                      background: fcurrent ? p.cream : 'transparent',
                      border: fcurrent ? `2.5px solid ${p.fg}` : `1.5px dashed ${p.fg}35`,
                      borderRadius: 18, padding: '16px 20px', opacity: flocked ? 0.5 : 1, marginTop: 4,
                      display: 'flex', alignItems: 'center', gap: 16,
                      boxShadow: fcurrent ? `0 4px 0 ${p.fg}` : 'none',
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', flex: '0 0 auto',
                      background: fdone ? p.accent : fcurrent ? p.sun : `${p.fg}12`,
                      border: `2px solid ${p.fg}`, display: 'grid', placeItems: 'center',
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={fdone ? p.cream : p.fg} strokeWidth="2"><circle cx="12" cy="8" r="6" /><path d="M9 13l-2 8 5-3 5 3-2-8" /></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...sub, fontSize: 20, fontWeight: 500, lineHeight: 1.1 }}>Final test — {focusVol.cert}</div>
                      <div style={{ ...lbl, fontSize: 8.5, opacity: 0.5, marginTop: 4 }}>
                        {fdone ? '◆ CERTIFIED' : fcurrent ? '◆ READY · TAP TO TAKE IT' : 'FINISH ALL LESSONS TO UNLOCK'}
                      </div>
                    </div>
                    {!flocked && <span style={{ ...lbl, color: p.accent, fontSize: 10 }}>{fdone ? 'PASSED' : 'TAKE'} →</span>}
                  </button>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── PRODUCT UPDATES ──────────────────────────────── */}
        {productUpdates.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div style={{ ...lbl, color: p.muted, marginBottom: 12 }}>UPDATES REQUIRED</div>
            {productUpdates.map(({ assignment, module }) => {
              const hoursLeft = assignment.deadline ? Math.max(0, Math.round((assignment.deadline - Date.now()) / 3600000)) : null;
              const urgent = hoursLeft !== null && hoursLeft <= 48;
              return (
                <div key={assignment.id} style={{ background: urgent ? `${p.cherry}0d` : p.cream, border: `1.5px solid ${urgent ? p.cherry : p.rule}`, borderRadius: 16, padding: '16px 20px', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ ...sans, fontWeight: 600, color: p.fg, margin: '0 0 3px' }}>{module.title}</p>
                    {hoursLeft !== null && (
                      <p style={{ ...sans, fontSize: 12, color: urgent ? p.cherry : p.muted, margin: 0 }}>
                        {urgent ? '⚡ Urgent — ' : ''}{hoursLeft}h left to complete
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => openProductUpdate({ assignment, module })}
                    style={{ ...sans, fontWeight: 600, fontSize: 13, padding: '7px 18px', borderRadius: 999, background: urgent ? p.cherry : p.accent, color: p.cream, border: 'none', cursor: 'pointer' }}>
                    Start →
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── STAT CHIPS ─────────────────────────────────────── */}
        <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { big: `${overall}%`, label: 'overall', tint: p.accent },
            { big: String(thisWeek), label: 'lessons this week', tint: p.sun },
            { big: String(badges), label: 'badges earned', tint: p.fg },
          ].map((s, i) => (
            <div key={i} style={{ background: p.cream, borderRadius: 20, padding: '20px 16px', textAlign: 'center', border: `1.5px solid ${p.fg}20` }}>
              <div style={{ ...display, fontStyle: 'italic', fontSize: 44, lineHeight: 1, color: s.tint, fontWeight: 400 }}>{s.big}</div>
              <div style={{ ...lbl, opacity: 0.7, marginTop: 8, fontSize: 9 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64, textAlign: 'center' }}>
          <span data-app-action="logout" style={{ ...lbl, opacity: 0.4, cursor: 'pointer', fontSize: 9 }}>LOG OUT</span>
        </div>
      </div>

      {/* ── Product update modal ──────────────────────────── */}
      {puModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(31,27,20,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={(e) => { if (e.target === e.currentTarget) setPuModal(null); }}
        >
          <div style={{ background: p.cream, borderRadius: 20, maxWidth: 460, width: '100%', overflow: 'hidden', boxShadow: '0 20px 60px rgba(31,27,20,0.22)' }}>
            {/* Header */}
            <div style={{ background: p.accent, color: p.cream, padding: '22px 24px' }}>
              <p style={{ ...lbl, opacity: 0.75, margin: '0 0 6px' }}>◆ Product Update</p>
              <h2 style={{ ...display, fontSize: 26, fontWeight: 400, margin: 0, lineHeight: 1.2 }}>{puModal.module.title}</h2>
              {puModal.assignment.deadline && (
                <p style={{ ...sans, fontSize: 12, opacity: 0.8, margin: '8px 0 0' }}>
                  {Math.max(0, Math.round((puModal.assignment.deadline - Date.now()) / 3600000))}h left to complete
                </p>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {!puComplete ? (
                <>
                  <p style={{ ...sub, fontSize: 16, color: p.fg, lineHeight: 1.65, margin: '0 0 10px' }}>
                    Your manager has pushed a product update for your team to review. Go through the key points below, then mark it complete.
                  </p>
                  <ul style={{ margin: '0 0 20px', paddingLeft: 20 }}>
                    {[
                      'Review the new ' + puModal.module.title.toLowerCase() + ' changes',
                      'Understand how it affects your daily workflow',
                      'Ask your manager if anything is unclear',
                    ].map((point, i) => (
                      <li key={i} style={{ ...sans, fontSize: 14, color: p.fg, marginBottom: 6, lineHeight: 1.5 }}>{point}</li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button onClick={() => setPuModal(null)} style={{ ...sans, fontSize: 13, fontWeight: 500, padding: '9px 18px', borderRadius: 999, background: 'transparent', border: `1.5px solid ${p.rule}`, color: p.muted, cursor: 'pointer' }}>
                      Close
                    </button>
                    <button onClick={completeProductUpdate} style={{ ...sans, fontSize: 13, fontWeight: 600, padding: '9px 22px', borderRadius: 999, background: p.accent, color: p.cream, border: 'none', cursor: 'pointer' }}>
                      Mark complete ✓
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <p style={{ fontSize: 36, margin: '0 0 10px' }}>✓</p>
                  <p style={{ ...display, fontSize: 22, color: p.accent, margin: 0 }}>Update complete!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { BaristaDashboard });


// ===== barista-library.jsx =====
// ═════════════════════════════════════════════════════════
// BARISTA LIBRARY — the full map of what to learn and how far
// you've come. Reads CopiStore; tapping a volume opens its next
// lesson in the player. Refreshers are lessons already passed.
// ═════════════════════════════════════════════════════════

function BaristaLibrary({ user = {} }) {
  const _th = window.THEME || {};
  const p = { bg: _th.bg||'#EFE9DA', fg: _th.ink||'#1F1B14', accent: _th.accent||'#44704B', cream: _th.bgCard||'#FBF8F0', sun: _th.gold||'#C49455', cherry: _th.danger||'#7A2B1F', rule: _th.line||'#D5CDBA', muted: _th.muted||'#6E675A' };
  const display = { fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif' };
  const sub     = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const sans    = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const lbl     = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 10 };

  const store = window.useCopiStore();
  const email = user.email || 'lili@milano.coffee';
  const act = window.CopiActions || {};

  const vols = store.curriculum;
  const assignedVols = vols.filter((v) => store.isAssigned(email, v.id));
  let totalDone = 0, totalLessons = 0;
  assignedVols.forEach((v) => { const s = store.volumeStats(email, v.id); totalDone += s.done; totalLessons += s.total; });
  const pct = totalLessons ? Math.round((totalDone / totalLessons) * 100) : 0;

  // House curriculum — published imported curricula assigned to this user.
  const _meUser = store.getUserByEmail ? store.getUserByEmail(email) : null;
  const houseCurricula = (_meUser && store.getCurriculaForUser)
    ? store.getCurriculaForUser(_meUser.id)
    : [];
  const [houseViewerTarget, setHouseViewerTarget] = React.useState(null);

  // Refreshers — most recently completed lessons.
  const _dbU2 = store.getUserByEmail ? store.getUserByEmail(email) : null;
  const _prog2 = _dbU2 ? (store.raw().progress[_dbU2.id] || {}) : {};
  const refreshers = Object.entries(_prog2.lessons || {})
    .filter(([, r]) => r.done)
    .sort((a, b) => b[1].ts - a[1].ts)
    .slice(0, 3)
    .map(([lessonId]) => store.lessonById(lessonId))
    .filter(Boolean);

  const Mono = ({ name: n, size = 36 }) => {
    const initials = (n || 'L').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: p.accent, color: p.cream, borderRadius: '50%',
        display: 'grid', placeItems: 'center', ...sans, fontSize: size * 0.38, fontWeight: 700,
        letterSpacing: '0.04em', flex: '0 0 auto',
      }}>{initials}</div>
    );
  };

  const Dots = ({ total, done, on }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: i < done ? on : `${p.fg}20` }} />
      ))}
    </div>
  );

  const openVolume = (v) => {
    // open the first actionable lesson, else its final, else first lesson for review
    for (let i = 0; i < v.lessons.length; i++) {
      if (store.lessonStatus(email, v.id, i) === 'current') { act.openLesson(v.id, v.lessons[i].id); return; }
    }
    if (store.finalStatus(email, v.id) === 'current') { act.openFinal(v.id); return; }
    act.openLesson(v.id, v.lessons[0].id); // all done → review from the top
  };

  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg }}>

      {/* ── TOP NAV ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px' }}>
        <span style={{ ...display, fontStyle: 'italic', fontSize: 38, lineHeight: 1 }}>Copi</span>
        <div style={{ display: 'flex', gap: 36, ...sans, fontSize: 13 }}>
          {[{ l: 'Today', active: false }, { l: 'Library', active: true }, { l: 'Profile', active: false }].map((x) => (
            <a key={x.l} data-app-nav={x.l} style={{
              opacity: x.active ? 1 : 0.55, fontWeight: x.active ? 700 : 400,
              borderBottom: x.active ? `2px solid ${p.fg}` : 'none', paddingBottom: 4, cursor: 'pointer',
            }}>{x.l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: p.sun, color: p.fg }}>
            <svg width="14" height="16" viewBox="0 0 14 16" fill={p.fg} aria-hidden="true">
              <path d="M7 0 C 8 4, 12 5, 12 10 C 12 13.5, 9.5 16, 7 16 C 4.5 16, 2 13.5, 2 10 C 2 7, 4 6, 5 4 C 6 2, 6 1, 7 0 Z" />
            </svg>
            <span style={{ ...sans, fontWeight: 700, fontSize: 14 }}>{pct}%</span>
          </div>
          <Mono name={user.name} size={36} />
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>

        <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 36 }}>
          <h1 style={{ ...display, fontSize: 56, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: 0 }}>
            Your <em style={{ fontStyle: 'italic', color: p.accent }}>library</em>
          </h1>
          <p style={{ ...sub, fontSize: 22, opacity: 0.7, fontWeight: 400, margin: '12px 0 0', fontStyle: 'italic' }}>
            everything there is to learn — and how far you&rsquo;ve come.
          </p>
        </div>

        {/* Overall progress */}
        <div style={{
          background: p.cream, borderRadius: 28, padding: '32px', border: `1.5px solid ${p.fg}20`,
          boxShadow: `0 6px 0 ${p.fg}15`, display: 'flex', alignItems: 'center', gap: 28,
        }}>
          <div style={{ position: 'relative', width: 104, height: 104, flex: '0 0 auto' }}>
            <svg width="104" height="104" viewBox="0 0 104 104">
              <circle cx="52" cy="52" r="46" fill="none" stroke={`${p.fg}18`} strokeWidth="10" />
              <circle cx="52" cy="52" r="46" fill="none" stroke={p.accent} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - pct / 100)}
                transform="rotate(-90 52 52)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', ...display, fontStyle: 'italic', fontSize: 34, color: p.accent, fontWeight: 400 }}>{pct}%</div>
          </div>
          <div>
            <div style={{ ...lbl, color: p.accent, marginBottom: 10 }}>◆ YOUR PROGRESS</div>
            <div style={{ ...sub, fontSize: 26, fontWeight: 500, lineHeight: 1.15 }}>{totalDone} of {totalLessons} lessons done.</div>
            <div style={{ ...sans, fontSize: 14, opacity: 0.65, marginTop: 6 }}>
              Across {assignedVols.length} assigned {assignedVols.length === 1 ? 'volume' : 'volumes'}.
            </div>
          </div>
        </div>

        {/* Volumes */}
        <div style={{ ...lbl, color: p.accent, textAlign: 'center', margin: '56px 0 24px' }}>◆ YOUR VOLUMES</div>

        <div style={{ display: 'grid', gap: 18 }}>
          {vols.map((v) => {
            const assigned = store.isAssigned(email, v.id);
            const s = store.volumeStats(email, v.id);
            const complete = s.certified || (assigned && s.done === s.total && s.total > 0);
            const tint = complete ? p.accent : assigned ? p.sun : p.fg;
            return (
              <button
                key={v.id}
                onClick={() => { if (assigned) openVolume(v); }}
                disabled={!assigned}
                style={{
                  width: '100%', textAlign: 'left', background: p.cream, borderRadius: 24,
                  border: assigned && !complete ? `2.5px solid ${p.fg}` : `1.5px solid ${p.fg}20`,
                  boxShadow: assigned ? `0 5px 0 ${p.fg}${complete ? '15' : ''}` : 'none',
                  padding: '26px', cursor: assigned ? 'pointer' : 'not-allowed', opacity: assigned ? 1 : 0.6,
                  display: 'flex', gap: 22, alignItems: 'center',
                }}
              >
                <div style={{
                  width: 76, height: 76, borderRadius: '50%', flex: '0 0 auto',
                  background: complete ? p.accent : assigned ? p.sun : `${p.fg}18`,
                  color: complete ? p.cream : p.fg, border: `2px solid ${p.fg}`,
                  display: 'grid', placeItems: 'center', ...display, fontStyle: 'italic', fontSize: 34, fontWeight: 400,
                }}>
                  {complete ? <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={p.cream} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                    : !assigned ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={p.fg} strokeWidth="2" opacity="0.6"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                    : v.num}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ ...lbl, opacity: 0.5, fontSize: 9 }}>{v.vol}</div>
                    <div style={{ ...lbl, color: tint, fontSize: 9 }}>
                      {complete ? '✓ COMPLETE' : assigned ? 'IN PROGRESS' : 'NOT ASSIGNED'}
                    </div>
                  </div>
                  <div style={{ ...display, fontSize: 32, lineHeight: 1.0, letterSpacing: '-0.02em', fontWeight: 400, marginTop: 4 }}>{v.name}</div>
                  <div style={{ ...sans, fontSize: 13.5, opacity: 0.65, marginTop: 8, lineHeight: 1.35 }}>{v.blurb}</div>
                  {assigned && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
                      <Dots total={s.total} done={s.done} on={tint} />
                      <span style={{ ...sans, fontSize: 12, fontWeight: 700, opacity: 0.6, whiteSpace: 'nowrap' }}>{s.done}/{s.total}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* House curriculum — published imports assigned to this user */}
        {houseCurricula.length > 0 && (
          <React.Fragment>
            <div style={{ ...lbl, color: p.accent, textAlign: 'center', margin: '56px 0 10px' }}>◆ HOUSE CURRICULUM</div>
            <p style={{ ...sub, fontSize: 17, fontStyle: 'italic', opacity: 0.65, textAlign: 'center', margin: '0 0 24px', fontWeight: 400 }}>
              built from your cafe&rsquo;s own roasters and writing.
            </p>
            <div style={{ display: 'grid', gap: 14 }}>
              {houseCurricula.map((cur) => {
                const tracks = store.getTracksForCurriculum(cur.id);
                const lessonCount = tracks.reduce(
                  (s, t) => s + store.getLessonsForTrack(t.id).length, 0);
                return (
                  <button
                    key={cur.id}
                    onClick={() => setHouseViewerTarget({ curriculumId: cur.id })}
                    style={{
                      width: '100%', textAlign: 'left', background: p.cream, borderRadius: 22,
                      border: `1.5px solid ${p.accent}55`,
                      boxShadow: `0 4px 0 ${p.fg}10`,
                      padding: '22px 24px', cursor: 'pointer',
                      display: 'flex', gap: 18, alignItems: 'center',
                    }}
                  >
                    <div style={{
                      width: 60, height: 60, borderRadius: '50%', flex: '0 0 auto',
                      background: p.accent, color: p.cream,
                      display: 'grid', placeItems: 'center', ...display, fontStyle: 'italic',
                      fontSize: 24, fontWeight: 400, border: `2px solid ${p.fg}`,
                    }}>
                      {(cur.shopName || 'H').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...lbl, opacity: 0.5, fontSize: 9, marginBottom: 4 }}>HOUSE · IMPORTED</div>
                      <div style={{ ...display, fontSize: 26, lineHeight: 1.05, letterSpacing: '-0.02em', fontWeight: 400 }}>
                        {cur.shopName || 'House curriculum'}
                      </div>
                      <div style={{ ...sans, fontSize: 13, opacity: 0.7, marginTop: 6 }}>
                        {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'} · {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
                      </div>
                    </div>
                    <span style={{ ...lbl, color: p.accent, fontSize: 10, whiteSpace: 'nowrap' }}>READ →</span>
                  </button>
                );
              })}
            </div>
          </React.Fragment>
        )}

        {/* Refreshers */}
        {refreshers.length > 0 && (
          <React.Fragment>
            <div style={{ ...lbl, color: p.accent, textAlign: 'center', margin: '56px 0 10px' }}>◆ REFRESHERS</div>
            <p style={{ ...sub, fontSize: 17, fontStyle: 'italic', opacity: 0.65, textAlign: 'center', margin: '0 0 24px', fontWeight: 400 }}>
              lessons you&rsquo;ve already passed — worth another look.
            </p>
            <div style={{ display: 'grid', gap: 12 }}>
              {refreshers.map(({ vol, lesson }, ri) => (
                <button
                  key={ri}
                  onClick={() => act.openLesson(vol.id, lesson.id)}
                  style={{
                    width: '100%', textAlign: 'left', background: 'transparent', borderRadius: 18,
                    border: `1.5px dashed ${p.fg}40`, padding: '16px 20px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: '50%', flex: '0 0 auto', border: `1.5px solid ${p.fg}`, display: 'grid', placeItems: 'center', background: p.cream }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={p.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...sub, fontSize: 19, fontWeight: 500, lineHeight: 1.1 }}>
                      <span style={{ opacity: 0.5, fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontWeight: 700, fontSize: 13, marginRight: 8 }}>{vol.vol}</span>
                      {lesson.title}
                    </div>
                    <div style={{ ...sans, fontSize: 12, opacity: 0.55, marginTop: 3 }}>passed · tap to review</div>
                  </div>
                  <span style={{ ...lbl, color: p.accent, fontSize: 10 }}>REFRESH →</span>
                </button>
              ))}
            </div>
          </React.Fragment>
        )}

      </div>

      {window.PublishedCurriculumViewer && (
        <window.PublishedCurriculumViewer
          open={!!houseViewerTarget}
          curriculumId={houseViewerTarget?.curriculumId}
          onClose={() => setHouseViewerTarget(null)}
        />
      )}
    </div>
  );
}

Object.assign(window, { BaristaLibrary });


// ===== barista-profile.jsx =====
// ═════════════════════════════════════════════════════════
// BARISTA PROFILE — typical profile page. Identity, stats,
// badges earned, certification status, and a few simple
// account settings. Same rounded, friendly aesthetic as the
// Today and Library views.
// ═════════════════════════════════════════════════════════

function BaristaProfile({ user = {} }) {
  const p = {
    bg:     '#E8DDC2',
    fg:     '#1A1410',
    accent: '#3F5A3A',
    cream:  '#F4EBD2',
    sun:    '#C68A3D',
    cherry: '#7A2B1F',
  };
  const display = { fontFamily: '"Playpen Sans", "Fredoka", system-ui, sans-serif' };
  const sub     = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const sans    = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif' };
  const lbl     = { fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 10 };

  const name = user.name || 'Lili Turko';
  const cafe = user.cafe || 'Milano';
  const email = user.email || 'barista@milano.coffee';

  const [fullName, setFullName] = React.useState(name);
  const [workEmail, setWorkEmail] = React.useState(email);
  const [reminders, setReminders] = React.useState(true);
  const [streakAlerts, setStreakAlerts] = React.useState(true);
  const [saved, setSaved] = React.useState(false);

  const flashSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 1800); };

  const Mono = ({ name: n, size = 28, bg = p.accent, color = p.cream }) => {
    const initials = n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, background: bg, color,
        borderRadius: '50%', display: 'grid', placeItems: 'center',
        ...sans, fontSize: size * 0.36, fontWeight: 700, letterSpacing: '0.04em', flex: '0 0 auto',
      }}>{initials}</div>
    );
  };

  const stats = [
    { big: '12', label: 'day streak',   tint: p.sun    },
    { big: '12', label: 'lessons done', tint: p.accent },
    { big: '3',  label: 'badges',       tint: p.fg     },
  ];

  // Earned + locked badges
  const badges = [
    { icon: 'star',   label: 'First lesson',   earned: true  },
    { icon: 'flame',  label: '7-day streak',   earned: true  },
    { icon: 'cup',    label: 'First cupping',  earned: true  },
    { icon: 'medal',  label: 'Foundations',    earned: false },
  ];

  const BadgeIcon = ({ kind, color }) => {
    const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (kind === 'star')  return <svg {...common}><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z" /></svg>;
    if (kind === 'flame') return <svg {...common}><path d="M12 2c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5-1-8z" /></svg>;
    if (kind === 'cup')   return <svg {...common}><path d="M5 8h11v4a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z" /><path d="M16 9h2a2 2 0 0 1 0 4h-2" /><path d="M7 3v2M10 3v2M13 3v2" /></svg>;
    return <svg {...common}><circle cx="12" cy="9" r="5" /><path d="M9 13l-2 8 5-3 5 3-2-8" /></svg>;
  };

  const inputStyle = {
    ...sans, fontSize: 16, fontWeight: 400,
    width: '100%', padding: '13px 16px',
    background: p.bg, color: p.fg,
    border: `1.5px solid ${p.fg}30`, borderRadius: 14,
    outline: 'none',
  };

  const Toggle = ({ on, onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: 52, height: 30, flex: '0 0 auto', borderRadius: 999,
        background: on ? p.accent : `${p.fg}25`, border: 'none',
        position: 'relative', cursor: 'pointer', padding: 0,
        transition: 'background 160ms ease',
      }}
      aria-pressed={on}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 25 : 3,
        width: 24, height: 24, borderRadius: '50%', background: p.cream,
        transition: 'left 180ms cubic-bezier(.2,.7,.2,1)',
      }} />
    </button>
  );

  return (
    <div style={{ width: '100%', minHeight: '100%', background: p.bg, color: p.fg }}>

      {/* ── TOP NAV ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px' }}>
        <span style={{ ...display, fontStyle: 'italic', fontSize: 38, lineHeight: 1 }}>Copi</span>
        <div style={{ display: 'flex', gap: 36, ...sans, fontSize: 13 }}>
          {[
            { l: 'Today',   active: false },
            { l: 'Library', active: false },
            { l: 'Profile', active: true  },
          ].map((x) => (
            <a key={x.l} data-app-nav={x.l} style={{
              opacity: x.active ? 1 : 0.55,
              fontWeight: x.active ? 700 : 400,
              borderBottom: x.active ? `2px solid ${p.fg}` : 'none',
              paddingBottom: 4, cursor: 'pointer',
            }}>{x.l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: p.sun, color: p.fg }}>
            <svg width="14" height="16" viewBox="0 0 14 16" fill={p.fg} aria-hidden="true">
              <path d="M7 0 C 8 4, 12 5, 12 10 C 12 13.5, 9.5 16, 7 16 C 4.5 16, 2 13.5, 2 10 C 2 7, 4 6, 5 4 C 6 2, 6 1, 7 0 Z" />
            </svg>
            <span style={{ ...sans, fontWeight: 700, fontSize: 14 }}>12</span>
          </div>
          <Mono name={fullName} size={36} />
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Identity */}
        <div style={{ textAlign: 'center', marginTop: 16, marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <Mono name={fullName} size={104} />
          </div>
          <h1 style={{ ...display, fontSize: 52, lineHeight: 1, letterSpacing: '-0.025em', fontWeight: 400, margin: 0 }}>
            {fullName}
          </h1>
          <p style={{ ...sub, fontSize: 20, opacity: 0.7, fontWeight: 400, margin: '10px 0 0', fontStyle: 'italic' }}>
            Barista at {cafe} · joined Aug 2025
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: p.cream, borderRadius: 20, padding: '22px 16px', textAlign: 'center',
              border: `1.5px solid ${p.fg}20`, boxShadow: `0 5px 0 ${p.fg}12`,
            }}>
              <div style={{ ...display, fontStyle: 'italic', fontSize: 48, lineHeight: 1, color: s.tint, fontWeight: 400 }}>{s.big}</div>
              <div style={{ ...lbl, opacity: 0.7, marginTop: 8, fontSize: 9 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Certification status */}
        <div style={{
          marginTop: 18, background: p.accent, color: p.cream, borderRadius: 24,
          padding: '26px 28px', boxShadow: `0 6px 0 ${p.fg}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
        }}>
          <div>
            <div style={{ ...lbl, opacity: 0.8, marginBottom: 8 }}>◆ CERTIFICATION</div>
            <div style={{ ...display, fontSize: 34, lineHeight: 1, fontWeight: 400 }}>
              Working toward <em style={{ fontStyle: 'italic', color: p.sun }}>Foundations.</em>
            </div>
            <div style={{ ...sans, fontSize: 13.5, opacity: 0.85, marginTop: 8 }}>
              4 lessons left in Volume II.
            </div>
          </div>
          <div style={{
            ...display, fontStyle: 'italic', fontSize: 30, fontWeight: 400,
            background: p.cream, color: p.accent, borderRadius: '50%',
            width: 84, height: 84, display: 'grid', placeItems: 'center', flex: '0 0 auto',
            border: `2px solid ${p.fg}`,
          }}>64%</div>
        </div>

        {/* Badges */}
        <div style={{ ...lbl, color: p.accent, textAlign: 'center', margin: '52px 0 22px' }}>◆ BADGES</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {badges.map((b, i) => (
            <div key={i} style={{
              background: p.cream, borderRadius: 20, padding: '22px 10px 16px', textAlign: 'center',
              border: `1.5px solid ${p.fg}20`,
              opacity: b.earned ? 1 : 0.5,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 12px',
                background: b.earned ? p.sun : `${p.fg}15`,
                border: `2px solid ${b.earned ? p.fg : `${p.fg}40`}`,
                display: 'grid', placeItems: 'center',
              }}>
                <BadgeIcon kind={b.icon} color={b.earned ? p.fg : `${p.fg}70`} />
              </div>
              <div style={{ ...sans, fontSize: 11.5, fontWeight: 600, lineHeight: 1.2 }}>{b.label}</div>
              {!b.earned && <div style={{ ...lbl, fontSize: 8, opacity: 0.6, marginTop: 4 }}>LOCKED</div>}
            </div>
          ))}
        </div>

        {/* Account settings */}
        <div style={{ ...lbl, color: p.accent, textAlign: 'center', margin: '52px 0 22px' }}>◆ ACCOUNT</div>
        <div style={{
          background: p.cream, borderRadius: 24, padding: '28px 28px',
          border: `1.5px solid ${p.fg}20`, boxShadow: `0 6px 0 ${p.fg}12`,
          display: 'grid', gap: 20,
        }}>
          <label style={{ display: 'block' }}>
            <div style={{ ...lbl, marginBottom: 8 }}>NAME</div>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: 'block' }}>
            <div style={{ ...lbl, marginBottom: 8 }}>EMAIL</div>
            <input type="email" value={workEmail} onChange={(e) => setWorkEmail(e.target.value)} style={inputStyle} />
          </label>

          <div style={{ height: 1, background: `${p.fg}18` }} />

          {[
            { label: 'Daily lesson reminders', desc: 'A nudge each day to keep your streak.', on: reminders, set: setReminders },
            { label: 'Streak alerts', desc: 'Let me know when my streak is about to break.', on: streakAlerts, set: setStreakAlerts },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
              <div>
                <div style={{ ...sub, fontSize: 19, fontWeight: 500, lineHeight: 1.1 }}>{row.label}</div>
                <div style={{ ...sans, fontSize: 13, opacity: 0.6, marginTop: 3 }}>{row.desc}</div>
              </div>
              <Toggle on={row.on} onClick={() => row.set(!row.on)} />
            </div>
          ))}

          <button
            onClick={flashSaved}
            style={{
              marginTop: 6, width: '100%', background: p.accent, color: p.cream,
              border: 'none', borderRadius: 999, padding: '15px 24px',
              ...sans, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', boxShadow: `0 5px 0 ${p.fg}`,
            }}
          >
            {saved ? '✓ Saved' : 'Save changes'}
          </button>
        </div>

        {/* Sign out */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <span data-app-action="logout" style={{ ...lbl, color: p.cherry, opacity: 0.8, cursor: 'pointer', fontSize: 11 }}>
            LOG OUT
          </span>
        </div>

      </div>
    </div>
  );
}

Object.assign(window, { BaristaProfile });


// ===== copi-prototype-shell.jsx =====
// ═════════════════════════════════════════════════════════
// COPI PROTOTYPE SHELL
// Wires up landing page + about/pricing/curriculum into a
// real navigable app, plus an interactive trial signup flow.
//
// Uses event delegation against the rendered page tree so the
// underlying page components stay untouched.
// ═════════════════════════════════════════════════════════

// Demo credentials for the sales/prototype flow.
// These are the seeded Supabase users (see supabase/migrations/seed_data.sql);
// clicking the demo buttons in LoginModal fills them in and they go through
// real supabase.auth.signInWithPassword — same path as any other user.
const DEMO_CREDENTIALS = [
  { label: 'Admin demo',   email: 'admin@milano.coffee',   password: 'copi2026' },
  { label: 'Barista demo', email: 'lili@milano.coffee',    password: 'copi2026' },
];

const PROTO_PALETTE = window.NEW_PALETTE || {
  bg: '#EFE9DA', fg: '#1F1B14', accent: '#44704B', cream: '#FBF8F0', sun: '#C49455'
};

// Match the trio inside the page nav. We intercept clicks on these by
// reading textContent. Order matches the source page nav.
const NAV_LABELS = ['Curriculum', 'Pricing', 'About'];

// ────────────────────────────────────────────────────────────
// Trial signup — three-step modal
// ────────────────────────────────────────────────────────────
function TrialModal({ open, onClose }) {
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState({ cafe: '', email: '', seats: 8, role: 'owner' });
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setStep(0);
      setClosing(false);
      setForm({ cafe: '', email: '', seats: 8, role: 'owner' });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open && !closing) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 220);
  };

  const p = window.NEW_PALETTE || PROTO_PALETTE;
  const t = window.TYPOGRAPHY || {};
  const RADIUS = window.RADIUS || { card: 12, pill: 999 };

  const valid = {
    0: form.cafe.trim().length > 1 && /.+@.+\..+/.test(form.email),
    1: form.seats >= 1 && !!form.role,
    2: true,
  }[step];

  const next = () => {
    if (!valid) return;
    if (step < 2) setStep(step + 1);
    else handleClose();
  };
  const back = () => { if (step > 0) setStep(step - 1); };

  const StepDot = ({ i }) => (
    <div style={{
      width: i === step ? 28 : 8, height: 8, borderRadius: 99,
      background: i <= step ? p.accent : p.tagBorder,
      transition: 'all 240ms cubic-bezier(.2,.7,.2,1)',
    }} />
  );

  const inputStyle = {
    ...t.body, fontSize: 16,
    width: '100%', padding: '14px 20px',
    background: p.bg, color: p.textPrimary,
    border: `1px solid ${p.tagBorder}`, borderRadius: RADIUS.pill,
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle = {
    ...t.eyebrow, color: p.textMuted,
    display: 'block', marginBottom: 8,
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(28,28,26,0.6)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'grid', placeItems: 'center', padding: 24,
        opacity: closing ? 0 : 1, transition: 'opacity 220ms ease',
      }}
    >
      <div style={{
        width: 'min(600px, 100%)',
        background: p.bgCard,
        borderRadius: RADIUS.card * 2,
        border: `1px solid ${p.tagBorder}`,
        boxShadow: '0 24px 64px rgba(0,0,0,0.16)',
        overflow: 'hidden',
        transform: closing ? 'translateY(8px) scale(0.98)' : 'translateY(0) scale(1)',
        opacity: closing ? 0 : 1,
        transition: 'transform 220ms cubic-bezier(.2,.7,.2,1), opacity 220ms ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 28px', borderBottom: `1px solid ${p.tagBorder}`,
        }}>
          <div style={{ ...t.eyebrow, color: p.textMuted }}>Step {step + 1} of 3</div>
          <button
            onClick={handleClose}
            style={{ ...t.button, color: p.textMuted, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '40px 40px 32px', minHeight: 380 }}>
          {step === 0 && (
            <div>
              <div style={{ ...t.eyebrow, color: p.accent, marginBottom: 12 }}>YOUR CAFÉ</div>
              <h2 style={{ ...t.h2, fontSize: 36, color: p.textPrimary, margin: '0 0 12px 0' }}>
                Tell us where you pour.
              </h2>
              <p style={{ ...t.body, color: p.textMuted, margin: '0 0 32px 0', lineHeight: 1.5 }}>
                Copi reads your menu and offerings on day one — no setup, no spreadsheets.
              </p>

              <label style={{ display: 'block', marginBottom: 20 }}>
                <div style={labelStyle}>Café or roastery name</div>
                <input autoFocus type="text" placeholder="Milano" value={form.cafe}
                  onChange={(e) => setForm({ ...form, cafe: e.target.value })} style={inputStyle} />
              </label>
              <label style={{ display: 'block' }}>
                <div style={labelStyle}>Work email</div>
                <input type="email" placeholder="you@cafe.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              </label>
            </div>
          )}

          {step === 1 && (
            <div>
              <div style={{ ...t.eyebrow, color: p.accent, marginBottom: 12 }}>YOUR TEAM</div>
              <h2 style={{ ...t.h2, fontSize: 36, color: p.textPrimary, margin: '0 0 12px 0' }}>
                How many people pour with you?
              </h2>
              <p style={{ ...t.body, color: p.textMuted, margin: '0 0 28px 0', lineHeight: 1.5 }}>
                Used only to scope the trial. You can change it any time.
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
                <div style={{ ...t.display, fontStyle: 'italic', fontSize: 80, lineHeight: 1, color: p.accent }}>
                  {form.seats}
                </div>
                <div style={{ ...t.eyebrow, color: p.textMuted }}>Baristas incl. managers</div>
              </div>
              <input type="range" min={1} max={40} step={1} value={form.seats}
                onChange={(e) => setForm({ ...form, seats: parseInt(e.target.value, 10) })}
                style={{ width: '100%', accentColor: p.accent, marginBottom: 32 }} />

              <div style={{ ...t.eyebrow, color: p.textMuted, marginBottom: 12 }}>What's your role?</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[{ v: 'owner', l: 'Owner' }, { v: 'manager', l: 'Manager' }, { v: 'lead', l: 'Lead barista' }].map((opt) => {
                  const active = form.role === opt.v;
                  return (
                    <button key={opt.v} onClick={() => setForm({ ...form, role: opt.v })} style={{
                      padding: '12px 8px',
                      background: active ? p.accent : p.bg,
                      color: active ? '#FFFFFF' : p.textPrimary,
                      border: `1px solid ${active ? p.accent : p.tagBorder}`,
                      borderRadius: RADIUS.pill,
                      ...t.button, cursor: 'pointer',
                      transition: 'all 160ms ease',
                    }}>
                      {opt.l}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center', paddingTop: 8 }}>
              <div style={{ ...t.eyebrow, color: p.accent, marginBottom: 16 }}>Trial confirmed</div>
              <h2 style={{ ...t.h2, fontSize: 40, color: p.textPrimary, margin: '0 0 16px 0' }}>
                Welcome to Copi.
              </h2>
              <p style={{ ...t.bodyLarge, color: p.textMuted, margin: '0 0 28px 0', lineHeight: 1.5, maxWidth: 420, marginInline: 'auto' }}>
                We sent a setup link to <strong style={{ color: p.textPrimary }}>{form.email || 'you'}</strong>. Your <strong style={{ color: p.textPrimary }}>{form.cafe || 'café'}</strong> workspace is being built now.
              </p>

              <div style={{
                display: 'inline-grid', gridTemplateColumns: 'auto auto', gap: '12px 28px',
                padding: '20px 28px', background: p.bg, borderRadius: RADIUS.card,
                border: `1px solid ${p.tagBorder}`, textAlign: 'left',
              }}>
                <div style={{ ...t.eyebrow, color: p.textMuted }}>Café</div>
                <div style={{ ...t.body, color: p.textPrimary }}>{form.cafe || '—'}</div>
                <div style={{ ...t.eyebrow, color: p.textMuted }}>Seats</div>
                <div style={{ ...t.body, color: p.textPrimary }}>{form.seats} baristas</div>
                <div style={{ ...t.eyebrow, color: p.textMuted }}>Trial</div>
                <div style={{ ...t.body, color: p.textPrimary }}>30 days · no card</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 28px', borderTop: `1px solid ${p.tagBorder}`, gap: 16,
        }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <StepDot i={0} /><StepDot i={1} /><StepDot i={2} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {step > 0 && step < 2 && (
              <button onClick={back} style={{
                ...t.button, padding: '12px 20px', borderRadius: RADIUS.pill,
                background: 'transparent', border: `1px solid ${p.tagBorder}`,
                color: p.textPrimary, cursor: 'pointer',
              }}>
                ← Back
              </button>
            )}
            <button onClick={next} disabled={!valid} style={{
              ...t.button, padding: '12px 24px', borderRadius: RADIUS.pill, border: 'none',
              background: valid ? p.accent : p.tagBg, color: valid ? '#FFFFFF' : p.textMuted,
              cursor: valid ? 'pointer' : 'not-allowed', transition: 'all 160ms ease',
            }}>
              {step === 0 && 'Continue →'}
              {step === 1 && 'Start my trial →'}
              {step === 2 && 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Login — single-screen modal
// ────────────────────────────────────────────────────────────
function LoginModal({ open, onClose, onSwitchToTrial, onAuth }) {
  const [closing, setClosing] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (open) {
      setClosing(false); setEmail(''); setPassword(''); setSubmitting(false); setError('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open && !closing) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 220);
  };

  const p = window.NEW_PALETTE || PROTO_PALETTE;
  const t = window.TYPOGRAPHY || {};
  const RADIUS = window.RADIUS || { card: 12, pill: 999 };

  const valid = /.+@.+\..+/.test(email) && password.length >= 4;

  const submit = async (e) => {
    e && e.preventDefault();
    if (!valid || submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const result = onAuth ? await onAuth({ email, password }) : { ok: false, error: 'Auth handler missing' };
      if (!result?.ok) {
        setError(result?.error || 'Invalid email or password.');
        setSubmitting(false);
      }
      // On success, the parent closes the modal — no local success state needed.
    } catch (err) {
      setError(err?.message || 'Something went wrong signing you in.');
      setSubmitting(false);
    }
  };

  const inputStyle = {
    ...t.body, fontSize: 16,
    width: '100%', padding: '14px 20px',
    background: p.bg, color: p.textPrimary,
    border: `1px solid ${p.tagBorder}`, borderRadius: RADIUS.pill,
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(28,28,26,0.6)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'grid', placeItems: 'center', padding: 24,
        opacity: closing ? 0 : 1, transition: 'opacity 220ms ease',
      }}
    >
      <div style={{
        width: 'min(480px, 100%)',
        background: p.bgCard,
        borderRadius: RADIUS.card * 2,
        border: `1px solid ${p.tagBorder}`,
        boxShadow: '0 24px 64px rgba(0,0,0,0.16)',
        overflow: 'hidden',
        transform: closing ? 'translateY(8px) scale(0.98)' : 'translateY(0) scale(1)',
        opacity: closing ? 0 : 1,
        transition: 'transform 220ms cubic-bezier(.2,.7,.2,1), opacity 220ms ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 28px', borderBottom: `1px solid ${p.tagBorder}`,
        }}>
          <div style={{ ...t.display, fontSize: 18, fontStyle: 'italic', color: p.textPrimary }}>Copi.</div>
          <button onClick={handleClose} style={{ ...t.button, color: p.textMuted, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
            ✕
          </button>
        </div>

        <div style={{ padding: '32px 28px 24px' }}>
          <form onSubmit={submit}>
            {/* Demo credential buttons — autofill only; real auth still runs. */}
            <div style={{ marginBottom: 24, display: 'grid', gap: 8 }}>
              {DEMO_CREDENTIALS.map((row, i) => (
                <button key={i} type="button"
                  onClick={() => { setEmail(row.email); setPassword(row.password); setError(''); }}
                  style={{
                    ...t.bodySmall, padding: '10px 14px', textAlign: 'left',
                    background: p.bg, border: `1px dashed ${p.tagBorder}`,
                    borderRadius: RADIUS.card, cursor: 'pointer', color: p.textMuted,
                    display: 'flex', justifyContent: 'space-between', gap: 12,
                  }}
                >
                  <span style={{ fontWeight: 500, color: p.accent }}>{row.label}</span>
                  <span>{row.email}</span>
                </button>
              ))}
            </div>

            <h2 style={{ ...t.h2, fontSize: 32, color: p.textPrimary, margin: '0 0 8px 0' }}>Sign in</h2>
            <p style={{ ...t.body, color: p.textMuted, margin: '0 0 24px 0' }}>Pick up where your team left off.</p>

            <label style={{ display: 'block', marginBottom: 16 }}>
              <div style={{ ...t.eyebrow, color: p.textMuted, marginBottom: 8 }}>Work email</div>
              <input autoFocus type="email" placeholder="you@cafe.com"
                value={email} onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }} style={inputStyle} />
            </label>
            <label style={{ display: 'block', marginBottom: 4 }}>
              <div style={{ ...t.eyebrow, color: p.textMuted, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>Password</span>
                <a style={{ color: p.accent, cursor: 'pointer' }}>Forgot?</a>
              </div>
              <input type="password" placeholder="••••••••"
                value={password} onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }} style={inputStyle} />
            </label>

            {error ? (
              <div role="alert" style={{
                ...t.bodySmall, marginTop: 16, padding: '10px 14px',
                background: p.bg, color: p.cherry,
                border: `1px solid ${p.cherry}`, borderRadius: RADIUS.card,
              }}>
                {error}
              </div>
            ) : null}

            <button type="submit" disabled={!valid || submitting} style={{
              ...t.button, width: '100%', marginTop: 20,
              padding: '14px 24px', borderRadius: RADIUS.pill, border: 'none',
              background: valid ? p.accent : p.tagBg, color: valid ? '#FFFFFF' : p.textMuted,
              cursor: valid && !submitting ? 'pointer' : 'not-allowed', transition: 'all 160ms ease',
            }}>
              {submitting ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 28px', borderTop: `1px solid ${p.tagBorder}`,
        }}>
          <span style={{ ...t.bodySmall, color: p.textMuted }}>New to Copi?</span>
          <button onClick={() => { handleClose(); setTimeout(onSwitchToTrial, 260); }}
            style={{ ...t.button, color: p.accent, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Start a free trial →
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Volume detail — slide-in side sheet
// ────────────────────────────────────────────────────────────
function VolumeModal({ open, volume, onClose, onTrial }) {
  const [closing, setClosing] = React.useState(false);
  const [enrolled, setEnrolled] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setClosing(false); setEnrolled(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, volume]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open && !closing) return null;
  if (!volume) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 260);
  };

  const p = window.NEW_PALETTE || PROTO_PALETTE;
  const t = window.TYPOGRAPHY || {};
  const RADIUS = window.RADIUS || { card: 12, pill: 999 };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(28,28,26,0.6)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'grid', placeItems: 'center', padding: 24,
        opacity: closing ? 0 : 1, transition: 'opacity 220ms ease',
      }}
    >
      <aside style={{
        width: 'min(680px, 100%)',
        maxHeight: 'calc(100vh - 48px)',
        background: p.bgCard,
        borderRadius: RADIUS.card * 2,
        border: `1px solid ${p.tagBorder}`,
        boxShadow: '0 24px 64px rgba(0,0,0,0.16)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        transform: closing ? 'translateY(8px) scale(0.98)' : 'translateY(0) scale(1)',
        opacity: closing ? 0 : 1,
        transition: 'transform 220ms cubic-bezier(.2,.7,.2,1), opacity 220ms ease',
      }}>
        {/* Header bar */}
        <div style={{
          flex: '0 0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 28px', borderBottom: `1px solid ${p.tagBorder}`,
        }}>
          <div style={{ ...t.eyebrow, color: p.textMuted }}>{volume.vol}</div>
          <button onClick={handleClose} style={{ ...t.button, color: p.textMuted, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
            ✕
          </button>
        </div>

        {/* Scroll body */}
        <div style={{ flex: '1 1 auto', overflowY: 'auto' }}>

          {/* Hero section */}
          <div style={{ padding: '32px 28px', background: p.bg, borderBottom: `1px solid ${p.tagBorder}` }}>
            <div style={{ ...t.eyebrow, color: p.accent, marginBottom: 12 }}>{volume.vol}</div>
            <h2 style={{ ...t.h2, fontSize: 40, color: p.textPrimary, margin: '0 0 8px 0' }}>{volume.name}</h2>
            <div style={{ ...t.body, fontStyle: 'italic', color: p.textMuted, marginBottom: 0 }}>{volume.tag}</div>
          </div>

          {/* Blurb + meta */}
          <div style={{ padding: '28px', borderBottom: `1px solid ${p.tagBorder}` }}>
            <p style={{ ...t.bodyLarge, color: p.textMuted, lineHeight: 1.6, margin: '0 0 24px 0' }}>{volume.blurb}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderRadius: RADIUS.card, border: `1px solid ${p.tagBorder}`, overflow: 'hidden' }}>
              {[
                ['Entries', String(volume.meta.entries)],
                ['Duration', volume.meta.time],
                ['Certification', volume.meta.cert],
                ['Sample', 'First 2 free'],
              ].map(([label, value], i) => (
                <div key={i} style={{
                  padding: '16px', borderRight: i < 3 ? `1px solid ${p.tagBorder}` : 'none',
                  background: p.bgCard,
                }}>
                  <div style={{ ...t.eyebrow, color: p.textMuted, marginBottom: 6 }}>{label}</div>
                  <div style={{ ...t.body, fontWeight: 500, color: p.textPrimary }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Table of contents */}
          <div style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ ...t.eyebrow, color: p.textMuted }}>Table of contents</div>
              <div style={{ ...t.bodySmall, color: p.textMuted }}>{volume.lessons.length} entries</div>
            </div>

            <ol style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: `1px solid ${p.tagBorder}` }}>
              {volume.lessons.map(([n, name], i) => {
                const free = i < 2;
                return (
                  <li key={i} style={{
                    display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 16,
                    alignItems: 'center', padding: '14px 0',
                    borderBottom: `1px solid ${p.tagBorder}`,
                  }}>
                    <span style={{ ...t.caption, color: p.textMuted, fontVariantNumeric: 'tabular-nums', minWidth: 24 }}>{n}</span>
                    <span style={{ ...t.body, color: p.textPrimary }}>{name}</span>
                    {free && (
                      <span style={{
                        ...t.label, fontSize: 10, color: p.accent,
                        border: `1px solid ${p.accent}`, padding: '3px 8px', borderRadius: RADIUS.tag,
                      }}>Free</span>
                    )}
                    <span style={{ ...t.caption, color: p.textMuted, fontVariantNumeric: 'tabular-nums' }}>
                      {Math.floor(8 + (i * 1.7) % 9)}m
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Footer CTAs */}
        <div style={{
          flex: '0 0 auto',
          padding: '20px 28px', borderTop: `1px solid ${p.tagBorder}`,
          display: 'flex', gap: 12, alignItems: 'center', background: p.bgCard,
        }}>
          {enrolled ? (
            <div style={{
              flex: 1, padding: '14px 20px', borderRadius: RADIUS.pill,
              background: p.tagBg, border: `1px solid ${p.accent}`,
              ...t.button, color: p.accent, textAlign: 'center',
            }}>
              Added to your shelf · Check your email
            </div>
          ) : (
            <React.Fragment>
              <button onClick={() => setEnrolled(true)} style={{
                flex: 1, ...t.button, padding: '14px 20px', borderRadius: RADIUS.pill,
                background: p.accent, color: '#FFFFFF', border: 'none', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}>
                Preview the first 2 entries →
              </button>
              <button onClick={() => { handleClose(); setTimeout(onTrial, 280); }} style={{
                ...t.button, padding: '14px 20px', borderRadius: RADIUS.pill,
                background: 'transparent', color: p.textPrimary,
                border: `1px solid ${p.tagBorder}`, cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}>
                Start trial
              </button>
            </React.Fragment>
          )}
        </div>
      </aside>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Subscription gate. Owner/admin routes are blocked when the cafe's
// Stripe subscription isn't in a working state. Feature-flagged off by
// default (VITE_STRIPE_PAYWALL_ENABLED) so nothing changes until we're
// ready to flip it — this lets us ship the paywall code without breaking
// the seeded Milano demo or any pre-Stripe signups.
// ────────────────────────────────────────────────────────────
const PAYWALL_ENABLED = import.meta.env.VITE_STRIPE_PAYWALL_ENABLED === 'true';
const ALLOWED_SUBSCRIPTION_STATUSES = new Set(['trialing', 'active', 'past_due']);
const PAYWALLED_ROUTES = new Set([
  'dashboard', 'team', 'admin-curriculum', 'analytics', 'settings',
  'billing', 'ai-review',
  'admin-home', 'admin-team', 'admin-team-add', 'admin-lessons-grid',
  'admin-setup-copi', 'admin-curriculum-page', 'admin-billing-page',
  'admin-profile-page', 'admin-notifications-page',
]);
function shouldPaywall(user, route) {
  if (!PAYWALL_ENABLED) return false;
  if (!user || !user.cafeId) return false;
  if (!['owner', 'admin'].includes(user.role)) return false;
  if (!PAYWALLED_ROUTES.has(route)) return false;
  return !ALLOWED_SUBSCRIPTION_STATUSES.has(user.subscriptionStatus);
}

// ────────────────────────────────────────────────────────────
// Route → page
// ────────────────────────────────────────────────────────────
function PageFor({ route, user, inviteToken, onSignup, onCafeSetupComplete, onImportRoasterComplete, onInviteAccepted, onLogin }) {
  const LandingPageNew    = window.LandingPageNew;
  const SignupPage        = window.SignupPage;
  const CafeSetupPage     = window.CafeSetupPage;
  const InviteAcceptPage  = window.InviteAcceptPage;
  const ManagerDashboard  = window.ManagerDashboard;
  const CmsPage           = window.CmsPage;
  const OwnerDashboard    = window.OwnerDashboard;
  const StaffPage         = window.StaffPage;
  const AiReviewPage      = window.AiReviewPage;
  const PaywallPage       = window.PaywallPage;

  if (route === 'paywall') {
    return PaywallPage ? <PaywallPage user={user || {}} /> : null;
  }
  if (shouldPaywall(user, route)) {
    return PaywallPage ? <PaywallPage user={user} /> : null;
  }

  // Wireframe-based admin screens (left-sidebar shell)
  if (route === 'admin-home') {
    const AdminHome = window.AdminHome;
    if (AdminHome) return <AdminHome user={user || {}} />;
  }
  if (route === 'admin-team') {
    const AdminTeam = window.AdminTeam;
    if (AdminTeam) return <AdminTeam user={user || {}} view="roster" />;
  }
  if (route === 'admin-team-add') {
    const AdminTeam = window.AdminTeam;
    if (AdminTeam) return <AdminTeam user={user || {}} view="add" />;
  }
  if (route === 'admin-lessons-grid') {
    const AdminLessonsGrid = window.AdminLessonsGrid;
    if (AdminLessonsGrid) return <AdminLessonsGrid user={user || {}} />;
  }
  if (route === 'admin-setup-copi') {
    const AdminSetupCopi = window.AdminSetupCopi;
    if (AdminSetupCopi) return <AdminSetupCopi user={user || {}} />;
  }
  if (route === 'admin-curriculum-page') {
    const AdminCurriculumPageNew = window.AdminCurriculumPageNew;
    if (AdminCurriculumPageNew) return <AdminCurriculumPageNew user={user || {}} />;
  }
  if (route === 'admin-billing-page') {
    const AdminBillingPage = window.AdminBillingPage;
    if (AdminBillingPage) return <AdminBillingPage user={user || {}} />;
  }
  if (route === 'admin-profile-page') {
    const AdminProfilePage = window.AdminProfilePage;
    if (AdminProfilePage) return <AdminProfilePage user={user || {}} />;
  }
  if (route === 'admin-notifications-page') {
    const AdminNotificationsPage = window.AdminNotificationsPage;
    if (AdminNotificationsPage) return <AdminNotificationsPage user={user || {}} />;
  }

  // New authenticated pages (pick new over legacy when available)
  if (route === 'dashboard')  {
    const AdminHome = window.AdminHome;
    if (AdminHome) return <AdminHome user={user || {}} />;
    if (OwnerDashboard) return <OwnerDashboard user={user || {}} />;
    return <RoasterDashboard user={user || {}} />;
  }
  if (route === 'team') {
    const AdminTeam = window.AdminTeam;
    if (AdminTeam) return <AdminTeam user={user || {}} view="roster" />;
    if (StaffPage) return <StaffPage user={user || {}} />;
    return <AdminTeamPage user={user || {}} />;
  }
  if (route === 'admin-curriculum') {
    const AdminCurriculumNew = window.AdminCurriculumNew;
    if (AdminCurriculumNew) return <AdminCurriculumNew user={user || {}} />;
    return <AdminCurriculumPage user={user || {}} />;
  }
  if (route === 'settings') {
    // Old top-nav "Account settings" page is scrapped — legacy 'settings'
    // route now renders the sidebar-layout Set up (Copi AI) page so any
    // stray link/delegation lands users in the current settings surface.
    const AdminSetupCopi = window.AdminSetupCopi;
    if (AdminSetupCopi) return <AdminSetupCopi user={user || {}} />;
    return null;
  }
  if (route === 'analytics') {
    const AdminAnalyticsPageNew = window.AdminAnalyticsPageNew;
    if (AdminAnalyticsPageNew) return <AdminAnalyticsPageNew user={user || {}} />;
    const AdminAnalyticsNew = window.AdminAnalyticsNew;
    if (AdminAnalyticsNew) return <AdminAnalyticsNew user={user || {}} />;
    return <AdminAnalyticsPage user={user || {}} />;
  }
  if (route === 'manager-dashboard') return ManagerDashboard ? <ManagerDashboard user={user || {}} /> : <RoasterDashboard user={user || {}} />;
  if (route === 'billing') {
    const AdminBillingPage = window.AdminBillingPage;
    return AdminBillingPage ? <AdminBillingPage user={user || {}} /> : null;
  }
  if (route === 'cms')       return CmsPage ? <CmsPage user={user || {}} /> : null;
  if (route === 'ai-review') return AiReviewPage ? <AiReviewPage user={user || {}} /> : <AdminCurriculumPage user={user || {}} />;
  if (route === 'today')     return <BaristaDashboard user={user || {}} />;
  if (route === 'barista-library') return <BaristaLibrary user={user || {}} />;
  if (route === 'barista-profile') {
    const BaristaProfileNew = window.BaristaProfileNew;
    return BaristaProfileNew ? <BaristaProfileNew user={user || {}} /> : <BaristaProfile user={user || {}} />;
  }
  if (route === 'curriculum') return <CurriculumPage />;
  if (route === 'pricing')    return <PricingPage />;
  if (route === 'about')      return <AboutPage />;

  // Unauthenticated flows
  if (route === 'signup') return SignupPage ? <SignupPage onSignup={onSignup} onLogin={onLogin} /> : null;
  if (route === 'cafe-setup') return CafeSetupPage && onSignup ? <CafeSetupPage pendingUser={user || {}} onComplete={onCafeSetupComplete} /> : null;
  if (route === 'import-roaster') {
    const ImportRoasterPage = window.ImportRoasterPage;
    if (ImportRoasterPage) return <ImportRoasterPage user={user || {}} onComplete={onImportRoasterComplete} />;
    return null;
  }
  if (route === 'invite-accept') return InviteAcceptPage ? <InviteAcceptPage token={inviteToken} onAccepted={onInviteAccepted} onExpired={onLogin} /> : null;

  return LandingPageNew ? <LandingPageNew /> : <BrandingTemplate3 />;
}

// ────────────────────────────────────────────────────────────
// Floating route indicator — shows current page + lets you tab back to home
// ────────────────────────────────────────────────────────────
function RouteBadge({ route, onHome }) {
  const labelFor = {
    home: 'HOME · LANDING', signup: 'SIGN UP', 'cafe-setup': 'SETUP', 'import-roaster': 'IMPORT ROASTER',
    curriculum: 'CURRICULUM', pricing: 'PRICING', about: 'ABOUT',
    dashboard: 'WORKSPACE · OWNER', team: 'TEAM · OWNER',
    'admin-home': 'HOME · OWNER',
    'admin-team': 'ROSTER · OWNER',
    'admin-team-add': 'ADD TEAMMATE · OWNER',
    'admin-lessons-grid': 'LESSONS · OWNER',
    'admin-curriculum-page': 'CURRICULUM · OWNER',
    'admin-billing-page': 'BILLING · OWNER',
    'admin-setup-copi': 'SET UP COPI AI · OWNER',
    'admin-profile-page': 'PROFILE · OWNER',
    'admin-notifications-page': 'NOTIFICATIONS · OWNER',
    'admin-curriculum': 'CURRICULUM · OWNER', settings: 'SETTINGS',
    analytics: 'ANALYTICS', billing: 'BILLING',
    'manager-dashboard': 'DASHBOARD · MANAGER', 'manager-team': 'TEAM · MANAGER',
    'ai-review': 'AI SETUP',
    today: 'TODAY · BARISTA', 'barista-library': 'LIBRARY · BARISTA',
    'barista-profile': 'PROFILE · BARISTA',
    cms: 'CMS · INTERNAL', 'invite-accept': 'JOIN',
  };
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    setShow(true);
    const t = setTimeout(() => setShow(false), 2400);
    return () => clearTimeout(t);
  }, [route]);
  return (
    <div style={{
      position: 'fixed', left: 20, bottom: 20, zIndex: 8000,
      display: 'flex', gap: 8, alignItems: 'center',
      padding: '10px 14px',
      background: 'rgba(26,20,16,0.86)', color: (window.THEME||{}).onDark||'#EFE9DA',
      fontFamily: '"Hanken Grotesk", "Inter", sans-serif', fontWeight: 600, letterSpacing: '0.18em',
      textTransform: 'uppercase', fontSize: 10,
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      transform: show ? 'translateY(0)' : 'translateY(8px)',
      opacity: show ? 1 : 0.35,
      transition: 'all 320ms cubic-bezier(.2,.7,.2,1)',
      pointerEvents: 'auto',
      cursor: route === 'home' ? 'default' : 'pointer',
    }}
    onClick={() => route !== 'home' && onHome()}
    onMouseEnter={() => setShow(true)}
    onMouseLeave={() => setShow(false)}
    >
      <span style={{ width: 6, height: 6, borderRadius: 99, background: (window.THEME||{}).gold||'#C49455' }} />
      {labelFor[route]}
      {route !== 'home' && <span style={{ opacity: 0.6, marginLeft: 8 }}>← HOME</span>}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// The shell
// ────────────────────────────────────────────────────────────
function routeFromHash() {
  const hash = window.location.hash;
  if (hash.startsWith('#/invite/')) return { route: 'invite-accept', token: hash.slice(9) };
  if (hash === '#/cms') return { route: 'cms', token: null };
  return null;
}

function routeForRole(role) {
  if (['owner','admin'].includes(role)) return 'dashboard';
  if (role === 'manager') return 'manager-dashboard';
  if (role === 'cms') return 'cms';
  return 'today';
}

function CopiPrototype() {
  const hashInfo = routeFromHash();
  const [inviteToken, setInviteToken] = React.useState(hashInfo?.token || null);
  const [route, setRoute] = React.useState(() => {
    if (hashInfo) return hashInfo.route;
    return localStorage.getItem('copi.route') || 'home';
  });
  const [trial, setTrial] = React.useState(false);
  const [login, setLogin] = React.useState(false);
  const [volumeIdx, setVolumeIdx] = React.useState(null);
  const [lessonTarget, setLessonTarget] = React.useState(null);
  const [assignVolId, setAssignVolId] = React.useState(null);
  const [detailEmail, setDetailEmail] = React.useState(null);
  const [fading, setFading] = React.useState(false);
  const [pendingSignupUser, setPendingSignupUser] = React.useState(null);

  // Initial user hydration:
  //   - Supabase session is loaded async by the onAuthStateChange effect below.
  //   - For CMS/CopiStore fallback sessions we still read localStorage on mount
  //     so demo/prototype sessions survive a refresh.
  const [user, setUser] = React.useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('copi.user') || 'null');
      if (!raw) return null;
      if (raw.authProvider === 'supabase') return null; // let the auth listener rehydrate
      if (raw.kind === 'admin' && !raw.role) return { ...raw, role: 'owner' };
      if (raw.kind === 'barista' && !raw.role) return { ...raw, role: 'barista' };
      return raw;
    } catch (_e) { return null; }
  });

  React.useEffect(() => {
    // Supabase's SDK persists its own session; skip our copy for those users
    // so we're not writing the same state in two places.
    if (user && user.authProvider !== 'supabase') {
      localStorage.setItem('copi.user', JSON.stringify(user));
    } else if (!user) {
      localStorage.removeItem('copi.user');
    }
  }, [user]);

  // ── Supabase session bridge ────────────────────────────────────────
  // Hydrates `user` from a Supabase session on mount and keeps it in sync
  // with sign-in, sign-out, and token refresh events. Real auth flows only —
  // CopiStore / CMS demo sessions bypass this path.
  const hydrateSupabaseUser = React.useCallback(async (authUser) => {
    if (!supabase || !authUser) return null;
    const { data: row, error: err } = await supabase
      .from('users')
      .select('id, cafe_id, location_id, email, name, role, cafes(name, subscription_status, trial_end, current_period_end, cancel_at_period_end)')
      .eq('id', authUser.id)
      .maybeSingle();
    if (err || !row) return null;
    const cafe = row.cafes || {};
    return {
      id: row.id,
      cafeId: row.cafe_id,
      locationId: row.location_id,
      email: row.email,
      name: row.name,
      role: row.role,
      kind: ['owner','admin'].includes(row.role) ? 'admin' : row.role,
      cafe: cafe.name || '',
      subscriptionStatus: cafe.subscription_status || null,
      trialEnd: cafe.trial_end || null,
      currentPeriodEnd: cafe.current_period_end || null,
      cancelAtPeriodEnd: !!cafe.cancel_at_period_end,
      authProvider: 'supabase',
    };
  }, []);

  React.useEffect(() => {
    if (!supabase) return; // env not configured — prototype/demo mode only
    let cancelled = false;

    // Rehydrate any existing session on first mount.
    supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled || !data.session) return;
      const u = await hydrateSupabaseUser(data.session.user);
      if (!cancelled && u) {
        setUser(u);
        // Land the user on their role's home surface if they refresh into 'home'.
        setRoute((r) => (r === 'home' ? routeForRole(u.role) : r));
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        return;
      }
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
        if (!session?.user) return;
        const u = await hydrateSupabaseUser(session.user);
        if (u) setUser(u);
      }
      // TOKEN_REFRESHED / PASSWORD_RECOVERY: SDK updates its own session, no-op here.
    });

    return () => { cancelled = true; sub?.subscription?.unsubscribe(); };
  }, [hydrateSupabaseUser]);

  // handleAuth returns { ok, error } so LoginModal can show inline errors.
  //   1. Supabase auth (real) — the only path that creates a real session.
  //   2. CMS hardcoded team login — unchanged; internal-only surface.
  //   3. CopiStore in-memory fallback — preserves the sales/prototype roster
  //      until CopiStore data reads are migrated in a later session.
  const handleAuth = async ({ email, password }) => {
    const trimmedEmail = email.trim().toLowerCase();

    // 1) Real Supabase auth
    if (supabase) {
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email: trimmedEmail, password,
      });
      if (!signInErr && data?.session?.user) {
        const u = await hydrateSupabaseUser(data.session.user);
        if (u) {
          setUser(u);
          setLogin(false);
          goTo(routeForRole(u.role));
          return { ok: true };
        }
        // Authed against Supabase Auth but no matching public.users row.
        await supabase.auth.signOut();
        return { ok: false, error: 'This account has no cafe profile yet. Ask your owner to resend your invite.' };
      }
      // Not a Supabase user — fall through to CMS + CopiStore fallbacks.
    }

    // 2) CMS internal login (hardcoded)
    if (trimmedEmail === 'team@copi.app' && password === 'copi2026') {
      setUser({ id: 'cms', name: 'Copi Team', email: 'team@copi.app', role: 'cms', kind: 'admin' });
      setLogin(false);
      goTo('cms');
      return { ok: true };
    }

    // 3) CopiStore in-memory fallback (prototype/demo roster beyond seeded users)
    const store = window.CopiStore;
    const dbUser = store ? store.authenticate(trimmedEmail, password) : null;
    if (dbUser) {
      setUser({
        ...dbUser,
        kind: ['owner','admin'].includes(dbUser.role) ? 'admin' : dbUser.role === 'manager' ? 'manager' : 'barista',
        cafe: 'Milano',
      });
      setLogin(false);
      goTo(routeForRole(dbUser.role));
      return { ok: true };
    }

    return { ok: false, error: 'Invalid email or password.' };
  };

  const handleSignup = (userData) => {
    setPendingSignupUser(userData);
    goTo('cafe-setup');
  };

  // After CafeSetupPage.bootstrap_owner_cafe RPC succeeds, hydrate `user`
  // from Supabase (the source of truth now that public.cafes/users rows
  // exist). Falls back to CopiStore only for demo/prototype signups made
  // when Supabase isn't configured.
  const handleCafeSetupComplete = async (result) => {
    let u = null;

    if (supabase) {
      const { data: sessionData } = await supabase.auth.getUser();
      if (sessionData?.user) {
        u = await hydrateSupabaseUser(sessionData.user);
      }
    }

    if (!u) {
      // Demo/prototype fallback: build the user shape from CopiStore.
      // Real signups should never hit this branch — if they do, either
      // Supabase isn't configured or the RPC didn't create the public.users
      // row (which would be a bug worth surfacing in logs).
      u = {
        cafeId: result?.cafeId,
        locationId: result?.locationId || null,
        cafeName: result?.cafeName,
        kind: 'admin',
        role: 'owner',
        cafe: result?.cafeName || window.CopiStore?.getCafe(result?.cafeId)?.name || 'My Cafe',
      };
    }

    setUser(u);
    // Send new owners through the roaster-import step before the dashboard.
    // The step is fully skippable, so this never blocks login.
    goTo('import-roaster');
    // Defer the pendingSignupUser clear until after the goTo fade-out
    // (~180ms) so CafeSetupPage doesn't re-render with a null pendingUser
    // mid-transition and crash on `pendingUser.name.split(...)`.
    setTimeout(() => setPendingSignupUser(null), 400);
  };

  const handleImportRoasterComplete = () => {
    goTo('dashboard');
  };

  const handleInviteAccepted = (dbUser) => {
    const u = { ...dbUser, kind: ['owner','admin'].includes(dbUser.role) ? 'admin' : dbUser.role === 'manager' ? 'manager' : 'barista', cafe: 'Milano' };
    setUser(u);
    setInviteToken(null);
    window.location.hash = '';
    goTo(routeForRole(dbUser.role));
  };

  const handleLogout = async () => {
    if (supabase) {
      try { await supabase.auth.signOut(); } catch (_e) { /* ignore — clearing local state is what matters */ }
    }
    setUser(null);
    goTo('home');
  };

  React.useEffect(() => {
    localStorage.setItem('copi.route', route);
  }, [route]);

  const goTo = React.useCallback((next) => {
    if (next === route) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setFading(true);
    setTimeout(() => { setRoute(next); window.scrollTo(0, 0); requestAnimationFrame(() => setFading(false)); }, 180);
  }, [route]);

  const navigate = goTo;

  // ─────────────────────────────────────────────────────────
  // Click delegation: read text content of clicked link/button
  // and translate into navigation or actions.
  // ─────────────────────────────────────────────────────────
  // Expose a small imperative API the page components call directly.
  React.useEffect(() => {
    window.CopiActions = {
      openLesson: (volId, lessonId) => setLessonTarget({ kind: 'lesson', volId, lessonId }),
      openFinal:  (volId) => setLessonTarget({ kind: 'final', volId }),
      openAssign: (volId) => setAssignVolId(volId),
      openBarista: (email) => setDetailEmail(email),
      openTrial: () => navigate('signup'),
      openLogin: () => setLogin(true),
      navigate,
    };
  });

  const onPageClick = (e) => {
    // Logo wordmark — <a> or <span> "Copi." in NavNew / old nav
    const logoEl = e.target.closest('a, span');
    if (logoEl) {
      const text = (logoEl.textContent || '').trim();
      if (text === 'Copi.' || text === 'Copi') {
        const cs = window.getComputedStyle(logoEl);
        if (cs.fontStyle === 'italic' && parseFloat(cs.fontSize) >= 18) {
          e.preventDefault();
          navigate('home');
          return;
        }
      }
    }

    const target = e.target.closest('a, button');
    if (!target) return;

    // Ignore controls inside our own overlay UI
    if (target.closest('[data-proto-ui]')) return;

    // ── Volume "Read the volume" buttons (curriculum cards) ──
    const volIdxAttr = target.getAttribute('data-volume-idx');
    if (volIdxAttr !== null) {
      e.preventDefault();
      setVolumeIdx(parseInt(volIdxAttr, 10));
      return;
    }

    // ── In-app actions (dashboard) ───────────────────────────
    const appAction = target.getAttribute('data-app-action') || target.closest('[data-app-action]')?.getAttribute('data-app-action');
    if (appAction === 'logout') {
      e.preventDefault();
      handleLogout();
      return;
    }
    if (appAction === 'invite') {
      e.preventDefault();
      navigate('team');
      return;
    }

    const raw = (target.textContent || '').trim();
    const text = raw.replace(/\s+/g, ' ');

    // ── Nav primary links ────────────────────────────
    if (text === 'Home')              { e.preventDefault(); navigate('home');             return; }
    if (text === 'Team')              { e.preventDefault(); navigate('team');             return; }
    if (text === 'Dashboard')         { e.preventDefault(); navigate(user?.role === 'manager' ? 'manager-dashboard' : 'dashboard'); return; }
    if (text === 'Billing')           { e.preventDefault(); navigate('admin-billing-page'); return; }
    if (text === 'Curriculum')        {
      e.preventDefault();
      const adminRoutes = ['dashboard','team','admin-curriculum','analytics','settings','billing','ai-review','manager-dashboard'];
      const inAdminSurface = user && (user.kind === 'admin' || ['owner','admin','manager'].includes(user.role)) && adminRoutes.includes(route);
      navigate(inAdminSurface ? 'admin-curriculum' : 'curriculum');
      return;
    }
    if (text === 'Pricing')           { e.preventDefault(); navigate('pricing');          return; }
    if (text === 'About')             { e.preventDefault(); navigate('about');            return; }
    if (text === 'Settings')          { e.preventDefault(); navigate('admin-setup-copi');  return; }
    if (text === 'Analytics')         { e.preventDefault(); navigate('analytics');        return; }
    if (text === 'Today')             { e.preventDefault(); navigate('today');            return; }
    if (text === 'Profile')           { e.preventDefault(); navigate('barista-profile');  return; }
    if (text === 'Log in')            { e.preventDefault(); setLogin(true);               return; }
    if (text === 'Sign up')           { e.preventDefault(); navigate('signup');           return; }
    if (text === 'Library')           {
      e.preventDefault();
      navigate(user && user.kind === 'admin' ? 'analytics' : 'barista-library');
      return;
    }

    // ── CTAs ─────────────────────────────────────────
    if (/start free trial/i.test(text) || /join the waitlist/i.test(text)) {
      e.preventDefault();
      navigate('signup');
      return;
    }
    if (/^log in$/i.test(text)) {
      e.preventDefault();
      setLogin(true);
      return;
    }
    if (/^see the curriculum/i.test(text)) {
      e.preventDefault();
      navigate('curriculum');
      return;
    }
    if (/^preview a volume/i.test(text)) {
      e.preventDefault();
      navigate('curriculum');
      return;
    }
    if (/^the editors/i.test(text)) {
      e.preventDefault();
      navigate('about');
      return;
    }
    if (/^history of coffee/i.test(text) || /^processing methods/i.test(text) || /^barista knowledge/i.test(text)) {
      e.preventDefault();
      navigate('curriculum');
      return;
    }

    // Default: swallow link clicks so href="" / empty anchors don't reload
    if (target.tagName === 'A') e.preventDefault();
  };

  return (
    <div
      onClickCapture={onPageClick}
      style={{
        minHeight: '100vh', position: 'relative',
        background: (window.THEME || window.NEW_PALETTE || {}).bg || '#EFE9DA',
      }}
    >
      <div
        key={route}
        style={{
          opacity: fading ? 0 : 1,
          transform: fading ? 'translateY(6px)' : 'translateY(0)',
          transition: 'opacity 180ms ease, transform 240ms cubic-bezier(.2,.7,.2,1)',
        }}
      >
        <PageFor
          route={route} user={route === 'cafe-setup' ? pendingSignupUser : user}
          inviteToken={inviteToken}
          onSignup={handleSignup}
          onCafeSetupComplete={handleCafeSetupComplete}
          onImportRoasterComplete={handleImportRoasterComplete}
          onInviteAccepted={handleInviteAccepted}
          onLogin={() => setLogin(true)}
        />
      </div>

      <div data-proto-ui>
        <RouteBadge route={route} onHome={() => navigate('home')} />
        <TrialModal open={trial} onClose={() => setTrial(false)} />
        <LoginModal
          open={login}
          onClose={() => setLogin(false)}
          onSwitchToTrial={() => { setLogin(false); navigate('signup'); }}
          onAuth={handleAuth}
        />
        <VolumeModal
          open={volumeIdx !== null}
          volume={volumeIdx !== null ? (window.COPI_VOLUMES || [])[volumeIdx] : null}
          onClose={() => setVolumeIdx(null)}
          onTrial={() => navigate('signup')}
        />
        {window.NewLessonPlayer
          ? React.createElement(window.NewLessonPlayer, {
              open: !!lessonTarget,
              email: (user && user.email) || 'lili@milano.coffee',
              target: lessonTarget,
              onClose: () => setLessonTarget(null),
            })
          : React.createElement(LessonPlayer, {
              open: !!lessonTarget,
              email: (user && user.email) || 'lili@milano.coffee',
              target: lessonTarget,
              onClose: () => setLessonTarget(null),
            })
        }
        <AssignModal
          open={!!assignVolId}
          volId={assignVolId}
          onClose={() => setAssignVolId(null)}
        />
        <BaristaDetailModal
          open={!!detailEmail}
          email={detailEmail}
          onClose={() => setDetailEmail(null)}
        />
      </div>
    </div>
  );
}

Object.assign(window, { CopiPrototype, TrialModal, LoginModal, VolumeModal, RouteBadge, PROTO_PALETTE });


export default CopiPrototype;
