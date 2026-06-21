# Suno Prompt Library

Suno AI用プロンプトを、静的JSON中心で検索・絞り込み・コピーできる最小サイトです。

## 方針

- 公開画面は `data/prompts-index.min.json` を1回fetchしてブラウザ側で検索します。
- Firestoreは初期実装では使いません。公開画面のFirestore Readは0です。
- 管理画面やFirestore編集機能は、後から「Firestoreで編集 -> 静的JSONへpublish」の形で追加する想定です。
- 公開用プロンプト本文では、特定アーティスト名や特定楽曲名を直接使わず、ジャンル、音質、楽器、構成、グルーヴ、BPM、Exclude指定で表現します。

## ファイル構成

```text
index.html
style.css
app.js
data/
  catalog.json
  collections.json
  tags.json
  prompts-index.json
  prompts-index.min.json
  bundles/
    v01.json
    rock-v02.json
    electro-groove-v03.json
    top-picks.json
tools/
  build-static-json.js
```

## データ再生成

```powershell
node tools\build-static-json.js
```

## 大量収集ワークフロー

ChatGPTで生成した新規バッチは、まず `incoming/chatgpt/*.jsonl` に保存します。公開用に昇格する前に検査します。

```powershell
node tools\validate-prompt-jsonl.js incoming\chatgpt\20260622-world-pop-001.jsonl
```

詳しい手順:

- `docs/prompt-collection-workflow.md`
- `docs/chatgpt-batch-template.md`
- `docs/prompt-jsonl-schema.md`

作成者が分かっているプロンプトは、音楽タグではなく `creator` / `creator_slug` / `creator_tags` に入れます。サイト側では「作成者」フィルターで絞り込みます。

KOTAのアップロード済みプロンプトを再取り込みする場合:

```powershell
node tools\import-kota-prompts.js path\to\pasted-text.txt
node tools\build-static-json.js
```

## ローカル確認

JSONをfetchするため、`file://` ではなくローカルサーバー経由で開きます。

```powershell
node tools\static-server.js
```

その後、`http://127.0.0.1:5173/` を開きます。
