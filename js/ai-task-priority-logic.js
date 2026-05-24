(function(){
  'use strict';
  const DONE_STATUSES = new Set(['verified']);
  function normalize(task, index) {
    const item = { ...(task || {}) };
    item.priority = Number.isFinite(Number(item.priority)) ? Number(item.priority) : (index + 1) * 10;
    item.risk = item.risk || 'medium';
    item.dependsOn = Array.isArray(item.dependsOn) ? item.dependsOn : [];
    item.status = item.status || (item.done ? 'verified' : 'pending');
    item.selected = item.selected === true;
    return item;
  }
  function dependenciesResolved(item, all) {
    if (!item.dependsOn.length) return true;
    return item.dependsOn.every(id => all.some(t => t.id === id && t.status === 'verified' && t.done === true));
  }
  function prioritizeAndSelect(tasks, options = {}) {
    const normalized = (Array.isArray(tasks) ? tasks : []).map(normalize);
    const runnable = normalized
      .filter(item => !(DONE_STATUSES.has(item.status) && item.done === true))
      .filter(item => dependenciesResolved(item, normalized))
      .sort((a, b) => Number(a.priority || 9999) - Number(b.priority || 9999));
    const selectedIds = new Set(runnable.map(item => item.id));
    return normalized.map(item => {
      if (selectedIds.has(item.id)) return { ...item, selected: true, status: item.status === 'pending' ? 'selected' : item.status, selectionReason: options.reason || '' };
      if (item.status === 'verified' && item.done === true) return { ...item, selected: false };
      return { ...item, selected: false, status: item.status || 'pending' };
    });
  }
  window.AITaskPriorityLogic = { normalize, prioritizeAndSelect };
})();
