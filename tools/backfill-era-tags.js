const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const COLLECTION_DIR = path.join(ROOT, "data-src", "collections");

const EXTRA_SOURCE_FILES = [
  path.join(ROOT, "suno-prompts-research-start-V01-20260621", "manifest.jsonl"),
  path.join(ROOT, "suno-rock-prompts-overseas-V02-20260621", "manifest-rock-prompts-V02-20260621.jsonl"),
  path.join(ROOT, "suno-electro-groove-prompts-overseas-V03-20260621", "manifest-electro-groove-prompts-V03-20260621.jsonl"),
];

const RETRO_DECADES = new Set(["1950s", "1960s", "1970s", "1980s", "1990s"]);
const ALLOWED_ERA_TAGS = new Set([
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
  "retro",
]);

const ERA_RULES = [
  {
    id: "1950s",
    patterns: [
      /\b1950s\b/,
      /\b50s\b/,
      /\bfifties\b/,
      /\bdoo[- ]?wop\b/,
      /\brockabilly\b/,
      /\bearly rock and roll\b/,
      /\bcrooner\b/,
    ],
  },
  {
    id: "1960s",
    patterns: [
      /\b1960s\b/,
      /\b60s\b/,
      /\bsixties\b/,
      /\bsurf rock\b/,
      /\bgarage rock\b/,
      /\bpsychedelic rock\b/,
      /\bsunshine pop\b/,
      /\bmod beat\b/,
      /\bgo[- ]?go\b/,
      /\bbeat group\b/,
    ],
  },
  {
    id: "1970s",
    patterns: [
      /\b1970s\b/,
      /\b70s\b/,
      /\bseventies\b/,
      /\bclassic rock\b/,
      /\bprog rock\b/,
      /\bprogressive rock\b/,
      /\bkrautrock\b/,
      /\bdisco\b/,
      /\bboogie\b/,
      /\broots reggae\b/,
      /\bdub reggae\b/,
      /\bphilly soul\b/,
      /\bwah[- ]?wah\b/,
      /\bstring machine\b/,
    ],
  },
  {
    id: "1980s",
    patterns: [
      /\b1980s\b/,
      /\b80s\b/,
      /\beighties\b/,
      /\bsynthwave\b/,
      /\bretrowave\b/,
      /\boutrun\b/,
      /\bcity pop\b/,
      /\bnew wave\b/,
      /\bsynth[- ]?pop\b/,
      /\bgated reverb\b/,
      /\bgated snare\b/,
      /\bfm synth\b/,
      /\bdx7\b/,
      /\bjuno[- ]?style\b/,
      /\blinn[- ]?style\b/,
      /\bneon noir\b/,
      /\bvhs\b/,
      /\bcassette\b/,
      /\bchorus[- ]?soaked\b/,
      /\bchorus guitar\b/,
    ],
  },
  {
    id: "1990s",
    patterns: [
      /\b1990s\b/,
      /\b90s\b/,
      /\bnineties\b/,
      /\bgrunge\b/,
      /\bshoegaze\b/,
      /\bbritpop\b/,
      /\btrip[- ]?hop\b/,
      /\bboom[- ]?bap\b/,
      /\bg[- ]?funk\b/,
      /\bjungle\b/,
      /\bdrum and bass\b/,
      /\bdnb\b/,
      /\bacid jazz\b/,
      /\beurodance\b/,
      /\bnew jack swing\b/,
      /\balternative rock\b/,
      /\blo[- ]?fi indie\b/,
    ],
  },
  {
    id: "2000s",
    patterns: [
      /\b2000s\b/,
      /\b00s\b/,
      /\by2k\b/,
      /\bbloghouse\b/,
      /\belectroclash\b/,
      /\bindie sleaze\b/,
      /\bgarage revival\b/,
      /\bdance punk\b/,
      /\bpost[- ]?hardcore\b/,
      /\bpop punk\b/,
      /\bnu metal\b/,
      /\bdubstep\b/,
      /\bcrunk\b/,
    ],
  },
  {
    id: "2010s",
    patterns: [
      /\b2010s\b/,
      /\bfuture bass\b/,
      /\bfuture funk\b/,
      /\btropical house\b/,
      /\blo[- ]?fi hip[- ]?hop\b/,
      /\bcloud rap\b/,
      /\bdrill\b/,
      /\btrap\b/,
      /\bvaporwave\b/,
      /\bkawaii future bass\b/,
      /\bmoombahton\b/,
    ],
  },
  {
    id: "2020s",
    patterns: [
      /\b2020s\b/,
      /\bhyperpop\b/,
      /\bphonk\b/,
      /\bdrift phonk\b/,
      /\bjersey club\b/,
      /\bpluggnb\b/,
      /\brage beat\b/,
      /\bamapiano\b/,
      /\bsigilkore\b/,
    ],
  },
];

