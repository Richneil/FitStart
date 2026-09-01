import { rules } from "../data/rules.js";

export function compareAssessments(previous, current, primaryGoal) {
  if (!previous || !current) return [];
  const priorMap = new Map(previous.metrics.map(metric => [metric.id,metric]));
  return current.metrics.flatMap(metric => {
    const prior = priorMap.get(metric.id);
    if (!prior || metric.value === "" || prior.value === "") return [];
    const difference = Number(metric.value)-Number(prior.value);
    const threshold = rules.largeDifference[metric.id] ?? Infinity;
    const direction = difference === 0 ? "same" : difference > 0 ? "up" : "down";
    const supported = rules.goalDirections[primaryGoal]?.[metric.id] === direction;
    return [{...metric,previousValue:Number(prior.value),currentValue:Number(metric.value),difference,direction,large:Math.abs(difference)>threshold,goalConnection:supported?"In the direction of your stated goal":"No approved goal-direction statement"}];
  });
}
