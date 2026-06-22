const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "incoming", "codex");
const OUT_FILE = path.join(OUT_DIR, "world-blues-soul-gospel-v04-200.jsonl");

const collection = "world-blues-soul-gospel-v04";
const category = "world-blues-soul-gospel";
const sourceType = "codex_generated";

const profiles = [
  ["delta-blues", "Delta blues", "US South", "a sparse acoustic 12-bar foundation with foot-tap pulse, slide guitar color, and a weathered vocal center", "brush kick, foot stomp, handclaps, and light snare ghosts", "upright-style bass or thumbed low guitar notes keeping the roots clear", "resonator-style guitar, slide phrases, porch ambience, and subtle harmonica answers", "a raw intimate lead vocal", ["delta-blues", "acoustic", "slide-guitar", "raw-vocal", "roots"]],
  ["piedmont-blues", "Piedmont blues", "US Southeast", "a fingerpicked ragtime-blues groove with alternating bass thumb, bright syncopation, and relaxed storytelling", "light brushed kit, foot taps, claps, and soft shaker movement", "alternating acoustic bass notes inside the guitar pattern", "fingerpicked guitar, small piano fills, warm room tone, and gentle harmony hums", "a conversational lead vocal", ["piedmont-blues", "fingerpicking", "ragtime-feel", "storytelling", "acoustic"]],
  ["chicago-electric-blues", "Chicago electric blues", "US Midwest", "a smoky electric shuffle with biting guitar, walking bass, and a vocal that pushes against the backbeat", "shuffle drums, snare accents, ride cymbal, and compact fills", "walking electric bass with clean turnarounds", "electric guitar bends, harmonica-like synth or real harp color, piano stabs, and small horn pads", "a gritty expressive lead vocal", ["chicago-electric-blues", "shuffle", "electric-guitar", "walking-bass", "gritty"]],
  ["texas-blues", "Texas blues", "US Southwest", "a wide open blues groove with clean lead guitar, swinging drums, and a confident vocal pocket", "shuffle or straight-eighth drums, tight snare, ride motion, and tasteful fills", "round bass that walks through chord changes with bounce", "clean electric guitar, warm overdrive, piano comping, and short horn accents", "a strong relaxed blues vocal", ["texas-blues", "guitar-lead", "swing", "warm-overdrive", "confident"]],
  ["west-coast-blues", "West Coast blues", "US West Coast", "a polished jump-blues swing with jazzy chords, walking bass, and bright horn punctuation", "swinging kit, brushed snare, ride cymbal, and small-band fills", "walking upright-style bass with clean chromatic approaches", "electric guitar comping, piano, tenor-like horn stabs, and smooth backing responses", "a suave rhythmic lead vocal", ["west-coast-blues", "jump-blues", "swing", "horns", "walking-bass"]],
  ["jump-blues", "jump blues", "US", "an upbeat blues swing built for dance, with horn riffs, piano drive, and a shout-style hook", "swing drums, snare pops, ride cymbal, handclaps, and quick breaks", "walking bass with strong downbeats and playful fills", "boogie piano, horn section stabs, clean guitar chops, and call-and-response backing voices", "a lively lead vocal with group replies", ["jump-blues", "dance", "horn-riffs", "boogie-piano", "upbeat"]],
  ["boogie-woogie", "boogie woogie blues", "US", "a rolling piano-led boogie groove with left-hand drive, bluesy right-hand riffs, and a compact vocal hook", "shuffle drums, claps, ride cymbal, and short fills", "piano left-hand bass doubled by upright or electric bass", "bright piano, clean guitar support, horn hits, and handclap energy", "a playful rhythmic vocal or instrumental piano lead", ["boogie-woogie", "piano", "shuffle", "dance", "rolling"]],
  ["swamp-blues", "swamp blues", "US Gulf Coast", "a low-slung swamp-blues groove with tremolo guitar, heavy space, and humid rhythmic drag", "lazy backbeat, kick on the floor, shaker, and deep snare hits", "thick bass that sits behind the beat with simple repeating figures", "tremolo guitar, dark organ, slide touches, and distant harmonica color", "a low gritty lead vocal", ["swamp-blues", "tremolo", "low-slung", "organ", "humid"]],
  ["soul-blues", "soul blues", "US South", "a blues progression warmed by soul harmony, pocket drums, and a chorus that opens with emotional lift", "slow shuffle or mid-tempo backbeat, rim accents, and gospel-like claps", "warm bass moving between blues roots and soul passing tones", "clean guitar, electric piano, organ swells, and soft horn responses", "a soulful lead vocal with restrained melisma", ["soul-blues", "emotional", "organ", "warm-bass", "vocal"]],
  ["modern-blues-rock", "modern blues rock", "Global", "a punchy blues-rock track with heavy riffing, expressive bends, and a chorus that stays original and direct", "solid rock drums, shuffle accents, crash lifts, and tom fills", "electric bass locked to kick with blues-scale passing notes", "crunch guitar, slide touches, organ pad, and a short fresh solo phrase", "a gritty melodic rock-blues vocal", ["modern-blues-rock", "riff", "guitar", "organ", "punchy"]],
  ["southern-soul", "Southern soul", "US South", "a deep Southern soul groove with warm rhythm section, churchy organ, and a heartfelt chorus", "pocket drums, snare backbeat, tambourine, and handclaps", "round bass outlining the chord changes with gentle push", "organ, electric piano, clean guitar, horn pads, and backing vocal answers", "a heartfelt lead vocal with natural grit", ["southern-soul", "organ", "heartfelt", "horns", "warm"]],
  ["northern-soul", "Northern soul", "UK and US", "an energetic uptempo soul groove with driving drums, bright strings or horns, and a crisp danceable hook", "fast four-on-the-floor soul drums, tambourine, claps, and snare snaps", "melodic bass with octave movement and constant forward motion", "piano, brass, string-like pads, guitar chops, and group backing vocals", "a bright passionate lead vocal", ["northern-soul", "uptempo", "dance", "tambourine", "bright"]],
  ["deep-soul-ballad", "deep soul ballad", "US", "a slow emotional soul ballad with spacious drums, rich chords, and a vocal-first arrangement", "slow backbeat, brushed cymbals, soft toms, and restrained fills", "warm bass with long supportive notes and subtle passing tones", "electric piano, organ swells, muted guitar, strings-like pads, and close harmonies", "an intimate soulful lead vocal", ["deep-soul-ballad", "slow", "emotional", "electric-piano", "harmony"]],
  ["memphis-style-soul", "river-city soul", "US South", "a tight Southern city soul groove with dry drums, horn punches, guitar chops, and a direct vocal hook", "dry pocket drums, snare snap, tambourine, and short stops", "firm bass that locks tightly with the kick and horn accents", "clean rhythm guitar, organ, brass stabs, and backing vocal replies", "a strong lead vocal with rhythmic phrasing", ["southern-city-soul", "horn-stabs", "dry-drums", "guitar-chops", "direct"]],
  ["detroit-soul-pop", "Detroit soul pop", "US Midwest", "a polished soul-pop groove with driving tambourine, melodic bass, and a chorus that feels bright and communal", "crisp drums, tambourine on top, claps, and clean fills", "active melodic bass with hook-like movement", "piano, guitar chops, string-like pads, brass hits, and harmony stacks", "a clear melodic lead vocal with group answers", ["detroit-soul-pop", "polished", "tambourine", "melodic-bass", "harmony"]],
  ["philly-soul-inspired", "Philadelphia soul inspired", "US East Coast", "a lush orchestral soul groove with smooth rhythm section, elegant strings, and a graceful chorus", "silky drums, conga touches, soft snare, and polished cymbal lift", "warm bass moving smoothly under extended chords", "electric piano, clean guitar, string-like pads, horns, and velvet backing vocals", "a smooth romantic lead vocal", ["philly-soul-inspired", "lush", "strings", "smooth", "romantic"]],
  ["neo-soul", "neo soul", "Global", "a modern pocket groove with extended chords, laid-back drums, and a vocal melody that floats behind the beat", "dry kick, rimshot snare, swung hats, snaps, and subtle percussion", "warm subby bass with syncopated rests and tasteful slides", "Rhodes-style keys, clean guitar, muted synth pad, and stacked harmony textures", "a smooth expressive lead vocal", ["neo-soul", "extended-chords", "laid-back", "rhodes", "smooth"]],
  ["alternative-soul", "alternative soul", "Global", "a moody soul track with sparse drums, dark chords, and intimate vocal phrasing", "minimal kick, rim clicks, brushed hats, and tasteful electronic texture", "deep bass with simple syncopated figures and long notes", "electric piano, filtered guitar, low synth pad, and airy background vocals", "a close vulnerable lead vocal", ["alternative-soul", "moody", "minimal", "deep-bass", "intimate"]],
  ["indie-soul", "indie soul", "Global", "a warm indie-soul groove with loose live drums, clean guitar, and a chorus that feels handmade", "slightly loose kit, soft snare, shakers, and roomy fills", "melodic bass with human timing and rounded tone", "clean guitar, Wurlitzer-style keys, soft horns, and casual harmony stacks", "a natural melodic lead vocal", ["indie-soul", "warm", "live-drums", "clean-guitar", "handmade"]],
  ["retro-soul", "retro soul", "Global", "a vintage-flavored soul groove with analog warmth, tight rhythm guitar, and horn-led section lifts", "dry drums, tambourine, claps, and snare backbeat", "round bass with classic pocket movement and simple fills", "organ, electric piano, guitar chops, horn section, and group backing vocals", "a bold soulful lead vocal", ["retro-soul", "analog-warmth", "horns", "guitar-chops", "bold"]],
  ["gospel-choir", "gospel choir soul", "US", "a choir-forward gospel soul track with piano foundation, handclaps, and a call-and-response chorus", "clap-driven drums, tambourine, kick support, and rising fills", "supportive bass following piano and choir movement", "piano, organ, choir harmonies, small horn pads, and foot-stomp energy", "a lead vocal answered by choir voices", ["gospel-choir", "call-response", "piano", "handclaps", "choir"]],
  ["handclap-gospel", "handclap gospel groove", "US", "an upbeat gospel groove with claps, organ, stomping drums, and a joyful hook", "stomping kick, snare claps, tambourine, and crowd-like handclaps", "walking electric bass with uplift and syncopation", "piano, organ, clean guitar, choir shouts, and brass-like accents", "a joyful lead vocal with group responses", ["handclap-gospel", "upbeat", "organ", "stomp", "joyful"]],
  ["gospel-ballad", "gospel soul ballad", "US", "a slow gospel-soul ballad with piano-led harmony, organ swells, and a powerful emotional arc", "slow drums, soft cymbals, tambourine at peaks, and restrained fills", "warm bass with long supportive notes and final-chorus movement", "piano, organ, choir pads, strings-like textures, and close harmonies", "a heartfelt lead vocal with choir support", ["gospel-ballad", "slow", "piano", "organ", "emotional"]],
  ["gospel-house", "gospel house", "Global", "a danceable gospel-house groove with soulful chords, choir-style hooks, and uplifting club momentum", "four-on-the-floor kick, claps, hats, and gospel tambourine accents", "deep house bass with warm syncopated movement", "piano stabs, organ, choir stacks, filtered pads, and bright risers", "a soulful lead vocal with group hook responses", ["gospel-house", "uplifting", "house", "choir", "dance"]],
  ["new-orleans-rnb", "New Orleans R&B", "US Gulf Coast", "a second-line-flavored R&B groove with rolling piano, syncopated drums, and brass responses", "street-parade inspired drums, snare rolls, bass drum kicks, and hand percussion", "bouncy bass moving around piano and brass hits", "rolling piano, clean guitar, brass section, organ, and group vocal calls", "a lively rhythmic lead vocal", ["new-orleans-rnb", "second-line", "piano", "brass", "syncopated"]],
  ["new-orleans-soul-funk", "New Orleans soul funk", "US Gulf Coast", "a swampy soul-funk groove with loose syncopation, clav-like keys, and horn stabs", "funky drums, ghosted snare, cowbell-like accents, and tom fills", "rubbery bass with syncopated rests and octave pops", "clavinet-style keys, guitar chops, organ, brass stabs, and backing shouts", "a gritty rhythmic soul vocal", ["new-orleans-soul-funk", "swampy", "rubbery-bass", "horn-stabs", "syncopated"]],
  ["funk-soul", "funk soul", "Global", "a tight funk-soul pocket with bass-led motion, crisp guitar, and a chantable chorus", "dry funk drums, ghost notes, tight hats, claps, and short breaks", "syncopated bassline with octave jumps and strong hook identity", "wah guitar, clav-style keys, brass stabs, organ hits, and group replies", "a rhythmic soulful lead vocal", ["funk-soul", "bass-led", "wah-guitar", "clav", "dance"]],
  ["afro-soul", "Afro soul", "West Africa", "a warm Afro-soul groove with interlocking guitar, hand percussion, and rich vocal harmony", "pocket drums blended with shakers, claps, and djembe-like accents", "round bass connecting soul chords to percussion patterns", "clean interlocking guitars, electric piano, organ pad, brass touches, and group responses", "a warm melodic lead vocal", ["afro-soul", "interlocking-guitars", "hand-percussion", "harmony", "warm"]],
  ["south-african-soul", "South African soul", "South Africa", "a bright soul groove with choral harmony, bouncing bass, and gentle township-pop color", "light drums, shakers, claps, and relaxed snare accents", "bouncy bass with melodic turns and warm sustain", "clean guitar, electric piano, marimba-like synth color, brass pads, and group harmonies", "a smooth expressive lead vocal", ["south-african-soul", "choral-harmony", "bouncy-bass", "bright", "smooth"]],
  ["ethiopian-soul-jazz", "Ethiopian soul jazz", "Ethiopia", "a modal soul-jazz groove with smoky horns, minor-key color, and laid-back drums", "dry jazz-soul drums, ride cymbal, rim accents, and hand percussion", "warm bass repeating a modal figure with subtle variation", "electric piano, guitar, brass and reed-like leads, organ pad, and sparse backing vocals", "a smooth vocal or instrumental horn lead", ["ethiopian-soul-jazz", "modal", "horns", "soul-jazz", "minor-key"]],
  ["latin-soul", "Latin soul", "Latin America", "a soulful groove with Latin percussion, warm horns, and a chorus that moves with syncopated lift", "kit drums with conga-like accents, shakers, claps, and timbale-style fills", "rounded bass locking with percussion and soul chord movement", "electric piano, clean guitar, brass stabs, organ, and group responses", "a passionate melodic soul vocal", ["latin-soul", "percussion", "horns", "syncopated", "passionate"]],
  ["brazilian-soul", "Brazilian soul", "Brazil", "a warm Brazilian soul groove with soft percussion, lush chords, and a breezy vocal hook", "light kit, shaker, surdo-like low accents, claps, and brushed fills", "smooth bass with syncopated movement and rounded tone", "electric piano, nylon guitar color, organ pad, brass touches, and airy harmonies", "a smooth melodic lead vocal", ["brazilian-soul", "warm", "percussion", "nylon-guitar", "breezy"]],
  ["caribbean-soul", "Caribbean soul", "Caribbean", "a relaxed Caribbean soul groove with island percussion, warm bass, and silky harmony vocals", "laid-back drums, shakers, soft rim clicks, handclaps, and light percussion rolls", "round bass with relaxed syncopation and gentle slides", "clean guitar, electric piano, organ, steel-pan-like synth color, and backing harmonies", "a smooth lead vocal", ["caribbean-soul", "island", "smooth", "warm-bass", "harmony"]],
  ["desert-blues-soul", "desert blues soul", "North Africa", "a hypnotic desert-blues groove blended with soul chords, modal guitar, and steady hand percussion", "steady kit, hand drums, shakers, and deep tom accents", "warm bass holding a repeating modal figure with subtle movement", "clean electric guitar drones, organ pad, hand percussion, and vocal harmony responses", "a soulful melodic lead vocal", ["desert-blues-soul", "modal", "hypnotic", "hand-percussion", "guitar"]],
  ["country-soul", "country soul", "US South", "a warm country-soul ballad groove with gentle guitar, organ, and a chorus that leans into honest emotion", "soft drums, brushed snare, tambourine, and restrained fills", "supportive bass following simple heartfelt chord changes", "acoustic guitar, clean electric fills, organ, piano, and close backing vocals", "a sincere soulful lead vocal", ["country-soul", "ballad", "organ", "acoustic-guitar", "heartfelt"]],
  ["blues-gospel-rock", "blues gospel rock", "Global", "a rootsy blues-gospel rock track with stomping drums, organ, guitar riffs, and choir-like lift", "stomp-clap drums, snare backbeat, tambourine, and tom builds", "firm bass locking with guitar riffs and choir accents", "crunch guitar, organ, piano, group vocals, and short slide fills", "a gritty lead vocal with group responses", ["blues-gospel-rock", "stomp", "organ", "group-vocals", "rootsy"]],
  ["cinematic-soul", "cinematic soul", "Global", "a wide-screen soul track with slow drums, strings-like pads, and a vocal melody shaped for drama", "slow pocket drums, deep kick, soft snare, and cymbal swells", "warm bass with long notes and emotional passing tones", "piano, electric piano, guitar, horn pads, strings-like textures, and choir-like harmony", "a dramatic soulful lead vocal", ["cinematic-soul", "dramatic", "strings", "slow", "wide"]],
  ["lofi-soul-blues", "lofi soul blues", "Global", "a dusty soul-blues loop feel with mellow drums, warm vinyl-like texture, and intimate vocal fragments", "soft chopped drums, rim clicks, brushed hats, and muted percussion", "warm bass with short repeating phrases and gentle saturation", "electric piano, clean guitar bends, organ dust, and tape-style ambience", "a close mellow vocal or wordless hook", ["lofi-soul-blues", "dusty", "mellow", "electric-piano", "intimate"]],
  ["spiritual-jazz-soul", "spiritual jazz soul", "Global", "a meditative soul-jazz groove with modal chords, soft choir texture, and slow-building emotional release", "jazz-soul drums, ride cymbal, hand percussion, and spacious fills", "upright-style bass with modal movement and long sustain", "piano, electric piano, horn-like lead, organ drone, and wordless vocal layers", "a gentle lead vocal or instrumental melody", ["spiritual-jazz-soul", "modal", "meditative", "horn-lead", "wordless"]],
  ["soulful-acoustic-ballad", "soulful acoustic ballad", "Global", "an intimate acoustic soul ballad with fingerpicked guitar, warm bass, and a close emotional vocal", "soft kick, brushed snare, shakers, and sparse hand percussion", "subtle bass supporting the vocal and chord movement", "acoustic guitar, piano, light organ pad, and close harmony doubles", "a close soulful lead vocal", ["soulful-acoustic-ballad", "acoustic", "intimate", "piano", "warm"]],
];

