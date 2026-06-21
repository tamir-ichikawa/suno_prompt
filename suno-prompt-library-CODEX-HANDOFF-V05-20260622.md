# SUNO AI Prompt Library / Codex 引継ぎファイル

Version: V05  
Date: 2026-06-22  
Project owner: Tamir Ichikawa  
Workspace: `E:\codex\dev\suno_prompt`

## 1. プロジェクトの目的

Suno AI用プロンプト集を、Web上で検索・絞り込み・コピーできる公開サイトにする。

最初の重要方針は、Firestoreから毎回大量に読む構成にしないこと。公開画面は静的JSONを中心にし、Firestore Read数を節約する。管理画面・編集機能・Firebase/Firestore連携は後から追加する。

公開用プロンプトでは、特定アーティスト名・特定楽曲名・作品名を直接使わず、ジャンル、音質、楽器、構成、グルーヴ、BPM、Exclude指定などで表現する。

## 2. 作成済みプロンプト集

現在の元データは以下。

- V01: 全ジャンルスターター版、117件
- V02: 海外ロック特化版、328件
- V03: 海外エレクトロ・グルーヴ特化版、395件
- 合計: 840件

V03は、French touch、filter house、robot disco、synthwave、neon noir、night driveなどの語彙で、電子音楽・グルーヴ・80年代的シンセ感を表現している。

## 3. 現在の実装状態

静的JSON中心の最小サイトを実装済み。

追加・更新された主要ファイル:

```text
index.html
style.css
app.js
README.md
.gitignore
.nojekyll
tools/
  build-static-json.js
  static-server.js
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
```

実装済み機能:

- `data/prompts-index.min.json` をfetchして一覧表示
- Firestore不使用、公開画面のFirestore Readは0
- キーワード検索
- コレクションフィルタ
- カテゴリフィルタ
- タグフィルタ
- BPM min/max
- Groove min
- Energy min
- Public Safeのみ表示
- おすすめのみ表示
- 並び替え
- Promptコピー
- Prompt + Excludeコピー
- 詳細モーダル
- 類似プロンプト表示

## 4. データ生成

元データのJSONLを統一スキーマに変換するツールを作成済み。

実行コマンド:

```powershell
node tools\build-static-json.js
```

生成結果:

```text
Generated 840 public prompts
Collections: 全ジャンルスターター 117, 海外ロック 328, 海外エレクトロ・グルーヴ 395
Top picks: 17
```

データ検査結果:

```json
{
  "count": 840,
  "uniqueIds": 840,
  "risky": 0,
  "promptContainsExclude": 0
}
```

意味:

- 公開プロンプト840件
- ID重複なし
- 公開プロンプト本文に、避けたい固有表現・模倣表現の検出なし
- `Exclude:` は本文から分離済み

## 5. GitHub Pagesについて

ユーザーはGitHubに入れた。

GitHub Pages設定画面で、以下の表示が出た。

```text
Upgrade or make this repository public to enable Pages
```

原因:

- リポジトリがPrivateだったため
- GitHub Freeでは、GitHub Pages公開にはPublicリポジトリが必要
- Private Pagesは有料/Enterprise系が必要

ユーザー方針:

- 必要な情報は後でFirebaseに入れればよい
- 一旦公開されていてもよい

そのため、次の対応でOK。

1. GitHub repo の `Settings`
2. 左メニュー `General`
3. 下部 `Danger Zone`
4. `Change repository visibility`
5. `Change to public`
6. その後 `Settings > Pages`
7. `Source`: `Deploy from a branch`
8. `Branch`: `main`
9. Folder: `/(root)`
10. `Save`

想定URL:

```text
https://tamir-ichikawa.github.io/suno_prompt/
```

`.nojekyll` は追加済み。GitHub Pagesで余計なJekyll処理を避けるための保険。

## 6. ローカル確認

ローカルサーバー:

```powershell
node tools\static-server.js
```

