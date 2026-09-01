import { rules } from "../data/rules.js";

export function scoreAssessment(assessment, profile) {
  if (!assessment?.verified || !profile?.primaryGoal) return {items:[], mainFocus:null, priorities:[], insufficient:true};
  const primaryMatches = rules.goalMap[profile.primaryGoal] || [];
  const secondaryMatches = rules.goalMap[profile.secondaryGoal] || [];
  const items = assessment.metrics.filter(metric => metric.value !== null && metric.value !== "" && Number.isFinite(Number(metric.value))).map(metric => {
    const status = rules.statusPoints[metric.sourceCategory] ?? 0;
    const primary = primaryMatches.includes(metric.id) ? rules.primaryGoalPoints : 0;
    const secondary = secondaryMatches.includes(metric.id) ? rules.secondaryGoalPoints : 0;
    const relationship = primaryMatches.some(id => (rules.relationships[id] || []).includes(metric.id)) ? rules.relationshipPoints : 0;
    const score = status + primary + secondary + relationship;
    const band = rules.bands.find(item => score >= item.min).label;
    return {...metric, score, band, breakdown:{status,primary,secondary,relationship}, primaryMatch:primary>0};
  }).sort((a,b) => b.score-a.score || (rules.statusPoints[b.sourceCategory]??0)-(rules.statusPoints[a.sourceCategory]??0) || Number(b.primaryMatch)-Number(a.primaryMatch) || rules.fixedOrder.indexOf(a.id)-rules.fixedOrder.indexOf(b.id));
  const eligible = items.filter(item => item.score >= 2);
  return {items,mainFocus:eligible[0]||null,priorities:eligible.slice(1,3),insufficient:eligible.length===0};
}
