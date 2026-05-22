# AI Web Studio Pro — Vendor-Agnostic Agentic Build

このZIPは、既存のAI Web Studioをベースに、複数AIベンダー、Cloudflare Worker移行、複数ファイル編集・公開、README生成、リモートテンプレート配信、多言語UIに対応させた修正版です。

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
