export const demoAssessments = [
  {
    id: "assessment-001", assessedAt: "2026-07-20", sourceType: "demo", verified: true,
    metrics: [
      { id: "weight", name: "Body weight", value: 68.4, unit: "kg", sourceCategory: "attention", sourceCategoryLabel: "Worth reviewing" },
      { id: "body-fat-percentage", name: "Body fat estimate", value: 30, unit: "%", sourceCategory: "higher-attention", sourceCategoryLabel: "Review first" },
      { id: "skeletal-muscle-mass", name: "Muscle mass", value: 22.8, unit: "kg", sourceCategory: "attention", sourceCategoryLabel: "Worth reviewing" },
      { id: "bmi", name: "Body mass index (BMI)", value: 26.2, unit: "kg/m²", sourceCategory: "attention", sourceCategoryLabel: "Worth reviewing" },
      { id: "body-water", name: "Body water estimate", value: 47.2, unit: "%", sourceCategory: "within", sourceCategoryLabel: "Within expected range" },
      { id: "visceral-fat", name: "Visceral fat level", value: 10, unit: "level", sourceCategory: "attention", sourceCategoryLabel: "Worth reviewing" },
      { id: "basal-metabolic-rate", name: "Resting energy estimate", value: 1378, unit: "kcal/day", sourceCategory: "within", sourceCategoryLabel: "Reference only" }
    ]
  },
  {
    id: "assessment-002", assessedAt: "2026-09-01", sourceType: "demo", verified: true,
    metrics: [
      { id: "weight", name: "Body weight", value: 67.6, unit: "kg", sourceCategory: "attention", sourceCategoryLabel: "Worth reviewing" },
      { id: "body-fat-percentage", name: "Body fat estimate", value: 29, unit: "%", sourceCategory: "higher-attention", sourceCategoryLabel: "Review first" },
      { id: "skeletal-muscle-mass", name: "Muscle mass", value: 23.1, unit: "kg", sourceCategory: "attention", sourceCategoryLabel: "Worth reviewing" },
      { id: "bmi", name: "Body mass index (BMI)", value: 25.9, unit: "kg/m²", sourceCategory: "attention", sourceCategoryLabel: "Worth reviewing" },
      { id: "body-water", name: "Body water estimate", value: 47.8, unit: "%", sourceCategory: "within", sourceCategoryLabel: "Within expected range" },
      { id: "visceral-fat", name: "Visceral fat level", value: 9, unit: "level", sourceCategory: "attention", sourceCategoryLabel: "Worth reviewing" },
      { id: "basal-metabolic-rate", name: "Resting energy estimate", value: 1386, unit: "kcal/day", sourceCategory: "within", sourceCategoryLabel: "Reference only" }
    ]
  }
];

export const blankMetrics = demoAssessments[1].metrics.map(metric => ({...metric, value: "", sourceCategory: "within", sourceCategoryLabel: "Not set"}));
