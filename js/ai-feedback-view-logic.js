(function(){
  'use strict';
  const LABELS = {
    summary: '要約',
    functional: '機能説明',
    implementation: '実装概要',
    technical: '技術詳細',
    design: '設計評価'
  };
  function sectionLabels(keys) {
    return (Array.isArray(keys) ? keys : []).map(k => LABELS[k] || k).filter(Boolean);
  }
  function formatForSections(payload, sections) {
    const selected = Array.isArray(sections) && sections.length ? sections : ['summary','functional'];
    const p = payload || {};
    const out = [];
    if (selected.includes('summary')) out.push(`【要約】\n${p.summary || p.bugSummary || p.result || ''}`.trim());
    if (selected.includes('functional')) out.push(`【機能説明】\n${p.functional || p.affectedFeatures || p.userImpact || ''}`.trim());
    if (selected.includes('implementation')) out.push(`【実装概要】\n${p.implementation || p.affectedFiles || p.files || ''}`.trim());
    if (selected.includes('technical')) out.push(`【技術詳細】\n${p.technical || p.rootCause || p.details || ''}`.trim());
    if (selected.includes('design')) out.push(`【設計評価】\n${p.design || p.impactAnalysis || p.riskLevel || ''}`.trim());
    return out.filter(Boolean).join('\n\n');
  }
  window.AIFeedbackViewLogic = { LABELS, sectionLabels, formatForSections };
})();
