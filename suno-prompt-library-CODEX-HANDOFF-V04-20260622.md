# SUNO AI Prompt Library / Codex 引継ぎファイル
Version: V04
Date: 2026-06-22
Project owner: Tamir Ichikawa
Purpose: Codex に、SunoAI用プロンプト集の収集経緯・現在の成果物・今後の管理サイト化方針を引き継ぐ。

============================================================
1. 最初の目的
============================================================

SunoAI用のプロンプト集を作成したい。
最終的には、以前作成している管理サイトのように、GitHubとFirebaseを使って、プロンプト一覧をWeb上で見られるサイトにしたい。

初期段階では、まずWeb上で公開されている「良いといわれるSunoプロンプト」や、Suno向けに有効なジャンル語彙・構成パターン・スタイル指定の考え方を集めて、後で読み込んで整理できるように、テキストファイル・CSV・JSONL形式で大量に蓄積することを目的とした。

ただし、公開サイト化を見据えて、ブログ・Reddit・Wiki・YouTube解説などの本文を丸ごと転載するのではなく、出典やライセンスを確認しながら、公開用にはできるだけ「ジャンル特徴をもとにしたオリジナル整理版プロンプト」にする方針。

============================================================
2. ここまでの方針変更・ユーザー要望
============================================================

(1) 最初は全ジャンルを広く収集したいという要望だった。

(2) その後、日本語ジャンルはまず不要になった。
    代わりに、海外のロック、特にグルーヴ感のあるロックや、様々なロックのスタイルを集める方針に変更。

(3) さらに次の方向として、Daft Punkのような「電子音だけどグルーヴがある」もの、映画『Drive』のような「80年代の電子音楽っぽいものの現代版」が欲しいという要望が出た。

(4) そのため、次のようなカテゴリに分けて、海外エレクトロ・グルーヴ特化のプロンプト集を作成した。
    - French Touch / Filter House
    - Electro-Funk / Robot Disco
    - Nu-Disco / Indie Dance
    - Synthwave / Outrun / Retrowave
    - Neon Noir Night Drive
    - Darksynth / Cyberpunk Synth
    - Electro-Rock / Bloghouse / French Electro
    - Italo Disco / Space Disco / Eurodisco
    - New Wave / Minimal Wave / Coldwave
    - Electronic Post-Punk / Dance-Punk
    - Synth-Rock / Dreamwave Rock
    - EBM / Industrial Dance Groove
    - Balearic Electro / Cosmic Groove

(5) アーティスト名を公開用プロンプト本文に直接入れるのは避ける方針。
    例：
      NG寄り: Daft Punk style
      公開用に望ましい: French touch, filter house, robot disco, vocoder funk, disco-funk bassline

      NG寄り: Drive soundtrack style
      公開用に望ましい: neon noir synthwave, night drive atmosphere, 80s analog synth soundtrack, pulsing arpeggiated bass

============================================================
3. 現在作成済みのデータセット
============================================================

以下のデータセットを作成済み。
ファイルはChatGPTセッション内の /mnt/data に配置されている。
Codex作業時には、ユーザーがダウンロードしたZIP/TXT/CSV/JSONLをGitHubリポジトリに配置する前提。

------------------------------------------------------------
V01: 全ジャンルスターター版
------------------------------------------------------------
概要:
  最初のDeepResearch由来の初期スターター版。
  幅広いジャンルを対象に、Suno向けのプロンプト構造を整理。

件数:
  117件

主なファイル:
  /mnt/data/suno-prompts-research-start-V01-REPACK-DOWNLOAD-V03-20260621.zip
  /mnt/data/suno-prompts-research-start-V01-MAIN-TEXT-DOWNLOAD-V03-20260621.txt
  /mnt/data/suno-prompts-research-start-V01-MANIFEST-DOWNLOAD-V03-20260621.csv
  /mnt/data/suno-prompts-research-start-V01-MANIFEST-DOWNLOAD-V03-20260621.jsonl

