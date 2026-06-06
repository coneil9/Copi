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
