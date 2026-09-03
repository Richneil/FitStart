import { getMetricDefinition } from "../data/metric-library.js";
import { optionLabels } from "../data/demo-profile.js";

export function explainMetric(item, profile) {
  const definition = getMetricDefinition(item.id);
  const goal = optionLabels[profile.primaryGoal] || "your stated goal";
  const depth = profile.experience === "experienced" ? definition?.represents : definition?.definition;
  return {
    meaning: depth || "This measurement provides body-composition context.",
    toldUs: `Your main goal is ${goal}${profile.activities?.length ? ` and you prefer ${profile.activities.map(id=>optionLabels[id]).join(" and ").toLowerCase()}` : ""}.`,
    showed: `Your report showed ${item.name} as ${item.value} ${item.unit} and labelled it “${item.sourceCategoryLabel}.”`,
    why: item.primaryMatch ? `This result comes first because the report says it is worth reviewing and it connects with your ${goal.toLowerCase()} goal.` : `This result comes first because of its report label and how it connects with the other measurements.`,
    limitation: definition?.limitation || "Interpret this result with a qualified fitness professional."
  };
}

export function quickWins(profile) {
  const wins = [];
  if (profile.barriers?.includes("uncertainty")) wins.push("Choose one priority to understand first instead of trying to interpret every number at once.");
  if (profile.barriers?.includes("time")) wins.push("Set aside one short, low-complexity check-in to review the result with a qualified fitness professional.");
  if (profile.confidence === "low" || profile.barriers?.includes("confidence")) wins.push("Bring the full report and ask a qualified fitness professional to clarify any unfamiliar terms.");
  if (profile.activities?.length) wins.push(`Use your interest in ${profile.activities.map(id=>optionLabels[id]).join(" and ").toLowerCase()} as context when discussing realistic first steps.`);
  wins.push("Use consistent measurement conditions if you complete another assessment.");
  return [...new Set(wins)].slice(0,3);
}
