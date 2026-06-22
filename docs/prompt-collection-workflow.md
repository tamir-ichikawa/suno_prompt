# Prompt Collection Workflow

Goal: collect many Suno prompt candidates from around the world while keeping the public site static, public-safe, and free of Firestore reads.

## Recommended Order

1. Build a genre map.
2. Generate ChatGPT or Codex batches by genre, region, BPM range, vocal type, and use case.
3. Store raw ChatGPT output in `incoming/chatgpt/*.raw.md` and machine-readable output in `incoming/chatgpt/*.jsonl`; store Codex-generated machine-readable batches in `incoming/codex/*.jsonl`.
4. Validate JSONL with `tools/validate-prompt-jsonl.js`.
5. Review unsafe wording manually.
6. Promote reviewed JSONL into `data-src/collections/`.
7. Later, wire reviewed collections into the static JSON build.

## Tool Split

ChatGPT is best for:

- large batch generation
- world genre coverage
- rewriting artist references into genre, instrumentation, groove, production, BPM, key, and exclude wording
- brainstorming tags and categories

Codex is best for:

- direct batch generation when the project needs repo-ready JSONL immediately
- storing files in the repo
- validating JSONL
- normalizing data
- removing duplicates
- regenerating static JSON
- checking the website

## Public Safety Rules

Public prompt fields must avoid:

- specific artist names
- specific song names
- "in the style of"
- "sounds like"
- requests to imitate a living artist or copyrighted recording

Use descriptive musical language instead:

- genre and subgenre
- tempo and key
- instruments
- groove and drum pattern
- production texture
- vocal type without naming a singer
- arrangement structure
- exclude terms
