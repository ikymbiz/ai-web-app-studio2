// AI Web Studio Pro — チャット用生成AIロジック
// チャット段階とデバッグ段階を明示し、index.html 側の既存処理に渡す。
(function () {
  let pendingTaskType = 'chat';

  function normalizeTaskType(value) {
    return value === 'debug' ? 'debugging' : (value || 'chat');
  }

  window.AIChatLogic = {
    setPendingTaskType(taskType) {
      pendingTaskType = normalizeTaskType(taskType);
      window.__pendingChatTaskType = pendingTaskType;
    },
    clearPendingTaskType() {
      pendingTaskType = 'chat';
      window.__pendingChatTaskType = 'chat';
    },
    prepareRun() {
      const taskType = normalizeTaskType(window.__pendingChatTaskType || pendingTaskType || 'chat');
      const promptKey = taskType === 'debugging' ? 'debug' : 'plan';
      return {
        logicFile: 'js/ai-chat-logic.js',
        taskType,
        stage: taskType === 'debugging' ? 'debugging' : 'chat',
        promptKey,
        model: typeof window.getModelForPrompt === 'function' ? window.getModelForPrompt(promptKey) : undefined
      };
    }
  };
})();