const variations = [
  {
    structure: "Arrange intro, groove statement, verse, pre-hook lift, chorus, instrumental answer, final chorus, and clean outro.",
    detail: "Let the instrumental answer use guitar, organ, piano, horn, or choir response without quoting a known lick.",
    useCase: "playlist-ready warmth",
  },
  {
    structure: "Arrange short drum or piano pickup, verse, call-and-response hook, bridge, solo phrase, final hook, and fade-style ending.",
    detail: "Use call-and-response between lead voice and backing vocals, guitar, horn, or organ so the song breathes like a live band.",
    useCase: "human groove feel",
  },
  {
    structure: "Arrange bass or guitar intro, full pocket, verse, chorus, stripped middle, rebuild, final chorus, and hard stop.",
    detail: "In the stripped middle, leave only bass, claps, and keys before the drums and backing voices return.",
    useCase: "clear section contrast",
  },
  {
    structure: "Arrange atmospheric opening, rhythm entrance, verse, wide chorus, short solo, breakdown, final chorus, and ringing last chord.",
    detail: "Add one new layer in the second half: harmony stack, horn pad, organ swell, handclap group, or clean guitar fill.",
    useCase: "emotional build",
  },
  {
    structure: "Arrange count-in or room-tone intro, main groove, vocal section, chorus, instrumental break, last chorus, and spacious outro.",
    detail: "Keep the groove steady but shift one bass note, drum fill, or chord extension near the end for development.",
    useCase: "repeatable hook identity",
  },
];

