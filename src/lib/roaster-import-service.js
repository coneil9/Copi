// ═════════════════════════════════════════════════════════
// roaster-import-service.js
//
// Client-side implementation of POST /api/import/roaster — the same
// shape, the same error envelope, the same JSON schema.
//
// THE PROJECT HAS NO BACKEND. This file is the prototype-side
// equivalent until the real /api/import/roaster route exists. When a
// backend is added, swap the body of `importRoaster()` for a single
// fetch() call against the route — the inputs, the validation, the
// rate-limit guard, the error contract, and the persistence are all
// already correct.
//
// Patterns followed:
//   - Mirrors `src/lib/ai-service.js` (other simulated AI services).
//   - Rate limit: 3 imports per browser session (sessionStorage).
//   - Validation: URL must be parseable + http/https.
//   - Response envelope:
//        ok   → { ok: true, data: { curriculumId, shop_name, tracks } }
//        fail → { error: true, message: '...', status: 422 }
//   - Strips ```json fences from "the LLM response" before JSON.parse,
//     just like a real backend would, so the swap is exact.
//   - The SYSTEM_PROMPT constant is the literal prompt that will be
//     sent to Claude when the real backend lands.
// ═════════════════════════════════════════════════════════

// ── Constants ──────────────────────────────────────────────
const RATE_LIMIT_KEY    = 'copi.roasterImport.rateLimit';
const RATE_LIMIT_MAX    = 3;
const ANTHROPIC_MODEL   = 'claude-sonnet-4-6';

// The exact system prompt that will be sent to Claude when a real
// backend exists. Kept here so the client and server stay in sync.
export const SYSTEM_PROMPT = `You are a coffee shop training content specialist. You will be given a coffee roaster's website URL. Fetch and read the site thoroughly, including any pages about: their coffees, origins, processing methods, brew guides, about/story page, and any educational content.

Extract all training-relevant information and return ONLY a valid JSON object with no markdown, no preamble, and no explanation. Use this exact schema:

{
  "shop_name": "string",
  "tagline": "string or null",
  "logo_url": "string or null",
  "about": "string — 2-3 sentence brand summary",
  "tracks": [
    {
      "title": "string — track name e.g. 'Origins & Sourcing'",
      "description": "string",
      "lessons": [
        {
          "title": "string",
          "content": "string — full lesson content, written as training material for a barista. Minimum 100 words. Written in second person, practical and educational.",
          "estimated_minutes": number
        }
      ]
    }
  ]
}

Generate between 2 and 4 tracks. Each track should have between 2 and 5 lessons. Prioritize: origin stories, processing methods, brew recipes, tasting notes, brand values, and any unique techniques or products this roaster is known for. If the site has limited content, infer reasonable barista training content from what is available and note it is suggested content. Never return empty lessons.`;

// ── URL validation ─────────────────────────────────────────
function validateUrl(input) {
  if (typeof input !== 'string' || !input.trim()) {
    return { valid: false, message: 'A roaster website URL is required.' };
  }
  const trimmed = input.trim();
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch (_) {
    return { valid: false, message: 'That doesn\'t look like a valid URL.' };
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, message: 'URL must start with http:// or https://' };
  }
  // Hostname must look DNS-shaped (contain at least one dot, no spaces)
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(parsed.hostname)) {
    return { valid: false, message: 'That hostname doesn\'t look reachable.' };
  }
  return { valid: true, url: parsed.toString(), host: parsed.hostname.replace(/^www\./, '') };
}

// ── Rate limiting (per session) ────────────────────────────
function readRateLimit() {
  try {
    return JSON.parse(sessionStorage.getItem(RATE_LIMIT_KEY)) || { count: 0 };
  } catch (_) {
    return { count: 0 };
  }
}
function bumpRateLimit() {
  const next = readRateLimit();
  next.count = (next.count || 0) + 1;
  try { sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(next)); } catch (_) {}
  return next.count;
}
export function getRateLimitState() {
  const { count } = readRateLimit();
  return { count, max: RATE_LIMIT_MAX, remaining: Math.max(0, RATE_LIMIT_MAX - count) };
}

