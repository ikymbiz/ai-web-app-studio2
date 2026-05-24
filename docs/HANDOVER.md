# HANDOVER: Current Status & Next Steps

## 1. 現在の作業ステータス
- フェーズ: 管理設定、Skill JSON管理、モデル管理、タスク実行、検証AI、プレビュー、標準docs構造の統合中。
- 管理画面に「開発ルール」設定を追加した。
- 管理画面の開発ルールは、AI-Only Operations、齟齬検証、HANDOVER運用、標準フォルダ構造、コスト制約を保持する設定値として扱う。
- このアプリ自身の docs/PRINCIPLE.md、docs/DEVELOPMENT_RULES.md、docs/SYSTEM_DESIGN.md、docs/FAILURE_LOG.md、docs/HANDOVER.md を更新した。

## 2. 完了した項目
- 設定画面のタブ分割。
- 管理設定へのAPI接続、Custom Base URL、モデル名管理、管理用Skill JSON管理の追加。
- ユーザーSkillと管理用Skillの分離。
- 管理用SkillsのJSON一本化。
- 複数ファイル仮想プレビュー対応。
- 検証AI完了後にプレビューへ進むフロー。
- フィードバック内容の複数選択化。
- 修正承認モードの追加。
- ブラウザ中断時の進行履歴保存と再実行導線。
- 生成アプリの標準Root構造 docs/, src/apps/, src/admin/, config/, .github/ の導入。

## 3. 次回実施すべき作業内容
- 管理画面の「開発ルール」がコード生成AI、デバッグAI、検証AI、原因分析AIのすべてに渡っているかをブラウザ上で確認する。
- prompts.json と index.html 内フォールバックの初期値が完全に同期しているかを確認する。
- 生成されたアプリの docs/DEVELOPMENT_RULES.md が管理画面の開発ルールに沿って補完されるかを確認する。

## 4. 未解決事項・保留中の要件
- 長時間AI処理をブラウザを閉じた後もバックグラウンドで継続するには、サーバー側ジョブ管理が必要。現状は中断状態として保存し、再実行する仕様。


## v20 現在の引き継ぎ状態
- 実装済み: プレビュー前レビュー、チャット上のエージェント進行ログ、進行タブのエージェント名表示、中断時HANDOVERスナップショット保存。
- プレビュー表示条件: 検証AIが完了し、タスク消込が終わり、ユーザーがプレビュー前レビューで「プレビューを表示」を選んだ場合。
- 再開時の注意: running 状態で閉じられた場合は interrupted にし、該当タスクは blocked として残す。勝手に verified にしない。
- 次に確認すべきこと: 実ブラウザで生成→検証→プレビュー前レビュー→プレビュー表示の順序が崩れていないか確認する。

## v21 進行タブ・文言修正の引き継ぎ状態
- Skill選定中のステータスメッセージは「Skillsから必要なものを選定しています。」へ変更済み。
- タスクモーダル内の「進行」タブ、表示領域、再実行・履歴クリアボタンが存在することを確認済み。
- Planner / Coder / Debugger / Verifier / Bug Analyst / Reviewer / Handover の進行イベントは localStorage の aiWorkflowEvents に保存し、進行タブへ表示する設計を維持。
- チャット側のエージェント進行ログ表示と、ブラウザ更新・中断時の HANDOVER スナップショット保存は維持。
- スマホ表示でタスクタブが重ならないよう、タブ列を横スクロール可能に調整済み。

## v22 進行中ボタン・プレビュー手書き修正の引き継ぎ状態
- チャットヘッダーに「📋 タスク」の隣で開ける「⏳ 進行中」ボタンを追加した。タスクモーダル内だけに閉じず、外側から直接「進行」タブを開ける。
- 進行中ボタンは workflow 状態に応じて running / awaiting_approval / interrupted / error を視覚表示し、進行ログがあれば履歴バッジを表示する。
- プレビュー画面には手書き注釈モードを追加し、ペンと蛍光ペンを切り替えて直接書き込みできる。
- 手書き注釈モードは Undo / Clear を備え、スマホの指操作でも扱える pointer イベントで実装した。
- サービスワーカーのキャッシュ名は v22 に更新し、旧キャッシュが残って進行中ボタンや文言修正が反映されないリスクを下げた。

