const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT_FILE = path.join(ROOT, "data-src", "collections", "kota-v04.jsonl");
const CREATOR = "KOTA";
const CREATOR_SLUG = "kota";
const COLLECTION = "kota-v04";
const BATCH_ID = "20260622-kota-upload-001";
const EXCLUDE =
  "specific artist references, copyrighted melodies, direct song imitation, over-polished generic pop, muddy vocals, unreadable low end, harsh digital clipping";

const SECTION_MAP = {
  "跳ね感増し増しトイグランジ": {
    category: "Toy Grunge",
    subcategory: "bouncy toy-pop grunge",
    tags: ["toy-grunge", "toy-pop", "grunge", "offbeat", "bouncy-groove"],
    defaultBpm: 96,
    defaultKey: "E minor",
  },
  オルタナグランジ: {
    category: "Alternative Grunge",
    subcategory: "offbeat microtonal grunge",
    tags: ["alternative-grunge", "grunge", "offbeat", "detuned-guitar", "dissonance"],
    defaultBpm: 82,
    defaultKey: "E minor",
  },
  ブリティッシュロック: {
    category: "British Rock",
    subcategory: "britpop downer rock",
    tags: ["british-rock", "britpop", "downer-rock", "guitar-rock"],
    defaultBpm: 78,
    defaultKey: "C major",
  },
  "女性アーティスト・オルタナ": {
    category: "Female Vocal Alternative",
    subcategory: "dark female vocal alternative",
    tags: ["female-vocal", "alternative-rock", "dark-rock", "cinematic"],
    defaultBpm: 92,
    defaultKey: "D minor",
  },
  オルタナティブロック: {
    category: "Alternative Rock",
    subcategory: "groove alternative rock",
    tags: ["alternative-rock", "groove-rock", "offbeat", "guitar-rock"],
    defaultBpm: 96,
    defaultKey: "D major",
  },
  バラード: {
    category: "Alternative Ballad",
    subcategory: "intimate alternative rock ballad",
    tags: ["alternative-ballad", "clean-guitar", "emotional", "slow-build"],
    defaultBpm: 76,
    defaultKey: "E minor",
  },
  プログレッシブロック: {
    category: "Progressive Rock",
    subcategory: "art rock progressive hybrid",
    tags: ["progressive-rock", "art-rock", "odd-meter", "cinematic-rock"],
    defaultBpm: 84,
    defaultKey: "E minor",
  },
  メタル: {
    category: "Alternative Metal",
    subcategory: "nu-metal industrial hybrid",
    tags: ["alternative-metal", "nu-metal", "industrial-metal", "heavy-groove"],
    defaultBpm: 94,
    defaultKey: "C minor",
  },
  Uncategorized: {
    category: "Groove Rock",
    subcategory: "raw hybrid groove rock",
    tags: ["groove-rock", "raw-rock", "blues-rock", "hybrid-rock"],
    defaultBpm: 90,
    defaultKey: "E minor",
  },
  "R&B": {
    category: "Alternative R&B",
    subcategory: "dark alternative r&b rock",
    tags: ["alternative-rnb", "dark-rnb", "industrial-rnb", "deep-groove"],
    defaultBpm: 80,
    defaultKey: "A minor",
  },
  Instrumental: {
    category: "Cinematic Instrumental",
    subcategory: "cinematic instrumental underscore",
    tags: ["instrumental", "cinematic", "underscore", "strings"],
    defaultBpm: 64,
    defaultKey: "C minor",
  },
};