const keys = ["A minor", "C minor", "D minor", "E minor", "G major"];
const bpms = [72, 84, 96, 108, 120];

const titleA = ["Amber", "Cedar", "Velvet", "Copper", "Ivory", "River", "Golden", "Blue", "Walnut", "Silver", "Rose", "Harbor", "Sable", "Honey", "Crimson", "Morning", "Opal", "Juniper", "Brass", "Willow", "Dusty", "Maple", "Lunar", "Warm", "Cobalt", "Marble", "Teak", "Pearl", "Coral", "Saffron", "Rain", "Orchid", "Basalt", "Cloud", "Meadow", "Twilight", "Anchor", "Magnolia", "Tobacco", "Dawn"];
const titleB = ["Porch", "Avenue", "Chapel", "Lantern", "Harbor", "Corner", "Piano", "Garden", "Bridge", "Signal", "Market", "Window", "Street", "Choir", "Station", "Kitchen", "Canopy", "Terrace", "Compass", "Room", "Shore", "Mural", "Valley", "Ridge", "Courtyard", "Beacon", "Factory", "Cabin", "Field", "Horizon", "Alley", "Veranda", "Theater", "River", "Crossing", "Breeze", "Workshop", "Pier", "Tower", "Table"];
const titleC = ["Sway", "Glow", "Answer", "Lift", "Turn", "Roll", "Bloom", "Echo", "Step", "Rise", "Pulse", "Reply", "Drift", "Shine", "Hold", "Groove", "Arc", "Trace", "Motion", "Chord", "Shuffle", "Return", "Phrase", "Circle", "Call", "Wave", "Spark", "Landing", "Thread", "Flow", "Wake", "Rally", "Path", "Spring", "Frame", "Hush", "Crossing", "Flight", "Signal", "Crest"];

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
  if (slug.includes("ballad")) return [58, 64, 70, 76, 82][variationIndex];
  if (slug.includes("northern") || slug.includes("jump") || slug.includes("boogie") || slug.includes("gospel-house")) return [118, 126, 134, 142, 150][variationIndex];
  if (slug.includes("funk")) return [92, 100, 108, 116, 124][variationIndex];
  if (slug.includes("lofi") || slug.includes("alternative")) return [68, 74, 82, 88, 94][variationIndex];
  return bpms[variationIndex];
}

