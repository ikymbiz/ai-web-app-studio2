// AI Web Studio Pro — コード作成用生成AIロジック
// コーディング段階のモデル選択、Skill stage、コードだけを返す制約、複数ファイル出力の解析を管理する。
(function () {
  const GENERATED_APP_STRUCTURE_INSTRUCTION = [
    '生成するWebアプリには README.md と plan_log.md を必ず含める。',
    'README.md にはアプリ概要を簡潔に記載する。',
    'plan_log.md には実装計画・進捗・教訓を1ファイルにまとめる。',
    'その他のフォルダ構成は規模に応じて任意。ちょっとしたアプリは単一HTMLでも可。',
    '既存コードを修正する場合も、ユーザーが明示しない限り既存ファイルを削除せず、不足するファイルだけを追加する。'
  ].join('\n');

  const CODE_ONLY_INSTRUCTION = [
    '出力はコードだけにする。',
    '説明、要約、Plan、Act、分析、検証報告、前置き、後書きを出力しない。',
    GENERATED_APP_STRUCTURE_INSTRUCTION,
    '単一HTMLで実装できる場合は単一HTMLでよい。複数ファイル化する場合も説明文を混ぜず、JSONだけを出力する。',
    'HTML/CSS/JSなど複数ファイルで実装する場合は、説明文を混ぜず、次のJSONだけを出力する: {"entryFile":"index.html","files":[{"path":"README.md","content":"..."},{"path":"plan_log.md","content":"..."},{"path":"index.html","content":"..."}]}',
    '複数ファイルJSONを使う場合、contentには各ファイルの全文を入れる。省略記号、差分、Markdownコードフェンスは禁止。'
  ].join('\n');

  const TEXT_FILE_EXTENSIONS = /(?:\.(html?|css|js|mjs|cjs|ts|tsx|jsx|json|txt|md|svg|xml|yml|yaml)|\.gitkeep)$/i;

  const REQUIRED_DOC_FILES = {
    "README.md": "# Project\n\nアプリの概要を1〜3行で簡潔に記載する。\n",
    "plan_log.md": "# Plan & Log\n\n## Plan\n- 実装計画を箇条書きで残す。\n\n## Progress\n- 各ステップの進捗を追記。\n\n## Lessons\n- 修正指摘から得た教訓を追記。\n"
  };

  const REQUIRED_PLACEHOLDERS = {};

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
