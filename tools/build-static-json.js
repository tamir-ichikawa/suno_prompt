const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "data");
const BUNDLE_DIR = path.join(OUT_DIR, "bundles");
const TODAY = "2026-06-22";

const COLLECTIONS = {
  v01: {
    id: "starter-v01",
    version: "V01",
    label: "全ジャンルスターター",
    description: "幅広いジャンルを対象にしたSunoプロンプトの初期スターター版。",
    source: path.join(ROOT, "suno-prompts-research-start-V01-20260621", "manifest.jsonl"),
    bundle: "v01.json",
  },
  rock: {
    id: "overseas-rock-v02",
    version: "V02",
    label: "海外ロック",
    description: "グルーヴ感のある海外ロック、ファンクロック、ポストパンク、ガレージなど。",
    source: path.join(ROOT, "suno-rock-prompts-overseas-V02-20260621", "manifest-rock-prompts-V02-20260621.jsonl"),
    bundle: "rock-v02.json",
  },
  electro: {
    id: "electro-groove-v03",
    version: "V03",
    label: "海外エレクトロ・グルーヴ",
    description: "French touch、filter house、synthwave、neon noirなどの電子音楽グルーヴ集。",
    source: path.join(ROOT, "suno-electro-groove-prompts-overseas-V03-20260621", "manifest-electro-groove-prompts-V03-20260621.jsonl"),
    bundle: "electro-groove-v03.json",
  },
  kota: {
    id: "kota-v04",
    version: "V04",
    label: "KOTAプロンプト",
    description: "KOTA作成のグランジ、オルタナ、R&B、シネマティック系Sunoプロンプト。",
    source: path.join(ROOT, "data-src", "collections", "kota-v04.jsonl"),
    bundle: "kota-v04.json",
  },
  worldPop: {
    id: "world-pop-v04",
    version: "V04",
    label: "World Pop",
    description: "世界各地のポップ語彙を、特定アーティスト名なしで整理したSunoプロンプト。",
    source: path.join(ROOT, "data-src", "collections", "world-pop-v04.jsonl"),
    bundle: "world-pop-v04.json",
  },
  worldElectronic: {
    id: "world-electronic-v04",
    version: "V04",
    label: "World Electronic",
    description: "世界各地の電子音楽・ダンス音楽語彙を、特定アーティスト名なしで整理したSunoプロンプト。",
    source: path.join(ROOT, "data-src", "collections", "world-electronic-v04.jsonl"),
    bundle: "world-electronic-v04.json",
  },
  worldRock: {
    id: "world-rock-v04",
    version: "V04",
    label: "World Rock",
    description: "世界各地のロック/ギター音楽語彙を、特定アーティスト名なしで整理したSunoプロンプト。",
    source: path.join(ROOT, "data-src", "collections", "world-rock-v04.jsonl"),
    bundle: "world-rock-v04.json",
  },
  worldHiphopRnb: {
    id: "world-hiphop-rnb-v04",
    version: "V04",
    label: "World Hip-Hop/R&B",
    description: "世界各地のHip-Hop/R&B/Soul/Beat Music語彙を、特定アーティスト名なしで整理したSunoプロンプト。",
    source: path.join(ROOT, "data-src", "collections", "world-hiphop-rnb-v04.jsonl"),
    bundle: "world-hiphop-rnb-v04.json",
  },
  worldFolkAcoustic: {
    id: "world-folk-acoustic-v04",
    version: "V04",
    label: "World Folk/Acoustic",
    description: "世界各地のFolk/Acoustic/Roots/Singer-Songwriter語彙を、特定アーティスト名なしで整理したSunoプロンプト。",
    source: path.join(ROOT, "data-src", "collections", "world-folk-acoustic-v04.jsonl"),
    bundle: "world-folk-acoustic-v04.json",
  },
  worldJazzFunk: {
    id: "world-jazz-funk-v04",
    version: "V04",
    label: "World Jazz/Funk",
    description: "世界各地のJazz/Funk/Fusion/Groove/Brass系語彙を、特定アーティスト名なしで整理したSunoプロンプト。",
    source: path.join(ROOT, "data-src", "collections", "world-jazz-funk-v04.jsonl"),
    bundle: "world-jazz-funk-v04.json",
  },
  worldCinematicScore: {
    id: "world-cinematic-score-v04",
    version: "V04",
    label: "World Cinematic Score",
    description: "世界各地のCinematic/Score/Ambient/Hybrid Orchestra系語彙を、特定作品名なしで整理したSunoプロンプト。",
    source: path.join(ROOT, "data-src", "collections", "world-cinematic-score-v04.jsonl"),
    bundle: "world-cinematic-score-v04.json",
  },
};

