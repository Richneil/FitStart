export function validateProfile(profile) {
  const errors={};
  if(!profile.displayName?.trim()) errors.displayName="Enter a display name or nickname.";
  if(!profile.primaryGoal) errors.primaryGoal="Choose a primary goal.";
  if(profile.secondaryGoal && profile.secondaryGoal===profile.primaryGoal) errors.secondaryGoal="Choose a different secondary goal or leave it blank.";
  if(!profile.experience) errors.experience="Choose an experience level.";
  return errors;
}

export function validateAssessment(assessment) {
  const errors={};
  const required=["weight","body-fat-percentage","skeletal-muscle-mass","bmi"];
  assessment.metrics.forEach(metric=>{if(required.includes(metric.id)&&metric.value==="") errors[metric.id]="Enter a numeric value or mark this metric unavailable."; else if(metric.value!==null&&metric.value!==""&&!Number.isFinite(Number(metric.value))) errors[metric.id]="Enter numbers only.";});
  return errors;
}
