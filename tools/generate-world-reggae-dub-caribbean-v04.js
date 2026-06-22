const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "incoming", "codex");
const OUT_FILE = path.join(OUT_DIR, "world-reggae-dub-caribbean-v04-200.jsonl");

const collection = "world-reggae-dub-caribbean-v04";
const category = "world-reggae-dub-caribbean";
const sourceType = "codex_generated";

const profiles = [
  ["roots-reggae", "roots reggae", "Jamaica", "a relaxed one-drop pulse, spiritual minor-key movement, guitar skank, and patient chorus lift", "one-drop kick placement, dry rim clicks, shaker motion, and soft tom fills", "round melodic bass that carries the hook with warm slides", "bubble organ, clean rhythm guitar, short horn responses, and group backing hums", "a warm lead vocal with calm conviction", ["roots-reggae", "one-drop", "warm-bass", "organ-bubble", "spiritual"]],
  ["modern-roots-reggae", "modern roots reggae", "Global", "classic roots warmth with modern low-end control, crisp skank, and a wide uplifting refrain", "tight one-drop drums, subtle programmed percussion, and clean cymbal lifts", "deep bass with dubby movement and polished sub support", "organ stabs, filtered guitar delays, brass pads, and gentle vocal doubles", "a soulful melodic lead vocal", ["modern-roots-reggae", "polished", "deep-bass", "skank", "uplifting"]],
  ["one-drop-reggae", "one-drop reggae", "Jamaica", "a spacious one-drop groove where the backbeat leaves air and the bass answers each vocal phrase", "kick and snare landing together, rim accents, hats, shakers, and small tom rolls", "supple bass with syncopated rests and a memorable original line", "chopped guitar skank, organ bubble, muted horns, and clean delay throws", "a relaxed lead vocal with optional harmony replies", ["one-drop-reggae", "space", "bassline", "organ", "skank"]],
  ["rockers-reggae", "rockers reggae", "Jamaica", "a heavier rockers pulse with steady kick drive, strong bass movement, and a chorus that feels forward but unhurried", "four-on-the-floor reggae kick, snare rim accents, hats, and punchy tom fills", "firm bass moving in rolling eighth-note phrases", "organ bubble, rhythm guitar, brass stabs, and tape-style echo hits", "a confident melodic vocal with group accents", ["rockers-reggae", "steady-kick", "rolling-bass", "brass", "confident"]],
  ["steppers-dub-reggae", "steppers dub reggae", "UK", "a driving steppers rhythm with deep kick pressure, skanking guitar, and dub delays that answer the groove", "constant low kick, springy snare, percussion ticks, and big transition drops", "sub-heavy bass with simple hypnotic movement", "organ chops, tape delay sends, filtered horns, and reverb splashes", "mostly instrumental with sparse vocal fragments", ["steppers-dub", "dub", "sub-bass", "sound-system", "hypnotic"]],
  ["dub-reggae", "dub reggae", "Jamaica", "a stripped dub groove focused on bass, drums, echo, reverb, and empty space as arrangement devices", "dry drum foundation with snare delays, rim shots, percussion drops, and sudden mute moments", "huge rounded bassline that repeats hypnotically but shifts at section turns", "organ stabs, guitar skank fragments, horn echoes, and tape-style feedback swells", "instrumental with occasional wordless vocal echoes", ["dub-reggae", "echo", "reverb", "bassline", "instrumental"]],
  ["deep-dub", "deep dub", "UK", "a slow deep-dub meditation with sub pressure, minimal drums, and long delay trails shaping the arrangement", "reduced kick-snare hits, filtered percussion, and wide echo throws", "very deep bass with long notes, slides, and carefully timed rests", "distant organ, muted guitar chops, low drones, and washed horn fragments", "instrumental or nearly instrumental", ["deep-dub", "minimal", "sub-bass", "delay", "meditative"]],
  ["psychedelic-dub", "psychedelic dub", "Global", "a swirling dub groove with phaser movement, tape wobble, and a bassline that anchors the strange colors", "one-drop or steppers drums with reverse hits, splashy delays, and muted breakdowns", "warm bass repeating a simple original motif", "wah guitar, organ, analog-style synth mist, horn echoes, and pitch-drift effects", "use sparse vocal phrases as texture only", ["psychedelic-dub", "phaser", "tape-wobble", "warm-bass", "spacey"]],
  ["dub-poetry-spoken-word", "dub poetry spoken word", "Caribbean diaspora", "a spoken-word reggae-dub bed with bass-led patience, rimshot punctuation, and room for voice rhythm", "one-drop drums, hand percussion, dry snare, and dub delay accents", "melodic bass that answers spoken lines without crowding them", "organ bubble, clean guitar chop, low horn pads, and echo returns", "a rhythmic spoken lead with optional sung hook", ["dub-poetry", "spoken-word", "reggae", "bass-led", "diaspora"]],
  ["lovers-rock", "lovers rock", "UK", "a smooth romantic reggae groove with soft one-drop feel, rounded bass, and a silky chorus melody", "gentle kick-snare placement, brushed hats, shakers, and soft tom fills", "warm bassline with graceful passing notes", "electric piano, organ bubble, clean guitar skank, and sweet backing vocals", "a tender melodic lead vocal with close harmonies", ["lovers-rock", "romantic", "smooth", "electric-piano", "harmony"]],
  ["rocksteady", "rocksteady", "Jamaica", "a laid-back rocksteady groove with slower skank, soulful harmony, and bass that walks elegantly", "simple kick-snare pattern, rim clicks, light hats, and hand percussion", "walking bass with melodic turns and clean rests", "vintage organ, warm guitar chops, small horn section, and handclap accents", "a smooth soulful vocal with harmony answers", ["rocksteady", "vintage", "walking-bass", "horns", "soulful"]],
  ["ska", "ska", "Jamaica", "an upbeat ska rhythm with bright offbeat guitar, walking bass, horn riffs, and fast dance energy", "up-tempo drums, snare snaps, ride motion, and lively fills", "walking bass that outlines the chord movement with bounce", "upstroke guitar, piano or organ chops, trumpet-like horn stabs, and sax-like answers", "an energetic lead vocal or instrumental horn lead", ["ska", "upbeat", "horns", "walking-bass", "dance"]],
  ["two-tone-inspired-ska", "two-tone inspired ska", "UK", "a sharp ska-punk-adjacent rhythm with clipped upstrokes, urgent drums, and brass punches", "fast kick-snare drive, tight hats, offbeat accents, and short stops", "punchy bass walking between root notes and quick fills", "clean guitar chops, organ stabs, horn hooks, and shouted group replies", "a direct spirited vocal with group call backs", ["two-tone-inspired-ska", "fast", "brass", "group-vocals", "urgent"]],
  ["mento-inspired", "mento inspired Caribbean folk pop", "Jamaica", "a light acoustic Caribbean folk groove with hand percussion, playful bass, and sunny call-and-response", "hand drums, shakers, brushed snare, and relaxed clap patterns", "upright or rounded bass with bouncy root-fifth movement", "acoustic guitar, banjo-like pluck, small horn touches, and island percussion", "a cheerful lead vocal with group responses", ["mento-inspired", "acoustic", "caribbean-folk", "hand-percussion", "sunny"]],
  ["calypso-pop", "calypso pop", "Trinidad and Tobago", "a bright calypso-inspired pop groove with syncopated percussion, witty melodic movement, and dancing bass", "kit drums blended with steel-pan-like accents, shakers, and hand percussion", "bouncy bass that moves around the vocal melody", "clean guitar, piano chops, brass-like synth stabs, and steel-pan-style lead color", "a lively melodic vocal with playful group replies", ["calypso-pop", "steel-pan-color", "syncopated", "bright", "caribbean"]],
  ["soca-groove", "soca groove", "Trinidad and Tobago", "a high-energy soca groove with driving kick, bright percussion, and a hook built for movement", "four-on-the-floor kick, snare snaps, shakers, claps, and rapid percussion rolls", "simple energetic bass locking tightly to kick and chord pushes", "brass stabs, synth plucks, clean guitar, and carnival-style percussion color", "a festive lead vocal with group chant responses", ["soca", "carnival", "high-energy", "percussion", "group-chant"]],
  ["dancehall-groove", "dancehall groove", "Jamaica", "a sparse dancehall rhythm with deep kick, snapped snare, syncopated bass, and a vocal pocket that leaves space", "dry electronic-leaning drums, rim clicks, claps, and tight percussion drops", "minimal bass hits with sub weight and rhythmic gaps", "short synth stabs, guitar chops, filtered pads, and original vocal ad-libs", "a rhythmic melodic vocal with confident phrasing", ["dancehall", "sparse", "sub-bass", "vocal-pocket", "modern"]],
  ["modern-dancehall-pop", "modern dancehall pop", "Global", "a polished dancehall-pop groove with tropical synth color, bouncing drums, and a clean chorus lift", "crisp kick, snare clicks, shaker loops, clap layers, and small risers", "rounded sub bass following a catchy syncopated pattern", "marimba-like plucks, muted guitar, airy pads, and bright hook doubles", "a melodic lead vocal with rhythmic verses and a sung hook", ["modern-dancehall-pop", "tropical", "polished", "sub-bass", "hook"]],
  ["dub-dancehall", "dub dancehall", "Jamaica", "a dancehall rhythm opened into dub space, with sudden mutes, echo throws, and heavy low-end hits", "dry dancehall drums with rim shots, snare delays, and dropouts", "sub bass hitting in short phrases with long decay", "filtered synth stabs, guitar skank fragments, siren-like original synth tones, and reverb returns", "sparse vocal fragments and hook phrases", ["dub-dancehall", "dropouts", "echo", "sub-bass", "sparse"]],
  ["ragga-jungle-influenced", "ragga jungle influenced breakbeat", "UK", "a fast breakbeat track with reggae bass flavor, chopped percussion energy, and original vocal shouts used as rhythm", "rapid breakbeat-style drums, snare edits, hats, and dubby transition delays", "rolling bass that nods to sound-system pressure without copying any known line", "organ stabs, skank guitar slices, filtered pads, and short horn samples recreated as original synth lines", "use short rhythmic vocal calls, not imitated performers", ["ragga-jungle-influenced", "breakbeat", "fast", "dub", "sound-system"]],
  ["reggae-fusion", "reggae fusion", "Global", "a flexible reggae fusion groove with offbeat guitar, modern pop arrangement, and a bassline that stays central", "one-drop or light dancehall drums, shakers, claps, and section-building fills", "melodic bass with warm sub support and clean syncopation", "guitar skank, electric piano, brass pads, light synth plucks, and harmony stacks", "a melodic lead vocal with relaxed rhythmic phrasing", ["reggae-fusion", "pop-arrangement", "skank", "bassline", "melodic"]],
  ["reggae-rock", "reggae rock", "Global", "a guitar-forward reggae-rock groove with skank verses, heavier chorus chords, and a relaxed but punchy pocket", "rock kit with reggae backbeat feel, rim clicks, open hats, and tom fills", "warm bass moving between reggae bounce and rock sustain", "clean skank guitar, crunchy chorus guitars, organ support, and short lead fills", "a gritty melodic vocal with harmony support", ["reggae-rock", "guitar", "organ", "punchy", "hybrid"]],
  ["surf-reggae", "surf reggae", "Pacific coast", "a breezy surf-reggae groove with clean reverb guitar, offbeat skank, and sunlit melodic hooks", "laid-back drums, rim clicks, shakers, and simple fills", "rounded bass with playful walking turns", "springy guitar reverb, organ bubble, small percussion, and airy background vocals", "a relaxed melodic lead vocal", ["surf-reggae", "breezy", "reverb-guitar", "sunlit", "skank"]],
  ["acoustic-reggae", "acoustic reggae", "Global", "an intimate acoustic reggae groove with hand-played skank, warm percussion, and a close vocal center", "brushes, cajon-like hits, shakers, soft rim clicks, and hand percussion", "acoustic or rounded electric bass with simple melodic movement", "acoustic guitar upstrokes, light organ pad, handclaps, and soft backing voices", "a close natural lead vocal", ["acoustic-reggae", "intimate", "hand-percussion", "warm", "natural-vocal"]],
  ["nyabinghi-inspired-roots", "nyabinghi inspired roots reggae", "Jamaica", "a ceremonial roots-reggae pulse with hand-drum layers, deep bass, and patient call-and-response energy", "fundeh-like hand drum pulse, shakers, soft kick, rim accents, and slow tom rolls", "deep bass moving slowly under the drum circle feel", "organ drone, clean guitar skank, low horns, and wordless backing chants", "a reverent melodic lead vocal or chant-like hook", ["nyabinghi-inspired", "roots-reggae", "hand-drums", "call-response", "deep-bass"]],
  ["caribbean-soul-reggae", "Caribbean soul reggae", "Caribbean diaspora", "a soulful reggae groove with warm chords, laid-back drums, and a chorus that leans into harmony", "one-drop drums with soft snare, brushed hats, shakers, and tasteful fills", "smooth bass that supports soul chord changes", "electric piano, organ bubble, clean guitar, muted horns, and close vocal harmonies", "a warm soulful lead vocal", ["caribbean-soul-reggae", "soulful", "harmony", "electric-piano", "warm"]],
  ["caribbean-jazz-reggae", "Caribbean jazz reggae", "Caribbean diaspora", "a jazz-colored reggae groove with extended chords, relaxed skank, and melodic improvisation windows", "light one-drop kit, ride cymbal, shakers, and syncopated snare accents", "walking reggae bass with jazzy passing tones", "electric piano, clean guitar chops, muted trumpet-like lead, and sax-like answers", "mostly instrumental or a smooth vocal hook", ["caribbean-jazz-reggae", "jazz-chords", "instrumental", "walking-bass", "smooth"]],
  ["caribbean-funk-reggae", "Caribbean funk reggae", "Caribbean diaspora", "a bass-forward reggae-funk pocket with syncopated guitar, clav-like chops, and a tight dance hook", "dry funk-reggae drums, ghosted snare, shaker groove, and punchy fills", "rubbery bassline with octave jumps and offbeat rests", "clavinet-style keys, rhythm guitar skank, horn stabs, and wah-guitar accents", "a rhythmic lead vocal or chantable hook", ["caribbean-funk-reggae", "funk", "rubbery-bass", "horn-stabs", "dance"]],
  ["afro-caribbean-reggae", "Afro-Caribbean reggae", "Pan-African diaspora", "a reggae groove blended with layered African percussion, call-and-response, and deep bass movement", "one-drop drums with djembe-like accents, shakers, claps, and tom responses", "warm bass that connects the skank to the percussion layers", "clean guitar, organ bubble, thumb-piano-like synth color, and group vocal replies", "a warm melodic lead with wordless group answers", ["afro-caribbean-reggae", "layered-percussion", "call-response", "warm-bass", "diaspora"]],
  ["west-african-reggae-fusion", "West African reggae fusion", "West Africa", "a sunny reggae fusion groove with highlife-like guitar color, hand percussion, and relaxed low-end sway", "light reggae drums, shakers, bell-like percussion, and soft tom fills", "melodic bass with gentle syncopation and rounded sub", "clean interlocking guitars, organ bubble, brass pads, and bright backing vocals", "a smooth melodic lead vocal", ["west-african-reggae-fusion", "interlocking-guitars", "hand-percussion", "sunny", "fusion"]],
  ["latin-reggae-fusion", "Latin reggae fusion", "Latin America", "a reggae groove blended with Latin percussion accents, nylon-string color, and a warm chorus melody", "one-drop drums with conga-like accents, shakers, claps, and light timbale-style fills", "rounded bass that holds the reggae pocket while answering percussion", "nylon-string guitar, organ, brass stabs, and clean electric skank", "a passionate melodic vocal with rhythmic phrase endings", ["latin-reggae-fusion", "percussion", "nylon-guitar", "warm", "skank"]],
  ["brazilian-reggae-fusion", "Brazilian reggae fusion", "Brazil", "a warm Brazilian reggae groove with beachside sway, syncopated percussion, and smooth vocal harmonies", "reggae drums blended with shaker, surdo-like low accents, claps, and soft fills", "round bass with relaxed movement and occasional octave turns", "clean guitar skank, acoustic texture, organ bubble, and bright backing voices", "a smooth melodic lead vocal", ["brazilian-reggae-fusion", "beach-sway", "percussion", "harmony", "warm"]],
  ["pacific-island-reggae", "Pacific island reggae", "Pacific Islands", "a relaxed island-reggae groove with gentle skank, airy harmonies, and an easy rolling bassline", "soft kick-snare pulse, shakers, handclaps, and light tom fills", "warm bass with simple rolling phrases and plenty of space", "ukulele-like plucks, clean guitar upstrokes, organ pad, and group harmony layers", "a smooth friendly lead vocal", ["pacific-island-reggae", "island", "harmony", "warm-bass", "relaxed"]],
  ["maori-pacific-reggae", "Maori Pacific reggae fusion", "Aotearoa and Pacific", "a Pacific reggae fusion groove with grounded bass, group harmony, and respectful chant-like textures without quoting traditional melodies", "steady reggae drums, hand percussion, claps, and broad tom accents", "deep bass supporting group vocal movement and skank guitar", "clean guitar, warm organ, low drones, and wordless group responses", "a strong melodic lead with group harmonies", ["maori-pacific-reggae", "pacific", "group-harmony", "respectful", "deep-bass"]],
  ["uk-dub-reggae", "UK dub reggae", "UK", "a bass-heavy UK dub groove with sound-system pressure, sharp drum drops, and echo as a main instrument", "steppers or one-drop drums, snare delays, rim shots, and sudden percussion mutes", "massive sub bass with simple memorable movement", "organ skank, filtered horn stabs, tape delay, spring reverb, and low synth drones", "instrumental with occasional vocal echoes", ["uk-dub-reggae", "sound-system", "sub-bass", "echo", "steppers"]],
  ["french-caribbean-zouk-reggae", "French Caribbean zouk reggae fusion", "French Caribbean", "a smooth Caribbean fusion groove mixing reggae skank with zouk-like rhythmic flow and glossy harmonies", "light reggae drums, syncopated percussion, soft claps, and gentle fills", "rounded bass that sways between reggae pocket and dance groove", "clean guitar, bright keys, warm synth pads, small brass touches, and harmony vocals", "a silky melodic lead vocal", ["french-caribbean-zouk-reggae", "smooth", "zouk-fusion", "harmony", "caribbean"]],
  ["creole-reggae-pop", "Creole reggae pop", "Caribbean diaspora", "a melodic reggae-pop groove with island percussion, clean skank, and a bright singable chorus", "one-drop drums, shakers, handclaps, soft rim clicks, and light percussion fills", "friendly bassline with simple hook movement and warm sub support", "organ bubble, clean guitar, steel-pan-like synth color, and backing vocal stacks", "a warm lead vocal with group responses", ["creole-reggae-pop", "melodic", "island-percussion", "bright", "chorus"]],
  ["island-dub-ambient", "island dub ambient", "Global", "a slow atmospheric dub piece with oceanic space, minimal skank fragments, and bass that moves like a tide", "minimal kick, rim echo, soft percussion, and long reverb tails", "deep bass with long sustained notes and gentle slides", "distant guitar chops, organ haze, filtered field-like textures, and horn echoes", "mostly instrumental with wordless vocal mist", ["island-dub-ambient", "ambient", "minimal", "deep-bass", "spacious"]],
  ["bass-heavy-sound-system", "bass-heavy sound system reggae", "Global", "a huge sound-system reggae groove with sub pressure, sparse drums, and a hook built around bass response", "dry kick, snare rim, shaker ticks, dub drops, and wide delay returns", "very large bassline with clear note centers and dramatic rests", "organ stabs, skank guitar, siren-like original synth sweeps, and horn hits", "sparse vocal calls or instrumental lead hooks", ["sound-system-reggae", "sub-bass", "dub-drops", "sparse", "heavy"]],
  ["tropical-reggae-pop", "tropical reggae pop", "Global", "a polished tropical reggae-pop groove with clean skank, warm bass, and an easy bright chorus", "light one-drop drums, clap layers, shakers, and smooth transition fills", "round bassline with pop-friendly movement and low-end warmth", "muted guitar, electric piano, airy pads, marimba-like plucks, and soft backing vocals", "a breezy melodic lead vocal", ["tropical-reggae-pop", "bright", "polished", "warm-bass", "chorus"]],
];

