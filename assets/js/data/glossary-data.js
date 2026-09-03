import { metricDefinitions } from "./fitmao-metrics.js";

export const glossaryData = metricDefinitions.map((metric, index, all) => ({
  ...metric,
  related: all.filter(item => item.category === metric.category && item.id !== metric.id).slice(0,3).map(item => item.id),
  source: "Research-approved reference to be added before production."
}));

export const glossaryEntry = id => glossaryData.find(item => item.id === id);
