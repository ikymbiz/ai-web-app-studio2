(function(){
  'use strict';
  function canCompleteTask(result) {
    return !!result && result.status === 'verified' && result.implemented === true && result.behaviorChecked === true && result.canComplete === true;
  }
  function summarize(results) {
    const list = Array.isArray(results) ? results : [];
    return {
      verified: list.filter(canCompleteTask).length,
      failed: list.filter(r => r && r.status === 'failed').length,
      blocked: list.filter(r => r && r.status === 'blocked').length
    };
  }
  window.AIVerifyLogic = { canCompleteTask, summarize };
})();
