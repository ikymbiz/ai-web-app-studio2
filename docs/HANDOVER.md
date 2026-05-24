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