URL:

```text
http://127.0.0.1:5173/
```

検証済み:

- `/` がHTTP 200
- `/data/catalog.json` がHTTP 200
- `/data/prompts-index.min.json` が840件として読み込める
- `node --check app.js` OK
- `node --check tools\build-static-json.js` OK
- `node --check tools\static-server.js` OK

注意:

- この作業時点では通常の `git` コマンドがPATHになかった
- Codex bundled runtimeにはGitがあったが、このフォルダはGit repositoryとして認識されなかった
- そのため、コミット状態はCodex側では確認できていない

## 7. GitHubにpushすべきもの

最低限、以下はGitHubに入れる。

```text
index.html
style.css
app.js
README.md
.nojekyll
.gitignore
data/
tools/
```

公開サイトとして不要または注意が必要なもの:

- 引継ぎメモ類は公開してもよいならそのままでOK
- 研究メモやprivate reference noteが将来増える場合は公開リポジトリに入れない
- Firebase秘密鍵やサービスアカウントJSONは絶対に入れない

## 8. Firebase / Firestoreの今後の最適構成

現時点ではFirestoreは使わない。

将来的な理想構成:

```text
Public site:
  GitHub Pages or Firebase Hosting
  data/*.json をfetch
  Firestore Read 0

Admin:
  Firebase Auth
  Firestore
  管理者だけ追加・編集

Publish:
  Firestoreの内容を静的JSONに変換
  data/prompts-index.min.json などを更新
  公開画面は静的JSONだけ読む
```

Firestore直接読み込みは避ける。

理由:

- 840件をFirestoreドキュメントとして毎回読むと、初回表示だけで840 reads相当になりやすい
- 今後件数が増えるほど無料枠を圧迫する
- 公開一覧は読み取り中心なので静的JSONのほうが向いている

## 9. 次にやること

優先順:

1. GitHubリポジトリをPublicにする
2. `Settings > Pages` で `main / /(root)` を設定する
3. 公開URL `https://tamir-ichikawa.github.io/suno_prompt/` を開いて表示確認する
4. もし表示されない場合は、ActionsのPages deployログ、ファイル配置、URLパスを確認する
5. 公開後、スマホ表示とコピー機能を確認する
6. 必要ならUI調整
7. その後、Firebase HostingにするかGitHub Pages継続か決める
8. 管理画面は後回し

## 10. 新スレッドでCodexに依頼するとよいこと

新スレッドでは、このファイルを最初に読ませる。

読むファイル:

```text
E:\codex\dev\suno_prompt\suno-prompt-library-CODEX-HANDOFF-V05-20260622.md
```

次スレッドでは、まずGitHub Pages公開後のURL確認、404やJSON fetch失敗の調査、表示崩れの修正をお願いするとよい。

## 11. 新スレッド用コピペ文面

```text
以下の引継ぎファイルを読んで、Suno AI用プロンプト管理サイトの開発を引き継いでください。

E:\codex\dev\suno_prompt\suno-prompt-library-CODEX-HANDOFF-V05-20260622.md

現在は、Firestoreを使わず、静的JSON中心の最小サイトが実装済みです。
GitHubには入れました。GitHub Pagesで公開するため、一旦リポジトリをPublicにして、Settings > Pages で main / /(root) を設定する方針です。

まずは引継ぎファイルを読んで、現在の実装状態・データ構造・GitHub Pages公開手順・次に確認すべきことを整理してください。
その後、公開URLで表示確認し、404、JSON fetch失敗、パス問題、スマホ表示崩れ、コピー機能の不具合があれば修正してください。

重要:
- Firestoreはまだ使わない
- 公開画面は静的JSON中心
- Firestore Readを増やさない
- 管理画面は後回し
- 公開用プロンプトでは、特定アーティスト名や特定楽曲名を直接使わず、ジャンル・音質・楽器・構成・グルーヴ・BPM・Exclude指定などで表現する
```