const RETRO_PATTERNS = [
  /\bretro\b/,
  /\bvintage\b/,
  /\bold[- ]?school\b/,
  /\bthrowback\b/,
  /\bnostalgic\b/,
  /\bnostalgia\b/,
  /\btape hiss\b/,
  /\btape saturation\b/,
  /\banalog warmth\b/,
  /\bretro[- ]?future\b/,
  /\bretro[- ]?futuristic\b/,
];

function sourceFiles() {
  const collectionFiles = fs
    .readdirSync(COLLECTION_DIR)
    .filter((file) => file.endsWith(".jsonl"))
    .sort()
    .map((file) => path.join(COLLECTION_DIR, file));
  return [...EXTRA_SOURCE_FILES, ...collectionFiles];
}

function readJsonl(filePath) {
  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line, index) => ({ line: line.trim(), lineNumber: index + 1 }))
    .filter((item) => item.line)
    .map((item) => {
      try {
        return JSON.parse(item.line);
      } catch (error) {
        throw new Error(`JSONL parse error at ${filePath}:${item.lineNumber}\n${error.message}`);
      }
    });
}

function writeJsonl(filePath, records) {
  fs.writeFileSync(filePath, `${records.map((record) => JSON.stringify(record)).join("\n")}\n`, "utf8");
}

function normalizeExistingTags(value) {
  const raw = Array.isArray(value) ? value : String(value || "").split(/[;,]/);
  return raw
    .map((tag) =>
      String(tag || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
    )
    .filter((tag) => ALLOWED_ERA_TAGS.has(tag));
}

function normalizeText(value) {
  if (Array.isArray(value)) return value.map(normalizeText).join(" ");
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTrailingExclude(value) {
  const text = String(value || "");
  const index = text.toLowerCase().lastIndexOf("exclude:");
  return index === -1 ? text : text.slice(0, index);
}

function searchableText(record) {
  const fields = [
    record.title,
    record.genre_category,
    record.category,
    record.category_slug,
    record.subgenre,
    record.subcategory,
    record.variation_label,
    record.language_region,
    record.language_focus,
    record.tags,
    stripTrailingExclude(record.prompt),
    stripTrailingExclude(record.style_prompt),
    record.groove,
    record.bass,
    record.synth,
    record.guitar,
    record.vocal,
    record.mood,
    record.production,
    record.structure,
    record.use_case,
  ];
  return normalizeText(fields.filter(Boolean).join(" "));
}

function inferEraTags(record) {
  const text = searchableText(record);
  const tags = [];

  ERA_RULES.forEach((rule) => {
    if (rule.patterns.some((pattern) => pattern.test(text))) tags.push(rule.id);
  });

  if (tags.some((tag) => RETRO_DECADES.has(tag)) || RETRO_PATTERNS.some((pattern) => pattern.test(text))) {
    tags.push("retro");
  }

  return [...new Set(tags)];
}

function summarize(records) {
  const counts = new Map();
  records.forEach((record) => {
    (record.era_tags || []).forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
  });
  return Object.fromEntries([...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const files = sourceFiles();
  const totals = {
    files: files.length,
    records: 0,
    records_with_era_tags: 0,
    changed_records: 0,
    era_counts: {},
  };
  const allRecords = [];

  files.forEach((filePath) => {
    const records = readJsonl(filePath);
    let changed = false;
    records.forEach((record) => {
      const next = [...new Set([...normalizeExistingTags(record.era_tags), ...inferEraTags(record)])];
      const hadEraTags = Object.prototype.hasOwnProperty.call(record, "era_tags");
      const before = JSON.stringify(record.era_tags || []);
      record.era_tags = next;
      if (!hadEraTags || JSON.stringify(record.era_tags) !== before) {
        totals.changed_records += 1;
        changed = true;
      }
      if (record.era_tags.length) totals.records_with_era_tags += 1;
      allRecords.push(record);
    });
    totals.records += records.length;
    if (changed && !dryRun) writeJsonl(filePath, records);
  });

  totals.era_counts = summarize(allRecords);
  console.log(JSON.stringify(totals, null, 2));
  if (dryRun) console.log("Dry run only; no files were changed.");
}

main();
