# Incoming Prompt Batches

`incoming/` is the staging area for newly collected prompt material.

Use this area for ChatGPT-generated batches, manual notes, and external-reference research before the data is reviewed and promoted into `data-src/collections/`.

## Rules

- Keep one prompt per line in `.jsonl` files.
- Save raw ChatGPT conversations or copied research notes as `.raw.md`; these files are ignored by git.
- Do not publish copied external prompt text directly.
- Do not leave specific artist names, song names, or "style of" language in public prompt fields.
- Run validation before promoting a batch:

```powershell
node tools\validate-prompt-jsonl.js incoming\chatgpt\20260622-world-pop-001.jsonl
```

## Suggested Names

```text
incoming/
  chatgpt/
    20260622-world-pop-001.raw.md
    20260622-world-pop-001.jsonl
    20260622-world-electronic-001.raw.md
    20260622-world-electronic-001.jsonl
```