// ── Markdown-fence stripping ───────────────────────────────
// Real LLM responses occasionally wrap JSON in ```json … ``` fences
// even when told not to. Server code strips them before JSON.parse;
// we do the same here so the path is identical.
function stripFences(text) {
  if (typeof text !== 'string') return text;
  let t = text.trim();
  if (t.startsWith('```')) {
    t = t.replace(/^```[a-zA-Z]*\s*/, '').replace(/```\s*$/, '');
  }
  return t.trim();
}

// ── Curated roaster content bank ───────────────────────────
// Realistic, varied content for the demo. The bank is keyed by
// hostname; unknown hosts fall back to a hash-rotation of the
// generic templates so every URL produces a different curriculum.
const ROASTER_BANK = {
  'onyxcoffeelab.com': {
    shop_name: 'Onyx Coffee Lab',
    tagline: 'Coffee, but better.',
    about: 'Onyx is a multi-time U.S. Brewers Cup champion roastery from Northwest Arkansas, known for transparent sourcing, single-origin focus, and a tight competition-driven approach to roasting and brewing.',
    flavor: 'transparent-sourcing'
  },
  'sightglasscoffee.com': {
    shop_name: 'Sightglass Coffee',
    tagline: 'San Francisco roastery and cafés.',
    about: 'Sightglass is a San Francisco roaster that built its reputation on classic, balanced espresso and direct trade relationships across Central America, East Africa, and Indonesia.',
    flavor: 'classic-espresso'
  },
  'fortyninthparallelroasters.com': {
    shop_name: '49th Parallel Coffee Roasters',
    tagline: 'Roasting in Burnaby since 2004.',
    about: '49th Parallel is one of Canada\'s most-recognised specialty roasters. Their house style leans on clean washed coffees from Latin America with a small rotation of standout naturals and competition lots.',
    flavor: 'transparent-sourcing'
  },
  'phil-sebastian.com': {
    shop_name: 'Phil & Sebastian',
    tagline: 'Calgary-born specialty roasters.',
    about: 'Phil & Sebastian started with a single market stall in Calgary and now operates multiple cafés plus a wholesale program known for precision brewing and long-running producer partnerships.',
    flavor: 'precision-brewing'
  },
  'mattcoffee.com': {
    shop_name: 'Matchstick Coffee',
    tagline: 'Vancouver coffee + bakery.',
    about: 'Matchstick is a Vancouver-based roaster and bakery with cafés across the city. Their roasting style favours lively, juicy single-origins and an accessible house blend built for milk drinks.',
    flavor: 'classic-espresso'
  },
  'pallet.coffee': {
    shop_name: 'Pallet Coffee Roasters',
    tagline: 'Vancouver, BC.',
    about: 'Pallet roasts on a Diedrich and runs four Vancouver cafés. The lineup leans on Latin American washed coffees with a rotating natural for the brew bar.',
    flavor: 'classic-espresso'
  }
};

// Fallback template families. Each produces a different track set
// so unknown URLs feel varied. Choice is deterministic on hostname
// hash so repeated imports of the same URL are consistent.
const TEMPLATE_FLAVORS = ['transparent-sourcing', 'classic-espresso', 'precision-brewing'];

function hashStringToInt(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return Math.abs(h);
}

function inferShopNameFromHost(host) {
  const base = host.split('.').slice(0, -1).join(' ').replace(/[-_]/g, ' ');
  return base.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Imported Roaster';
}