const KEYWORD_TAGS = [
  [/toy piano|glockenspiel|music-box|bell/i, "toy-instruments"],
  [/lo-fi|tape hiss|tape noise/i, "lo-fi"],
  [/industrial|machine|mechanical|metallic/i, "industrial"],
  [/microtonal|53-TET|cents|detune|detuned/i, "microtonal"],
  [/offbeat|off-beat|syncop/i, "syncopation"],
  [/jazz/i, "jazz-influenced"],
  [/dissonan|unresolved|minor-2nd|tritone/i, "dissonance"],
  [/female vocal|female vocals|female voice/i, "female-vocal"],
  [/male vocal|male vocals|male voice/i, "male-vocal"],
  [/duet|two distinct vocalists/i, "duet"],
  [/rap|spoken-word|talk-sing|semi-rapped/i, "rap-rock"],
  [/funk|slap|groove/i, "funk-groove"],
  [/orchestral|string quartet|strings|cello|violin|viola/i, "strings"],
  [/piano|rhodes|wurlitzer/i, "keys"],
  [/synth|808|sub-bass|sub synth/i, "synth-bass"],
  [/nu-metal/i, "nu-metal"],
  [/grunge/i, "grunge"],
  [/britpop|brit-rock|british/i, "british-rock"],
  [/cinematic|film|underscore|cue/i, "cinematic"],
  [/ballad/i, "ballad"],
  [/progressive|odd-meter|5\/4|7\/8/i, "progressive"],
];

function usage() {
  console.error("Usage: node tools\\import-kota-prompts.js <pasted-text.txt>");
}

function parseSections(text) {
  const sections = [];
  let current = null;

  text.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return;

    const sectionMatch = line.match(/^\[(.*)\]$/);
    if (sectionMatch) {
      const name = sectionMatch[1].trim() || "Uncategorized";
      current = { name, prompts: [] };
      sections.push(current);
      return;
    }

    if (!current) {
      current = { name: "Uncategorized", prompts: [] };
      sections.push(current);
    }
    current.prompts.push(line);
  });

  return sections;
}

function normalizePrompt(text, section) {
  const sectionMeta = SECTION_MAP[section] || SECTION_MAP.Uncategorized;
  const cleaned = String(text || "")
      .replace(/＊/g, "")
      .replace(/[“”]/g, '"')
      .replace(/[’]/g, "'")
      .replace(/\s+/g, " ")
      .replace(/\bDrums are inspired by Dannie Richmond:\s*/i, "Drums are dynamic, expressive, human, and jazz-informed: ")
      .replace(/\binspired by Dannie Richmond:\s*/i, "jazz-informed and expressive: ")
      .replace(/\bAfro-American\b/gi, "soulful rhythmically agile")
      .replace(/\bCaucasian\b/gi, "raspy melodic rock")
      .replace(/divide singer black and white according to lyrics command/gi, "divide the singers by contrasting vocal tone and lyrical role")
      .replace(/\bBlack musical traditions\b/gi, "groove-rooted soul and funk traditions")
      .replace(/\bwhite rock\b/gi, "raw guitar-driven rock")
      .trim();

  const canonicalBpm = parseBpm(cleaned) || sectionMeta.defaultBpm;
  const canonicalKey = parseKey(cleaned) || sectionMeta.defaultKey;
  const additions = [];
  if (canonicalBpm) additions.push(`BPM: ${canonicalBpm}`);
  if (canonicalKey) additions.push(`Key: ${canonicalKey}`);
  if (!additions.length) return trimToLimit(cleaned, 1000);

  const suffix = `, ${additions.join(", ")}.`;
  const body = cleaned.length + suffix.length > 1000 ? trimToLimit(cleaned, 1000 - suffix.length) : cleaned;
  const withDefaults = `${body.replace(/[,.]\s*$/, "")}${suffix}`;
  return trimToLimit(withDefaults, 1000);
}

function trimToLimit(text, limit) {
  if (text.length <= limit) return text;
  const target = text.slice(0, limit - 1);
  const cutIndex = Math.max(target.lastIndexOf(", "), target.lastIndexOf(". "));
  if (cutIndex > 650) return `${target.slice(0, cutIndex).trim()}.`;
  return `${target.trim()}.`;
}

