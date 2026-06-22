const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "incoming", "codex");
const OUT_FILE = path.join(OUT_DIR, "world-latin-tropical-v04-200.jsonl");

const collection = "world-latin-tropical-v04";
const category = "world-latin-tropical";
const sourceType = "codex_generated";

const profiles = [
  ["salsa-dura", "salsa dura", "Caribbean Latin", "a hard-driving salsa groove with tight clave, piano montuno, tumbao bass, and horn-led call-and-response", "timbales, congas, bongos, cowbell, clave accents, and crisp section breaks", "syncopated tumbao bass that locks to piano and percussion", "piano montuno, brass stabs, hand percussion, chorus responses, and short instrumental moñas", "a powerful rhythmic lead vocal with coro answers", ["salsa-dura", "clave", "montuno", "horns", "dance"]],
  ["salsa-romantica", "salsa romantica", "Caribbean Latin", "a smooth salsa groove with romantic chord movement, polished percussion, and a graceful chorus melody", "congas, timbales, soft cowbell, bongos, and tasteful cymbal lifts", "warm tumbao bass with elegant passing notes", "piano montuno, soft brass, strings-like pads, clean guitar touches, and harmony coro", "a tender melodic lead vocal", ["salsa-romantica", "smooth", "tumbao", "romantic", "coro"]],
  ["son-cubano-inspired", "son cubano inspired", "Cuba", "a classic son-inspired groove with clave pulse, tres-like guitar color, walking bass, and relaxed vocal call-and-response", "bongos, maracas, clave, light congas, and subtle güiro motion", "upright-style bass outlining tumbao movement with spacious rests", "tres-like guitar, piano touches, trumpet-like lead phrases, and group vocal replies", "a warm conversational lead vocal", ["son-cubano-inspired", "tres-like-guitar", "clave", "call-response", "warm"]],
  ["mambo-big-band", "mambo big band", "Caribbean Latin", "a brassy mambo groove with sharp horn riffs, syncopated piano, and high-energy dance breaks", "timbales, congas, bongos, cowbell, snare accents, and ensemble hits", "walking tumbao bass driving every horn stab", "large brass section, sax-like answers, piano montuno, and percussion breaks", "mostly instrumental with optional shouted coro phrases", ["mambo", "big-band", "brass", "percussion-breaks", "dance"]],
  ["cha-cha-cha", "cha-cha-cha", "Cuba", "a playful cha-cha-cha groove with steady bell pattern, light piano, and elegant melodic phrasing", "cha-cha bell, güiro, congas, bongos, and small kit accents", "simple warm bass moving in clear dance steps", "piano, flute-like lead, light brass, clean guitar, and soft vocal replies", "a graceful lead vocal or instrumental melody", ["cha-cha-cha", "playful", "guiro", "flute-color", "dance"]],
  ["bolero", "bolero", "Latin America", "a slow romantic bolero with lush chords, gentle percussion, and an intimate vocal arc", "soft bongos, brushes, shakers, and restrained cymbal swells", "warm bass with long supportive notes and subtle turns", "nylon-string guitar, piano, strings-like pads, muted trumpet-like phrases, and close harmonies", "an intimate expressive lead vocal", ["bolero", "romantic", "slow", "nylon-guitar", "intimate"]],
  ["bolero-son", "bolero son", "Cuba", "a slow-to-mid bolero-son groove with romantic melody, clave undercurrent, and gently moving bass", "bongos, clave, maracas, light congas, and soft rim clicks", "round bass connecting bolero harmony to son-style pulse", "nylon guitar, piano montuno hints, trumpet-like answers, and warm backing vocals", "a tender lead vocal with call-and-response moments", ["bolero-son", "romantic", "clave", "warm-bass", "call-response"]],
  ["bossa-nova", "bossa nova", "Brazil", "a soft bossa nova groove with syncopated guitar, airy melody, and restrained jazz harmony", "brushes, rim clicks, shaker, soft kick, and subtle ride cymbal", "gentle bass moving through extended chords with relaxed timing", "nylon-string guitar, electric piano, flute-like lead, and breathy harmonies", "a smooth understated lead vocal", ["bossa-nova", "nylon-guitar", "soft", "jazz-harmony", "relaxed"]],
  ["samba", "samba", "Brazil", "a lively samba groove with layered percussion, bright cavaquinho-like strums, and a chorus that moves with street energy", "surdo-like low drums, pandeiro, tamborim, shakers, claps, and snare rolls", "bouncy bass following percussion pushes and harmonic turns", "cavaquinho-like strums, guitar, brass touches, piano, and group vocals", "a spirited melodic lead vocal", ["samba", "layered-percussion", "bouncy", "group-vocals", "bright"]],
  ["samba-reggae", "samba reggae", "Brazil", "a heavy Afro-Brazilian percussion groove with slow swing, deep drums, and broad call-and-response hooks", "surdo-like bass drums, repique-like accents, shakers, claps, and large ensemble hits", "deep bass reinforcing the drum patterns with simple powerful movement", "clean guitar, brass pads, hand percussion, and group vocal responses", "a strong communal lead vocal", ["samba-reggae", "afro-brazilian", "deep-drums", "call-response", "communal"]],
  ["pagode-pop", "pagode pop", "Brazil", "a warm pagode-inspired pop groove with hand percussion, cavaquinho-like sparkle, and a smooth chorus", "pandeiro, tantan-like low hits, hand claps, shakers, and soft kit support", "rounded bass with relaxed syncopation and friendly movement", "cavaquinho-like strums, nylon guitar, piano, and group backing vocals", "a warm melodic lead vocal", ["pagode-pop", "hand-percussion", "cavaquinho-color", "warm", "chorus"]],
  ["forro-pop", "forro pop", "Brazil", "a danceable forro-pop groove with accordion-like lead, zabumba-inspired pulse, and bright melodic lift", "zabumba-like low drum, triangle, shakers, claps, and compact kit accents", "simple bouncing bass that follows the dance pulse", "accordion-like synth lead, nylon guitar, percussion, and group vocal replies", "a cheerful melodic lead vocal", ["forro-pop", "accordion-color", "triangle", "dance", "bright"]],
  ["baiao-fusion", "baiao fusion", "Brazil", "a baião-inspired groove with triangle pulse, syncopated bass, and modern harmonic color", "triangle, zabumba-like hits, shakers, claps, and tight snare accents", "syncopated bassline that pushes against the percussion pattern", "accordion-like keys, electric piano, nylon guitar, and small brass phrases", "a melodic lead vocal or instrumental top line", ["baiao-fusion", "triangle", "syncopated", "accordion-color", "fusion"]],
  ["mpb-tropical-pop", "MPB tropical pop", "Brazil", "a sophisticated Brazilian pop groove with warm chords, soft percussion, and a breezy melodic hook", "light kit, shaker, pandeiro accents, brushed snare, and gentle fills", "smooth bass with syncopated movement and rounded tone", "nylon guitar, electric piano, organ pad, flute-like lead, and airy harmonies", "a smooth natural lead vocal", ["mpb-tropical-pop", "sophisticated", "nylon-guitar", "warm-chords", "breezy"]],
  ["tango-nuevo-inspired", "tango nuevo inspired", "Argentina", "a dramatic tango-inspired groove with sharp accents, minor-key tension, and cinematic dance movement", "staccato percussion, brushed snare, hand claps, and dramatic stops", "upright-style bass marking strong downbeats and chromatic turns", "bandoneon-like lead, piano, strings-like pads, nylon guitar, and low drones", "a dramatic vocal or instrumental lead melody", ["tango-nuevo-inspired", "dramatic", "bandoneon-color", "minor-key", "cinematic"]],
  ["milonga-fusion", "milonga fusion", "Argentina", "a quick milonga-inspired pulse with folk guitar motion, syncopated bass, and bright rhythmic lift", "light percussion, brushed snare, claps, and hand drum accents", "nimble bass following the fast dance pulse", "nylon guitar, accordion-like color, piano touches, and small string-like answers", "a clear melodic lead vocal", ["milonga-fusion", "quick-pulse", "folk-guitar", "syncopated", "argentina"]],
  ["cumbia-colombiana", "Colombian cumbia", "Colombia", "a rolling cumbia groove with steady percussion, accordion-like hook, and bass that sways behind the beat", "tambora-like low hits, guacharaca-like scrape, hand drums, shakers, and claps", "warm bass with simple rocking movement and syncopated rests", "accordion-like lead, clean guitar, brass touches, and group vocal responses", "a relaxed melodic lead vocal", ["cumbia-colombiana", "accordion-color", "sway", "hand-percussion", "dance"]],
  ["cumbia-sonidera", "cumbia sonidera", "Mexico", "a bright cumbia sonidera-inspired groove with playful keyboard hooks, steady percussion, and dancefloor bounce", "cumbia drums, güiro-like scrape, claps, timbales, and electronic percussion touches", "round bass pulsing in a simple dance pattern", "keyboard lead, brass-like synth stabs, clean guitar, and call-and-response vocals", "a lively melodic lead vocal", ["cumbia-sonidera", "keyboard-hook", "dancefloor", "guiro", "bright"]],
  ["digital-cumbia", "digital cumbia", "Latin America", "a modern digital cumbia groove with synthetic percussion, warm bass, and psychedelic melodic color", "electronic cumbia kick, claps, güiro-like texture, shakers, and filtered drum fills", "subby bass that keeps the cumbia sway clear", "synth accordion color, dubby guitar, organ, filtered pads, and playful lead hooks", "a sparse melodic vocal or instrumental lead", ["digital-cumbia", "synthetic", "sub-bass", "psychedelic", "cumbia"]],
  ["chicha-psychedelic-cumbia", "chicha psychedelic cumbia", "Peru", "a psychedelic cumbia groove with clean guitar hooks, steady percussion, and hypnotic tropical sway", "cumbia drums, güiro-like scrape, hand percussion, and simple cymbal accents", "warm bass holding repeating figures with subtle turns", "clean electric guitar melody, organ, farfisa-like keys, and echo touches", "a relaxed lead vocal or guitar-led instrumental", ["chicha", "psychedelic-cumbia", "clean-guitar", "hypnotic", "peru"]],
  ["vallenato-pop", "vallenato pop", "Colombia", "a melodic vallenato-pop groove with accordion-like lead, caja-inspired percussion, and clear chorus lift", "caja-like hand drum, guacharaca-like scrape, claps, soft kit, and fills", "rounded bass supporting the accordion-style hook and vocal melody", "accordion-like synth, acoustic guitar, piano, and group vocal responses", "a heartfelt melodic lead vocal", ["vallenato-pop", "accordion-color", "heartfelt", "hand-percussion", "chorus"]],
  ["bachata-tradicional", "bachata tradicional", "Dominican Republic", "a guitar-led bachata groove with syncopated requinto-style phrases, bongo pulse, and romantic melody", "bongo patterns, güira-like scrape, soft kick, claps, and small fills", "rounded bass outlining the bachata pulse with warm movement", "nylon and electric guitar arpeggios, requinto-style lead phrases, and close harmonies", "a tender lead vocal", ["bachata", "guitar-led", "bongo", "guira", "romantic"]],
  ["bachata-urbana", "bachata urbana", "Dominican Republic", "a polished urban bachata groove with modern drums, guitar arpeggios, and a smooth pop hook", "bongo and güira-inspired layers blended with crisp kick, snare, claps, and risers", "warm sub bass following the bachata rhythm with clean syncopation", "requinto-style guitar, nylon arpeggios, pads, and soft harmony stacks", "a smooth melodic lead vocal", ["bachata-urbana", "modern", "guitar-arpeggios", "sub-bass", "pop-hook"]],
  ["merengue-tipico-inspired", "merengue tipico inspired", "Dominican Republic", "a fast merengue-inspired groove with accordion-like lead, tambora pulse, and constant dance energy", "tambora-like drum, güira-like scrape, kick support, claps, and fast fills", "driving bass with steady dance motion and chord pushes", "accordion-like lead, brass stabs, piano, and group vocal shouts", "an energetic lead vocal with call backs", ["merengue", "fast", "accordion-color", "tambora", "dance"]],
  ["merengue-pop", "merengue pop", "Dominican Republic", "a bright merengue-pop track with glossy horns, fast percussion, and a singable chorus", "fast güira-like texture, tambora-like hits, claps, kick, and snare lifts", "simple energetic bass locking with the percussion engine", "brass stabs, piano, synth layers, and backing vocal stacks", "a lively melodic lead vocal", ["merengue-pop", "bright", "fast-percussion", "horns", "chorus"]],
  ["reggaeton-pop", "reggaeton pop", "Latin America", "a polished reggaeton-pop groove with dembow-inspired bounce, tropical chords, and a clean melodic hook", "tight dembow-style kick-snare pattern, claps, hats, percussion fills, and risers", "rounded sub bass with syncopated movement and pop-friendly restraint", "muted guitar, synth plucks, airy pads, brass-like hits, and vocal doubles", "a melodic rhythmic lead vocal", ["reggaeton-pop", "dembow-inspired", "sub-bass", "tropical", "hook"]],
  ["latin-trap-pop", "Latin trap pop", "Latin America", "a smooth Latin trap-pop groove with sparse drums, dark chords, and a melodic sung hook", "deep kick, crisp snare, rolling hats, claps, and subtle percussion accents", "sub bass with long notes and occasional syncopated slides", "nylon guitar loop, moody keys, filtered pads, and small brass-like moments", "a melodic vocal with rhythmic phrasing", ["latin-trap-pop", "sparse", "sub-bass", "dark-chords", "melodic"]],
  ["dembow-club", "dembow club", "Caribbean Latin", "a high-energy dembow club groove with hard percussion, short vocal hooks, and strong bass bounce", "dembow-style drums, claps, rim shots, shaker loops, and sharp fills", "punchy sub bass hitting around the kick with clear gaps", "short synth stabs, brass hits, chopped guitar, and hype-style group responses", "a rhythmic lead vocal with short call phrases", ["dembow-club", "club", "percussion", "sub-bass", "high-energy"]],
  ["latin-house", "Latin house", "Global", "a danceable Latin house groove with piano stabs, percussion loops, and a bright club chorus", "four-on-the-floor kick, conga-like loops, claps, hats, timbale fills, and risers", "deep house bass with syncopated Latin push", "piano stabs, brass-like synths, guitar chops, and group vocal hooks", "a soulful rhythmic vocal hook", ["latin-house", "club", "piano-stabs", "percussion", "dance"]],
  ["salsa-house-fusion", "salsa house fusion", "Global", "a hybrid salsa-house groove with clave-aware percussion, club kick, and horn-driven chorus impact", "house kick, congas, timbales, cowbell, claps, and filter-build fills", "tumbao-inspired bass shaped for club low end", "piano montuno, brass stabs, synth pads, and coro-style responses", "a rhythmic vocal hook with group answers", ["salsa-house", "fusion", "clave", "club", "horns"]],
  ["latin-jazz", "Latin jazz", "Global", "a sophisticated Latin jazz groove with clave, extended chords, and improvisation-ready instrumental sections", "congas, timbales, ride cymbal, clave accents, and dynamic fills", "walking tumbao bass with chromatic approaches and rhythmic clarity", "piano montuno, horn-like lead, guitar comping, and percussion solos", "mostly instrumental with optional wordless vocal texture", ["latin-jazz", "extended-chords", "instrumental", "clave", "improvisation"]],
  ["afro-cuban-jazz", "Afro-Cuban jazz", "Cuba and diaspora", "an Afro-Cuban jazz groove with layered percussion, strong clave logic, and brass-led melodic development", "congas, batá-inspired accents, timbales, cowbell, ride cymbal, and ensemble hits", "syncopated bass connecting jazz harmony to percussion cycles", "piano montuno, brass and reed-like leads, guitar comping, and wordless chorus pads", "instrumental or sparse vocal texture", ["afro-cuban-jazz", "layered-percussion", "clave", "brass", "jazz"]],
  ["latin-funk", "Latin funk", "Latin America", "a tight Latin funk pocket with syncopated bass, hand percussion, wah guitar, and horn stabs", "funk drums, congas, cowbell, claps, ghosted snare, and short breaks", "rubbery bassline with octave jumps and Latin push", "wah guitar, clav-like keys, brass stabs, organ, and group vocal replies", "a rhythmic soulful lead vocal", ["latin-funk", "rubbery-bass", "wah-guitar", "horn-stabs", "percussion"]],
  ["latin-rock", "Latin rock", "Latin America", "a guitar-forward Latin rock track with syncopated percussion, strong chorus chords, and melodic lead lines", "rock kit blended with conga-like accents, claps, shakers, and tom fills", "warm electric bass locking rock drive to Latin percussion", "crunch guitar, clean arpeggios, organ, brass touches, and short lead fills", "a passionate melodic rock vocal", ["latin-rock", "guitar", "percussion", "passionate", "chorus"]],
  ["spanish-rumba-pop", "Spanish rumba pop", "Spain", "a sunny rumba-pop groove with handclaps, nylon guitar rasgueado color, and a bright chorus", "palmas-style claps, cajon-like hits, shakers, light kick, and snare brushes", "rounded bass supporting guitar strums and vocal phrases", "nylon guitar strums, hand percussion, accordion-like pad, and harmony vocals", "a warm melodic lead vocal", ["spanish-rumba-pop", "palmas", "nylon-guitar", "sunny", "handclaps"]],
  ["flamenco-pop-fusion", "flamenco pop fusion", "Spain", "a pop track with flamenco-inspired handclaps, nylon guitar flourishes, and dramatic chorus lift", "palmas-style claps, cajon-like hits, kick support, shakers, and tom accents", "warm bass grounding the dramatic chord movement", "nylon guitar runs, piano, strings-like pads, and group vocal responses", "an expressive melodic lead vocal", ["flamenco-pop-fusion", "palmas", "dramatic", "nylon-guitar", "pop"]],
  ["andean-tropical-pop", "Andean tropical pop", "Andes", "a bright Andean-tropical groove with pan-flute-like color, charango-like sparkle, and danceable percussion", "hand drums, shakers, claps, light kick, and cumbia-adjacent percussion", "warm bass with simple uplifting movement", "charango-like plucks, pan-flute-like synth lead, guitar, and backing vocals", "a clear melodic lead vocal", ["andean-tropical-pop", "charango-color", "pan-flute-color", "dance", "bright"]],
  ["huayno-pop-fusion", "huayno pop fusion", "Andes", "a fast Andean pop fusion with bright rhythm, high melodic hooks, and acoustic-string sparkle", "hand percussion, claps, shakers, kick support, and quick fills", "bouncy bass following the dance pulse and melody", "charango-like strums, guitar, accordion-like keys, and high lead synth color", "an energetic melodic lead vocal", ["huayno-pop-fusion", "andean", "fast", "bright", "acoustic-string"]],
  ["norteno-pop", "norteño pop", "Mexico and US borderlands", "a lively norteño-pop groove with accordion-like lead, bajo-style rhythm, and a direct singable chorus", "snare, kick, handclaps, shaker, and compact dance fills", "steady bass outlining polka-like movement and chord pushes", "accordion-like lead, bajo sexto-like guitar color, brass touches, and group replies", "a confident melodic lead vocal", ["norteno-pop", "accordion-color", "borderlands", "dance", "chorus"]],
  ["mariachi-pop-fusion", "mariachi pop fusion", "Mexico", "a cinematic mariachi-pop fusion with trumpet-like hooks, vihuela-like strums, and a modern chorus shape", "light kit, handclaps, guitarron-like low accents, and percussion rolls", "deep acoustic-style bass supporting dramatic chord turns", "trumpet-like lead, vihuela-like strums, nylon guitar, strings-like pads, and group vocals", "a bold melodic lead vocal", ["mariachi-pop-fusion", "trumpet-color", "bold", "acoustic-low-end", "modern"]],
];

