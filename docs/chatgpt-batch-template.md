# ChatGPT Batch Template

Use this prompt in ChatGPT when generating a new batch.

```text
Suno AI用の公開プロンプト候補をJSONLで作ってください。

目的:
- 世界中の音楽ジャンルを幅広く集める
- 特定アーティスト名、特定楽曲名、作品名は使わない
- "in the style of", "sounds like", "voice of" などの模倣表現は使わない
- ジャンル、音質、楽器、構成、グルーヴ、BPM、Key、Exclude指定で表現する

今回のテーマ:
- Collection: world-pop-v04
- Batch ID: 20260622-world-pop-001
- 対象: Afro pop, amapiano pop, Brazilian funk pop, Latin alt-pop, Balkan brass pop, Arabic electronic pop, Caribbean dance pop, Nordic folk pop, Southeast Asian indie pop
- 件数: 50件

出力形式:
- JSONLのみ
- 1行に1 JSON object
- Markdownのコードブロックは使わない
- 説明文は出さない

必須フィールド:
source_type, batch_id, collection, language_region, category, subcategory, title, prompt, exclude, bpm, key, tags, public_safe, rights_status, needs_review

固定値:
- source_type: chatgpt_generated
- batch_id: 20260622-world-pop-001
- collection: world-pop-v04
- public_safe: true
- rights_status: ai_generated_original
- needs_review: false

tags:
- lowercase kebab-case
- 4-8個

prompt:
- Sunoにそのまま貼れる英語
- 目標は650-900 characters
- 最大1000 characters以内。スペース、句読点、改行も文字数に含める
- JSONLの1行を壊さないため、promptフィールド内に改行は入れない
- 4-7文程度で、短すぎる箇条書き風にしない
- BPMとKeyを必ず含める
- genre/subgenre, groove, drums, bass, main instruments, vocal tone, arrangement, production texture, mix/mastering feel を具体的に書く
- intro, verse, pre-chorus, chorus, bridge/drop/breakdown, outro など構成の流れを入れる
- Exclude指定はprompt本文に入れず、excludeフィールドに分離する
- アーティスト名や曲名は入れない

exclude:
- specific artist references, copyrighted melodies を必ず含める
- そのジャンルに不要な音色や崩れやすい要素も入れる

出力前チェック:
- 各promptが650-900 characters程度になっているか確認する
- 1000 charactersを超えそうなら、重複表現を削って900 characters前後に収める
- prompt内に改行、"Exclude:"、アーティスト名、曲名、模倣表現がないか確認する
```

After ChatGPT returns JSONL, save it as:

```text
incoming/chatgpt/20260622-world-pop-001.jsonl
```

Then run:

```powershell
node tools\validate-prompt-jsonl.js incoming\chatgpt\20260622-world-pop-001.jsonl
```