## v23 プレビュー注釈画像添付の引き継ぎ状態
- プレビュー画面の手書き・蛍光ペン注釈を、修正依頼時にPNG画像としてAIへ添付する処理を追加した。
- 注釈画像がある場合、チャット上のユーザー発言にも「プレビュー注釈画像つき」とサムネイルを表示する。
- デバッグAIプロンプトに、添付画像がプレビュー表示領域と同じ縦横比の注釈レイヤーであることを明記した。
- 既存のテキスト修正依頼、タスク選定、検証AI、進行ログ、HANDOVER保存処理は維持した。
- サービスワーカーのキャッシュ名は v23 に更新済み。

## v24 UI先行レビュー・コアロジック分離の引き継ぎ状態
- チャット画面の生成導線に「🎨 UIだけ先に作る」ボタンを追加した。通常の「⚡️ コードを作成」は維持。
- UI先行レビューでは UI Designer が画面・レイアウト・文言・部品だけを生成し、コアロジック、API接続、永続化、本物の保存処理はまだ実装しない。
- UI生成後は `ui_review_pending` として localStorage の aiUiFirstReviewState に承認待ち状態を保存し、プレビューと UI先行レビュー モーダルを表示する。
- 「このUIでロジック実装へ進む」を押した場合だけ Core Logic が承認済みUIにロジックを接続する。
- コアロジック生成時は承認済みUIの id / class / 表示文言を抽出し、構造・CSS・文言を壊さない UIロック制約としてプロンプトに渡す。
- UIレビュー中に手書き・蛍光ペンで修正依頼した場合は、コアロジックへ進まず UI修正として再レビューに戻す。
- 進行ログには UI Designer / Core Logic の段階を表示する。
- サービスワーカーのキャッシュ名は v24 に更新済み。

## v25 要件優先順位・手書きメニュー化の引き継ぎ状態
- チャットで決めた内容、仕様リスト、直近のユーザー発言、添付・手書き注釈を最優先する「要件優先順位」指示を追加した。
- ターゲットペルソナは UI/UX、文体、導線の参考情報に降格し、機能要件・サービス内容・画面構成を上書きしない制約を Planner / UI Designer / Core Logic / Debugger / Verifier 系プロンプトに反映した。
- UI先行レビュー・通常生成・デバッグ修正・Core Logic 接続で `buildRequirementPriorityInstruction()` を渡し、ペルソナ起因の仕様逸脱を防ぐ。
- プレビュー画面の手書きツールバーは常時表示しないようにし、修正依頼欄左のメニューボタンから必要時だけ表示・操作する導線に変更した。
- 手書きモードON時は最小限のステータスバッジだけを表示し、ペン / 蛍光ペン / 戻す / クリア / 注釈添付確認は左メニューから操作する。
- サービスワーカーのキャッシュ名は v25 に更新済み。

## v26 Workflow Orchestration / Task Management 追加の引き継ぎ状態
- docs/PRINCIPLE.md と docs/DEVELOPMENT_RULES.md に、Plan Node Default、Subagent Strategy、Self-Improvement Loop、Verification Before Done、Demand Elegance、Autonomous Bug Fixing を追加した。
- Task Management と Core Principles を追記し、tasks/todo.md と tasks/lessons.md を追加した。
- 今後の修正では、非自明な作業は計画化し、修正指摘後は lessons に再発防止パターンを残す。


## v29.2 生成アプリ最小ドキュメント方針への整合（2026-05-24）

### 背景
v29.1 までは「生成アプリは README.md + plan_log.md だけでよい」という v29 方針と、「生成アプリには docs/ 5本 + src/apps + src/admin + config + .github を必ず含めよ」という v26 までの旧方針が、複数ファイルに共存していた。同一プロンプト内で矛盾する指示が AI に渡るため、小規模アプリでも空の docs 5本を出力したり、トークン枠を浪費して JSON が途中で切れたりするチグハグが発生していた。

