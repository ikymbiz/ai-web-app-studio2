# AI Web Studio Pro — Vendor-Agnostic Agentic Build

このZIPは、既存のAI Web Studioをベースに、複数AIベンダー、Cloudflare Worker移行、複数ファイル編集・公開、README生成、リモートテンプレート配信、多言語UIに対応させた修正版です。

## v29.3 修正（2026-05-25）— ペルソナ先行 / MVP直接生成 / UIレビューモーダル廃止

ユーザー要求 5項目に対応しました。

1. **最初にターゲットペルソナを確認しセット**: チャット冒頭でペルソナ未設定なら、AIが必ず `id="persona"` の確認質問を出します。回答はモーダル適用時に `target-persona` 欄へ自動保存され、`updatePromptPreviews()` と `autoSaveSettings()` が走ります。設定済みなら再確認しません。
2. **UI/UX分岐質問のみ実施**: ペルソナ確認とあわせて、レイアウト傾向・配色トーン・ナビゲーション形式・操作感・入力スタイルなど、UI/UX・使い勝手の分岐に関する質問を1〜2問だけ出します。
3. **基本機能は質問しない**: CRUD、データ保存、ログイン、言語切替、テーマ切替、レスポンシブ、PWA、最低限のエラー処理、空状態、`README.md` と `plan_log.md` の同梱などは既定で含め、質問しません。
4. **最初の出力は実際に動くMVP**: 旧「⚡️ コードを作成」ボタンは静的UIモック生成 (`generateUiFirstReview`) を呼んでいましたが、これを `generateCode()`（コード生成AI → 検証 → プレビュー前レビュー → プレビュー の通常フロー）の直接呼び出しに変更。コアな入力→処理→保存/表示まで含めたMVPを最初の生成で出力します。
5. **UIデザイン確認モーダルを廃止**: `ui-review-modal` のHTML、関連JS（`showUiReviewModal`、`approveUiReviewAndGenerateCore`、`requestUiRevisionFromReview`、`generateUiFirstReview`、`generateCoreLogicFromApprovedUi` 等）を削除し、互換のため呼び出しは安全な no-op スタブまたは `generateCode()` への薄いエイリアスとして残しています。`runPreviewDebugRequest` の `isUiReviewRevision` 分岐も削除し、通常のデバッグフローに統一しました。なお、検証完了後の「プレビュー前レビュー」モーダル（`preview-review-modal`）は別物で、これは維持しています。

### 変更ファイル

- `prompts.json`: `_version` を `v29-3-persona-first-mvp` に更新、`plan` プロンプトをペルソナ先行＋UI/UX分岐＋MVP前提に再記述。
- `index.html`:
  - `buildRequirementFlowInstruction()`: ペルソナ有無で分岐し、未設定時は `id="persona"` の質問を強制、設定済みなら再確認しない指示に変更。
  - `applyOptionsModalAnswers()`: 質問グループの `id="persona"` または質問文がペルソナ系キーワードを含む場合、回答を `target-persona` 欄に自動保存。「その他: 自由入力」のプレフィックスを除去。既存値があれば上書きしない。
  - 「⚡️ コードを作成」ボタンの `onclick` を `generateUiFirstReview()` → `generateCode()` に変更（フローティングボタン・チャット内動的ボタンの2か所）。
  - `ui-review-modal` のHTMLブロックを削除。
  - 旧UI先行レビュー関連の関数群を no-op スタブまたは `generateCode()` エイリアスに置換。
  - `runPreviewDebugRequest()` から `isUiReviewRevision` 分岐を削除。
- `sw.js`: `CACHE_NAME` を `v29-3-persona-first-mvp` に更新。
- `CHAT_FAILURE_LOG.md`: 今回の修正を追記。

### 後方互換性

- `generateUiFirstReview` / `generateCoreLogicFromApprovedUi` は `generateCode()` への薄いエイリアスとして残置したため、旧ブックマークレットや永続化された workflow state からの再実行も壊れません。
- `uiFirstGenerateButton`、`uiReviewModalTitle` などのi18nラベルは未使用のまま残置（削除すると失敗ログのルール「未指示の削除を行わない」に反するため）。

---

## 今回の追加修正（2026-05-23）

- Android/狭幅画面でコード画面のファイルタブと操作ボタンが重ならないよう、ツールバーとファイルタブを2段レイアウトへ変更。
- GitHub Personal Access Token（PAT）を設定画面の「セキュリティ」から登録・検証できるように追加。
- APIキー管理モーダルからもGitHub PATを登録できるように追加。
- GitHubデプロイ処理を強化。
  - GitHub REST APIヘッダーを共通化。
  - リポジトリ一覧取得のエラー表示を追加。
  - 選択リポジトリの既定ブランチを自動設定。
  - 既存GitHub Pagesがある場合は作成ではなく更新を試行。
  - ファイルpush失敗時にHTTPステータスとGitHubメッセージを表示。