備考:
  最初のリンクがダウンロードできない問題があったため、後で /mnt/data 直下に再パック版として作り直した。

------------------------------------------------------------
V02: 海外ロック特化版
------------------------------------------------------------
概要:
  日本語ジャンルを外し、海外ロックを中心に収集・整理。
  特にグルーヴ感のあるロック、ファンクロック、ブルースロック、ストーナー、デザートロック、ポストパンク、ガレージ、グランジ、マスロック、クラシックロックなどを含む。

件数:
  328件

主なファイル:
  /mnt/data/suno-rock-prompts-overseas-V02-20260621.zip
  /mnt/data/suno-rock-prompts-overseas-V02-20260621/suno-rock-prompts-overseas-V02-20260621.txt
  /mnt/data/suno-rock-prompts-overseas-V02-20260621/top-groove-rock-selection-V02-20260621.txt
  /mnt/data/suno-rock-prompts-overseas-V02-20260621/manifest-rock-prompts-V02-20260621.csv
  /mnt/data/suno-rock-prompts-overseas-V02-20260621/manifest-rock-prompts-V02-20260621.jsonl
  /mnt/data/suno-rock-prompts-overseas-V02-20260621/suno-rock-prompts-V02-20260621.json
  /mnt/data/suno-rock-prompts-overseas-V02-20260621/firestore-schema-rock-prompts-V02-20260621.txt
  /mnt/data/suno-rock-prompts-overseas-V02-20260621/sources-license-notes-V02-20260621.txt

注目カテゴリ:
  - Funk Rock
  - Wah-Wah Groove Rock
  - Pocket Groove Rock
  - Boogie Rock
  - Dance-Punk
  - Desert Rock
  - Stoner Rock
  - Garage Rock
  - Post-Punk
  - Blues Rock
  - Math Rock
  - Grunge

------------------------------------------------------------
V03: 海外エレクトロ・グルーヴ特化版
------------------------------------------------------------
概要:
  Daft Punk的な「電子音だがグルーヴがある」方向と、映画Drive的な「80年代電子音楽の現代版」方向を中心に整理。
  ただし公開用プロンプト本文では、アーティスト名・作品名の直指定を避け、ジャンル語彙・音色・構成・BPM・ミックス指示に分解している。

件数:
  395件

主なファイル:
  /mnt/data/suno-electro-groove-prompts-overseas-V03-20260621.zip
  /mnt/data/suno-electro-groove-prompts-overseas-V03-MAIN-DOWNLOAD-20260621.txt
  /mnt/data/top-electro-groove-selection-V03-DOWNLOAD-20260621.txt
  /mnt/data/manifest-electro-groove-prompts-V03-DOWNLOAD-20260621.csv
  /mnt/data/manifest-electro-groove-prompts-V03-DOWNLOAD-20260621.jsonl
  /mnt/data/suno-electro-groove-prompts-overseas-V03-20260621/README-electro-groove-V03-20260621.md

注目カテゴリ:
  - French Touch / Filter House
  - Electro-Funk / Robot Disco
  - Nu-Disco / Indie Dance
  - Synthwave / Outrun / Retrowave
  - Neon Noir Night Drive
  - Darksynth / Cyberpunk Synth
  - Electro-Rock / Bloghouse / French Electro
  - Italo Disco / Space Disco / Eurodisco
  - New Wave / Minimal Wave / Coldwave
  - Electronic Post-Punk / Dance-Punk
  - Synth-Rock / Dreamwave Rock
  - EBM / Industrial Dance Groove
  - Balearic Electro / Cosmic Groove

============================================================
4. 総件数
============================================================

V01: 117件
V02: 328件
V03: 395件
----------------------
合計: 840件

============================================================
5. Sunoプロンプト作成の基本方針
============================================================

Suno向けには、単にジャンル名を並べるだけではなく、以下の要素をできるだけ含める方針。

