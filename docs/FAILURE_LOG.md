# FAILURE LOG: Risk Tracking & Lessons Learned

| 日付 | フェーズ | 失敗/リスクの内容 | 原因 | 対策・設計変更 |
| :--- | :--- | :--- | :--- | :--- |
| 2024-05-22 | 初期設計 | AIによるコード出力の省略 | トークン節約の自動化 | PRINCIPLE.md に省略禁止条項を追加。 |
| 2024-05-22 | 初期設計 | 開発文脈の消失 | セッション切断 | HANDOVER.md の常時更新ルールを新設。 |
| 2024-05-22 | 初期設計 | 計画と実装の乖離 | 実装時の無意識な仕様変更 | DEVELOPMENT_RULES.md に Alignment Check を追加。 |
| 2024-05-22 | 構成設計 | フォルダ構成の不透明さ | 物理配置の定義不足 | DEVELOPMENT_RULES.md と SYSTEM_DESIGN.md に標準ディレクトリ構造を定義。 |
| 2026-05-24 | UI修正 | プレビュー画面に不要な赤い警告ボタンが残った | 旧UI部品の参照が残存 | preview-feedback-btn と reportPreviewIssue を削除し、修正依頼パネルに統一。 |
| 2026-05-24 | Skill設計 | mdファイルとJSONの二重管理リスク | Skill本文を分割mdで保持していた | 管理用Skillsを skills/admin-skills.json と admin-skills.index.json に一本化。 |
| 2026-05-24 | 検証フロー | 検証前にタスクを消し込むリスク | コード生成完了と検証完了の状態が混在 | verified 条件を厳格化し、検証後にだけプレビューへ遷移する流れに変更。 |
