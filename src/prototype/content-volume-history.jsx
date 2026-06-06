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