const variations = [
  {
    structure: "Arrange intro, groove statement, verse, pre-hook lift, chorus, instrumental answer, final chorus, and clean outro.",
    detail: "Let the instrumental answer use piano, guitar, brass, accordion-like lead, flute-like color, or percussion without quoting a known phrase.",
    useCase: "playlist-ready warmth",
  },
  {
    structure: "Arrange percussion pickup, main groove, verse, call-and-response hook, bridge, short break, final hook, and fade-style ending.",
    detail: "Use call-and-response between lead voice, chorus, horn, guitar, piano, or accordion-like lead so the arrangement feels communal.",
    useCase: "danceable live-band motion",
  },
  {
    structure: "Arrange bass or percussion intro, full groove, verse, chorus, stripped middle, rebuild, final chorus, and hard stop.",
    detail: "In the stripped middle, leave only percussion, bass, and one chord instrument before the full ensemble returns.",
    useCase: "clear section contrast",
  },
  {
    structure: "Arrange atmospheric opening, rhythm entrance, verse, wide chorus, instrumental motif, breakdown, final chorus, and ringing last chord.",
    detail: "Add one new layer in the second half: harmony vocals, brass pad, extra percussion, piano montuno, or guitar counterline.",
    useCase: "emotional build",
  },
  {
    structure: "Arrange count-in or room-tone intro, main rhythm, vocal section, chorus, dance break, last chorus, and spacious outro.",
    detail: "Keep the main groove recognizable but shift one bass note, percussion break, or chord color near the end for development.",
    useCase: "repeatable groove identity",
  },
];

