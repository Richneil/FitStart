import { focusAreas, goalRelevance, expertReviewOrder } from "../data/ranking-rules.js";

const hasValue = metric => metric?.available !== false && metric?.value !== "" && metric?.value !== null && metric?.value !== undefined;
const outside = metric => ["Under","Over"].includes(metric?.status);

export function rankFocusAreas(assessment, profile) {
  if (!assessment?.verified || !profile?.primaryGoal) return {items:[],mainFocus:null,priorities:[],insufficient:true};
  const metrics = assessment.metrics.filter(hasValue);
  const primaryMap = goalRelevance[profile.primaryGoal] || {};
  const secondaryMap = goalRelevance[profile.secondaryGoal] || {};
  const items = Object.entries(focusAreas).flatMap(([id, area]) => {
    const supporting = metrics.filter(metric => area.metrics.includes(metric.id));
    if (!supporting.length) return [];
    const individual = supporting.map(metric => outside(metric) ? 3 : metric.id === "body-type" && /over/i.test(String(metric.value)) ? 1 : 0);
    const outsideCount = supporting.filter(outside).length;
    const evidence = Math.min(4, Math.max(0,...individual) + (outsideCount > 1 ? 1 : 0));
    const primary = primaryMap[id] || 0;
    const mappedSecondary = secondaryMap[id] || 0;
    const secondary = mappedSecondary > 0 ? Math.max(1,Math.floor(mappedSecondary/2)) : 0;
    const score = evidence + primary + secondary;
    if (evidence === 0 && primary === 0 && secondary === 0) return [];
    return [{id,...area,supporting,evidence,primary,secondary,score}];
  }).sort((a,b) => b.score-a.score || b.evidence-a.evidence || b.primary-a.primary || expertReviewOrder.indexOf(a.id)-expertReviewOrder.indexOf(b.id));
  return {items,mainFocus:items[0]||null,priorities:items.slice(1,3),insufficient:items.length===0};
}