function parseBpm(prompt) {
  const contextualRange = prompt.match(/(?:BPM|Tempo|tempo|around|hovering around)[^0-9]{0,16}(\d{2,3})\s*[–-]\s*(\d{2,3})\s*(?:BPM)?/i);
  if (contextualRange) return Math.round((Number(contextualRange[1]) + Number(contextualRange[2])) / 2);

  const range = prompt.match(/(?:BPM\s*[:~]?\s*)?(\d{2,3})\s*[–-]\s*(\d{2,3})\s*BPM/i);
  if (range) return Math.round((Number(range[1]) + Number(range[2])) / 2);

  const around = prompt.match(/(?:BPM\s*(?:around|~)|Tempo\s*~|Tempo around|hovering around)\s*(\d{2,3})/i);
  if (around) return Number(around[1]);

  const bpm = prompt.match(/\b(\d{2,3})\s*BPM\b/i) || prompt.match(/\bBPM\s*[:~]?\s*(\d{2,3})\b/i);
  if (bpm) return Number(bpm[1]);

  const under = prompt.match(/\bBPM\s+under\s+(\d{2,3})\b/i);
  if (under) return Number(under[1]);

  return null;
}

function parseKey(prompt) {
  const patterns = [
    /\bkey\s+([A-G][#b]?\s+(?:minor|major)(?:\s+or\s+[A-G][#b]?\s+(?:minor|major))?)/i,
    /\bkey\s+in\s+([^,]+)/i,
    /\bkey\s+of\s+([^,]+)/i,
    /\bKey\s*:\s*([^,.]+)/i,
    /\bkey\s+center\s+around\s+([^,]+)/i,
    /\bTonal center\s+([^,]+)/i,
  ];
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match) return cleanupKey(match[1]);
  }
  return "";
}

function cleanupKey(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\.$/, "")
    .trim();
}

function titleFor(section, prompt, index) {
  const bpm = parseBpm(prompt);
  const key = parseKey(prompt);
  const suffix = [bpm ? `${bpm} BPM` : "", key ? key : ""].filter(Boolean).join(" / ");
  const base = SECTION_MAP[section]?.category || "KOTA Prompt";
  return suffix ? `${base} ${index} (${suffix})` : `${base} ${index}`;
}

function tagsFor(section, prompt) {
  const base = SECTION_MAP[section]?.tags || SECTION_MAP.Uncategorized.tags;
  const keywordTags = KEYWORD_TAGS.filter(([pattern]) => pattern.test(prompt)).map(([, tag]) => tag);
  return unique([...base, ...keywordTags]).slice(0, 10);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function recordFor(section, prompt, index) {
  const sectionMeta = SECTION_MAP[section] || SECTION_MAP.Uncategorized;
  const normalizedPrompt = normalizePrompt(prompt, section);
  return {
    source_type: "manual_original",
    batch_id: BATCH_ID,
    collection: COLLECTION,
    language_region: "japan",
    creator: CREATOR,
    creator_slug: CREATOR_SLUG,
    creator_tags: [CREATOR_SLUG],
    category: sectionMeta.category,
    subcategory: sectionMeta.subcategory,
    title: titleFor(section, normalizedPrompt, index),
    prompt: normalizedPrompt,
    exclude: EXCLUDE,
    bpm: parseBpm(normalizedPrompt),
    key: parseKey(normalizedPrompt),
    tags: tagsFor(section, normalizedPrompt),
    public_safe: true,
    rights_status: "original_normalized",
    needs_review: false,
  };
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    usage();
    process.exit(2);
  }

  const absoluteInput = path.resolve(inputPath);
  const text = fs.readFileSync(absoluteInput, "utf8");
  const records = [];
  parseSections(text).forEach((section) => {
    section.prompts.forEach((prompt, index) => {
      records.push(recordFor(section.name, prompt, index + 1));
    });
  });

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, `${records.map((record) => JSON.stringify(record)).join("\n")}\n`, "utf8");
  console.log(`Imported ${records.length} KOTA prompts to ${OUT_FILE}`);
}

main();