### 確定方針
- 論点1（生成アプリの必須ドキュメント）= 案① **v29 方針が正**。生成アプリは `README.md` と `plan_log.md` のみ必須。他のフォルダは規模に応じて任意。
- 論点2（本体の進捗ログ置き場）= **従来通り**。本体は `docs/` 5本、`tasks/todo.md`、`tasks/lessons.md`、`docs/HANDOVER.md` をそのまま使う。`sw.js` のキャッシュ対象、`docs/PRINCIPLE.md` / `docs/DEVELOPMENT_RULES.md` 内の `tasks/*` 参照、`src/` `config/` `.github/` 配下は変更しない。

### 書き換えたファイル
- `README.md`: 「生成アプリの標準フォルダ構造」セクションを「生成アプリの最小ドキュメント」に置換。
- `docs/SYSTEM_DESIGN.md`: §2 を「生成アプリの最小ファイル定義」に置換。§3 を「任意フォルダの推奨用途」に置換。§3-bis を新設し本体の構造を別管理として明記。
- `docs/DEVELOPMENT_RULES.md`: §1 の「省略禁止: docs、src、config、.github の必要ファイル...」をフォルダ名を含まない一般表現に変更。§4「ディレクトリ構造定義」を「生成アプリの最小ファイル定義」に置換。§7 の「生成アプリにも docs/PRINCIPLE.md ... を必ず含める」を「README.md と plan_log.md を必ず含める」に変更。v26 セクションの `tasks/*` 参照は本体プロセスなので維持。
- `prompts.json` `admin-development-rules`: §1 §2 §6 のフォルダ強制・docs 参照を生成アプリ用に整理。§4 §7 は既に v29 整合済みのため触らない。
- `index.html` 行 5407: 通常生成プロンプトから「docs/ と src/ と config/ と .github/ を省略せず、」を削除。
- `js/ai-code-logic.js` 行 16: `CODE_ONLY_INSTRUCTION` から「docs/ の5ファイルを省略しない」を削除。

### 触らなかったファイル
- `docs/PRINCIPLE.md`（v26 セクションの `tasks/*` 参照は本体プロセス）。
- `docs/FAILURE_LOG.md`（過去履歴は事実なので保持。本作業の記録は同ファイル末尾に1行追加）。
- `tasks/todo.md`、`tasks/lessons.md`。
- `sw.js` の APP_SHELL に列挙された `docs/` 5本と `tasks/` 2本（本体のキャッシュ対象として正しい）。
- `index.html` 行 4989、5253、5350、5405、6750-6758（既に v29 整合済み）。
- `js/ai-code-logic.js` 行 4-9、23-26（既に v29 整合済み）。

### 検証
- 静的構文検証: `python3 -m json.tool prompts.json`、`node --check sw.js cloudflare-worker.js js/*.js`、`index.html` 内インラインスクリプトの構文を確認。
- 旧表現の残存ゼロ確認: `docs、src、config、.github の必要ファイル`、`docs/ の5ファイル`、`docs/ と src/ と config/ と .github/ を省略せず` が全ファイルから消えていることを grep で確認。
- 方針整合: README / SYSTEM_DESIGN / DEVELOPMENT_RULES / prompts.json / index.html / js/ai-code-logic.js が **同じ方針**（最小=README.md + plan_log.md、他は任意）を言っていることを目視確認。
- Service Worker キャッシュ名を `ai-web-studio-v3-3-tabs-skills-models-v29-2-doc-policy-aligned` に更新し、旧キャッシュが残らないようにした。

### 残課題
- 実機 Android / iOS Safari でのキャッシュ更新挙動は未確認。
- ユーザーが管理画面の「開発ルール」を保存済みの場合、旧文言（フォルダ強制）がローカルに残っているため、`prompts.json` 初期値ボタンで上書きしないと反映されない。


