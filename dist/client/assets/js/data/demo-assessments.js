export const demoAssessments = [
  {
    id: "assessment-001", assessedAt: "2026-07-20", sourceType: "demo", verified: true,
    metrics: [
      { id: "weight", name: "Weight", value: 68.4, unit: "kg", sourceCategory: "attention", sourceCategoryLabel: "Demo: Needs Review" },
      { id: "body-fat-percentage", name: "Body-Fat Percentage", value: 30, unit: "%", sourceCategory: "higher-attention", sourceCategoryLabel: "Demo: Higher Attention" },
      { id: "skeletal-muscle-mass", name: "Skeletal Muscle Mass", value: 22.8, unit: "kg", sourceCategory: "attention", sourceCategoryLabel: "Demo: Needs Review" },
      { id: "bmi", name: "Body Mass Index", value: 26.2, unit: "kg/m²", sourceCategory: "attention", sourceCategoryLabel: "Demo: Needs Review" },
      { id: "body-water", name: "Body Water", value: 47.2, unit: "%", sourceCategory: "within", sourceCategoryLabel: "Demo: Within Reference Range" },
      { id: "visceral-fat", name: "Visceral Fat", value: 10, unit: "level", sourceCategory: "attention", sourceCategoryLabel: "Demo: Needs Review" },
      { id: "basal-metabolic-rate", name: "Basal Metabolic Rate", value: 1378, unit: "kcal/day", sourceCategory: "within", sourceCategoryLabel: "Demo: Reference Only" }
    ]
  },
  {
    id: "assessment-002", assessedAt: "2026-09-01", sourceType: "demo", verified: true,
    metrics: [
      { id: "weight", name: "Weight", value: 67.6, unit: "kg", sourceCategory: "attention", sourceCategoryLabel: "Demo: Needs Review" },
      { id: "body-fat-percentage", name: "Body-Fat Percentage", value: 29, unit: "%", sourceCategory: "higher-attention", sourceCategoryLabel: "Demo: Higher Attention" },
      { id: "skeletal-muscle-mass", name: "Skeletal Muscle Mass", value: 23.1, unit: "kg", sourceCategory: "attention", sourceCategoryLabel: "Demo: Needs Review" },
      { id: "bmi", name: "Body Mass Index", value: 25.9, unit: "kg/m²", sourceCategory: "attention", sourceCategoryLabel: "Demo: Needs Review" },
      { id: "body-water", name: "Body Water", value: 47.8, unit: "%", sourceCategory: "within", sourceCategoryLabel: "Demo: Within Reference Range" },
      { id: "visceral-fat", name: "Visceral Fat", value: 9, unit: "level", sourceCategory: "attention", sourceCategoryLabel: "Demo: Needs Review" },
      { id: "basal-metabolic-rate", name: "Basal Metabolic Rate", value: 1386, unit: "kcal/day", sourceCategory: "within", sourceCategoryLabel: "Demo: Reference Only" }
    ]
  }
];

export const blankMetrics = demoAssessments[1].metrics.map(metric => ({...metric, value: "", sourceCategory: "within", sourceCategoryLabel: "Demo: Classification not set"}));
