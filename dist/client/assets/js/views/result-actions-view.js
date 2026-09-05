export function resultActionsView(state={}){
  const current=state.resultAssessment;
  const isSaved=Boolean(current&&state.assessments?.some(item=>item.id===current.id));
  return `<a class="button button-primary" href="#/summary">Export / Print for Trainer</a><a class="button button-secondary" href="#/glossary">Open Glossary</a>${isSaved?'<span class="saved-result-status" role="status">✓ Assessment saved to history</span>':'<button class="button button-secondary" data-action="save-assessment">Save My Assessment for History</button>'}${state.session?.signedIn?'<a class="button button-secondary" href="#/dashboard">Open Dashboard</a>':""}`;
}