- Genre / Subgenre
- BPM or tempo feel
- Groove / rhythm feel
- Drum style
- Bass style
- Guitar or synth texture
- Vocal texture
- Song structure
- Production / mix direction
- Mood / scene / use case
- Exclude / avoid指定

例:

Modern French touch electro-funk with a tight four-on-the-floor groove, rubbery disco bassline, filtered synth chords, compressed kick, vocoder-style backing hooks, clipped rhythm guitar accents, glossy but human feel, 118 BPM, danceable and warm. Exclude: trap drums, EDM drop, Japanese vocals.

Neon noir synthwave rock for a late-night city drive, pulsing analog bass arpeggio, vintage drum machine with gated reverb, glassy polysynth pads, restrained electric guitar textures, cinematic 80s atmosphere with modern low-end, melancholic male vocal, 96 BPM. Exclude: anime style, J-pop, tropical house.

============================================================
6. ライセンス・公開時の注意
============================================================

重要:
  公開サイト化する場合、Web上のプロンプト本文を無断で丸ごと転載するのは避ける。

方針:
  - CC0などライセンスが明確なものは取り込み候補にできる。
  - ブログ・Reddit・Wiki・YouTube・Xなどは、参考元として扱い、本文コピーではなく構造・ジャンル語彙・ノウハウの参考に留める。
  - 公開用データには、なるべくオリジナル整理版プロンプトを載せる。
  - アーティスト名、曲名、作品名、声の模倣を直接要求する表現は避ける。
  - 研究メモ用には reference_note として残してもよいが、公開UIでは非表示にする。

推奨フィールド:
  rights_status:
    - original_normalized
    - cc0_source_based
    - research_reference_only
    - private_note_only

public_safe:
    true / false

============================================================
7. 管理サイト化のおすすめ方針
============================================================

ユーザーはFirebaseのRead数・無料枠を気にしている。
そのため、プロンプト一覧のような読み取り中心データは、Firestoreから全件読むより、静的JSONとしてFirebase Hosting / GitHub Pagesで配信する方が望ましい。

おすすめ構成:

A案: 静的JSON中心
  - GitHubにデータを置く
  - Firebase HostingまたはGitHub Pagesで公開
  - /data/prompts-index.json を一括読み込み
  - Firestoreは使わない、または管理者編集用だけに使う

メリット:
  - Firestore readがほぼ発生しない
  - 無料枠に強い
  - 一覧表示・検索・フィルタが速い

デメリット:
  - Web上で編集した内容を即Firestore反映、という管理機能は別途必要

B案: Firestore編集 + 静的JSON公開
  - 管理者はFirestoreにプロンプトを登録・編集
  - publish処理で静的JSONを生成
  - 一般ユーザー画面は静的JSONのみ読む

メリット:
  - 管理機能と公開表示を分けられる
  - 公開画面のRead数を節約できる

C案: Firestore直接読み込み
  - promptsコレクションを直接読み込む

注意:
  - 840件を1件ずつFirestoreドキュメントとして読むと、初回表示だけで840 readsになりやすい。
  - 今後データが増えると無料枠を圧迫する可能性がある。

現時点のおすすめ:
  B案、または最初はA案。

============================================================
8. 推奨リポジトリ構成
============================================================

suno-prompt-library/
  README.md
  index.html
  style.css
  app.js
  firebase-config.js              // Firebaseを使う場合のみ。公開キーはOKだが秘密情報は置かない。
  /data/
    prompts-index.json             // 公開画面が読むメインデータ
    prompts-index.min.json         // 任意。軽量版
    collections.json               // V01/V02/V03などのコレクション情報
    tags.json                      // タグ一覧
    sources.json                   // 出典メモ。公開範囲に注意
    /import/
      manifest-v01.csv
      manifest-v01.jsonl
      manifest-v02.csv
      manifest-v02.jsonl
      manifest-v03.csv
      manifest-v03.jsonl
  /docs/
    CODEX-HANDOFF-V04-20260622.txt
    license-notes.txt
    firestore-schema-draft.txt
  /tools/
    normalize-import.txt           // 将来、JS/Pythonコードを作る場合は .txt 配布後に .js/.py へリネーム
    build-static-json.txt
  /admin/
    admin.html                     // 後で作る場合
    admin.js                       // 後で作る場合