const variations = [
  {
    structure: "Arrange intro, groove statement, verse, pre-hook lift, chorus, dub break, second chorus, and a clean outro.",
    detail: "Let the dub break mute the vocal, send snare and organ to echo, then return with a small bass variation.",
    useCase: "playlist-ready clarity",
  },
  {
    structure: "Arrange percussion or guitar intro, verse, response hook, instrumental answer, bridge, final hook, and fade-style ending.",
    detail: "Use call-and-response between voice, horn, organ, guitar, or synth so the hook has a human conversation feel.",
    useCase: "warm live-band motion",
  },
  {
    structure: "Arrange short bass intro, full groove, verse, chorus, stripped middle, dubby rebuild, final chorus, and hard stop.",
    detail: "In the stripped middle, leave only bass, rim, and delay returns before percussion and skank re-enter.",
    useCase: "sound-system low-end focus",
  },
  {
    structure: "Arrange atmospheric opening, rhythm entrance, verse, wide hook, instrumental motif, breakdown, final hook, and ringing last chord.",
    detail: "Add one new layer in the second half: harmony vocal, horn pad, organ bubble, percussion, or filtered guitar echo.",
    useCase: "clear section contrast",
  },
  {
    structure: "Arrange drum pickup, main riddim, vocal section, chorus, dub drop, lead answer, last chorus, and spacious outro.",
    detail: "Keep the main riddim recognizable but shift one bass note or drum accent near the end for development.",
    useCase: "repeatable groove identity",
  },
];

