import { largeDifference, goalDirections } from "../data/ranking-rules.js";

export function compareAssessments(previous,current,primaryGoal) {
  if (!previous || !current) return [];
  const before = new Map(previous.metrics.map(metric => [metric.id,metric]));
  return current.metrics.flatMap(metric => {
    const old = before.get(metric.id);
    if (!old || typeof metric.value !== "number" || typeof old.value !== "number") return [];
    const difference = Number((metric.value-old.value).toFixed(2));
    const direction = difference === 0 ? "same" : difference > 0 ? "up" : "down";
    const changeLabel = direction === "same" ? "No Measured Change" : direction === "up" ? "Increased" : "Decreased";
    return [{...metric,previousValue:old.value,currentValue:metric.value,difference,direction,changeLabel,large:Math.abs(difference)>(largeDifference[metric.id]??Infinity),supportsGoal:goalDirections[primaryGoal]?.[metric.id]===direction}];
  });
}