- 英語切替時に日本語が残る問題を修正し、主要UIラベルの英語辞書を追加。
- 言語ボタンに加えて、今後の多言語追加を想定した表示言語セレクタを追加。
- Service Workerのキャッシュ名を更新し、旧UIが残りにくいように変更。


## v3.2 修正メモ（質問グループ選択 / プロンプト厳格化）

- AI応答から選択肢を抽出する処理を、フラットな選択肢配列ではなく「質問グループ」として扱うように変更しました。
- 例: 「ターゲットユーザー」「主要機能」「重視したい点」の3問がある場合、1つのモーダルにまとめず、1問ずつステップ式に表示します。
- 主要機能など複数回答が自然な質問は複数選択に対応しました。
- 「その他」は各質問で自由入力できます。
- `prompts.json` を厳格版に更新し、勝手な削除・省略・解釈・未検証の修正済み主張を禁止する内容に強化しました。
- ローカルファイル起動などで `prompts.json` が読めない場合に備え、`index.html` 内のfallbackプロンプトも同じ内容へ同期しました。
- このチャットでの失敗と再発防止策を `CHAT_FAILURE_LOG.md` に記録しました。

## 主な機能

- モデル指定を `provider:model-id` 形式に統一
- Gemini / OpenAI / Claude / xAI / Groq / Custom OpenAI互換 / Cloudflare Worker経由に対応
- APIキー登録を専用モーダルへ分離
- プルダウン式のAIプロバイダー・モデル選択を廃止し、手入力式へ変更
- プロンプトテンプレートごとに異なるモデルルートを指定可能
- Cloudflare WorkerへAPIキーとシステムプロンプトを移すためのサンプルを追加
- コード生成を「生成 → 検証 → 1回自己修復」のエージェンティック設計へ変更
- 複数ファイルの読み込み・編集・保存・GitHubデプロイに対応
- README.md自動生成機能を追加
- リモートテンプレート配信URLに対応
- `paid:true` テンプレートの課金ロック表示に対応
- 日本語 / 英語UI切替に対応

## ファイル構成

```text
.
├── index.html                 # 修正版フロントエンド本体
├── prompts.json               # プロンプト定義
├── sw.js                      # Service Worker
├── cloudflare-worker.js       # Cloudflare Workerサンプル
├── templates/
│   └── catalog.example.json   # リモートテンプレート配信例
├── IMPLEMENTATION_PLAN.md     # 修整計画
├── VERIFICATION_REPORT.md     # 検証レポート
└── CHAT_FAILURE_LOG.md        # このチャットの失敗ログ
```

## ローカルでの起動

ブラウザのService Workerやfetch制約を避けるため、ローカルサーバーで起動してください。

```bash
python3 -m http.server 8080
```

その後、ブラウザで次を開きます。

```text
http://localhost:8080/index.html
```

## モデルルートの指定例

設定画面の「チャットモデル」「コード生成モデル」、またはプロンプトテンプレート編集モーダルの「使用モデル」に次の形式で入力します。

```text
gemini:gemini-2.5-flash
openai:gpt-4o
claude:claude-sonnet-4-20250514
xai:grok-3
groq:llama-3.3-70b-versatile
custom:your-model-id
server:gemini:gemini-2.5-flash
```

`custom:` はOpenAI Chat Completions互換API用です。APIキー管理モーダルでCustom Base URLを設定してください。

## APIキー / GitHub PAT登録

設定画面の「APIキーを登録 / 管理」ボタンから専用モーダルを開き、利用するベンダーのキーを入力します。

GitHub PATは次の2か所から登録できます。

1. 設定 > セキュリティ > GitHub Personal Access Token
2. APIキー管理モーダル内の GitHub Personal Access Token

Fine-grained PATでGitHubデプロイとPages有効化を行う場合の目安は以下です。

- Contents: Read and write
- Pages: Read and write
- Administration: Read and write
- Metadata: Read

既にGitHub Pages設定済みのリポジトリへファイルだけpushする場合は、Contents: Read and write が中心になります。Pagesの作成・更新もアプリから行う場合はPages/Administration権限が必要です。

本番運用ではクライアントにAI APIキーを保存せず、Cloudflare Worker側の環境変数へ移すことを推奨します。

## Cloudflare Workerでのサーバー側移行

`cloudflare-worker.js` をWorkerとしてデプロイします。

### 環境変数

使うベンダーだけ設定してください。

```text
GEMINI_API_KEY
OPENAI_API_KEY
ANTHROPIC_API_KEY
XAI_API_KEY
GROQ_API_KEY
CUSTOM_API_KEY
CUSTOM_BASE_URL
SYSTEM_PROMPT
DEFAULT_MODEL_ROUTE
TEMPLATE_CATALOG_JSON
```

### フロント側設定

AI Web Studioの設定画面で、Cloudflare Worker API Endpointに次を設定します。

```text
https://<your-worker>.<subdomain>.workers.dev/api/ai
```

リモートテンプレート配信をWorkerで行う場合は、テンプレート配信URLに次を設定します。

```text
https://<your-worker>.<subdomain>.workers.dev/api/templates
```

