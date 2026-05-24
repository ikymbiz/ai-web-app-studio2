// AI Web Studio Pro — コード作成用生成AIロジック
// コーディング段階のモデル選択、Skill stage、コードだけを返す制約、複数ファイル出力の解析を管理する。
(function () {
  const CODE_ONLY_INSTRUCTION = [
    '出力はコードだけにする。',
    '説明、要約、Plan、Act、分析、検証報告、前置き、後書きを出力しない。',
    '単一HTMLで実装できる場合は、最初の非空白文字を <!DOCTYPE html> または <html にし、完全なHTMLだけを省略せず出力する。',
    'HTML/CSS/JSなど複数ファイルで実装する場合は、説明文を混ぜず、次のJSONだけを出力する: {"entryFile":"index.html","files":[{"path":"index.html","content":"..."},{"path":"styles.css","content":"..."},{"path":"script.js","content":"..."}]}',
    '複数ファイルJSONを使う場合、contentには各ファイルの全文を入れる。省略記号、差分、Markdownコードフェンスは禁止。'
  ].join('\n');

  const TEXT_FILE_EXTENSIONS = /\.(html?|css|js|mjs|cjs|ts|tsx|jsx|json|txt|md|svg|xml|yml|yaml)$/i;

  function normalizePath(path) {
    return String(path || 'index.html').trim().replace(/^\/+/, '').replace(/\\/g, '/') || 'index.html';
  }

  function stripFence(text) {
    return String(text || '').replace(/^```(?:json|html|css|javascript|js|xml)?\s*/i, '').replace(/```\s*$/i, '').trim();
  }

  function extractJsonProject(text) {
    const raw = String(text || '').trim();
    const candidates = [];
    candidates.push(stripFence(raw));
    const fencedJson = raw.match(/```json\s*([\s\S]*?)```/i);
    if (fencedJson) candidates.push(fencedJson[1].trim());
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) candidates.push(raw.slice(firstBrace, lastBrace + 1));

    for (const candidate of candidates) {
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
    const fenced = raw.match(/```(?:html|xml)?\s*([\s\S]*?)```/i);
    let code = (fenced ? fenced[1] : raw).trim();
    const startMatch = code.search(/<!doctype\s+html|<html[\s>]/i);
    if (startMatch > 0) code = code.slice(startMatch);
    const endIndex = code.toLowerCase().lastIndexOf('</html>');
    if (endIndex >= 0) code = code.slice(0, endIndex + 7);
    return code.trim();
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
    parseProjectFiles,
    extractCodeOnly
  };
})();