const keys = ["A minor", "C minor", "D minor", "E minor", "G major"];
const defaultBpms = [86, 94, 102, 110, 118];

const titleA = ["Coral", "Amber", "Palm", "Golden", "Cedar", "Azul", "Mango", "Copper", "Saffron", "Lunar", "Ivory", "Marble", "Crimson", "Silver", "Orchid", "Harbor", "Velvet", "Tidal", "Opal", "Rain", "Cobalt", "Morning", "Teak", "Pearl", "Juniper", "Solar", "Rose", "Sable", "Bamboo", "Jade", "Basalt", "Cloud", "Magnolia", "Anchor", "Cocoa", "Twilight", "Warm", "Brass", "Emerald", "Seaside"];
const titleB = ["Plaza", "Lantern", "Harbor", "Garden", "Compass", "Market", "Veranda", "Bridge", "Courtyard", "Signal", "Marina", "Terrace", "Mural", "Cove", "Avenue", "Window", "Breeze", "Ridge", "Festival", "Canopy", "Station", "Shore", "Piano", "Street", "Reef", "Tower", "Valley", "Theater", "Café", "Pier", "Field", "Beacon", "Alley", "River", "Kitchen", "Horizon", "Cabin", "Crossing", "Circuit", "Table"];
const titleC = ["Sway", "Lift", "Echo", "Glow", "Turn", "Rise", "Step", "Bloom", "Roll", "Reply", "Pulse", "Drift", "Wave", "Answer", "Motion", "Shine", "Arc", "Groove", "Path", "Flow", "Spark", "Call", "Trace", "Circle", "Phrase", "Wake", "Rally", "Landing", "Thread", "Hush", "Flight", "Frame", "Crossing", "Hold", "Shuffle", "Spring", "Signal", "Crest", "Return", "Chord"];