## GitHubデプロイ

1. エディタで複数ファイルを読み込みます。
2. 「🚀 公開」を押します。
3. GitHub PATを入力、または設定済みのPATを使います。
4. 既存リポジトリまたは新規リポジトリを選びます。
5. README欄は自動生成されます。必要に応じて編集します。
6. 公開実行で、複数ファイルとREADME.mdがpushされます。
7. 「GitHub Pagesを有効化」がONの場合、Pagesの作成または更新も試行します。

## デプロイは本当にできるか

コード上は、GitHub Contents APIで複数ファイルをpushし、GitHub Pages APIでPages設定を作成または更新する実装です。したがって、PAT権限、リポジトリ権限、ブランチ保護、GitHub Pagesの利用可否が満たされれば実際に公開できます。

失敗する主なケースは以下です。

- PATにContents write権限がない。
- Pagesを有効化するのに必要なPages/Administration権限がない。
- 対象ブランチが保護されていて直接pushできない。
- 組織リポジトリでPages利用が制限されている。
- ブラウザやネットワークがGitHub API呼び出しをブロックしている。

## テンプレート配信JSON

`templates/catalog.example.json` を参考にしてください。

`paid:true` のテンプレートはロック表示になります。実決済処理は未接続のため、決済完了後に `paidTemplateEntitlements` へIDを追加する処理を組み込んでください。

## 検証

検証内容は `VERIFICATION_REPORT.md` に記録しています。


## v3 修正メモ（モバイルUI / 多言語）

- Android Chrome でソフトキーボード表示時に上部タブやチャット入力欄が見切れないよう、`visualViewport` に基づく `--app-height` 制御を追加しました。
- 入力中は下部の「コードを作成」フローティングボタンを一時的に非表示にして、チャット入力欄の表示領域を確保します。
- 言語切り替えUIはボタン併用を廃止し、プルダウンのみになりました。
- i18next は任意数の言語リソースを扱えます。ただしライブラリ自体が文章を自動翻訳するわけではないため、追加言語は `prompts.json` の `ui: { "言語コード": { ... } }` 形式、または今後の言語パック配信で追加します。

## v3.3 修正メモ（ZIP/複数添付・設定画面分割）

- チャット添付で複数ファイルを選択できるようにしました。
- チャット添付で `.zip` を選択できるようにし、ZIP内のテキスト系ファイルを読み取ってAIへの文脈に追加します。
- 画像は複数添付時もマルチモーダル入力として送信します。
- コード読込で `.zip` を受け付け、ZIP内のHTML/CSS/JS/JSON/Markdown等のテキスト系ファイルをプロジェクトファイルとして展開します。
- 設定画面を以下の画面に分割しました。
  - ペルソナ・ユーザー指示・モデル設定
  - APIキーの設定
  - 管理用システムプロンプト
  - 管理用Skill設定
  - デプロイ用設定
  - 保存先設定
  - 開発補助設定（既存のテーマ・テンプレート機能を保持）
- 管理用システムプロンプト画面に「プリンシプル」「システム要件」「実装検証用」を追加しました。
- ユーザー用システムプロンプトは管理用システムプロンプトとは別項目として保存し、PLAN/BUILD時に追加指示として反映します。
- `prompts.json` に追加項目の初期値を追加しました。


## AI外部記憶 / docs

このアプリ自身にも以下の docs ファイルを同梱しています。次のAIや開発者は最初に読む前提です。

- `docs/PRINCIPLE.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/SYSTEM_DESIGN.md`
- `docs/FAILURE_LOG.md`
- `docs/HANDOVER.md`

## 生成アプリの最小ドキュメント

AI Web Studio Pro で生成するアプリには、最小ドキュメントとして次の2ファイルを必ず含めます。

- `README.md` アプリ概要
- `plan_log.md` 実装計画・進捗・教訓

その他のフォルダ構成（`docs/`, `src/`, `config/`, `.github/` など）は規模に応じて任意です。小規模アプリは単一HTMLでも構いません。

AI Web Studio Pro 本体自身は別途、`docs/` 5本、`tasks/`、`src/`、`config/`、`.github/` を従来通り保持します（本体の運用文書）。


## 管理設定の開発ルール

管理画面の「開発ルール」には、AI-Only Operations、齟齬検証、HANDOVER運用、標準フォルダ構造、コスト制約を保存します。コード生成AI、デバッグAI、検証AIはこの設定値を共通制約として参照します。

## v20 変更点

- プレビューは、コード生成直後ではなく、検証AIの実行とタスク消込が完了した後の「プレビュー前レビュー」モーダルでユーザーが確認してから表示します。
- 長時間処理中はチャットに Planner / Coder / Debugger / Verifier / Bug Analyst / Reviewer / Handover の進行ログを表示します。
- タスクモーダルの進行タブに、担当エージェント名、処理段階、結果を保存します。
- 中断、エラー、ブラウザ更新前に docs/HANDOVER.md とローカル保存へ現在状態を残し、再開に必要な情報を保持します。