============================================================
9. 推奨データスキーマ：公開JSON版
============================================================

prompts-index.json の例:

[
  {
    "id": "eg-v03-0001",
    "version": "V03",
    "collection": "overseas_electro_groove",
    "category": "French Touch / Filter House",
    "subcategory": "Electro-Funk / Robot Disco",
    "title": "Modern French Touch Electro-Funk",
    "prompt": "Modern French touch electro-funk with a tight four-on-the-floor groove...",
    "exclude": "trap drums, EDM drop, Japanese vocals",
    "bpm": "118",
    "key": "optional",
    "language": "English",
    "vocal": "vocoder-style backing hooks, optional male vocal",
    "mood": ["danceable", "warm", "retro-future"],
    "tags": ["french-touch", "filter-house", "electro-funk", "robot-disco", "groove"],
    "use_case": ["music demo", "advertising", "night drive", "fashion video"],
    "groove_score": 5,
    "energy": 4,
    "public_safe": true,
    "rights_status": "original_normalized",
    "source_note": "Genre research based; no direct copied prompt text.",
    "created_at": "2026-06-22",
    "updated_at": "2026-06-22"
  }
]

============================================================
10. 推奨Firestore構造
============================================================

Firestoreを使う場合の案:

collections:
  promptCollections/{collectionId}
    name: "Overseas Electro Groove V03"
    version: "V03"
    description: "French touch, synthwave, electro-funk, neon noir..."
    promptCount: 395
    isPublished: true
    createdAt
    updatedAt

  prompts/{promptId}
    id
    version
    collectionId
    category
    subcategory
    title
    prompt
    exclude
    bpm
    key
    language
    vocal
    mood[]
    tags[]
    use_case[]
    groove_score
    energy
    public_safe
    rights_status
    source_note
    reference_note_private
    createdAt
    updatedAt

  tags/{tagId}
    name
    type
    count

  sources/{sourceId}
    title
    url
    source_type
    license_status
    notes
    public_visible

セキュリティ方針:
  - 公開プロンプトをFirestoreから読む場合は read: true でもよいが、read数に注意。
  - 書き込みは admin のみ。
  - reference_note_private は公開UIに出さない。

============================================================
11. 画面仕様案
============================================================

トップ画面:
  - 検索ボックス
  - カテゴリフィルタ
  - タグフィルタ
  - コレクションフィルタ V01 / V02 / V03
  - Groove重視フィルタ
  - BPM範囲フィルタ
  - Energyフィルタ
  - Public Safeのみ表示

一覧カード:
  - タイトル
  - カテゴリ
  - タグ
  - BPM
  - Groove Score
  - Energy
  - 短い説明
  - Copy Promptボタン
  - Detailボタン

詳細モーダル:
  - Prompt本文
  - Exclude
  - Tags
  - Use Case
  - 類似プロンプト
  - Copy Prompt
  - Copy Prompt + Exclude

管理画面は後回しでよい。
まずは静的JSONを読み込んで、検索・フィルタ・コピーができる閲覧サイトを作るのが最短。

============================================================
12. Codexへの初期タスク案
============================================================

Step 1:
  GitHubリポジトリを作成し、最小構成の静的サイトを作る。
  index.html / style.css / app.js / data/prompts-index.json を用意する。

Step 2:
  V01/V02/V03のCSVまたはJSONLを読み込み、統一スキーマの prompts-index.json に変換する。
  重複IDを避けるため、以下のようなIDを付ける。
    v01-0001
    rock-v02-0001
    eg-v03-0001

Step 3:
  一覧表示を実装する。
  まずは全件表示ではなく、初期表示はおすすめ/トップ抽出版でもよい。