function pad(value, width = 3) {
  return String(value).padStart(width, "0");
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function titleFor(profileIndex, variationIndex) {
  return `${titleA[(profileIndex * 2 + variationIndex) % titleA.length]} ${titleB[(profileIndex * 5 + variationIndex * 3) % titleB.length]} ${titleC[(profileIndex * 7 + variationIndex * 2) % titleC.length]}`;
}

function bpmFor(slug, variationIndex) {
  if (slug.includes("bolero")) return [62, 68, 74, 80, 86][variationIndex];
  if (slug.includes("bossa")) return [72, 78, 84, 90, 96][variationIndex];
  if (slug.includes("salsa") || slug.includes("mambo") || slug.includes("merengue")) return [132, 140, 148, 156, 164][variationIndex];
  if (slug.includes("reggaeton") || slug.includes("dembow")) return [88, 94, 100, 106, 112][variationIndex];
  if (slug.includes("trap")) return [72, 78, 84, 90, 96][variationIndex];
  if (slug.includes("house")) return [120, 124, 126, 128, 130][variationIndex];
  if (slug.includes("tango")) return [92, 100, 108, 116, 124][variationIndex];
  if (slug.includes("huayno") || slug.includes("norteno")) return [124, 132, 140, 148, 156][variationIndex];
  return defaultBpms[variationIndex];
}

function makePrompt(profile, variation, bpm, key) {
  const [slug, label, region, groove, drums, bass, colors, vocal] = profile;
  const full = [
    `Create an original ${label} track at ${bpm} BPM in ${key}, built around ${groove}.`,
    `Build the rhythm with ${drums}; use ${bass}.`,
    `Feature ${colors}; use ${vocal}. Keep melodies, hooks, montunos, coro parts, horn lines, basslines, and percussion breaks newly composed, with no named performer, existing song, label, or sampled recording references.`,
    variation.structure,
    variation.detail,
    `Shape it for ${variation.useCase}, strong dance pocket, clear regional rhythm identity, tasteful vocal phrasing, and no borrowed melody. Mix with separated kick, bass, guitars, piano, brass, vocals, percussion, synths, and room ambience.`,
  ].join(" ");
  if (full.length <= 1000) return full;

  const compact = [
    `Create an original ${label} track at ${bpm} BPM in ${key}, built around ${groove}.`,
    `Build the rhythm with ${drums}; use ${bass}.`,
    `Feature ${colors}; use ${vocal}. Keep melodies, hooks, horn lines, basslines, and percussion breaks newly composed, with no named performer or existing song references.`,
    variation.structure,
    `Shape it for ${variation.useCase}, strong dance pocket, clear regional rhythm identity, and no borrowed melody. Mix with separated kick, bass, guitars, piano, brass, vocals, percussion, synths, and room ambience.`,
  ].join(" ");
  if (compact.length <= 1000) return compact;

  return [
    `Create an original ${label} track at ${bpm} BPM in ${key}, built around ${groove}.`,
    `Use ${drums}, ${bass}, and ${colors}.`,
    `${vocal}. Keep hooks, horn lines, basslines, montunos, and percussion breaks newly composed, with no named performer or existing song references.`,
    variation.structure,
    `Mix with separated kick, bass, guitars, piano, brass, vocals, percussion, synths, and room ambience.`,
  ].join(" ");
}

function ensureLength(prompt, profile) {
  let value = prompt;
  const additions = [
    " Preserve human timing, natural push and pull, and clear percussion dialogue so the groove feels alive rather than looped.",
    " Use tasteful automation for breaks, drops, and ensemble returns while keeping the rhythm identity easy to recognize.",
    ` Keep the ${profile[1]} identity clear through percussion, bass movement, chord color, vocal shape, and a memorable original hook.`,
  ];
  for (const addition of additions) {
    if (value.length >= 650) break;
    if (value.length + addition.length <= 1000) value += addition;
  }
  if (value.length < 650) throw new Error(`${profile[0]} prompt too short after padding: ${value.length}`);
  return value;
}

function makeExclude(slug) {
  return unique([
    "specific artist references",
    "copyrighted melodies",
    "copied montunos",
    "copied percussion breaks",
    "existing song titles",
    "famous Latin hooks",
    "label references",
    "recognizable samples",
    "fake accent caricature",
    "muddy low end",
    "harsh clipping",
    "thin percussion",
    slug.includes("reggaeton") || slug.includes("dembow") ? "famous dembow hooks" : "",
  ]).join(", ");
}

const records = [];
profiles.forEach((profile, profileIndex) => {
  const [slug, label, region, , , , , , tags] = profile;
  variations.forEach((variation, variationIndex) => {
    const index = records.length;
    const batchNumber = Math.floor(index / 50) + 1;
    const bpm = bpmFor(slug, variationIndex);
    const key = keys[(profileIndex + variationIndex) % keys.length];
    const prompt = ensureLength(makePrompt(profile, variation, bpm, key), profile);
    records.push({
      id: `world-latin-tropical-v04-${pad(index + 1)}`,
      source_type: sourceType,
      batch_id: `20260622-world-latin-tropical-${pad(batchNumber)}`,
      collection,
      language_region: region,
      category,
      subcategory: slug,
      title: titleFor(profileIndex, variationIndex),
      prompt,
      exclude: makeExclude(slug),
      bpm,
      key,
      vocal: profile[7],
      mood: [variation.useCase, "dance pocket", "warm ensemble"],
      tags: unique([...tags, slugify(region)]),
      groove_score: variationIndex === 0 ? 9 : 8,
      energy: bpm >= 124 ? "high" : bpm >= 96 ? "medium-high" : "medium",
      energy_score: bpm >= 124 ? 9 : bpm >= 96 ? 8 : 6,
      public_safe: true,
      rights_status: "ai_generated_original",
      needs_review: false,
      is_top_pick: variationIndex === 0 && profileIndex % 5 === 0,
    });
  });
});

if (records.length !== 200) throw new Error(`Expected 200 records, got ${records.length}`);

const titleSet = new Set();
const idSet = new Set();
records.forEach((record) => {
  const titleKey = record.title.toLowerCase();
  if (titleSet.has(titleKey)) throw new Error(`Duplicate title: ${record.title}`);
  titleSet.add(titleKey);
  if (idSet.has(record.id)) throw new Error(`Duplicate id: ${record.id}`);
  idSet.add(record.id);
  if (record.prompt.length < 650 || record.prompt.length > 1000) {
    throw new Error(`${record.id} prompt length out of range: ${record.prompt.length}`);
  }
  if (/\r|\n/.test(record.prompt)) throw new Error(`${record.id} prompt contains newline`);
});

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, `${records.map((record) => JSON.stringify(record)).join("\n")}\n`, "utf8");
console.log(`Wrote ${records.length} records to ${OUT_FILE}`);