const bpms = [72, 78, 84, 92, 100];
const fastBpms = [118, 128, 138, 150, 164];
const socaBpms = [116, 124, 132, 140, 148];
const keys = ["A minor", "C minor", "D minor", "E minor", "G minor"];

const titleA = ["Cedar", "Amber", "Coral", "Palm", "Copper", "Lagoon", "Mango", "Blue", "Golden", "Harbor", "Solar", "Velvet", "Coconut", "Silver", "Cocoa", "Tidal", "Saffron", "Rain", "Quartz", "Bamboo", "Orchid", "Brass", "Crimson", "Sable", "Opal", "Teak", "Lunar", "Jade", "Basalt", "Pearl", "Island", "Seaside", "Drift", "Warm", "Emerald", "Cloud", "Rose", "Anchor", "Morning", "Twilight"];
const titleB = ["Harbor", "Lagoon", "Signal", "Lantern", "Current", "Echo", "Market", "Garden", "Bridge", "Compass", "Sound", "Terrace", "Skank", "Reef", "Riddim", "Tower", "Canopy", "Marina", "Pulse", "Cove", "Channel", "Sway", "Beacon", "Courtyard", "Engine", "Veranda", "Street", "Dawn", "Festival", "Shore", "Window", "Outpost", "Horizon", "Mural", "Cabin", "Vessel", "Pier", "Breeze", "Circuit", "Valley"];
const titleC = ["Echo", "Sway", "Lift", "Dub", "Glow", "Run", "Return", "Bloom", "Step", "Roll", "Chorus", "Drift", "Skank", "Rise", "Wave", "Reply", "Turn", "Groove", "Signal", "Pulse", "Motion", "Arc", "Path", "Hold", "Rally", "Flight", "Circle", "Trace", "Flow", "Answer", "Shimmer", "Crossing", "Anchor", "Spring", "Wake", "Frame", "Shuffle", "Spark", "Landing", "Phrase"];

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
  if (slug.includes("ska") || slug.includes("ragga-jungle")) return fastBpms[variationIndex];
  if (slug.includes("soca") || slug.includes("calypso")) return socaBpms[variationIndex];
  if (slug.includes("dancehall") || slug.includes("pop")) return [88, 94, 100, 106, 112][variationIndex];
  if (slug.includes("ambient") || slug.includes("deep-dub")) return [62, 68, 72, 76, 80][variationIndex];
  return bpms[variationIndex];
}

