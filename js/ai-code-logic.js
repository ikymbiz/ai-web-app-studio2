// AI Web Studio Pro — コード作成用生成AIロジック
// コーディング段階のモデル選択、Skill stage、コードだけを返す制約を管理する。
(function () {
  const CODE_ONLY_INSTRUCTION = [
    '出力はコードだけにする。',
    '説明、要約、Plan、Act、分析、検証報告、Markdownコードフェンス、前置き、後書きを出力しない。',
    '最初の非空白文字は <!DOCTYPE html> または <html にする。',
    'HTMLの外側に自然言語テキストを置かない。',
    '完全なHTMLを省略せず出力する。'
  ].join('\n');

  function extractCodeOnly(text) {
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
    extractCodeOnly
  };
})();
