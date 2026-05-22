# 検証レポート

## 検証項目

| No | 要件 | 検証結果 |
|---:|---|---|
| 1 | どのベンダーのモデルでも使える構造 | `provider:model-id` 形式に統一。Gemini / OpenAI / Claude / xAI / Groq / Custom OpenAI互換 / Cloudflare Workerを実装。 |
| 2 | システムプロンプトごとにベンダーが違ってもよい | プロンプト編集モーダルのモデル欄を手入力式にし、プロンプト別 `modelOverrides` を保持。 |
| 3 | APIキーは別モーダルで登録 | `api-key-modal` を追加し、設定画面から開く形に変更。 |
| 4 | プルダウン不要 | AIプロバイダー・モデル・プロンプト別モデルのselectを廃止し、手入力欄に変更。 |
| 5 | システムプロンプトをサーバー側へ移せる | `cloudflare-worker.js` とWorker Endpoint入力欄を追加。Worker側 `SYSTEM_PROMPT` を利用可能。 |
| 6 | エージェンティックに動く設計 | コード生成時に生成→検証→1回自己修復する `runAgenticCodeBuild()` を追加。 |
| 7 | 画面テンプレートを事後配信 | `template-catalog-url` と `loadRemoteTemplates()` を追加。JSONカタログから読み込み可能。 |
| 8 | 一部テンプレート課金式 | `paid:true` のテンプレートにPAIDバッジとロックを表示。決済連携の差し込み点を用意。 |
| 9 | README作成機能 | `generateProjectReadme()` を追加し、GitHubデプロイ時に `README.md` をpush。 |
| 10 | 複数ファイル取り扱い | 複数ファイルアップロード、ファイルタブ、IndexedDB保存を追加。 |
| 11 | 複数ファイルデプロイ | `pending_deploy.files` をGitHub Contents APIで順次push。 |
| 12 | タブが重なって見えない問題 | `.editor-actions` のabsolute配置を廃止し、操作ボタン段とファイルタブ段を分離。横スクロールとflex-shrink抑制を追加。 |
| 13 | GitHub PATを登録可能にする | 設定 > セキュリティにPAT入力欄と検証ボタンを追加。APIキー管理モーダルにもPAT入力欄を追加。 |
| 14 | GitHubデプロイの実用性 | 共通GitHub APIヘッダー、リポジトリ既定ブランチ設定、Pages create/update、pushエラー詳細表示を追加。 |
| 15 | 英語切替で英語表示 | `ensureEnglishLabels()` に主要UI英語辞書を追加し、`data-placeholder-label` によるplaceholder翻訳も実装。 |
| 16 | 多言語選択 | 言語ボタンに加え、表示言語セレクタを追加。 |

## 実行した静的検証

- HTML内の `<script>` を抽出し、`node --check app-script.js` 相当の構文検証を実行。
- `node --check sw.js` を実行。
- `node --check cloudflare-worker.js` を実行。
- `prompts.json` を `python3 -m json.tool` で検証。
- `getElementById()` の静的ID参照について、HTML内に存在することを確認。
- AIプロバイダー・モデル・プロンプト別モデルに旧selectが残っていないことを確認。
- `id` 重複を確認。テンプレート文字列内の動的IDを除き、実DOM用IDの重複なし。

## 検証時に修正したバグ

- README生成関数内の改行文字列がテンプレートリテラル内で構文エラーになる問題を修正。
- Workerの `server:` ルートを `DEFAULT_MODEL_ROUTE` へ委譲できるように修正。
- 複数ファイル状態保存時に現在エディタ内容が失われないよう `syncCurrentEditorFile()` を追加。
- 英語辞書追加時の日本語UIオブジェクト末尾カンマ不足によるJavaScript構文エラーを修正。
- GitHub API呼び出しのヘッダー指定を共通関数化し、直接push/Pages更新の失敗理由を表示するよう修正。

## 残課題

- 課金テンプレートの実決済処理は未接続。現在はロック表示と解除ポイントのみ実装。
- ブラウザから各ベンダーAPIを直接呼ぶ場合、ベンダー側CORS制約を受ける可能性がある。本番はCloudflare Worker経由を推奨。
- 複数ファイルのブラウザ内ZIPダウンロードは未実装。現状の保存ボタンは現在開いているファイルを保存する。
- GitHub Pagesの作成・更新はPAT権限や組織ポリシーに依存するため、UIでエラーを返す設計としている。


## v3 追加検証

- Android Chrome のソフトキーボード表示を想定し、`visualViewport` 連動の高さ制御、入力欄フォーカス時の `keyboard-open` クラス付与、チャットログ末尾スクロールを追加。
- 言語切り替えUIからボタン式トグルを削除し、`language-select` プルダウンのみで切り替える構造に変更。
- i18next のリソース初期化を `ja/en` 固定から、`PROMPTS_DATA.ui` 内の任意言語を列挙する方式へ変更。
- Service Worker のキャッシュ名を `ai-web-studio-v3-mobile-i18n` に更新し、古いUIキャッシュが残りにくいようにした。


## v3.2 追加検証（質問グループ選択 / プロンプト厳格化）

| No | 要件 | 検証結果 |
|---:|---|---|
| 17 | 複数の問いを1つのモーダルにまとめない | `parseOptionGroupsFromText()` を追加し、質問見出しごとにグループ化。`showOptionsModal()` はグループを1問ずつ表示。 |
| 18 | 各問いの選択肢を表示して選択させる | `optionsModalStepIndex` / `optionsModalAnswers` / `optionsModalSelected` により、質問ごとに選択状態を保持。 |
| 19 | 主要機能などは複数選択できる | `isMultipleOptionQuestion()` により、主要機能・重視点などを複数選択として扱う。 |
| 20 | 「その他」で自由入力できる | 各ステップで `options-other-input` を利用し、`その他：入力内容` として回答へ反映。 |
| 21 | システムプロンプトの品質を強化 | `prompts.json` と `index.html` fallback の両方に、削除禁止・省略禁止・検証必須・勝手な解釈禁止を明記。 |
| 22 | このチャットの失敗ログを作成 | `CHAT_FAILURE_LOG.md` を追加し、失敗内容・原因・対応・再発防止策を記録。 |

## v3.2 実行した静的検証

- `index.html` 内の `<script>` を抽出し、`new Function()` によるJavaScript構文検証を実行。
- `prompts.json` を `python3 -m json.tool` で検証。
- 実例テキストで `parseOptionGroupsFromText()` を検証し、以下の3グループに分かれることを確認。
  1. ターゲットユーザー
  2. 主要機能
  3. 特に重視したい点
- `履歴機能` と `メモ機能` が質問見出し扱いで除外されず、主要機能の選択肢として残ることを確認。

## v3.2 未確認事項

- Android実機でのタップ、キーボード表示、Service Worker更新挙動は未確認。
- GitHub Pagesの実デプロイはPAT権限・リポジトリ設定に依存するため未実行。