function makePrompt(profile, variation, bpm, key) {
  const [slug, label, region, groove, drums, bass, colors, vocal] = profile;
  const full = [
    `Create an original ${label} track at ${bpm} BPM in ${key}, built around ${groove}.`,
    `Build the rhythm with ${drums}; use ${bass}.`,
    `Feature ${colors}; use ${vocal}. Keep melodies, riddims, chants, horn lines, and basslines newly composed, with no named performer, existing song, label, or sampled recording references.`,
    variation.structure,
    variation.detail,
    `Shape it for ${variation.useCase}, strong low-end pocket, clear offbeat skank, tasteful delay and reverb, and no borrowed melody. Mix with separated kick, bass, guitar, keys, horns, vocals, percussion, and dub effects.`,
  ].join(" ");
  if (full.length <= 1000) return full;

  const compact = [
    `Create an original ${label} track at ${bpm} BPM in ${key}, built around ${groove}.`,
    `Build the rhythm with ${drums}; use ${bass}.`,
    `Feature ${colors}; use ${vocal}. Keep melodies, riddims, horn lines, and basslines newly composed, with no named performer or existing song references.`,
    variation.structure,
    `Shape it for ${variation.useCase}, strong low-end pocket, clear offbeat skank, tasteful delay and reverb, and no borrowed melody. Mix with separated kick, bass, guitar, keys, horns, vocals, and dub effects.`,
  ].join(" ");
  if (compact.length <= 1000) return compact;

  return [
    `Create an original ${label} track at ${bpm} BPM in ${key}, built around ${groove}.`,
    `Use ${drums}, ${bass}, and ${colors}.`,
    `${vocal}. Keep all melodies, riddims, horn lines, and basslines newly composed, with no named performer or existing song references.`,
    variation.structure,
    `Mix with separated kick, bass, guitar, keys, horns, vocals, percussion, and dub effects.`,
  ].join(" ");
}

