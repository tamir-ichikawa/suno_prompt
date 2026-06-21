const fs = require("fs");
const path = require("path");

const REQUIRED_FIELDS = [
  "source_type",
  "batch_id",
  "collection",
  "language_region",
  "category",
  "subcategory",
  "title",
  "prompt",
  "exclude",
  "bpm",
  "key",
  "tags",
  "public_safe",
  "rights_status",
  "needs_review",
];

const ALLOWED_SOURCE_TYPES = new Set(["chatgpt_generated", "manual_original", "external_normalized"]);
const ALLOWED_RIGHTS = new Set(["ai_generated_original", "original_normalized", "cc0_source_based"]);
const PROMPT_TARGET_MIN = 650;
const PROMPT_HARD_MAX = 1000;

const RISKY_PATTERNS = [
  /\bin\s+the\s+style\s+of\b/i,
  /\bstyle\s+of\b/i,
  /\bsounds?\s+like\b/i,
  /\bsimilar\s+to\b/i,
  /\bvoice\s+of\b/i,
  /\bvocals?\s+like\b/i,
  /\bcover\s+of\b/i,
  /\bremix\s+of\b/i,
  /\bdaft\s+punk\b/i,
  /\btaylor\s+swift\b/i,
  /\bbillie\s+eilish\b/i,
  /\bthe\s+weeknd\b/i,
  /\bbruno\s+mars\b/i,
  /\bdua\s+lipa\b/i,
  /\bbeyonc[eé]\b/i,
  /\bkendrick\s+lamar\b/i,
  /\bdrake\b/i,
  /\bkanye\s+west\b/i,
  /\bqueen\b/i,
  /\bbeatles\b/i,
  /\bnirvana\b/i,
  /\bradiohead\b/i,
];

function usage() {
  console.error("Usage: node tools\\validate-prompt-jsonl.js <file.jsonl>");
}

function readJsonl(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  return text
    .split(/\r?\n/)
    .map((line, index) => ({ line: line.trim(), lineNumber: index + 1 }))
    .filter((item) => item.line && !item.line.startsWith("#"))
    .map((item) => {
      try {
        return { value: JSON.parse(item.line), lineNumber: item.lineNumber };
      } catch (error) {
        return { error: `Invalid JSON: ${error.message}`, lineNumber: item.lineNumber };
      }
    });
}

function isKebabTag(tag) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag);
}

function validateRecord(record, lineNumber) {
  const errors = [];
  const warnings = [];

  REQUIRED_FIELDS.forEach((field) => {
    if (!(field in record)) errors.push(`missing field: ${field}`);
  });

  if (!ALLOWED_SOURCE_TYPES.has(record.source_type)) errors.push(`invalid source_type: ${record.source_type}`);
  if (!ALLOWED_RIGHTS.has(record.rights_status)) errors.push(`invalid rights_status: ${record.rights_status}`);
  if (record.public_safe !== true) errors.push("public_safe must be true for public candidates");
  if (record.needs_review === true) warnings.push("needs_review is true");

  if (typeof record.title !== "string" || !record.title.trim()) errors.push("title must be a non-empty string");
  if (typeof record.prompt !== "string" || !record.prompt.trim()) {
    errors.push("prompt must be a non-empty string");
  } else {
    const promptLength = record.prompt.length;
    if (promptLength > PROMPT_HARD_MAX) errors.push(`prompt exceeds ${PROMPT_HARD_MAX} characters: ${promptLength}`);
    if (promptLength < PROMPT_TARGET_MIN) warnings.push(`prompt is shorter than target ${PROMPT_TARGET_MIN} characters: ${promptLength}`);
    if (/\r|\n/.test(record.prompt)) errors.push("prompt must not contain line breaks");
  }
  if (typeof record.exclude !== "string" || !record.exclude.trim()) warnings.push("exclude is empty");
  if (typeof record.category !== "string" || !record.category.trim()) errors.push("category must be a non-empty string");
  if (typeof record.subcategory !== "string" || !record.subcategory.trim()) warnings.push("subcategory is empty");
  if (typeof record.key !== "string" || !record.key.trim()) warnings.push("key is empty");

  if (typeof record.bpm !== "number" || !Number.isFinite(record.bpm)) {
    errors.push("bpm must be a number");
  } else if (record.bpm < 40 || record.bpm > 220) {
    errors.push(`bpm out of range: ${record.bpm}`);
  }

  if (!Array.isArray(record.tags) || record.tags.length === 0) {
    errors.push("tags must be a non-empty array");
  } else {
    record.tags.forEach((tag) => {
      if (typeof tag !== "string" || !isKebabTag(tag)) errors.push(`invalid tag: ${tag}`);
    });
  }

  const publicText = [record.title, record.prompt, record.exclude].filter(Boolean).join("\n");
  RISKY_PATTERNS.forEach((pattern) => {
    if (pattern.test(publicText)) errors.push(`risky wording matched: ${pattern}`);
  });

  if (/exclude\s*:/i.test(record.prompt || "")) errors.push("prompt contains Exclude:");
  if (!/specific artist references/i.test(record.exclude || "")) warnings.push("exclude should include 'specific artist references'");
  if (!/copyrighted melodies/i.test(record.exclude || "")) warnings.push("exclude should include 'copyrighted melodies'");

  if (record.source_type === "external_normalized" && !record.source_url) {
    warnings.push("external_normalized record should include source_url");
  }

  return {
    lineNumber,
    id: record.id || record.title || "",
    errors,
    warnings,
  };
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    usage();
    process.exit(2);
  }

  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
    process.exit(2);
  }

  const parsed = readJsonl(absolutePath);
  const parseErrors = parsed.filter((item) => item.error);
  const records = parsed.filter((item) => item.value);
  const validations = records.map((item) => validateRecord(item.value, item.lineNumber));
  const errorItems = [
    ...parseErrors.map((item) => ({ lineNumber: item.lineNumber, errors: [item.error], warnings: [] })),
    ...validations.filter((item) => item.errors.length),
  ];
  const warningItems = validations.filter((item) => item.warnings.length);
  const duplicateTitles = findDuplicates(records.map((item) => item.value.title).filter(Boolean));

  const summary = {
    file: absolutePath,
    records: records.length,
    parse_errors: parseErrors.length,
    records_with_errors: errorItems.length,
    records_with_warnings: warningItems.length,
    duplicate_titles: duplicateTitles.length,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (errorItems.length) {
    console.error("\nErrors:");
    errorItems.slice(0, 50).forEach((item) => {
      console.error(`line ${item.lineNumber}: ${item.errors.join("; ")}`);
    });
  }

  if (warningItems.length) {
    console.error("\nWarnings:");
    warningItems.slice(0, 50).forEach((item) => {
      console.error(`line ${item.lineNumber}: ${item.warnings.join("; ")}`);
    });
  }

  if (duplicateTitles.length) {
    console.error("\nDuplicate titles:");
    duplicateTitles.slice(0, 50).forEach((title) => console.error(`- ${title}`));
  }

  if (errorItems.length || duplicateTitles.length) process.exit(1);
}

function findDuplicates(values) {
  const seen = new Set();
  const duplicates = new Set();
  values.forEach((value) => {
    const key = String(value).trim().toLowerCase();
    if (!key) return;
    if (seen.has(key)) duplicates.add(value);
    seen.add(key);
  });
  return [...duplicates];
}

main();
