# Prompt JSONL Schema

Use one JSON object per line.

## Required Fields

```json
{
  "source_type": "chatgpt_generated",
  "batch_id": "20260622-world-pop-001",
  "collection": "world-pop-v04",
  "language_region": "global",
  "creator": "KOTA",
  "creator_slug": "kota",
  "creator_tags": ["kota"],
  "category": "Afro Pop",
  "subcategory": "bright percussion pop",
  "title": "Afro Pop Sunshine Groove",
  "prompt": "Create a bright afro-pop track with interlocking hand percussion, warm bass guitar, syncopated guitar stabs, airy group vocals, sunny hook, polished modern mix, BPM: 104, Key: A minor.",
  "exclude": "specific artist references, copyrighted melodies, EDM drop, harsh distortion, overcompressed vocals",
  "bpm": 104,
  "key": "A minor",
  "era_tags": ["2010s"],
  "tags": ["afro-pop", "percussion", "sunny", "groove"],
  "public_safe": true,
  "rights_status": "ai_generated_original",
  "needs_review": false
}
```

## Field Notes

- `source_type`: `chatgpt_generated`, `codex_generated`, `manual_original`, or `external_normalized`.
- `batch_id`: stable batch identifier, usually date + topic + sequence.
- `collection`: future collection slug, such as `world-pop-v04`.
- `language_region`: `global`, `west-africa`, `brazil`, `japan`, `uk`, etc.
- `creator`: optional human creator display name. Use this for KOTA or future contributors.
- `creator_slug`: optional lowercase creator id used by the creator filter, such as `kota`.
- `creator_tags`: optional creator tag list. Keep person tags here instead of mixing them into musical `tags`.
- `prompt`: target 650-900 characters, hard max 1000 characters, no line breaks, and no `Exclude:` block inside the prompt text.
- `exclude`: separate negative instructions.
- `bpm`: number from 40 to 220.
- `key`: musical key if known.
- `era_tags`: optional decade or era influence tags. Use lowercase values from `1950s`, `1960s`, `1970s`, `1980s`, `1990s`, `2000s`, `2010s`, `2020s`, and `retro`. Treat these as production-era influence tags, not claims about a real release date.
- `tags`: lowercase kebab-case strings.
- `public_safe`: must be `true` for public candidates.
- `rights_status`: `ai_generated_original`, `original_normalized`, or `cc0_source_based`.
- `needs_review`: set `true` if the prompt may need manual review before publishing.

## External References

For externally researched material, do not store copied prompt text as public data. Store only notes or normalized original wording:

```json
{
  "source_type": "external_normalized",
  "source_url": "https://example.com/reference",
  "raw_reference_note": "Reference used only for genre vocabulary. Do not publish copied source text."
}
```