function readJsonl(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`JSONL parse error at ${filePath}:${index + 1}\n${error.message}`);
      }
    });
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeJson(fileName, value, minify = false) {
  const json = JSON.stringify(value, null, minify ? 0 : 2);
  fs.writeFileSync(path.join(OUT_DIR, fileName), `${json}\n`, "utf8");
}

function writeBundle(fileName, value) {
  fs.writeFileSync(path.join(BUNDLE_DIR, fileName), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function pad(number) {
  return String(number).padStart(4, "0");
}

function slugify(value) {
  return String(value || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value) {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function splitTags(value) {
  if (Array.isArray(value)) return value.flatMap(splitTags);
  return String(value || "")
    .split(/[;,]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) =>
      tag
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
    )
    .filter(Boolean);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function toNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const match = String(value || "").match(/\d+/);
  return match ? Number(match[0]) : null;
}

function parseBpmFromPrompt(prompt) {
  const match = String(prompt || "").match(/\bBPM\s*:\s*(\d{2,3})\b/i);
  return match ? Number(match[1]) : null;
}

function parseKeyFromPrompt(prompt) {
  const match = String(prompt || "").match(/\bKey\s*:\s*([^,.]+)/i);
  return match ? match[1].trim() : "";
}

function stripTrailingExclude(prompt) {
  const text = String(prompt || "").trim();
  const index = text.toLowerCase().lastIndexOf("exclude:");
  if (index === -1) return text;
  return text.slice(0, index).replace(/\s+$/, "");
}

function energyScore(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const normalized = String(value || "").toLowerCase();
  if (!normalized) return null;
  if (normalized.includes("very high")) return 10;
  if (normalized.includes("high")) return normalized.includes("medium") ? 8 : 9;
  if (normalized.includes("medium")) return normalized.includes("low") ? 4 : 6;
  if (normalized.includes("low")) return 3;
  return null;
}

function publicSafe(prompt, title) {
  const text = `${title || ""}\n${prompt || ""}`;
  return ![
    /\bdaft\s+punk\b/i,
    /\bdrive\s+soundtrack\b/i,
    /\bin\s+the\s+style\s+of\b/i,
    /\bstyle\s+of\b/i,
    /\bsounds\s+like\b/i,
  ].some((pattern) => pattern.test(text));
}

function basePrompt(fields) {
  const tags = unique(splitTags(fields.tags));
  const prompt = stripTrailingExclude(fields.prompt);
  const title = fields.title || "Untitled Prompt";
  const safe = publicSafe(prompt, title);

  return {
    id: fields.id,
    original_id: fields.original_id || "",
    version: fields.version,
    collection: fields.collection,
    collection_label: fields.collection_label,
    category: fields.category || "Uncategorized",
    category_slug: fields.category_slug || slugify(fields.category || "uncategorized"),
    subcategory: fields.subcategory || "",
    title,
    prompt,
    exclude: String(fields.exclude || "").trim(),
    lyrics_direction: fields.lyrics_direction || "",
    bpm: fields.bpm ?? null,
    key: fields.key || "",
    language: fields.language || "English",
    vocal: fields.vocal || "",
    creator: fields.creator || "",
    creator_slug: fields.creator_slug || slugify(fields.creator || ""),
    creator_tags: unique(splitTags(fields.creator_tags)),
    mood: fields.mood || [],
    tags,
    use_case: fields.use_case || [],
    groove_score: fields.groove_score ?? null,
    energy: fields.energy ?? "",
    energy_score: fields.energy_score ?? energyScore(fields.energy),
    public_safe: safe && fields.public_safe !== false,
    rights_status: fields.rights_status || "original_normalized",
    source_note: fields.source_note || "Original normalized prompt based on genre research.",
    source_url: fields.source_url || "",
    is_top_pick: Boolean(fields.is_top_pick),
    created_at: TODAY,
    updated_at: TODAY,
  };
}

function normalizeV01(items) {
  const meta = COLLECTIONS.v01;
  return items.map((item, index) => {
    const prompt = item.prompt || "";
    const category = titleCase(item.genre_category || "starter");
    return basePrompt({
      id: `v01-${pad(index + 1)}`,
      original_id: item.id,
      version: meta.version,
      collection: meta.id,
      collection_label: meta.label,
      category,
      title: item.title,
      prompt,
      bpm: parseBpmFromPrompt(prompt),
      key: parseKeyFromPrompt(prompt),
      language: item.language === "en" ? "English" : item.language || "English",
      tags: item.tags,
      rights_status: item.license_status === "safe_cc0" ? "cc0_source_based" : "original_normalized",
      source_note: "CC0または公開利用に配慮して整理したスターター版プロンプト。",
      source_url: item.source_url,
      public_safe: item.license_status !== "quarantine_unverified",
    });
  });
}

function normalizeV02(items) {
  const meta = COLLECTIONS.rock;
  return items.map((item, index) => {
    const subgenreTitle = titleCase(item.subgenre || item.category || "Rock Prompt");
    const variation = item.variation_label ? ` (${item.variation_label})` : "";
    const groove = toNumber(item.groove_level);
    return basePrompt({
      id: `rock-v02-${pad(index + 1)}`,
      original_id: item.id,
      version: meta.version,
      collection: meta.id,
      collection_label: meta.label,
      category: item.category,
      subcategory: item.subgenre,
      title: `${subgenreTitle}${variation}`,
      prompt: item.style_prompt,
      exclude: item.exclude,
      lyrics_direction: item.lyrics_direction,
      bpm: toNumber(item.bpm),
      key: item.key,
      language: "English",
      tags: item.tags,
      groove_score: groove,
      energy: item.energy,
      energy_score: toNumber(item.energy),
      rights_status: "original_normalized",
      source_note: "海外ロックのジャンル特徴をもとにしたオリジナル整理版プロンプト。",
      is_top_pick: groove >= 10 && toNumber(item.energy) >= 9,
    });
  });
}

function normalizeV03(items) {
  const meta = COLLECTIONS.electro;
  return items.map((item, index) => {
    const tags = splitTags(item.tags);
    const topPick = tags.includes("top-pick") || String(item.use_case || "").includes("best first tests");
    return basePrompt({
      id: `eg-v03-${pad(index + 1)}`,
      original_id: item.id,
      version: meta.version,
      collection: meta.id,
      collection_label: meta.label,
      category: item.category,
      category_slug: item.category_slug,
      title: item.title,
      prompt: item.prompt,
      exclude: item.exclude,
      bpm: toNumber(item.bpm),
      key: item.key,
      language: "English",
      vocal: item.vocal && !String(item.vocal).includes("curated") ? item.vocal : "",
      mood: item.mood && !String(item.mood).includes("curated") ? splitTags(item.mood) : [],
      tags,
      use_case: item.use_case ? [item.use_case] : [],
      groove_score: topPick ? 10 : 8,
      energy: item.energy,
      energy_score: energyScore(item.energy),
      rights_status: "original_normalized",
      source_note: "電子音楽グルーヴのジャンル特徴をもとにしたオリジナル整理版プロンプト。",
      is_top_pick: topPick,
    });
  });
}

function normalizeKota(items) {
  const meta = COLLECTIONS.kota;
  return items.map((item, index) =>
    basePrompt({
      id: `kota-v04-${pad(index + 1)}`,
      original_id: item.id || `${item.batch_id}-${pad(index + 1)}`,
      version: meta.version,
      collection: meta.id,
      collection_label: meta.label,
      category: item.category,
      subcategory: item.subcategory,
      title: item.title,
      prompt: item.prompt,
      exclude: item.exclude,
      bpm: toNumber(item.bpm),
      key: item.key,
      language: "English",
      vocal: item.vocal || "",
      creator: item.creator || "KOTA",
      creator_slug: item.creator_slug || "kota",
      creator_tags: item.creator_tags || ["kota"],
      mood: item.mood || [],
      tags: item.tags,
      groove_score: item.groove_score ?? null,
      energy: item.energy || "",
      energy_score: item.energy_score ?? null,
      rights_status: item.rights_status || "original_normalized",
      source_note: "KOTA作成プロンプトを公開用に整理し、BPM/Key/タグ/作成者メタデータを付与。",
      is_top_pick: Boolean(item.is_top_pick),
      public_safe: item.public_safe !== false,
    })
  );
}

function normalizeWorldPop(items) {
  const meta = COLLECTIONS.worldPop;
  return items.map((item, index) => {
    const category = titleCase(item.subcategory || item.category || "World Pop");
    return basePrompt({
      id: `world-pop-v04-${pad(index + 1)}`,
      original_id: item.id || `${item.batch_id}-${pad(index + 1)}`,
      version: meta.version,
      collection: meta.id,
      collection_label: meta.label,
      category,
      subcategory: item.language_region || item.subcategory || "",
      title: item.title,
      prompt: item.prompt,
      exclude: item.exclude,
      bpm: toNumber(item.bpm),
      key: item.key,
      language: "English",
      vocal: item.vocal || "",
      creator: item.creator || "",
      creator_slug: item.creator_slug || "",
      creator_tags: item.creator_tags || [],
      mood: item.mood || [],
      tags: item.tags,
      groove_score: item.groove_score ?? null,
      energy: item.energy || "",
      energy_score: item.energy_score ?? null,
      rights_status: item.rights_status || "ai_generated_original",
      source_note: "ChatGPTで生成した世界各地のポップ系Sunoプロンプトを公開用に検査・整理。",
      is_top_pick: Boolean(item.is_top_pick),
      public_safe: item.public_safe !== false,
    });
  });
}

function normalizeWorldElectronic(items) {
  const meta = COLLECTIONS.worldElectronic;
  return items.map((item, index) => {
    const category = titleCase(item.subcategory || item.category || "World Electronic");
    return basePrompt({
      id: `world-electronic-v04-${pad(index + 1)}`,
      original_id: item.id || `${item.batch_id}-${pad(index + 1)}`,
      version: meta.version,
      collection: meta.id,
      collection_label: meta.label,
      category,
      subcategory: item.language_region || item.subcategory || "",
      title: item.title,
      prompt: item.prompt,
      exclude: item.exclude,
      bpm: toNumber(item.bpm),
      key: item.key,
      language: "English",
      vocal: item.vocal || "",
      creator: item.creator || "",
      creator_slug: item.creator_slug || "",
      creator_tags: item.creator_tags || [],
      mood: item.mood || [],
      tags: item.tags,
      groove_score: item.groove_score ?? null,
      energy: item.energy || "",
      energy_score: item.energy_score ?? null,
      rights_status: item.rights_status || "ai_generated_original",
      source_note: "ChatGPTで生成した世界各地の電子音楽・ダンス音楽系Sunoプロンプトを公開用に検査・整理。",
      is_top_pick: Boolean(item.is_top_pick),
      public_safe: item.public_safe !== false,
    });
  });
}

function normalizeWorldRock(items) {
  const meta = COLLECTIONS.worldRock;
  return items.map((item, index) => {
    const category = titleCase(item.subcategory || item.category || "World Rock");
    return basePrompt({
      id: `world-rock-v04-${pad(index + 1)}`,
      original_id: item.id || `${item.batch_id}-${pad(index + 1)}`,
      version: meta.version,
      collection: meta.id,
      collection_label: meta.label,
      category,
      subcategory: item.language_region || item.subcategory || "",
      title: item.title,
      prompt: item.prompt,
      exclude: item.exclude,
      bpm: toNumber(item.bpm),
      key: item.key,
      language: "English",
      vocal: item.vocal || "",
      creator: item.creator || "",
      creator_slug: item.creator_slug || "",
      creator_tags: item.creator_tags || [],
      mood: item.mood || [],
      tags: item.tags,
      groove_score: item.groove_score ?? null,
      energy: item.energy || "",
      energy_score: item.energy_score ?? null,
      rights_status: item.rights_status || "ai_generated_original",
      source_note: "ChatGPTで生成した世界各地のロック/ギター音楽系Sunoプロンプトを公開用に検査・整理。",
      is_top_pick: Boolean(item.is_top_pick),
      public_safe: item.public_safe !== false,
    });
  });
}

function normalizeWorldHiphopRnb(items) {
  const meta = COLLECTIONS.worldHiphopRnb;
  return items.map((item, index) => {
    const category = titleCase(item.subcategory || item.category || "World Hip-Hop/R&B");
    return basePrompt({
      id: `world-hiphop-rnb-v04-${pad(index + 1)}`,
      original_id: item.id || `${item.batch_id}-${pad(index + 1)}`,
      version: meta.version,
      collection: meta.id,
      collection_label: meta.label,
      category,
      subcategory: item.language_region || item.subcategory || "",
      title: item.title,
      prompt: item.prompt,
      exclude: item.exclude,
      bpm: toNumber(item.bpm),
      key: item.key,
      language: "English",
      vocal: item.vocal || "",
      creator: item.creator || "",
      creator_slug: item.creator_slug || "",
      creator_tags: item.creator_tags || [],
      mood: item.mood || [],
      tags: item.tags,
      groove_score: item.groove_score ?? null,
      energy: item.energy || "",
      energy_score: item.energy_score ?? null,
      rights_status: item.rights_status || "ai_generated_original",
      source_note: "ChatGPTで生成した世界各地のHip-Hop/R&B/Soul/Beat Music系Sunoプロンプトを公開用に検査・整理。",
      is_top_pick: Boolean(item.is_top_pick),
      public_safe: item.public_safe !== false,
    });
  });
}

function normalizeWorldFolkAcoustic(items) {
  const meta = COLLECTIONS.worldFolkAcoustic;
  return items.map((item, index) => {
    const category = titleCase(item.subcategory || item.category || "World Folk/Acoustic");
    return basePrompt({
      id: `world-folk-acoustic-v04-${pad(index + 1)}`,
      original_id: item.id || `${item.batch_id}-${pad(index + 1)}`,
      version: meta.version,
      collection: meta.id,
      collection_label: meta.label,
      category,
      subcategory: item.language_region || item.subcategory || "",
      title: item.title,
      prompt: item.prompt,
      exclude: item.exclude,
      bpm: toNumber(item.bpm),
      key: item.key,
      language: "English",
      vocal: item.vocal || "",
      creator: item.creator || "",
      creator_slug: item.creator_slug || "",
      creator_tags: item.creator_tags || [],
      mood: item.mood || [],
      tags: item.tags,
      groove_score: item.groove_score ?? null,
      energy: item.energy || "",
      energy_score: item.energy_score ?? null,
      rights_status: item.rights_status || "ai_generated_original",
      source_note: "ChatGPTで生成した世界各地のFolk/Acoustic/Roots/Singer-Songwriter系Sunoプロンプトを公開用に検査・整理。",
      is_top_pick: Boolean(item.is_top_pick),
      public_safe: item.public_safe !== false,
    });
  });
}

function normalizeWorldJazzFunk(items) {
  const meta = COLLECTIONS.worldJazzFunk;
  return items.map((item, index) => {
    const category = titleCase(item.subcategory || item.category || "World Jazz/Funk");
    return basePrompt({
      id: `world-jazz-funk-v04-${pad(index + 1)}`,
      original_id: item.id || `${item.batch_id}-${pad(index + 1)}`,
      version: meta.version,
      collection: meta.id,
      collection_label: meta.label,
      category,
      subcategory: item.language_region || item.subcategory || "",
      title: item.title,
      prompt: item.prompt,
      exclude: item.exclude,
      bpm: toNumber(item.bpm),
      key: item.key,
      language: "English",
      vocal: item.vocal || "",
      creator: item.creator || "",
      creator_slug: item.creator_slug || "",
      creator_tags: item.creator_tags || [],
      mood: item.mood || [],
      tags: item.tags,
      groove_score: item.groove_score ?? null,
      energy: item.energy || "",
      energy_score: item.energy_score ?? null,
      rights_status: item.rights_status || "ai_generated_original",
      source_note: "ChatGPTで生成した世界各地のJazz/Funk/Fusion/Groove/Brass系Sunoプロンプトを公開用に検査・整理。",
      is_top_pick: Boolean(item.is_top_pick),
      public_safe: item.public_safe !== false,
    });
  });
}

function normalizeWorldCinematicScore(items) {
  const meta = COLLECTIONS.worldCinematicScore;
  return items.map((item, index) => {
    const category = titleCase(item.subcategory || item.category || "World Cinematic Score");
    return basePrompt({
      id: `world-cinematic-score-v04-${pad(index + 1)}`,
      original_id: item.id || `${item.batch_id}-${pad(index + 1)}`,
      version: meta.version,
      collection: meta.id,
      collection_label: meta.label,
      category,
      subcategory: item.language_region || item.subcategory || "",
      title: item.title,
      prompt: item.prompt,
      exclude: item.exclude,
      bpm: toNumber(item.bpm),
      key: item.key,
      language: "English",
      vocal: item.vocal || "",
      creator: item.creator || "",
      creator_slug: item.creator_slug || "",
      creator_tags: item.creator_tags || [],
      mood: item.mood || [],
      tags: item.tags,
      groove_score: item.groove_score ?? null,
      energy: item.energy || "",
      energy_score: item.energy_score ?? null,
      rights_status: item.rights_status || "ai_generated_original",
      source_note: "ChatGPTで生成した世界各地のCinematic/Score/Ambient/Hybrid Orchestra系Sunoプロンプトを公開用に検査・整理。",
      is_top_pick: Boolean(item.is_top_pick),
      public_safe: item.public_safe !== false,
    });
  });
}

function summarizeCollections(prompts) {
  return Object.values(COLLECTIONS).map((collection) => {
    const collectionPrompts = prompts.filter((prompt) => prompt.collection === collection.id);
    return {
      id: collection.id,
      version: collection.version,
      label: collection.label,
      description: collection.description,
      prompt_count: collectionPrompts.length,
      bundle_path: `data/bundles/${collection.bundle}`,
    };
  });
}

function countBy(prompts, getKey) {
  const counts = new Map();
  prompts.forEach((prompt) => {
    const key = getKey(prompt);
    if (!key) return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return counts;
}

function summarizeCreators(prompts) {
  const map = new Map();
  prompts.forEach((prompt) => {
    if (!prompt.creator_slug) return;
    const current = map.get(prompt.creator_slug) || {
      id: prompt.creator_slug,
      name: prompt.creator || prompt.creator_slug,
      count: 0,
    };
    current.count += 1;
    map.set(prompt.creator_slug, current);
  });
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function summarizeCategories(prompts) {
  const map = new Map();
  prompts.forEach((prompt) => {
    const id = `${prompt.collection}:${prompt.category_slug}`;
    const current = map.get(id) || {
      id,
      slug: prompt.category_slug,
      name: prompt.category,
      collection: prompt.collection,
      collection_label: prompt.collection_label,
      count: 0,
    };
    current.count += 1;
    map.set(id, current);
  });
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function summarizeTags(prompts) {
  const counts = countBy(
    prompts.flatMap((prompt) => prompt.tags.map((tag) => ({ tag }))),
    (item) => item.tag
  );
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

function build() {
  ensureDir(OUT_DIR);
  ensureDir(BUNDLE_DIR);

  const v01 = normalizeV01(readJsonl(COLLECTIONS.v01.source));
  const rock = normalizeV02(readJsonl(COLLECTIONS.rock.source));
  const electro = normalizeV03(readJsonl(COLLECTIONS.electro.source));
  const kota = normalizeKota(readJsonl(COLLECTIONS.kota.source));
  const worldPop = normalizeWorldPop(readJsonl(COLLECTIONS.worldPop.source));
  const worldElectronic = normalizeWorldElectronic(readJsonl(COLLECTIONS.worldElectronic.source));
  const worldRock = normalizeWorldRock(readJsonl(COLLECTIONS.worldRock.source));
  const worldHiphopRnb = normalizeWorldHiphopRnb(readJsonl(COLLECTIONS.worldHiphopRnb.source));
  const worldFolkAcoustic = normalizeWorldFolkAcoustic(readJsonl(COLLECTIONS.worldFolkAcoustic.source));
  const worldJazzFunk = normalizeWorldJazzFunk(readJsonl(COLLECTIONS.worldJazzFunk.source));
  const worldCinematicScore = normalizeWorldCinematicScore(readJsonl(COLLECTIONS.worldCinematicScore.source));
  const prompts = [
    ...v01,
    ...rock,
    ...electro,
    ...kota,
    ...worldPop,
    ...worldElectronic,
    ...worldRock,
    ...worldHiphopRnb,
    ...worldFolkAcoustic,
    ...worldJazzFunk,
    ...worldCinematicScore,
  ];
  const publicPrompts = prompts.filter((prompt) => prompt.public_safe);
  const collections = summarizeCollections(publicPrompts);
  const creators = summarizeCreators(publicPrompts);
  const categories = summarizeCategories(publicPrompts);
  const tags = summarizeTags(publicPrompts);
  const topPicks = publicPrompts
    .filter((prompt) => prompt.is_top_pick)
    .sort((a, b) => (b.groove_score || 0) - (a.groove_score || 0) || (b.energy_score || 0) - (a.energy_score || 0))
    .slice(0, 48);

  writeJson("prompts-index.json", publicPrompts);
  writeJson("prompts-index.min.json", publicPrompts, true);
  writeJson("collections.json", collections);
  writeJson("tags.json", tags);
  writeJson("catalog.json", {
    generated_at: TODAY,
    prompt_count: publicPrompts.length,
    total_source_count: prompts.length,
    public_safe_count: publicPrompts.length,
    collections,
    creators,
    categories,
    top_tags: tags.slice(0, 80),
    top_pick_count: topPicks.length,
    strategy: "Static JSON first. Firestore is reserved for future admin editing and publish workflows.",
  });

  writeBundle(COLLECTIONS.v01.bundle, v01.filter((prompt) => prompt.public_safe));
  writeBundle(COLLECTIONS.rock.bundle, rock.filter((prompt) => prompt.public_safe));
  writeBundle(COLLECTIONS.electro.bundle, electro.filter((prompt) => prompt.public_safe));
  writeBundle(COLLECTIONS.kota.bundle, kota.filter((prompt) => prompt.public_safe));
  writeBundle(COLLECTIONS.worldPop.bundle, worldPop.filter((prompt) => prompt.public_safe));
  writeBundle(COLLECTIONS.worldElectronic.bundle, worldElectronic.filter((prompt) => prompt.public_safe));
  writeBundle(COLLECTIONS.worldRock.bundle, worldRock.filter((prompt) => prompt.public_safe));
  writeBundle(COLLECTIONS.worldHiphopRnb.bundle, worldHiphopRnb.filter((prompt) => prompt.public_safe));
  writeBundle(COLLECTIONS.worldFolkAcoustic.bundle, worldFolkAcoustic.filter((prompt) => prompt.public_safe));
  writeBundle(COLLECTIONS.worldJazzFunk.bundle, worldJazzFunk.filter((prompt) => prompt.public_safe));
  writeBundle(COLLECTIONS.worldCinematicScore.bundle, worldCinematicScore.filter((prompt) => prompt.public_safe));
  writeBundle("top-picks.json", topPicks);

  console.log(`Generated ${publicPrompts.length} public prompts`);
  console.log(`Collections: ${collections.map((collection) => `${collection.label} ${collection.prompt_count}`).join(", ")}`);
  console.log(`Top picks: ${topPicks.length}`);
}

build();