function makePrompt(profile, variation, bpm, key) {
  const [slug, label, region, groove, drums, bass, colors, vocal] = profile;
  const full = [
    `Create an original ${label} track at ${bpm} BPM in ${key}, built around ${groove}.`,
    `Build the rhythm with ${drums}; use ${bass}.`,
    `Feature ${colors}; use ${vocal}. Keep melodies, hooks, choir parts, horn lines, basslines, and guitar phrases newly composed, with no named performer, existing song, label, or sampled recording references.`,
    variation.structure,
    variation.detail,
    `Shape it for ${variation.useCase}, honest dynamics, strong pocket, tasteful vocal phrasing, and no borrowed melody. Mix with separated kick, bass, guitar, keys, organ, horns, vocals, choir, percussion, and room ambience.`,
  ].join(" ");
  if (full.length <= 1000) return full;

  const compact = [
    `Create an original ${label} track at ${bpm} BPM in ${key}, built around ${groove}.`,
    `Build the rhythm with ${drums}; use ${bass}.`,
    `Feature ${colors}; use ${vocal}. Keep melodies, hooks, horn lines, basslines, and guitar phrases newly composed, with no named performer or existing song references.`,
    variation.structure,
    `Shape it for ${variation.useCase}, strong pocket, tasteful vocal phrasing, and no borrowed melody. Mix with separated kick, bass, guitar, keys, organ, horns, vocals, choir, and room ambience.`,
  ].join(" ");
  if (compact.length <= 1000) return compact;

  return [
    `Create an original ${label} track at ${bpm} BPM in ${key}, built around ${groove}.`,
    `Use ${drums}, ${bass}, and ${colors}.`,
    `${vocal}. Keep all hooks, horn lines, basslines, choir parts, and guitar phrases newly composed, with no named performer or existing song references.`,
    variation.structure,
    `Mix with separated kick, bass, guitar, keys, organ, horns, vocals, choir, percussion, and room ambience.`,
  ].join(" ");
}

