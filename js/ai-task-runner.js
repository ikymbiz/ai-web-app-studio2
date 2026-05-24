(function(){
  'use strict';
  const STATUSES = ['pending','selected','in_progress','implemented','verifying','verified','failed','bug_found','fix_proposed','awaiting_approval','auto_fixing','blocked'];
  function isTerminal(task) {
    return task && task.status === 'verified' && task.done === true;
  }
  function allSelectedComplete(tasks) {
    return (Array.isArray(tasks) ? tasks : []).filter(t => t.selected).every(isTerminal);
  }
  window.AITaskRunner = { STATUSES, isTerminal, allSelectedComplete };
})();
