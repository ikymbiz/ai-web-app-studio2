(function(){
  'use strict';
  function isHighRisk(analysis) {
    const risk = String((analysis && (analysis.riskLevel || analysis.risk)) || '').toLowerCase();
    const text = JSON.stringify(analysis || {}).toLowerCase();
    return risk === 'high' || risk === 'critical' || /delete|remove|api key|token|github|deploy|storage|credential|secret|削除|apiキー|トークン|github|デプロイ|保存先|認証/.test(text);
  }
  window.AIBugAnalysisLogic = { isHighRisk };
})();