function ensureLength(prompt, profile, variation, bpm, key) {
  let value = prompt;
  const additions = [
    " Preserve a relaxed human pocket, let the bass answer the vocal or lead line, and keep the offbeat guitar or keys precise without feeling mechanical.",
    " Use automation for delay throws, brief dropouts, and reverb returns so the arrangement evolves while the groove stays easy to follow.",
    ` Keep the ${profile[1]} identity clear through drums, bass, skank, section contrast, and a memorable original hook.`,
  ];
  for (const addition of additions) {
    if (value.length >= 650) break;
    if (value.length + addition.length <= 1000) value += addition;
  }
  if (value.length < 650) {
    throw new Error(`${profile[0]} ${bpm} ${key} prompt too short after padding: ${value.length}`);
  }
  return value;
}

function makeExclude(slug) {
  return unique([
    "specific artist references",
    "copyrighted melodies",
    "copied riddims",
    "existing song titles",
    "famous reggae hooks",
    "label references",
    "recognizable samples",
    "fake patois caricature",
    "muddy sub bass",
    "harsh clipping",
    "thin snare",
    slug.includes("dub") ? "uncontrolled feedback" : "",
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
    const prompt = ensureLength(makePrompt(profile, variation, bpm, key), profile, variation, bpm, key);
    records.push({
      id: `world-reggae-dub-caribbean-v04-${pad(index + 1)}`,
      source_type: sourceType,
      batch_id: `20260622-world-reggae-dub-caribbean-${pad(batchNumber)}`,
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
      mood: [variation.useCase, "warm low-end pocket", "offbeat motion"],
      tags: unique([...tags, slugify(region)]),
      groove_score: variationIndex === 0 ? 9 : 8,
      energy: bpm >= 118 ? "high" : bpm >= 94 ? "medium-high" : "medium",
      energy_score: bpm >= 118 ? 9 : bpm >= 94 ? 8 : 6,
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
