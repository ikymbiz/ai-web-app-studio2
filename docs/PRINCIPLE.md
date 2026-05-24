# PRINCIPLE: AI-Driven Development System

## 1. 核心的論理構造
本プロジェクトは、AIによる開発作業の自動化、成果物の完全性維持、設計と実装の齟齬防止、およびセッションをまたいだ文脈維持を最上位の目的とする。

## 2. 実行強制命令（10ステップ・ワークフロー）
すべての思考、設計、および出力プロセスは、以下の10手順を省略なく実行する。

1. [PLAN]: 最小3ステップの具体的計画、検証方法、および予見される失敗への対応策を作る。
2. [SUBTASKS]: 並列実行または分割可能なタスク単位へ分解する。
3. [LESSONS]: 過去のミス、省略、誤解、バグ、設計乖離のパターンを確認し、防止策を明確にする。
4. [PROGRESS]: ステップごとの進捗状況を記録する。
5. [EXECUTION]: タスクを具体的に実行する。
6. [VERIFICATION & ALIGNMENT]: 期待結果、タスク、docs/SYSTEM_DESIGN.md、実装の齟齬を検証する。
7. [ELEGANCE CHECK]: 現状の策より簡潔、高度、低コストな代替案を検討する。
8. [PRINCIPLES CHECK]: 簡潔さ、根本原因の解決、影響の最小化を確認する。
9. [PRINCIPLES EXPANSION CHECK]: 目標達成度、観測可能性、仮説検証、安全性、コスト、一貫性を確認する。
10. [FINAL ANSWER]: そのターンの成果物を完全な構造で提示する。

## 3. 不変性と完全性の原則
- 省略の禁止: トークン節約等を理由とした省略表現や未出力を禁止する。
- 無断削除の禁止: ユーザー承認なしに既存の機能、コード、設定、ドキュメントを削除・変更しない。
- 引き継ぎの義務: 状態が変わる作業では docs/HANDOVER.md を更新する。
- 整合性の義務: 設計ドキュメントと実装の齟齬を許容しない。

## 4. 開発哲学
- Documentation First: 実装に先立ち設計書を更新し、論理的整合性を確保する。
- Full Asset Delivery: 成果物は常にZIP化可能な完全なディレクトリ構造を維持する。
- Verified Completion: タスクは検証AIが実装と動作経路を確認してから完了にする。


## v20追加原則: Preview After Review
- プレビューはコード生成直後に表示しない。
- 検証AIがタスクの実装と動作経路を確認し、タスク消込が完了した後に、プレビュー前レビューを表示する。
- 人がレビュー内容を確認して「プレビューを表示」を押した場合のみ、プレビュー画面へ遷移する。
- 中断時には必ず HANDOVER.md に現在状態、選定タスク、未完了タスク、次に再開すべき作業を残す。



## v26追加原則: Workflow Orchestration / Task Management / Core Principles

### Workflow Orchestration

#### 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions).
- If something goes sideways, STOP and re-plan immediately – don't keep pushing.
- Use plan mode for verification steps, not just building.
- Write detailed specs upfront to reduce ambiguity.

#### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean.
- Offload research, exploration, and parallel analysis to subagents.
- For complex problems, throw more compute at it via subagents.
- One task per subagent for focused execution.

#### 3. Self-Improvement Loop
- After ANY correction from the user: update tasks/lessons.md with the pattern.
- Write rules for yourself that prevent the same mistake.
- Ruthlessly iterate on these lessons until mistake rate drops.
- Review lessons at session start for relevant project.

#### 4. Verification Before Done
- Never mark a task complete without proving it works.
- Diff behavior between main and your changes when relevant.
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness.

#### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution."
- Skip this for simple, obvious fixes – don't over-engineer.
- Challenge your own work before presenting it.

#### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding.
- Point at logs, errors, failing tests – then resolve them.
- Zero context switching required from the user.
- Go fix failing CI tests without being told how.

### Task Management
1. **Plan First**: Write plan to tasks/todo.md with checkable items.
2. **Verify Plan**: Check in before starting implementation.
3. **Track Progress**: Mark items complete as you go.
4. **Explain Changes**: High-level summary at each step.
5. **Document Results**: Add review section to tasks/todo.md.
6. **Capture Lessons**: Update tasks/lessons.md after corrections.

### Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
