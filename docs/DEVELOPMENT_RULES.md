# DEVELOPMENT RULES: AI-Only Operations

## 1. AIコーディング・操作プロトコル
- 全アセットの同期: コード変更は必ず定義されたディレクトリ配下に反映し、docs/SYSTEM_DESIGN.md との完全な一致を確認する。
- 出力形式の統一: すべての成果物は、最終的に一つのZIPファイルとしてパッケージング可能な構造を維持して提示する。
- 省略禁止: 生成物、設定、docs、src、config、.github の必要ファイルを省略しない。
- 無断削除禁止: ユーザーが明示しない既存機能・設定・ファイル・保存形式を削除しない。

## 2. 齟齬検証（Alignment Check）ルール
- 対応表の照合: AIはコード出力時、それが docs/SYSTEM_DESIGN.md のどのセクションに基づいているかを明示できる状態にし、設計上の制約、コスト、閾値、通信プロトコルを遵守しているかセルフチェックする。
- 乖離時のアクション: 齟齬を発見した場合は docs/FAILURE_LOG.md に記載し、ユーザーに修正方針の承認を求める。
- タスク消込: タスクは実装だけでは完了にせず、検証AIが実装内容と動作経路を確認し、verified と判定した場合だけ消し込む。

## 3. 引き継ぎファイル（HANDOVER.md）の運用
- 毎ターンの更新: 現在のステータスと、次に着手すべき具体的作業を docs/HANDOVER.md に詳細に記述する。
- コンテキストの維持: 前後の文脈を知らないAIが、そのファイルだけで開発を続行できるようにする。

## 4. ディレクトリ構造定義
AIは生成するアプリでこの構造を逸脱してはならない。
- /docs: PRINCIPLE.md, DEVELOPMENT_RULES.md, SYSTEM_DESIGN.md, FAILURE_LOG.md, HANDOVER.md
- /src/apps: メインアプリケーション、コアロジック、バックエンド処理
- /src/admin: 管理・運用ツール、ダッシュボード、フロントエンド
- /config: 動作環境や外部連携の設定
- /.github: CI/CD、テスト、自動検証スケジュール

## 5. コスト削減とリソース制約
- LLMレイヤリング: チャット、コード生成、デバッグ、検証、原因分析を役割ごとに分離する。
- 必要最小限のコンテキスト: Skillはインデックスを先に渡し、必要な本文だけをオンデマンドで読み込む。
- 静的配信戦略: 可能な成果物は静的ファイルとして配信できる構造を維持する。

## 6. 実行強制ワークフロー
1. PLAN: 最小3ステップの具体的計画、検証方法、予見される失敗への対応策を立てる。
2. SUBTASKS: 並列実行または分割可能なタスク単位に分解する。
3. LESSONS: 過去のミス、省略、誤解、バグ、設計乖離のパターンを確認する。
4. PROGRESS: ステップごとの進捗を可視化する。
5. EXECUTION: タスクを実行する。
6. VERIFICATION & ALIGNMENT: 期待結果、タスク、docs/SYSTEM_DESIGN.md、実装の一致を検証する。
7. ELEGANCE CHECK: より簡潔、高度、低コストな代替案を検討する。
8. PRINCIPLES CHECK: 根本原因の解決、影響の最小化、一貫性を確認する。
9. PRINCIPLES EXPANSION CHECK: 目標達成度、観測可能性、仮説検証、安全性、コストを確認する。
10. FINAL ANSWER: 成果物を完全な構造で提示する。

## 7. AI Web Studio Pro における適用
- 管理画面の「開発ルール」設定値を、コード生成AI、デバッグAI、検証AIの共通制約として扱う。
- 生成アプリにも docs/PRINCIPLE.md, docs/DEVELOPMENT_RULES.md, docs/SYSTEM_DESIGN.md, docs/FAILURE_LOG.md, docs/HANDOVER.md を必ず含める。
- このアプリ自身の変更時も、index.html、js/*.js、prompts.json、models/models.json、skills/admin-skills.json、docs/*.md、sw.js の整合性を確認する。
