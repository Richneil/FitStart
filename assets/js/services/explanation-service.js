import { labels } from "../data/member-options.js";

const displayValue = metric => `${metric.value}${metric.unit && metric.unit !== "—" ? ` ${metric.unit}` : ""}`;
const evidenceText = focus => focus.supporting.filter(metric => ["Under","Over"].includes(metric.status)).slice(0,2).map(metric => `${metric.name} is ${displayValue(metric)} (${metric.status}${metric.range && metric.range !== "Chart band" ? `; printed reference ${metric.range}` : " band"})`);

export function explainFocus(focus, profile) {
  if (!focus) return null;
  const primary = labels[profile.primaryGoal] || "your main goal";
  const secondary = labels[profile.secondaryGoal] || "";
  const evidence = evidenceText(focus);
  const strongest = evidence.length ? evidence.join(" and ") : `${focus.supporting[0]?.name || "a supporting measurement"} appears in your confirmed report`;
  const isNew = profile.fitnessExperience === "new" || profile.assessmentFamiliarity === "not-familiar";
  return {
    definition:isNew ? focus.definition : `${focus.definition} Supporting measurements stay grouped so related results are not counted as separate priorities.`,
    toldUs:`You selected ${primary} as your primary goal${secondary ? ` and ${secondary} as your secondary goal` : ""}.`,
    showed:`Your FitMao report shows ${strongest}.`,
    why:`FITSTART placed ${focus.label} here because the confirmed report information${focus.primary ? ` directly relates to your ${primary} goal` : " is relevant to understanding your overall results"}.`,
    recommendation:`We recommend reviewing ${focus.label} first because it is supported by your confirmed FitMao results and your stated goal. Discuss appropriate exercise and nutrition strategies with a qualified fitness professional.`
  };
}