// ── Track generators (the "curated content bank") ──────────
function tracksFor(flavor, shopName) {
  if (flavor === 'transparent-sourcing') {
    return [
      {
        title: 'Origins & Sourcing',
        description: `How ${shopName} sources its coffee and the producer relationships behind the menu.`,
        lessons: [
          {
            title: 'Why we name the farm',
            estimated_minutes: 8,
            content: `When a guest asks where a coffee is from, your answer should be more specific than "Ethiopia" or "Colombia." You'll be naming the washing station or the farm, the elevation, and ideally the producer. This level of detail is the whole point of single-origin work: it lets the guest taste the place. Start by reading the bag — every retail bag at ${shopName} lists farm, region, elevation, processing, and varietal. Practice saying these out loud during pre-shift so the words feel natural mid-rush. If you don't know an answer, say so and offer to find out — guessing is worse than admitting.`
          },
          {
            title: 'Producer relationships, in plain language',
            estimated_minutes: 10,
            content: `${shopName} buys most of its coffee through long-running relationships rather than the commodity market. In practice that means we visit producers, agree on pricing well above the C-market, and commit to multiple harvests when a lot performs well. Your guest doesn't need the trade jargon — they need the human story. Practice a 20-second version: who the producer is, what makes their lot worth paying more for, and what you taste in the cup. If a guest pushes back on the price, that 20 seconds is your answer.`
          },
          {
            title: 'Reading a green coffee report',
            estimated_minutes: 12,
            content: `Every lot we buy comes with a green report — scores from our QC team, processing notes, screen size, and density. You don't need to memorize the numbers, but you should know what they mean. A higher density coffee usually wants a finer grind and more contact time. A natural with a high score for "fruit-forward" character will read sweeter on the cupping table than the bag suggests. When you're dialing in, glance at the report — it gives you a starting hypothesis instead of pure trial and error.`
          },
          {
            title: 'Talking sourcing without being preachy',
            estimated_minutes: 6,
            content: `Sourcing language can come across as lecturing fast. Lead with the cup, not the certification. "This is from a co-op in Huila that pulps each lot separately — you can taste the difference in the finish" lands better than reciting a fair-trade pitch. If a guest is curious, you can go deeper. If they're not, the coffee speaks for itself. Read the room. The goal is to make the guest curious, not informed-against-their-will.`
          }
        ]
      },
      {
        title: 'Processing Methods',
        description: 'The four processes you will pour the most, and how to taste the difference.',
        lessons: [
          {
            title: 'Washed: clean, transparent, structured',
            estimated_minutes: 9,
            content: `In a washed process, the cherry is depulped and the bean ferments in tanks of water before being dried. The result is a cup that highlights the origin character — washed Ethiopians taste floral and tea-like, washed Kenyans taste like blackcurrant. When you brew a washed coffee, expect clarity and acidity. If the cup tastes muddy or flat, you have probably over-extracted; coarsen your grind a click. Washed coffees reward precision, so this is where you build your dial-in habits.`
          },
          {
            title: 'Natural: fruit-forward and divisive',
            estimated_minutes: 9,
            content: `In a natural process, the cherry dries whole around the bean, fermenting in its own sugars. You get heavier body, fruit-forward notes (think blueberry, strawberry, rum), and sometimes a "winey" finish. A well-processed natural is a guest favourite; a poorly processed one tastes of compost. When pouring one on bar, prep a 10-second pitch — "this is a Brazilian natural, expect dark cherry and a syrupy body" — so guests know what's coming. Naturals on milk drinks polarize. Some guests love it, some find it muddy. Offer a small taste first if it's their first time.`
          },
          {
            title: 'Honey and pulped natural',
            estimated_minutes: 7,
            content: `Honey processing leaves some of the cherry mucilage on the bean during drying. The amount left (yellow, red, black) drives how much fruit comes through. Expect a middle ground between washed and natural — clean structure with a sweeter body. Honey-processed Costa Ricans are a great gateway for guests who find naturals too wild. They're also forgiving on bar: the body holds up well in milk drinks.`
          },
          {
            title: 'Anaerobic, carbonic, and the experimental column',
            estimated_minutes: 10,
            content: `Anaerobic fermentation seals the cherry in oxygen-free tanks, often producing high-impact tropical fruit and even funky, fermented notes. Carbonic maceration borrows the technique from winemaking. These coffees are rare, expensive, and divisive — pour them at the bar with a clear pitch and don't push them into milk. When a guest asks "what's that one?" make sure you know the processing in detail before you sell it. A bad first experience with an experimental coffee kills curiosity for months.`
          }
        ]
      },
      {
        title: 'Brewing & Dial-In',
        description: 'How we approach espresso and pour-over on bar.',
        lessons: [
          {
            title: 'The dial-in ritual',
            estimated_minutes: 10,
            content: `Every morning you pull two test shots — one slightly fine, one slightly coarse — and taste them side by side. The goal is balance, not a target yield. If both shots taste sour, you're under-extracting; finer or longer contact. If both taste bitter, you're over; coarser or shorter. Time gives you a clue (we aim for a 25–32 second window) but flavour decides. Note the recipe you land on for the day. If the espresso drifts mid-service, retaste before you reach for the grinder.`
          },
          {
            title: 'Pour-over for the bar guest',
            estimated_minutes: 9,
            content: `When a guest orders a pour-over, you're committing to a 4-minute moment with them. Set the kettle to 95°C, weigh out 18g of coffee to 300g of water, and prep the dripper. Bloom for 30 seconds with 60g of water, then pour in two pulses to hit your 300g target by 1:45. Total brew time should land between 3:00 and 3:30. While it's brewing, walk the guest through the coffee — origin, processing, what they should expect. The brew is the experience, the conversation is what they remember.`
          },
          {
            title: 'When to recalibrate mid-shift',
            estimated_minutes: 6,
            content: `Temperature, humidity, and bean age all shift extraction during a busy shift. If your shots start running fast and tasting sour by mid-morning, your grind has drifted coarser — bump finer by a click. If they're choking and tasting bitter, go coarser. Tell whoever is on bar with you what you changed so they aren't fighting an invisible adjustment. A 30-second mid-shift recalibration prevents a stretch of bad drinks.`
          }
        ]
      }
    ];
  }

  if (flavor === 'classic-espresso') {
    return [
      {
        title: `Our espresso programme at ${shopName}`,
        description: 'House style, recipes, and how we expect drinks to taste.',
        lessons: [
          {
            title: 'The house blend, ingredient by ingredient',
            estimated_minutes: 10,
            content: `Our house blend is built for milk drinks first, straight espresso second. You'll find a Brazilian natural at the base for body and chocolate, a washed Colombian for balance and acidity, and a small percentage of an Ethiopian for aromatic lift. Tasted as straight espresso it should read as milk chocolate, toasted nut, and a finish of dried orange. In a cortado it should taste like chocolate-covered cherry. If your shot tastes flat or hollow, you're under-extracting; if it tastes harsh or charred, you've gone too far.`
          },
          {
            title: 'Milk drinks, ratios, and texture',
            estimated_minutes: 9,
            content: `Every milk drink at ${shopName} uses the same espresso recipe — what changes is the ratio. A cortado is 1:1.5 espresso to milk. A flat white is 1:3. A latte is 1:5. A cappuccino is 1:3 but with thicker microfoam. The temperature target is 60–65°C; any hotter and the milk loses its sweetness. The pitcher should feel uncomfortably warm to the hand, never burning. Texture is the variable that separates a great flat white from an average one — practice stretching the milk for the first 3–4 seconds, then settling it into a tight, glossy spin.`
          },
          {
            title: 'Pulling for two: bar speed without breaking quality',
            estimated_minutes: 7,
            content: `When you're working a two-person bar in the morning rush, you'll be dosing, tamping, and pulling while your partner steams. Your job is to keep a rhythm: 8 seconds to dose and tamp, 28 seconds for the shot, repeat. Don't skip the swipe-off, don't forget to wipe the steam wand, and never serve a shot that pulled wrong because the queue is long. A drink reworked is faster than a drink remade.`
          }
        ]
      },
      {
        title: 'Coffees, rotation, and tasting',
        description: 'How we think about our menu and how we taste.',
        lessons: [
          {
            title: 'Reading the rotation',
            estimated_minutes: 8,
            content: `Our rotation changes roughly every 4–8 weeks per slot. The brew bar usually carries 3 single-origins — one easy-drinking, one mid, one challenging. Espresso changes less frequently because dialing in a new espresso on bar takes a full day. Knowing what's currently on bar is the most basic shift prep — check the menu board, taste each option, and have a sentence ready for guests who ask "what would you recommend?"`
          },
          {
            title: 'The Monday cupping habit',
            estimated_minutes: 9,
            content: `Every Monday before opening, we cup the current rotation as a team. You'll grind 11g of each coffee at a coarse setting, bloom with 175g of 95°C water, wait 4 minutes, break the crust, and taste with a soup spoon. The point isn't to grade — it's to anchor your palate to what each coffee tastes like at its best. When a guest asks "is this fruity or chocolatey?" you'll have the cupping memory to answer honestly.`
          }
        ]
      },
      {
        title: 'Service & hospitality',
        description: 'What makes our bar feel like our bar.',
        lessons: [
          {
            title: 'Greeting, in 5 seconds',
            estimated_minutes: 5,
            content: `Make eye contact within 5 seconds of a guest crossing the threshold. You don't have to take their order in that window — just acknowledge them. "Be right with you" is enough. The biggest service failure at a busy specialty bar isn't slow drinks, it's invisible guests. Once you've made contact, the wait feels like part of the experience instead of bad service.`
          },
          {
            title: 'Handling the "I usually drink it with sugar" guest',
            estimated_minutes: 6,
            content: `Some guests will ask for sugar because the last specialty coffee they had was sour. Don't push back. Pour their drink the way they asked, then quietly offer them a taste of the same coffee made differently — a smaller, more balanced flat white, or a pour-over of a sweeter natural. If they're interested, great; if not, they're still your guest and they should leave feeling good about the visit.`
          }
        ]
      }
    ];
  }

  // precision-brewing
  return [
    {
      title: 'Recipes & ratios',
      description: 'The numbers that anchor every drink we make.',
      lessons: [
        {
          title: 'Our espresso recipe and why',
          estimated_minutes: 9,
          content: `Our default espresso recipe is 18g in, 38g out, 28 seconds. That ratio (roughly 1:2.1) gives us a syrupy body without sacrificing clarity. When you dial in, hold the dose and time roughly constant and adjust the grind to land the yield. If your yield is light and the shot tastes sour, finer. If it's heavy and slow and the shot tastes bitter, coarser. Two adjustments should get you within range; if you're more than three clicks off, retare and start fresh — something else is wrong.`
        },
        {
          title: 'Pour-over: V60 default',
          estimated_minutes: 10,
          content: `For a single V60, weigh 15g of coffee and 250g of water at 94°C. Bloom with 50g for 30 seconds, then pour to 150g by 1:00, and to 250g by 1:45. Aim for a total brew time of 2:45–3:15. If your brew is finishing too fast and tasting hollow, your grind is too coarse. Too slow and bitter, too fine. The brew technique is the same every time — the grind is the only knob you adjust per coffee.`
        },
        {
          title: 'Batch brew: the unglamorous workhorse',
          estimated_minutes: 7,
          content: `Most of our drip volume goes through batch brew. The recipe is 60g/L of water, brewed at 94°C, with a contact time of 5–6 minutes. The coffee selected for batch is chosen for forgiveness — a balanced washed origin that holds up over a 90-minute service window. Stir the batch when you decant it; the solids settle and the last cup tastes different from the first if you skip the stir.`
        }
      ]
    },
    {
      title: 'Equipment care',
      description: 'How we keep the bar running.',
      lessons: [
        {
          title: 'Daily equipment routine',
          estimated_minutes: 6,
          content: `Backflush the espresso machine with a blank basket and detergent at close. Soak group heads, screens, and portafilters in cafiza overnight once a week. Wipe the steam wand after every drink and purge it before and after. Clean the grinder hopper weekly and brush the burrs monthly. These aren't optional — they're how the espresso stays consistent. A neglected machine drifts a little every day until one day the espresso tastes wrong and you don't know why.`
        },
        {
          title: 'Grinder calibration and burr life',
          estimated_minutes: 7,
          content: `Our grinders use flat burrs that last roughly 800–1000kg of coffee. As burrs wear, the grind gets finer at the same setting and the shots taste duller. If you find yourself coarsening the grind a lot over a few weeks, the burrs are likely tired. Tell your lead so they can plan a swap. A fresh set of burrs makes more difference to cup quality than almost any other adjustment.`
        }
      ]
    }
  ];
}

