# Local System Prompt Editor

ローカルだけで System Prompt / Principle / UX参考ペルソナ / Skill / Output Template / Token Budget を編集するための単一 HTML です。

## 使い方

1. `system-prompt-editor.html` をブラウザで開く
2. `フォルダを開く` を押して workspace を選択する
3. 各項目を編集する
4. `保存` を押す

Chrome / Edge など File System Access API 対応ブラウザでは、選択したフォルダへ直接保存します。非対応ブラウザでは JSON export / import を使ってください。

## 推奨 workspace 構成

```text
your-workspace/
  system_prompt_config.json
  prompts/
    system_prompt.md
    principle_full.md
    principle_compact.md
    persona_reference.md
  skills/
    default_skill_compact.md
  templates/
    output_template_compact.md
  runtime/
    runtime_notes.md
    token_budget.json
  exports/
    compiled_prompt.md
  .local-secrets/
    github_pat.txt
```

## PAT 管理方針

PAT は HTML、JSON export、localStorage、GitHub リポジトリには保存しません。

```bash
mkdir -p .local-secrets
chmod 700 .local-secrets
printf '%s' 'ghp_xxxxxxxxxxxxxxxxxxxx' > .local-secrets/github_pat.txt
chmod 600 .local-secrets/github_pat.txt

export GITHUB_TOKEN="$(cat .local-secrets/github_pat.txt)"
```

`.local-secrets/` は必ず `.gitignore` してください。
