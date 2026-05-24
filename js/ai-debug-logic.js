// AI Web Studio Pro — デバッグ用生成AIロジック
// デバッグ入力をチャットとは別段階として扱い、Skill stage=debugging を使わせる。
(function () {
  window.AIDebugLogic = {
    prepareUserInput(memoText) {
      return String(memoText || '').trim();
    },
    prepareRun() {
      return {
        logicFile: 'js/ai-debug-logic.js',
        taskType: 'debugging',
        stage: 'debugging',
        promptKey: 'debug',
        model: typeof window.getModelForPrompt === 'function' ? window.getModelForPrompt('debug') : undefined
      };
    }
  };
})();