function ensureLength(prompt, profile) {
  let value = prompt;
  const additions = [
    " Preserve human timing, natural push and pull, and a vocal-centered arrangement where the rhythm section supports every phrase.",
    " Use subtle room tone, analog warmth, and tasteful automation so the performance feels alive without copying any known recording.",
    ` Keep the ${profile[1]} identity clear through chords, rhythm, vocal shape, instrument color, and a memorable original hook.`,
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
    "copied blues licks",
    "existing song titles",
    "famous soul hooks",
    "label references",
    "recognizable samples",
    "fake gospel clichés",
    "overdone vocal runs",
    "muddy low end",
    "harsh clipping",
    "thin snare",
    slug.includes("gospel") ? "mock choir words" : "",
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
      id: `world-blues-soul-gospel-v04-${pad(index + 1)}`,
      source_type: sourceType,
      batch_id: `20260622-world-blues-soul-gospel-${pad(batchNumber)}`,
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
      mood: [variation.useCase, "human pocket", "warm performance"],
      tags: unique([...tags, slugify(region)]),
      groove_score: variationIndex === 0 ? 9 : 8,
      energy: bpm >= 118 ? "high" : bpm >= 92 ? "medium-high" : "medium",
      energy_score: bpm >= 118 ? 9 : bpm >= 92 ? 8 : 6,
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