Step 4:
  検索・カテゴリフィルタ・タグフィルタを実装する。
  Firestore Read節約のため、初回に静的JSONを1回fetchし、以後はブラウザ側で絞り込む。

Step 5:
  Copy Promptボタンを実装する。
  Prompt本文のみコピー、Prompt + Excludeをコピーの2種類があると便利。

Step 6:
  Firebase Hosting または GitHub Pagesで公開する。
  Firebase Hostingを使う場合でも、Firestoreはまだ使わなくてよい。

Step 7:
  後で管理画面が必要になったら、Firestore編集 + 静的JSON publish方式に拡張する。

============================================================
13. Firestore Read節約メモ
============================================================

このプロジェクトは、プロンプト一覧という読み取り中心のデータである。
840件以上をFirestoreドキュメントとして直接読むと、アクセスごとに大量Readが発生しやすい。

推奨:
  - 一般公開画面は static JSON をfetch
  - Firestoreは管理者編集用だけにする
  - またはジャンル別に bundle JSON を作る

例:
  /data/bundles/rock-v02.json
  /data/bundles/electro-groove-v03.json
  /data/bundles/top-groove.json

これなら、ユーザーが必要なカテゴリだけ読み込める。

============================================================
14. 次に収集すると良いジャンル・用途
============================================================

次に増やすなら、以下が有力。

(1) Cinematic Electronic / Advertising Music
  - 企業広告
  - ファッション映像
  - ゲーム広告
  - 夜景
  - 高級感
  - 疾走感
  - 静かな緊張感

(2) Game Music / Cyberpunk Trailer
  - cyberpunk chase
  - retro arcade synth
  - boss battle electro-rock
  - futuristic racing

(3) Dark Pop / Alternative Electronic
  - moody synth-pop
  - darkwave pop
  - trip-hop influenced electronic
  - nocturnal electro ballad

(4) Groove Rock + Electro Hybrid
  - live drums + synth bass
  - dance-punk
  - electro-rock
  - funk rock with synths
  - industrial groove rock

============================================================
15. Codexに注意してほしいこと
============================================================

- ユーザーは日本語で作業しているため、UI文言は日本語が望ましい。
- ただしプロンプト本文は海外ジャンル中心なので英語が基本。
- 公開用プロンプト本文に、特定アーティスト名や曲名をなるべく入れない。
- private reference note はUIに表示しない。
- ダウンロード用のコードファイルをChatGPT経由で渡す場合、ユーザー要望により .js などではなく .txt 拡張子で配布し、ダウンロード後にリネームする説明を付ける。
- 生成ファイル名は過去と被らないように、必ず V番号や日付を付ける。
- Firebase/Firestoreを使う修正では、必ずRead数・無料枠への影響を説明する。

============================================================
16. 最終的な理想形
============================================================

Suno Prompt Library として、以下ができるWebサイト。

- プロンプトをカテゴリ別に一覧表示
- キーワード検索
- ジャンル・タグ・BPM・ムード・用途で絞り込み
- 気に入ったプロンプトをすぐコピー
- Exclude込みでコピー
- トップおすすめを表示
- 将来的に管理画面から追加・編集
- Firestore Readをできるだけ増やさない
- 公開用としてライセンス・権利面に配慮した安全なプロンプト本文を表示

============================================================
17. 重要な引継ぎまとめ
============================================================

現在の成果:
  V01: 全ジャンルスターター 117件
  V02: 海外ロック特化 328件
  V03: 海外エレクトロ・グルーヴ特化 395件
  合計 840件

今の最優先:
  これらのCSV/JSONLを統一スキーマにまとめ、静的JSONで見られる管理サイト風のプロンプト一覧ページを作る。

おすすめ実装:
  まずはFirestoreなしの静的サイト。
  後でFirestore管理画面を追加。

特に大事な方針:
  Daft PunkやDriveのような方向性は、公開用には名前を直接出さず、French touch / electro-funk / synthwave / neon noir / night drive などの音楽的特徴に分解して扱う。
