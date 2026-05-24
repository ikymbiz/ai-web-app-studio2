// AI Web Studio Pro — コード作成用生成AIロジック
// コーディング段階のモデル選択、Skill stage、コードだけを返す制約、複数ファイル出力の解析を管理する。
(function () {
  const GENERATED_APP_STRUCTURE_INSTRUCTION = [
    '生成するWebアプリは、原則として次のRoot構造を含める: docs/, tasks/, src/apps/, src/admin/, config/, .github/.',
    'docs/ には必ず PRINCIPLE.md, DEVELOPMENT_RULES.md, SYSTEM_DESIGN.md, FAILURE_LOG.md, HANDOVER.md を含める。',
    'tasks/ には todo.md と lessons.md を含め、計画、レビュー、修正指摘から得た教訓を保持する。',
    'src/apps/ はメインアプリケーション、src/admin/ は管理・運用ツールを置く領域として扱う。',
    'config/ は設定、.github/ はCI/CDや自動化設定の領域として扱う。',
    '既存コードを修正する場合も、ユーザーが明示しない限り既存ファイルを削除せず、足りない標準構造だけを追加する。'
  ].join('\n');

  const CODE_ONLY_INSTRUCTION = [
    '出力はコードだけにする。',
    '説明、要約、Plan、Act、分析、検証報告、前置き、後書きを出力しない。',
    GENERATED_APP_STRUCTURE_INSTRUCTION,
    '単一HTMLで実装できる場合でも、複数ファイルJSONを優先し、docs/ の5ファイルを省略しない。',
    'HTML/CSS/JSなど複数ファイルで実装する場合は、説明文を混ぜず、次のJSONだけを出力する: {"entryFile":"src/admin/index.html","files":[{"path":"docs/PRINCIPLE.md","content":"..."},{"path":"docs/DEVELOPMENT_RULES.md","content":"..."},{"path":"docs/SYSTEM_DESIGN.md","content":"..."},{"path":"docs/FAILURE_LOG.md","content":"..."},{"path":"docs/HANDOVER.md","content":"..."},{"path":"tasks/todo.md","content":"..."},{"path":"tasks/lessons.md","content":"..."},{"path":"src/admin/index.html","content":"..."},{"path":"src/admin/styles.css","content":"..."},{"path":"src/admin/script.js","content":"..."},{"path":"src/apps/README.md","content":"..."},{"path":"config/README.md","content":"..."},{"path":".github/README.md","content":"..."}]}',
    '複数ファイルJSONを使う場合、contentには各ファイルの全文を入れる。省略記号、差分、Markdownコードフェンスは禁止。'
  ].join('\n');

  const TEXT_FILE_EXTENSIONS = /(?:\.(html?|css|js|mjs|cjs|ts|tsx|jsx|json|txt|md|svg|xml|yml|yaml)|\.gitkeep)$/i;

  const REQUIRED_DOC_FILES = {
    "docs/PRINCIPLE.md": "# PRINCIPLE: AI-Driven Development System\n\n## 1. 核心的論理構造\n本プロジェクトは、AIによる開発作業の自動化、成果物の完全性維持、設計と実装の齟齬防止、およびセッションをまたいだ文脈維持を最上位の目的とする。\n\n## 2. 実行強制命令（10ステップ・ワークフロー）\nすべての思考、設計、および出力プロセスは、以下の10手順を省略なく実行する。\n\n1. [PLAN]: 最小3ステップの具体的計画、検証方法、および予見される失敗への対応策を作る。\n2. [SUBTASKS]: 並列実行または分割可能なタスク単位へ分解する。\n3. [LESSONS]: 過去のミス、省略、誤解、バグ、設計乖離のパターンを確認し、防止策を明確にする。\n4. [PROGRESS]: ステップごとの進捗状況を記録する。\n5. [EXECUTION]: タスクを具体的に実行する。\n6. [VERIFICATION & ALIGNMENT]: 期待結果、タスク、docs/SYSTEM_DESIGN.md、実装の齟齬を検証する。\n7. [ELEGANCE CHECK]: 現状の策より簡潔、高度、低コストな代替案を検討する。\n8. [PRINCIPLES CHECK]: 簡潔さ、根本原因の解決、影響の最小化を確認する。\n9. [PRINCIPLES EXPANSION CHECK]: 目標達成度、観測可能性、仮説検証、安全性、コスト、一貫性を確認する。\n10. [FINAL ANSWER]: そのターンの成果物を完全な構造で提示する。\n\n## 3. 不変性と完全性の原則\n- 省略の禁止: トークン節約等を理由とした省略表現や未出力を禁止する。\n- 無断削除の禁止: ユーザー承認なしに既存の機能、コード、設定、ドキュメントを削除・変更しない。\n- 引き継ぎの義務: 状態が変わる作業では docs/HANDOVER.md を更新する。\n- 整合性の義務: 設計ドキュメントと実装の齟齬を許容しない。\n\n## 4. 開発哲学\n- Documentation First: 実装に先立ち設計書を更新し、論理的整合性を確保する。\n- Full Asset Delivery: 成果物は常にZIP化可能な完全なディレクトリ構造を維持する。\n- Verified Completion: タスクは検証AIが実装と動作経路を確認してから完了にする。\n\n\n## v20追加原則: Preview After Review\n- プレビューはコード生成直後に表示しない。\n- 検証AIがタスクの実装と動作経路を確認し、タスク消込が完了した後に、プレビュー前レビューを表示する。\n- 人がレビュー内容を確認して「プレビューを表示」を押した場合のみ、プレビュー画面へ遷移する。\n- 中断時には必ず HANDOVER.md に現在状態、選定タスク、未完了タスク、次に再開すべき作業を残す。\n\n\n\n## v26追加原則: Workflow Orchestration / Task Management / Core Principles\n\n### Workflow Orchestration\n\n#### 1. Plan Node Default\n- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions).\n- If something goes sideways, STOP and re-plan immediately – don't keep pushing.\n- Use plan mode for verification steps, not just building.\n- Write detailed specs upfront to reduce ambiguity.\n\n#### 2. Subagent Strategy\n- Use subagents liberally to keep main context window clean.\n- Offload research, exploration, and parallel analysis to subagents.\n- For complex problems, throw more compute at it via subagents.\n- One task per subagent for focused execution.\n\n#### 3. Self-Improvement Loop\n- After ANY correction from the user: update tasks/lessons.md with the pattern.\n- Write rules for yourself that prevent the same mistake.\n- Ruthlessly iterate on these lessons until mistake rate drops.\n- Review lessons at session start for relevant project.\n\n#### 4. Verification Before Done\n- Never mark a task complete without proving it works.\n- Diff behavior between main and your changes when relevant.\n- Ask yourself: \"Would a staff engineer approve this?\"\n- Run tests, check logs, demonstrate correctness.\n\n#### 5. Demand Elegance (Balanced)\n- For non-trivial changes: pause and ask \"is there a more elegant way?\"\n- If a fix feels hacky: \"Knowing everything I know now, implement the elegant solution.\"\n- Skip this for simple, obvious fixes – don't over-engineer.\n- Challenge your own work before presenting it.\n\n#### 6. Autonomous Bug Fixing\n- When given a bug report: just fix it. Don't ask for hand-holding.\n- Point at logs, errors, failing tests – then resolve them.\n- Zero context switching required from the user.\n- Go fix failing CI tests without being told how.\n\n### Task Management\n1. **Plan First**: Write plan to tasks/todo.md with checkable items.\n2. **Verify Plan**: Check in before starting implementation.\n3. **Track Progress**: Mark items complete as you go.\n4. **Explain Changes**: High-level summary at each step.\n5. **Document Results**: Add review section to tasks/todo.md.\n6. **Capture Lessons**: Update tasks/lessons.md after corrections.\n\n### Core Principles\n- **Simplicity First**: Make every change as simple as possible. Impact minimal code.\n- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.\n- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.\n",
    "docs/DEVELOPMENT_RULES.md": "# DEVELOPMENT RULES: AI-Only Operations\n\n## 1. AIコーディング・操作プロトコル\n- 全アセットの同期: コード変更は必ず定義されたディレクトリ配下に反映し、docs/SYSTEM_DESIGN.md との完全な一致を確認する。\n- 出力形式の統一: すべての成果物は、最終的に一つのZIPファイルとしてパッケージング可能な構造を維持して提示する。\n- 省略禁止: 生成物、設定、docs、src、config、.github の必要ファイルを省略しない。\n- 無断削除禁止: ユーザーが明示しない既存機能・設定・ファイル・保存形式を削除しない。\n\n## 2. 齟齬検証（Alignment Check）ルール\n- 対応表の照合: AIはコード出力時、それが docs/SYSTEM_DESIGN.md のどのセクションに基づいているかを明示できる状態にし、設計上の制約、コスト、閾値、通信プロトコルを遵守しているかセルフチェックする。\n- 乖離時のアクション: 齟齬を発見した場合は docs/FAILURE_LOG.md に記載し、ユーザーに修正方針の承認を求める。\n- タスク消込: タスクは実装だけでは完了にせず、検証AIが実装内容と動作経路を確認し、verified と判定した場合だけ消し込む。\n\n## 3. 引き継ぎファイル（HANDOVER.md）の運用\n- 毎ターンの更新: 現在のステータスと、次に着手すべき具体的作業を docs/HANDOVER.md に詳細に記述する。\n- コンテキストの維持: 前後の文脈を知らないAIが、そのファイルだけで開発を続行できるようにする。\n\n## 4. ディレクトリ構造定義\nAIは生成するアプリでこの構造を逸脱してはならない。\n- /docs: PRINCIPLE.md, DEVELOPMENT_RULES.md, SYSTEM_DESIGN.md, FAILURE_LOG.md, HANDOVER.md\n- /src/apps: メインアプリケーション、コアロジック、バックエンド処理\n- /src/admin: 管理・運用ツール、ダッシュボード、フロントエンド\n- /config: 動作環境や外部連携の設定\n- /.github: CI/CD、テスト、自動検証スケジュール\n\n## 5. コスト削減とリソース制約\n- LLMレイヤリング: チャット、コード生成、デバッグ、検証、原因分析を役割ごとに分離する。\n- 必要最小限のコンテキスト: Skillはインデックスを先に渡し、必要な本文だけをオンデマンドで読み込む。\n- 静的配信戦略: 可能な成果物は静的ファイルとして配信できる構造を維持する。\n\n## 6. 実行強制ワークフロー\n1. PLAN: 最小3ステップの具体的計画、検証方法、予見される失敗への対応策を立てる。\n2. SUBTASKS: 並列実行または分割可能なタスク単位に分解する。\n3. LESSONS: 過去のミス、省略、誤解、バグ、設計乖離のパターンを確認する。\n4. PROGRESS: ステップごとの進捗を可視化する。\n5. EXECUTION: タスクを実行する。\n6. VERIFICATION & ALIGNMENT: 期待結果、タスク、docs/SYSTEM_DESIGN.md、実装の一致を検証する。\n7. ELEGANCE CHECK: より簡潔、高度、低コストな代替案を検討する。\n8. PRINCIPLES CHECK: 根本原因の解決、影響の最小化、一貫性を確認する。\n9. PRINCIPLES EXPANSION CHECK: 目標達成度、観測可能性、仮説検証、安全性、コストを確認する。\n10. FINAL ANSWER: 成果物を完全な構造で提示する。\n\n## 7. AI Web Studio Pro における適用\n- 管理画面の「開発ルール」設定値を、コード生成AI、デバッグAI、検証AIの共通制約として扱う。\n- 生成アプリにも docs/PRINCIPLE.md, docs/DEVELOPMENT_RULES.md, docs/SYSTEM_DESIGN.md, docs/FAILURE_LOG.md, docs/HANDOVER.md を必ず含める。\n- このアプリ自身の変更時も、index.html、js/*.js、prompts.json、models/models.json、skills/admin-skills.json、docs/*.md、sw.js の整合性を確認する。\n\n\n## v20運用規則: 進行可視化と中断時引き継ぎ\n- 長時間処理ではチャットにエージェント進行ログを表示する。\n- Planner、Coder、Debugger、Verifier、Bug Analyst、Reviewer、Handover の作業段階を進行ログに残す。\n- 進行タブには時刻、担当エージェント、処理段階、結果を保存する。\n- ブラウザ終了、更新、AIエラー、中断時には HANDOVER.md を更新し、タスクを勝手に verified にしない。\n- プレビューは検証完了後のレビュー確認後にのみ表示する。\n\n## v25運用規則: ペルソナ制約と手書きツール\n- ターゲットペルソナは参考情報であり、チャット合意・仕様リスト・手書き注釈を上書きしてはならない。\n- UI Designer / Core Logic / Debugger / Verifier は、ペルソナ適合より仕様反映を優先する。\n- 手書きツールは必要時だけ表示し、通常のプレビュー確認を妨げない。\n\n\n\n## v26追加原則: Workflow Orchestration / Task Management / Core Principles\n\n### Workflow Orchestration\n\n#### 1. Plan Node Default\n- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions).\n- If something goes sideways, STOP and re-plan immediately – don't keep pushing.\n- Use plan mode for verification steps, not just building.\n- Write detailed specs upfront to reduce ambiguity.\n\n#### 2. Subagent Strategy\n- Use subagents liberally to keep main context window clean.\n- Offload research, exploration, and parallel analysis to subagents.\n- For complex problems, throw more compute at it via subagents.\n- One task per subagent for focused execution.\n\n#### 3. Self-Improvement Loop\n- After ANY correction from the user: update tasks/lessons.md with the pattern.\n- Write rules for yourself that prevent the same mistake.\n- Ruthlessly iterate on these lessons until mistake rate drops.\n- Review lessons at session start for relevant project.\n\n#### 4. Verification Before Done\n- Never mark a task complete without proving it works.\n- Diff behavior between main and your changes when relevant.\n- Ask yourself: \"Would a staff engineer approve this?\"\n- Run tests, check logs, demonstrate correctness.\n\n#### 5. Demand Elegance (Balanced)\n- For non-trivial changes: pause and ask \"is there a more elegant way?\"\n- If a fix feels hacky: \"Knowing everything I know now, implement the elegant solution.\"\n- Skip this for simple, obvious fixes – don't over-engineer.\n- Challenge your own work before presenting it.\n\n#### 6. Autonomous Bug Fixing\n- When given a bug report: just fix it. Don't ask for hand-holding.\n- Point at logs, errors, failing tests – then resolve them.\n- Zero context switching required from the user.\n- Go fix failing CI tests without being told how.\n\n### Task Management\n1. **Plan First**: Write plan to tasks/todo.md with checkable items.\n2. **Verify Plan**: Check in before starting implementation.\n3. **Track Progress**: Mark items complete as you go.\n4. **Explain Changes**: High-level summary at each step.\n5. **Document Results**: Add review section to tasks/todo.md.\n6. **Capture Lessons**: Update tasks/lessons.md after corrections.\n\n### Core Principles\n- **Simplicity First**: Make every change as simple as possible. Impact minimal code.\n- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.\n- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.\n",
    "docs/SYSTEM_DESIGN.md": "# SYSTEM_DESIGN.md — AI Web Studio Pro システム設計\n\n## 1. 目的\nAI Web Studio Pro は、要件整理、タスク化、優先順位付け、コード生成、デバッグ、検証、タスク消込、プレビュー、ZIP出力、GitHub公開を支援するWebアプリである。\n\n## 2. 標準生成フォルダ構造\n生成するアプリは次のRoot構造を標準とする。\n\n```text\n/\n├── docs/\n│   ├── PRINCIPLE.md\n│   ├── DEVELOPMENT_RULES.md\n│   ├── SYSTEM_DESIGN.md\n│   ├── FAILURE_LOG.md\n│   └── HANDOVER.md\n├── src/\n│   ├── apps/\n│   └── admin/\n├── config/\n└── .github/\n```\n\n## 3. 各領域の役割\n- docs/: AIの外部記憶・憲法。開発原則、運用規則、設計、失敗ログ、引き継ぎを保持する。\n- src/apps/: メインアプリケーション、コアロジック、バックエンド処理を配置する。\n- src/admin/: 管理・運用ツール、ダッシュボード、フロントエンドを配置する。\n- config/: 動作環境や外部連携の設定を配置する。秘密情報は保存しない。\n- .github/: CI/CD、テスト、自動検証スケジュールを配置する。\n\n## 4. AI処理の役割分担\n- チャットAI: 初回要件確認、1〜3問の質問、機能要件の整理を担当する。\n- コード生成AI: 選定済みタスクを実装し、複数ファイルJSONを出力する。\n- デバッグAI: プレビュー画面からの修正依頼と現在ファイルを受け取り、修正コードを出力する。\n- 検証AI: タスク単位と全体を確認し、verified のタスクだけ消し込む。\n- 原因分析AI: バグの原因、修正案、影響範囲、承認要否を整理する。\n\n## 5. 管理設定\n管理画面では次を設定できる。\n- 管理用システムプロンプト\n- コード生成の原則\n- 開発ルール\n- システム要件\n- 実装検証用プロンプト\n- 管理用Skills JSON\n- ユーザーSkills\n- モデルリスト\n- フィードバック内容\n- 修正承認モード\n\n## 6. 検証とタスク消込\nタスクは実装直後に完了にしない。検証AIが実装内容と動作経路を確認し、verified、implemented、behaviorChecked、canComplete がすべて真の場合だけ消し込む。\n",
    "docs/FAILURE_LOG.md": "# FAILURE LOG: Risk Tracking & Lessons Learned\n\n| 日付 | フェーズ | 失敗/リスクの内容 | 原因 | 対策・設計変更 |\n| :--- | :--- | :--- | :--- | :--- |\n| 2024-05-22 | 初期設計 | AIによるコード出力の省略 | トークン節約の自動化 | PRINCIPLE.md に省略禁止条項を追加。 |\n| 2024-05-22 | 初期設計 | 開発文脈の消失 | セッション切断 | HANDOVER.md の常時更新ルールを新設。 |\n| 2024-05-22 | 初期設計 | 計画と実装の乖離 | 実装時の無意識な仕様変更 | DEVELOPMENT_RULES.md に Alignment Check を追加。 |\n| 2024-05-22 | 構成設計 | フォルダ構成の不透明さ | 物理配置の定義不足 | DEVELOPMENT_RULES.md と SYSTEM_DESIGN.md に標準ディレクトリ構造を定義。 |\n| 2026-05-24 | UI修正 | プレビュー画面に不要な赤い警告ボタンが残った | 旧UI部品の参照が残存 | preview-feedback-btn と reportPreviewIssue を削除し、修正依頼パネルに統一。 |\n| 2026-05-24 | Skill設計 | mdファイルとJSONの二重管理リスク | Skill本文を分割mdで保持していた | 管理用Skillsを skills/admin-skills.json と admin-skills.index.json に一本化。 |\n| 2026-05-24 | 検証フロー | 検証前にタスクを消し込むリスク | コード生成完了と検証完了の状態が混在 | verified 条件を厳格化し、検証後にだけプレビューへ遷移する流れに変更。 |\n",
    "docs/HANDOVER.md": "# HANDOVER: Current Status & Next Steps\n\n## 1. 現在の作業ステータス\n- フェーズ: 管理設定、Skill JSON管理、モデル管理、タスク実行、検証AI、プレビュー、標準docs構造の統合中。\n- 管理画面に「開発ルール」設定を追加した。\n- 管理画面の開発ルールは、AI-Only Operations、齟齬検証、HANDOVER運用、標準フォルダ構造、コスト制約を保持する設定値として扱う。\n- このアプリ自身の docs/PRINCIPLE.md、docs/DEVELOPMENT_RULES.md、docs/SYSTEM_DESIGN.md、docs/FAILURE_LOG.md、docs/HANDOVER.md を更新した。\n\n## 2. 完了した項目\n- 設定画面のタブ分割。\n- 管理設定へのAPI接続、Custom Base URL、モデル名管理、管理用Skill JSON管理の追加。\n- ユーザーSkillと管理用Skillの分離。\n- 管理用SkillsのJSON一本化。\n- 複数ファイル仮想プレビュー対応。\n- 検証AI完了後にプレビューへ進むフロー。\n- フィードバック内容の複数選択化。\n- 修正承認モードの追加。\n- ブラウザ中断時の進行履歴保存と再実行導線。\n- 生成アプリの標準Root構造 docs/, src/apps/, src/admin/, config/, .github/ の導入。\n\n## 3. 次回実施すべき作業内容\n- 管理画面の「開発ルール」がコード生成AI、デバッグAI、検証AI、原因分析AIのすべてに渡っているかをブラウザ上で確認する。\n- prompts.json と index.html 内フォールバックの初期値が完全に同期しているかを確認する。\n- 生成されたアプリの docs/DEVELOPMENT_RULES.md が管理画面の開発ルールに沿って補完されるかを確認する。\n\n## 4. 未解決事項・保留中の要件\n- 長時間AI処理をブラウザを閉じた後もバックグラウンドで継続するには、サーバー側ジョブ管理が必要。現状は中断状態として保存し、再実行する仕様。\n"
};

  const REQUIRED_PLACEHOLDERS = {
    'src/apps/README.md': '# src/apps\n\nメインアプリケーション、コアロジック、バックエンド処理を配置します。\n',
    'src/admin/README.md': '# src/admin\n\n管理画面、運用ツール、フロントエンドを配置します。\n',
    'config/README.md': '# config\n\n動作環境や外部連携の設定を配置します。秘密情報は保存しません。\n',
    '.github/README.md': '# .github\n\nCI/CD、テスト、自動検証などの自動化設定を配置します。\n',
    'tasks/todo.md': '# TODO\n\n## Plan\n- [ ] Write the implementation plan before non-trivial work.\n\n## Review\n- Pending.\n',
    'tasks/lessons.md': '# Lessons\n\n## Correction Patterns\n- Add patterns after user corrections.\n'
  };

  function normalizePath(path) {
    return String(path || 'index.html').trim().replace(/^\/+/, '').replace(/\\/g, '/') || 'index.html';
  }

  function stripFence(text) {
    return String(text || '').replace(/^```(?:json|html|css|javascript|js|xml|md|markdown|ts|tsx|jsx)?\s*/i, '').replace(/```\s*$/i, '').trim();
  }

  // Drop a leading bare language tag like "json", "javascript", etc. that some models
  // emit without backticks. Only strips when followed by whitespace then '{' or '['.
  function stripLeadingLangTag(text) {
    return String(text || '').replace(/^\s*(?:json|javascript|js|html|css|xml|md|markdown)\b\s*(?=[{\[])/i, '');
  }

  // Walk the text and return the substring covering the first balanced JSON object,
  // respecting string literals and escape sequences. Useful for recovering JSON when
  // there is trailing prose, multiple objects, or extra closing braces inside strings.
  function sliceFirstBalancedObject(text, startIndex) {
    const s = String(text || '');
    const start = typeof startIndex === 'number' ? startIndex : s.indexOf('{');
    if (start < 0) return null;
    let depth = 0;
    let inString = false;
    let escape = false;
    for (let i = start; i < s.length; i++) {
      const c = s[i];
      if (escape) { escape = false; continue; }
      if (inString) {
        if (c === '\\') { escape = true; continue; }
        if (c === '"') { inString = false; }
        continue;
      }
      if (c === '"') { inString = true; continue; }
      if (c === '{') depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) return s.slice(start, i + 1);
      }
    }
    return null;
  }

  // Best-effort repair for truncated JSON (e.g. cut off by token limit):
  // closes any open string and balances brackets/braces.
  function repairTruncatedJson(text) {
    const s = String(text || '');
    const start = s.indexOf('{');
    if (start < 0) return null;
    let depth = 0;
    const stack = [];
    let inString = false;
    let escape = false;
    let endTrim = s.length;
    for (let i = start; i < s.length; i++) {
      const c = s[i];
      if (escape) { escape = false; continue; }
      if (inString) {
        if (c === '\\') { escape = true; continue; }
        if (c === '"') { inString = false; }
        continue;
      }
      if (c === '"') { inString = true; continue; }
      if (c === '{' || c === '[') { stack.push(c); depth++; }
      else if (c === '}' || c === ']') { stack.pop(); depth--; }
    }
    let body = s.slice(start, endTrim);
    if (inString) body += '"';
    // Strip trailing commas that would otherwise become syntax errors after appending closers.
    body = body.replace(/,\s*$/, '');
    while (stack.length) {
      const opener = stack.pop();
      body += opener === '{' ? '}' : ']';
    }
    return body;
  }

  function extractJsonProject(text) {
    const raw = String(text || '').trim();
    const candidates = [];

    // 1) Strip a leading fence (e.g. ```json) and trailing ``` if present at the edges.
    candidates.push(stripFence(raw));

    // 2) All fenced blocks anywhere in the response (handles preambles before the fence).
    const fenceRegex = /```(?:json|javascript|js|html|xml|css|md|markdown|ts|tsx|jsx)?\s*([\s\S]*?)```/gi;
    let fm;
    while ((fm = fenceRegex.exec(raw))) {
      const inner = fm[1].trim();
      if (inner) candidates.push(inner);
    }

    // 3) Bare leading language tag with no fences (e.g. "json\n{...}").
    candidates.push(stripLeadingLangTag(raw));

    // 4) First balanced JSON object — robust against trailing prose or extra braces in strings.
    const balanced = sliceFirstBalancedObject(raw);
    if (balanced) candidates.push(balanced);

    // 5) Naive slice from first '{' to last '}' (legacy fallback).
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) candidates.push(raw.slice(firstBrace, lastBrace + 1));

    // 6) Last-resort: try to repair a truncated JSON by balancing brackets.
    const repaired = repairTruncatedJson(raw);
    if (repaired) candidates.push(repaired);

    const seen = new Set();
    for (const candidate of candidates) {
      if (!candidate || seen.has(candidate)) continue;
      seen.add(candidate);
      try {
        const parsed = JSON.parse(candidate);
        const filesArray = Array.isArray(parsed?.files) ? parsed.files : null;
        if (!filesArray) continue;
        const files = {};
        filesArray.forEach(file => {
          const path = normalizePath(file.path || file.name || file.filename);
          if (!path || !TEXT_FILE_EXTENSIONS.test(path)) return;
          files[path] = String(file.content ?? file.code ?? '');
        });
        if (Object.keys(files).length) {
          const entryFile = normalizePath(parsed.entryFile || parsed.entry || (files['index.html'] !== undefined ? 'index.html' : Object.keys(files).find(p => /\.html?$/i.test(p)) || Object.keys(files)[0]));
          return { files, entryFile };
        }
      } catch (_) {}
    }
    return null;
  }

  function extractFencedProject(text) {
    const raw = String(text || '');
    const files = {};
    const fenceRegex = /(?:^|\n)(?:#{1,6}\s*)?(?:file|filename|path)?\s*[:：]?\s*`?([\w@./\\ -]+\.(?:html?|css|js|mjs|cjs|ts|tsx|jsx|json|txt|md|svg|xml|ya?ml))`?\s*\n```(?:[\w+-]+)?\s*\n([\s\S]*?)```/gi;
    let match;
    while ((match = fenceRegex.exec(raw))) {
      const path = normalizePath(match[1]);
      if (TEXT_FILE_EXTENSIONS.test(path)) files[path] = match[2].trim();
    }
    const markerRegex = /(?:^|\n)\s*(?:\/\/|<!--|#|\/\*)\s*(?:file|filename|path)\s*[:：]\s*([\w@./\\ -]+\.(?:html?|css|js|mjs|cjs|ts|tsx|jsx|json|txt|md|svg|xml|ya?ml))\s*(?:-->|\*\/)?\s*\n([\s\S]*?)(?=\n\s*(?:\/\/|<!--|#|\/\*)\s*(?:file|filename|path)\s*[:：]\s*[\w@./\\ -]+\.|$)/gi;
    while ((match = markerRegex.exec(raw))) {
      const path = normalizePath(match[1]);
      let content = match[2].trim();
      content = stripFence(content);
      if (TEXT_FILE_EXTENSIONS.test(path) && content) files[path] = content;
    }
    if (!Object.keys(files).length) return null;
    return { files, entryFile: files['index.html'] !== undefined ? 'index.html' : Object.keys(files).find(p => /\.html?$/i.test(p)) || Object.keys(files)[0] };
  }

  function parseProjectFiles(text) {
    return extractJsonProject(text) || extractFencedProject(text);
  }

  function extractCodeOnly(text) {
    const project = parseProjectFiles(text);
    if (project?.files) return project.files[project.entryFile] || project.files['index.html'] || Object.values(project.files)[0] || '';
    const raw = String(text || '');
    const fenced = raw.match(/```(?:html|xml|json|javascript|js|css|md|markdown|ts|tsx|jsx)?\s*([\s\S]*?)```/i);
    let code = (fenced ? fenced[1] : raw).trim();
    // Strip any leftover bare language tag that some models emit without backticks.
    code = code.replace(/^\s*(?:json|javascript|js|html|css|xml|md|markdown)\b\s*\n/i, '').trim();
    const startMatch = code.search(/<!doctype\s+html|<html[\s>]/i);
    if (startMatch > 0) code = code.slice(startMatch);
    const endIndex = code.toLowerCase().lastIndexOf('</html>');
    if (endIndex >= 0) code = code.slice(0, endIndex + 7);
    return code.trim();
  }

  function ensureRequiredProjectStructure(files) {
    const normalizedFiles = {};
    Object.entries(files || {}).forEach(([path, content]) => {
      const normalized = normalizePath(path);
      if (!normalized) return;
      normalizedFiles[normalized] = String(content ?? '');
    });
    Object.entries(REQUIRED_DOC_FILES).forEach(([path, content]) => {
      if (normalizedFiles[path] === undefined) normalizedFiles[path] = content;
    });
    Object.entries(REQUIRED_PLACEHOLDERS).forEach(([path, content]) => {
      if (normalizedFiles[path] === undefined) normalizedFiles[path] = content;
    });
    return normalizedFiles;
  }

  window.AICodeLogic = {
    prepareRun() {
      return {
        logicFile: 'js/ai-code-logic.js',
        taskType: 'code',
        stage: 'coding',
        promptKey: 'code',
        model: typeof window.getModelForPrompt === 'function' ? window.getModelForPrompt('code') : undefined
      };
    },
    prepareVerifyRun() {
      return {
        logicFile: 'js/ai-code-logic.js',
        taskType: 'verify',
        stage: 'coding',
        promptKey: 'verify',
        model: typeof window.getModelForPrompt === 'function' ? window.getModelForPrompt('verify') : undefined
      };
    },
    getCodeOnlyInstruction() {
      return CODE_ONLY_INSTRUCTION;
    },
    getGeneratedAppStructureInstruction() {
      return GENERATED_APP_STRUCTURE_INSTRUCTION;
    },
    ensureRequiredProjectStructure,
    parseProjectFiles,
    extractCodeOnly
  };
})();