// Pick a flavor for an unknown host so the demo always returns
// something varied.
function flavorForHost(host) {
  const hit = ROASTER_BANK[host];
  if (hit) return hit.flavor;
  return TEMPLATE_FLAVORS[hashStringToInt(host) % TEMPLATE_FLAVORS.length];
}

// Build the JSON payload as if Claude had just returned it.
function generatePayload(host) {
  const known = ROASTER_BANK[host];
  const shopName = known?.shop_name || inferShopNameFromHost(host);
  const flavor   = flavorForHost(host);
  return {
    shop_name: shopName,
    tagline:   known?.tagline   ?? null,
    logo_url:  null,
    about:     known?.about     ?? `${shopName} is a specialty coffee roaster. The lessons below were drafted from their public website and should be reviewed before publishing to your team.`,
    tracks:    tracksFor(flavor, shopName)
  };
}

// Simulated latency so the loading messages on the frontend have
// time to cycle the way they would against a real network call.
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

// ── Public entry point ─────────────────────────────────────
// Same signature you'd hit `fetch('/api/import/roaster', …)` with.
// Resolves with one of:
//   { ok: true,  data: { curriculumId, shop_name, tagline, tracks: [...] } }
//   { error: true, message: string, status: 422 }
export async function importRoaster({ url, shopId } = {}) {
  // 1) Validation
  const v = validateUrl(url);
  if (!v.valid) {
    return { error: true, message: v.message, status: 422 };
  }
  if (!shopId) {
    return { error: true, message: 'shopId is required.', status: 422 };
  }

  // 2) Rate limit
  const rate = readRateLimit();
  if ((rate.count || 0) >= RATE_LIMIT_MAX) {
    return {
      error: true,
      message: `Import limit reached for this session (${RATE_LIMIT_MAX} per session). Refresh the page to try a different URL.`,
      status: 422
    };
  }
  bumpRateLimit();

  // 3) Simulate the LLM call. A real backend would look like:
  //
  //    const resp = await fetch('https://api.anthropic.com/v1/messages', {
  //      method: 'POST',
  //      headers: {
  //        'x-api-key': process.env.ANTHROPIC_API_KEY,
  //        'anthropic-version': '2023-06-01',
  //        'content-type': 'application/json',
  //      },
  //      body: JSON.stringify({
  //        model: ANTHROPIC_MODEL,
  //        max_tokens: 4096,
  //        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
  //        system: SYSTEM_PROMPT,
  //        messages: [{ role: 'user', content: `Roaster URL: ${v.url}` }]
  //      })
  //    });
  //    const raw = (await resp.json()).content?.[0]?.text;
  //    const json = JSON.parse(stripFences(raw));
  //
  // We mimic that flow end-to-end so the swap is one block.
  try {
    await wait(2200);                                    // network + first token
    const fakeLlmText = '```json\n' + JSON.stringify(generatePayload(v.host)) + '\n```';
    const json = JSON.parse(stripFences(fakeLlmText));

    if (!json || !Array.isArray(json.tracks) || json.tracks.length === 0) {
      throw new Error('Empty tracks in response');
    }

    // 4) Persist via CopiStore (the same shape as the real backend would write)
    const store = window.CopiStore;
    if (!store) {
      return { error: true, message: 'Store not initialized.', status: 422 };
    }

    const curriculum = store.createDraftCurriculum(shopId, {
      sourceUrl: v.url,
      shopName:  json.shop_name,
      tagline:   json.tagline,
      about:     json.about,
      logoUrl:   json.logo_url
    });

    json.tracks.forEach((trackJson, ti) => {
      const track = store.addTrack(curriculum.id, {
        title:       trackJson.title,
        description: trackJson.description,
        position:    ti
      });
      (trackJson.lessons || []).forEach((lessonJson, li) => {
        store.addLessonToTrack(track.id, {
          title:            lessonJson.title,
          content:          lessonJson.content,
          estimatedMinutes: lessonJson.estimated_minutes,
          position:         li,
          aiGenerated:      true
        });
      });
    });

    return {
      ok: true,
      data: {
        curriculumId: curriculum.id,
        shop_name:    json.shop_name,
        tagline:      json.tagline,
        about:        json.about,
        sourceUrl:    v.url,
        tracks:       json.tracks.map((t) => ({
          title:        t.title,
          description:  t.description,
          lessonCount:  (t.lessons || []).length,
          totalMinutes: (t.lessons || []).reduce((s, l) => s + (l.estimated_minutes || 0), 0)
        }))
      }
    };
  } catch (err) {
    return {
      error: true,
      message: 'We couldn\'t read that site. Try a different URL, or skip this step and build your curriculum manually.',
      status: 422
    };
  }
}

// PATCH /api/curricula/:id/publish — same envelope, same persistence shape.
export async function publishCurriculum(curriculumId) {
  if (!curriculumId) return { error: true, message: 'curriculumId is required.', status: 422 };
  const store = window.CopiStore;
  if (!store) return { error: true, message: 'Store not initialized.', status: 422 };
  const cur = store.publishCurriculum(curriculumId);
  if (!cur) return { error: true, message: 'Curriculum not found.', status: 422 };
  return { ok: true, data: cur };
}

// Window export so App.jsx-style inline pages can reach it.
if (typeof window !== 'undefined') {
  window.RoasterImport = { importRoaster, publishCurriculum, getRateLimitState, SYSTEM_PROMPT };
}
