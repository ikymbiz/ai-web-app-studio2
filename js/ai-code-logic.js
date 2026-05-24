// AI Web Studio Pro — コード作成用生成AIロジック
// コーディング段階のモデル選択とSkill stageを管理する。
(function () {
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
    }
  };
})();
