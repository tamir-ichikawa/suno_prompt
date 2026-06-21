# Reviewed Source Data

`data-src/` is the reviewed source layer between collection and publication.

Only promote files here after they pass the JSONL validator and a human review for public-safe wording.

## Flow

```text
incoming/chatgpt/*.jsonl
  -> validate
  -> review
  -> data-src/collections/*.jsonl
  -> future static JSON build
  -> data/prompts-index.min.json
```

The public site should continue to read static JSON only. Firestore is not part of this collection workflow.

## Collection Files

Use one collection file per batch family:

```text
data-src/collections/world-pop-v04.jsonl
data-src/collections/world-electronic-v04.jsonl
data-src/collections/world-regional-v04.jsonl
data-src/collections/world-cinematic-v04.jsonl
```

Each line should follow the schema in `docs/prompt-jsonl-schema.md`.
